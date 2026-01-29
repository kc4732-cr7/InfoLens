from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from app.db.session import Base
import datetime

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=True)
    article_text = Column(Text)
    credibility_score = Column(Float)
    claims = Column(JSON)
    entities = Column(JSON)
    earliest_source = Column(JSON)
    propagation_graph = Column(JSON)
    forensic_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
