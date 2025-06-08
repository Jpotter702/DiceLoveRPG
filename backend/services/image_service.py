import random
from typing import Optional, Tuple
from models.image import ImageGenerationRequest, ImageGenerationResponse, ImageStyle
from services.huggingface_api import huggingface_client

class ImageService:
    def __init__(self):
        # Style-specific prompt enhancers
        self.style_prompts = {
            ImageStyle.ANIME: "anime style illustration, Studio Ghibli inspired",
            ImageStyle.REALISTIC: "photorealistic, highly detailed, 8k resolution",
            ImageStyle.WATERCOLOR: "watercolor painting style, soft edges, artistic",
            ImageStyle.PIXEL_ART: "pixel art style, retro gaming aesthetic",
            ImageStyle.COMIC: "comic book style, cel shaded, bold lines"
        }
        
        # Quality and enhancement prompts
        self.quality_prompts = [
            "masterpiece",
            "best quality",
            "highly detailed",
            "beautiful composition",
            "sharp focus"
        ]
        
        # Negative prompts to avoid common issues
        self.negative_prompts = [
            "lowres",
            "bad anatomy",
            "bad hands",
            "text",
            "error",
            "missing fingers",
            "extra digit",
            "fewer digits",
            "cropped",
            "worst quality",
            "low quality",
            "normal quality",
            "jpeg artifacts",
            "signature",
            "watermark",
            "username",
            "blurry"
        ]

    def _construct_prompt(self, request: ImageGenerationRequest) -> Tuple[str, str]:
        """Construct the main and negative prompts for image generation."""
        # Start with base prompt and style
        prompt_parts = [
            self.style_prompts[request.style],
            request.base_prompt
        ]
        
        # Add character name if provided
        if request.character_name:
            prompt_parts.insert(1, f"character named {request.character_name}")
        
        # Add location and time context
        if request.location:
            prompt_parts.append(f"in {request.location}")
        if request.time_of_day:
            prompt_parts.append(f"during {request.time_of_day}")
            
        # Add mood if provided
        if request.mood:
            prompt_parts.append(f"{request.mood} atmosphere")
            
        # Add additional details
        if request.additional_details:
            prompt_parts.extend(request.additional_details)
            
        # Add quality enhancers
        prompt_parts.extend(self.quality_prompts)
        
        # Combine all parts
        main_prompt = ", ".join(prompt_parts)
        negative_prompt = ", ".join(self.negative_prompts)
        
        return main_prompt, negative_prompt

    async def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """Generate an image based on the request parameters."""
        # Construct prompts
        main_prompt, negative_prompt = self._construct_prompt(request)
        
        # Generate a random seed for reproducibility
        seed = random.randint(1, 1000000)
        
        # Call Hugging Face API for image generation
        image_url = huggingface_client.generate_image(
            prompt=main_prompt,
            negative_prompt=negative_prompt,
            seed=seed
        )
        
        return ImageGenerationResponse(
            prompt_used=main_prompt,
            image_url=image_url,
            style=request.style,
            seed=seed
        )

# Initialize global image service
image_service = ImageService() 