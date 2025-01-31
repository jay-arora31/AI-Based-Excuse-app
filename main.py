from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class ExcuseRequest(BaseModel):
    situation: str
    context: Optional[str] = None
    formality_level: Optional[str] = "casual"

class ExcuseResponse(BaseModel):
    excuse: str
    alternatives: list[str]

@app.post("/api/generate-excuse")
async def generate_excuse(request: ExcuseRequest):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative excuse generator. Generate a believable and funny excuse."
                },
                {
                    "role": "user",
                    "content": f"Generate a creative excuse for this situation: {request.situation}"
                }
            ],
            max_tokens=150
        )
        
        excuse = response.choices[0].message.content
        return {"excuse": excuse}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)