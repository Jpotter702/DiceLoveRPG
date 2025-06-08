from fastapi import FastAPI
from routes import character, geist, image, story

app = FastAPI()

app.include_router(character.router, prefix="/character")
app.include_router(geist.router, prefix="/geist")
app.include_router(image.router, prefix="/image")
app.include_router(story.router, prefix="/story")

@app.get("/")
def root():
    return {"message": "Welcome to Love & Dice RPG API"}
