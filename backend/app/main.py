import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import forensics
from app.db.session import engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InfoLens API", version="1.0.0")

# Get allowed origins from env or default to wildcard for dev
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True if allowed_origins[0] != "*" else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forensics.router, prefix="/api/forensics", tags=["forensics"])

@app.get("/")
async def root():
    return {"message": "Welcome to InfoLens API"}

# For local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
