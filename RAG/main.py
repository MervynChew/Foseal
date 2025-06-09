from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import json

# Import your analyze_crop function and setup code
from Pipeline import analyze_crop  # adjust path to your actual script
from Chatbot import load_chain
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your React frontend during development
origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",  # Alternative localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # 👈 Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],                # 👈 Allow all HTTP methods
    allow_headers=["*"],                # 👈 Allow all headers
)

class CropInput(BaseModel):
    preharvest: Dict
    storage: Dict

class FaqInput(BaseModel):
    Data: Dict
    user_question: str

@app.post("/analyze")
async def analyze(input_data: CropInput):
    try:
        result = analyze_crop(input_data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class FaqInput(BaseModel):
    Data: Dict
    user_question: str

@app.post("/chat")
async def chat(input_data: FaqInput):
    try: 
        result = load_chain(input_data.Data, input_data.user_question)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
