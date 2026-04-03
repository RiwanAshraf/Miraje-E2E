"""
Firebase token verification middleware / dependency.

Usage in a protected route:
    @router.post("/predict-image")
    async def predict_image(file: UploadFile, user=Depends(verify_firebase_token)):
        ...
"""
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

# ── Initialise Firebase Admin SDK once ────────────────────────────────────────
_cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if _cred_path and os.path.exists(_cred_path):
    _cred = credentials.Certificate(_cred_path)
else:
    # Use default application credentials (e.g. on GCP/Cloud Run)
    _cred = credentials.ApplicationDefault()

if not firebase_admin._apps:
    firebase_admin.initialize_app(_cred)

# ── Bearer scheme ─────────────────────────────────────────────────────────────
_bearer = HTTPBearer(auto_error=True)


async def verify_firebase_token(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """
    FastAPI dependency that validates a Firebase ID token.
    Returns the decoded token payload (uid, email, name, etc.).
    Raises 401 if the token is missing, expired, or invalid.
    """
    token = creds.credentials
    try:
        decoded = firebase_auth.verify_id_token(token, check_revoked=True)
        return decoded
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked.")
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired.")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token.")
