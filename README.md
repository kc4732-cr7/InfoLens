# InfoLens - Digital Information Forensics & Credibility Analysis

InfoLens is a production-ready platform for probabilistic credibility and provenance analysis of news articles.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide, Recharts, React-Force-Graph.
- **Backend**: Python 3.10, FastAPI, PyTorch, HuggingFace Transformers, NetworkX, SQLAlchemy.
- **NLP Models**: 
  - NER: `dbmdz/bert-large-cased-finetuned-conll03-english`
  - NLI (Entailment): `facebook/bart-large-mnli`
  - Similarity: `sentence-transformers/all-MiniLM-L6-v2`

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- **URL Scraping**: Extract clean text from any news article.
- **Claim Extraction**: Automatically identifies factual claims within the text.
- **Cross-Verification**: Uses NLI and semantic similarity to check claims against trusted records.
- **Propagation Forensics**: Detects origin and constructs a directed propagation graph of how information spreads.
- **Probabilistic Scoring**: Generates a confidence score (0.0 - 1.0) based on multiple forensic factors.
- **Explainability**: Provides detailed forensic notes and evidence references for every analysis.
