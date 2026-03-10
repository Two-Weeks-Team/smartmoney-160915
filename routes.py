from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from models import SessionLocal, Transaction, Goal
from ai_service import analyze_transactions, generate_recommendations

router = APIRouter()

# Dependency to provide a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class AnalyzeRequest(BaseModel):
    transactions: List[Dict[str, Any]] = Field(..., description="List of raw transaction objects")

class GenerateGoalsRequest(BaseModel):
    income: float = Field(..., description="Monthly net income")
    expenses: float = Field(..., description="Monthly total expenses")

# ---------------------------------------------------------------------------
# AI‑powered endpoints
# ---------------------------------------------------------------------------

@router.post("/analyze-transactions")
async def post_analyze_transactions(payload: AnalyzeRequest, db: SessionLocal = Depends(get_db)):
    # In a real app we would persist the transactions; for the demo we just forward them
    result = await analyze_transactions(payload.transactions)
    # Expected keys: insights, recommendations – pass through whatever we have
    return result


@router.post("/generate-goals")
async def post_generate_goals(payload: GenerateGoalsRequest, db: SessionLocal = Depends(get_db)):
    result = await generate_recommendations(payload.income, payload.expenses)
    # Expected keys: scenarios, suggestions – pass through whatever we have
    return result

# ---------------------------------------------------------------------------
# Simple CRUD helpers (optional, not required for the demo but illustrate DB usage)
# ---------------------------------------------------------------------------

@router.get("/transactions")
def get_transactions(limit: int = 20, db: SessionLocal = Depends(get_db)):
    items = db.query(Transaction).order_by(Transaction.date.desc()).limit(limit).all()
    return [
        {
            "id": t.id,
            "user_id": t.user_id,
            "date": t.date.isoformat(),
            "description": t.description,
            "amount": t.amount,
            "category": t.category,
        }
        for t in items
    ]

@router.get("/goals")
def get_goals(db: SessionLocal = Depends(get_db)):
    items = db.query(Goal).all()
    return [
        {
            "id": g.id,
            "user_id": g.user_id,
            "target_amount": g.target_amount,
            "current_amount": g.current_amount,
            "deadline": g.deadline.isoformat() if g.deadline else None,
            "created_at": g.created_at.isoformat(),
        }
        for g in items
    ]
