from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services import scraper, nlp, propagation, scoring

router = APIRouter()

class AnalysisRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None

class AnalysisResponse(BaseModel):
    article_text: str
    claims: List[dict]
    entities: List[dict]
    earliest_source: dict
    propagation_graph: dict
    credibility_score: float
    forensic_notes: str

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_content(request: AnalysisRequest):
    if not request.url and not request.text:
        raise HTTPException(status_code=400, detail="Either URL or text must be provided")
    
    # 1. Extraction
    article_text = ""
    if request.url:
        article_text = scraper.extract_text(request.url)
    else:
        article_text = request.text
    
    if not article_text:
        raise HTTPException(status_code=400, detail="Failed to extract article text")
    
    # 2. NLP Analysis (Claims, Entities)
    claims = nlp.extract_claims(article_text)
    entities = nlp.extract_entities(article_text)
    
    # 3. Verification & Forensics
    # Cross-verify each claim
    verified_claims = []
    for claim in claims:
        verification = nlp.verify_claim(claim["text"])
        verified_claims.append({**claim, "verification": verification})
    
    # Origin & Propagation
    earliest_source = propagation.detect_origin(article_text, claims, request.url)
    graph_data = propagation.build_graph(earliest_source, article_text)
    
    # 4. Scoring
    score_result = scoring.calculate_score(verified_claims, earliest_source, graph_data)
    
    return AnalysisResponse(
        article_text=article_text,
        claims=verified_claims,
        entities=entities,
        earliest_source=earliest_source,
        propagation_graph=graph_data,
        credibility_score=score_result["score"],
        forensic_notes=score_result["notes"]
    )
