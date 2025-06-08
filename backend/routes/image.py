from fastapi import APIRouter, HTTPException
from models.image import ImageGenerationRequest, ImageGenerationResponse
from services.image_service import image_service

router = APIRouter()

@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest) -> ImageGenerationResponse:
    """
    Generate an image using Stable Diffusion based on the provided parameters.
    
    The endpoint constructs a detailed prompt from the request parameters,
    including style, mood, character details, and location context.
    It also applies negative prompts to avoid common issues in generated images.
    
    The response includes:
    - The complete prompt used for generation
    - The URL of the generated image
    - The style used
    - The seed (for reproducibility)
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
