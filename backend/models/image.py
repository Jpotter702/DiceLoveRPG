from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class ImageStyle(str, Enum):
    ANIME = "anime"
    REALISTIC = "realistic"
    WATERCOLOR = "watercolor"
    PIXEL_ART = "pixel_art"
    COMIC = "comic"

class ImageMood(str, Enum):
    HAPPY = "happy"
    ROMANTIC = "romantic"
    DRAMATIC = "dramatic"
    MYSTERIOUS = "mysterious"
    PEACEFUL = "peaceful"
    ENERGETIC = "energetic"

class ImageGenerationRequest(BaseModel):
    base_prompt: str = Field(..., min_length=3, max_length=500)
    style: ImageStyle
    mood: Optional[ImageMood] = None
    character_name: Optional[str] = None
    location: Optional[str] = None
    time_of_day: Optional[str] = None
    additional_details: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        schema_extra = {
            "example": {
                "base_prompt": "A young woman sitting in a cozy cafe",
                "style": "anime",
                "mood": "peaceful",
                "character_name": "Sakura",
                "location": "Downtown cafe",
                "time_of_day": "afternoon",
                "additional_details": [
                    "warm lighting",
                    "coffee cup on table",
                    "gentle smile"
                ]
            }
        }

class ImageGenerationResponse(BaseModel):
    prompt_used: str
    image_url: str
    style: ImageStyle
    seed: Optional[int] = None
    
    class Config:
        schema_extra = {
            "example": {
                "prompt_used": "Anime style illustration of Sakura, a young woman sitting in a cozy Downtown cafe during afternoon. She has a gentle smile, with warm lighting and a coffee cup on the table. Peaceful atmosphere.",
                "image_url": "https://storage.example.com/images/generated/cafe_scene_123.png",
                "style": "anime",
                "seed": 12345
            }
        } 