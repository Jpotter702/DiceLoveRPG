# Stub for image and text generation via HuggingFace

import os
import base64
import requests
from typing import Dict, Tuple, Optional
from models.story import DialogueRequest, NPCMood

class HuggingFaceAPI:
    def __init__(self):
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.api_url = "https://api-inference.huggingface.co/models/"
        self.text_model = "microsoft/DialoGPT-large"  # Good for dialogue generation
        self.image_model = "runwayml/stable-diffusion-v1-5"  # Good general purpose image model
        
    def _get_headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.api_key}"}

    def generate_image(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
    ) -> str:
        """
        Generate an image using Stable Diffusion.
        Returns the URL of the generated image.
        """
        if not self.api_key:
            return "https://image.placeholder.url"
            
        try:
            # Prepare the payload
            payload = {
                "inputs": prompt,
                "parameters": {
                    "negative_prompt": negative_prompt,
                    "num_inference_steps": num_inference_steps,
                    "guidance_scale": guidance_scale,
                    "seed": seed
                }
            }
            
            # Make API call
            response = requests.post(
                f"{self.api_url}{self.image_model}",
                headers=self._get_headers(),
                json=payload
            )
            response.raise_for_status()
            
            # The API returns the image as base64
            image_bytes = response.content
            
            # Here you would typically:
            # 1. Save the image to your storage service (S3, GCS, etc.)
            # 2. Return the public URL
            # For now, we'll return a placeholder
            
            # TODO: Implement proper image storage
            return f"https://storage.example.com/images/generated/{seed}.png"
            
        except Exception as e:
            print(f"Image generation failed: {str(e)}")
            return "https://image.placeholder.url"

    def generate_dialogue_response(self, request: DialogueRequest) -> Tuple[str, NPCMood, str, int]:
        """
        Generate an NPC's response using the dialogue model.
        Returns: (response_text, new_mood, mood_change_reason, affection_change)
        """
        if not self.api_key:
            # Return mock response for development
            return (
                f"Oh, {request.player_name}! {request.player_dialogue}? That's interesting!",
                NPCMood.HAPPY,
                "Positive interaction",
                2
            )

        # Construct the prompt for the model
        prompt = self._construct_dialogue_prompt(request)

        try:
            response = requests.post(
                f"{self.api_url}{self.text_model}",
                headers=self._get_headers(),
                json={"inputs": prompt, "parameters": {"max_length": 150}}
            )
            response.raise_for_status()
            
            # Parse the response
            generated_text = response.json()[0]["generated_text"]
            
            # Process the response to extract components
            response_parts = self._process_generated_response(generated_text, request)
            
            return response_parts
            
        except Exception as e:
            # Fallback response in case of API issues
            return (
                "I'm not quite sure how to respond to that...",
                NPCMood.CONFUSED,
                "Communication difficulty",
                0
            )

    def _construct_dialogue_prompt(self, request: DialogueRequest) -> str:
        """Construct a detailed prompt for the dialogue model."""
        return f"""
You are {request.npc_state.name}, a character in a romantic visual novel game. You should respond in a way that creates an engaging romantic comedy/drama atmosphere.

Character Profile:
- Name: {request.npc_state.name}
- Current Mood: {request.npc_state.mood}
- Relationship Status: {request.npc_state.relationship_status}
- Affection Level: {request.npc_state.affection}/100

Current Scene:
- Location: {request.story_context.location}
- Time: {request.story_context.time_of_day}
- Event: {request.story_context.current_event or 'Regular interaction'}

Memory & Context:
{chr(10).join(f"- {ctx}" for ctx in request.npc_state.context)}

Recent History:
{chr(10).join(f"- {inter}" for inter in request.story_context.previous_interactions)}

Guidelines:
1. Match the tone of a romantic comedy/drama - be charming, witty, and emotionally authentic
2. Reference past interactions naturally in your response when relevant
3. Show character growth based on the relationship status
4. Express emotions through both words and actions (e.g. *blushes*, *smiles warmly*)
5. Maintain consistent personality while letting the relationship evolve
6. If affection is high (>60), show more intimate/comfortable responses
7. If affection is low (<30), maintain appropriate social boundaries

Player ({request.player_name}) says [{request.dialogue_tone}]: {request.player_dialogue}

Respond in character, considering your mood, the relationship status, and the player's tone.
Format your response as:
<response>Your response (include actions in *asterisks*)</response>
<mood>new_mood</mood>
<reason>detailed reason for mood change</reason>
<affection>affection change (-10 to +10)</affection>
"""

    def _process_generated_response(
        self,
        generated_text: str,
        request: DialogueRequest
    ) -> Tuple[str, NPCMood, str, int]:
        """Process the generated text to extract response components."""
        try:
            # Extract components from the generated text using markers
            response = generated_text.split("<response>")[1].split("</response>")[0]
            mood = generated_text.split("<mood>")[1].split("</mood>")[0]
            reason = generated_text.split("<reason>")[1].split("</reason>")[0]
            affection = int(generated_text.split("<affection>")[1].split("</affection>")[0])
            
            # Validate and clean up the response
            mood = NPCMood(mood.lower()) if mood.lower() in NPCMood.__members__ else request.npc_state.mood
            affection = max(-10, min(10, affection))  # Ensure within bounds
            
            return response, mood, reason, affection
            
        except Exception:
            # Fallback to maintaining current state if parsing fails
            return (
                generated_text[:100] + "...",  # Truncate to reasonable length
                request.npc_state.mood,
                "Continued conversation",
                0
            )

# Initialize global API client
huggingface_client = HuggingFaceAPI()
