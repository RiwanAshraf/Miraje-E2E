from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.middleware.auth_middleware import verify_firebase_token
from app import services

router = APIRouter(prefix="", tags=["predict"])


@router.post("/predict-image")
async def predict_image(
    image: UploadFile = File(...),
    user: dict = Depends(verify_firebase_token),
):
    """Detect AI-generated / deepfake images. Requires authentication."""
    try:
        from app.services import image_service
        result = image_service.predict(image.file)
        result["user_uid"] = user.get("uid")
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image prediction failed: {e}")


@router.post("/predict-audio")
async def predict_audio(
    audio: UploadFile = File(...),
    user: dict = Depends(verify_firebase_token),
):
    """Detect cloned / synthetic audio. Requires authentication."""
    try:
        from app.services import audio_service
        content = await audio.read()
        result = audio_service.predict(content)
        result["user_uid"] = user.get("uid")
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio prediction failed: {e}")


@router.post("/predict-signature")
async def predict_signature(
    signature: UploadFile = File(...),
    user: dict = Depends(verify_firebase_token),
):
    """Detect forged signatures. Requires authentication."""
    try:
        from app.services import signature_service
        content = await signature.read()
        result = signature_service.predict(content)
        result["user_uid"] = user.get("uid")
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signature prediction failed: {e}")
