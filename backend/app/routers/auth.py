from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth_middleware import verify_firebase_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
async def get_me(user: dict = Depends(verify_firebase_token)):
    """
    Returns the authenticated user's profile from their Firebase token.
    Useful for the frontend to confirm a valid session server-side.
    """
    return {
        "uid":          user.get("uid"),
        "email":        user.get("email"),
        "name":         user.get("name"),
        "picture":      user.get("picture"),
        "email_verified": user.get("email_verified", False),
    }


@router.post("/verify")
async def verify_token(user: dict = Depends(verify_firebase_token)):
    """Lightweight endpoint to validate a token — returns 200 if valid, 401 otherwise."""
    return {"valid": True, "uid": user.get("uid")}
