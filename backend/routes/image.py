from fastapi import APIRouter, HTTPException
from models.image import ImageGenerationRequest, ImageGenerationResponse
from services.image_service import image_service

router = APIRouter()

@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest) -> ImageGenerationResponse:
    """
    Generate an image based on the provided prompt and parameters.
    
    The image is generated using Stable Diffusion via HuggingFace's API.
    The style and mood parameters help tune the generation to match the game's aesthetic.
    
    Returns:
        ImageGenerationResponse: Contains the generated image URL, prompt used, and generation parameters
    """
    try:
        return await image_service.generate_image(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate image"
        )
