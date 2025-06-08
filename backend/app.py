from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import character, geist, npc

app = FastAPI(
    title="LoveRPG API",
    description="Dating sim RPG with trait-based character system",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(character.router, prefix="/api", tags=["character"])
app.include_router(geist.router, prefix="/api", tags=["geist"])
app.include_router(npc.router, prefix="/api", tags=["npc"])

@app.get("/")
async def root():
    return {
        "name": "LoveRPG API",
        "version": "0.1.0",
        "status": "running"
    }
