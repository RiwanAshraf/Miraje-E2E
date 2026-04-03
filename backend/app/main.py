"""
FastAPI application entry point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.models.loader import load_all_models
from app.routers import predict, auth


# ── Lifespan: load models once on startup ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Loading ML models…")
    load_all_models()
    yield
    print("🛑 Shutting down.")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Miraje API",
    description="Synthetic media detection — image, audio & signature forgery",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(predict.router)
app.include_router(auth.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "2.0.0"}
