import os
import requests
import google.generativeai as genai  # type: ignore[import-untyped]
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path

# --- 1. INITIAL SETUP ---

# Get the explicit path to the .env file to ensure it loads correctly
BASE_DIR = Path(__file__).resolve().parent 
DOTENV_PATH = BASE_DIR / '.env'
load_dotenv(dotenv_path=DOTENV_PATH) 

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_KEY:
    print("CRITICAL ERROR: GEMINI_API_KEY environment variable is missing.")
    exit(1)


# --- Configure the Gemini API client using the stable method ---
try:
    genai.configure(api_key=GEMINI_KEY)
    global_model = genai.GenerativeModel('gemini-2.5-flash') 
except Exception as e:
    print(f"Error during Gemini client setup: {e}")
    exit(1)


# Configure the FastAPI app
app = FastAPI(
    title="AI Travel Guide API (Stable)",
    description="API for generating stable, non-streaming JSON itineraries and suggestions."
)

# --- CORS Configuration (Allows all common localhost ports and IPs) ---
origins = [
    # General Localhost Ports
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8000",
    
    # 127.0.0.1 IPs (Browser alternative to 'localhost')
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, OPTIONS)
    allow_headers=["*"], # Allow all headers (fixes pre-flight checks)
)

# Get the OpenWeatherMap API key 
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")


# --- 2. DATA MODELS (PYDANTIC) ---
class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    interests: str


# --- 3. API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Travel Guide API!"}


@app.get("/suggested-trips")
def get_suggested_trips():
    """Core Feature 2: Returns a static list of pre-curated trip suggestions."""
    return [
        {
            "id": 1,
            "destination": "Kyoto, Japan",
            "country_code": "JP",
            "country_flag": "https://flagcdn.com/w80/jp.png",
            "highlights": "Historic temples, beautiful gardens, and traditional tea houses.",
            "best_time": "March-May (Spring) or Oct-Nov (Autumn)",
            "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@35.011636,135.768029,50a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 2,
            "destination": "Amalfi Coast, Italy",
            "country_code": "IT",
            "country_flag": "https://flagcdn.com/w80/it.png",
            "highlights": "Stunning coastline, colorful villages, and delicious seafood.",
            "best_time": "April-June (Spring)",
            "image_url": "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@40.633333,14.602778,50a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 3,
            "destination": "Mumbai, India",
            "country_code": "IN",
            "country_flag": "https://flagcdn.com/w80/in.png",
            "highlights": "Gateway of India, Marine Drive, and vibrant street food.",
            "best_time": "October-March (Winter)",
            "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@18.922064,72.834646,10a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 4,
            "destination": "Cape Town, South Africa",
            "country_code": "ZA",
            "country_flag": "https://flagcdn.com/w80/za.png",
            "highlights": "Table Mountain, stunning beaches, and diverse wildlife.",
            "best_time": "November-March (Summer)",
            "image_url": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@-33.924869,18.424055,10a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 5,
            "destination": "Patagonia, Argentina",
            "country_code": "AR",
            "country_flag": "https://flagcdn.com/w80/ar.png",
            "highlights": "Glaciers, mountains, and pristine wilderness.",
            "best_time": "December-February (Summer)",
            "image_url": "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@-50.337975,-72.264724,50a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 6,
            "destination": "Santorini, Greece",
            "country_code": "GR",
            "country_flag": "https://flagcdn.com/w80/gr.png",
            "highlights": "White-washed buildings, blue domes, and stunning sunsets.",
            "best_time": "April-June or September-October",
            "image_url": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@36.393156,25.461509,50a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 7,
            "destination": "Banff, Canada",
            "country_code": "CA",
            "country_flag": "https://flagcdn.com/w80/ca.png",
            "highlights": "Turquoise lakes, Rocky Mountains, and abundant wildlife.",
            "best_time": "June-September (Summer)",
            "image_url": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@51.178363,-115.570769,1400a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 8,
            "destination": "Sydney, Australia",
            "country_code": "AU",
            "country_flag": "https://flagcdn.com/w80/au.png",
            "highlights": "Opera House, Harbour Bridge, and beautiful beaches.",
            "best_time": "September-November or March-May",
            "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@-33.865143,151.209900,10a,1000d,35y,0h,0t,0r"
        },
        {
            "id": 9,
            "destination": "Reykjavik, Iceland",
            "country_code": "IS",
            "country_flag": "https://flagcdn.com/w80/is.png",
            "highlights": "Northern lights, geothermal pools, and dramatic landscapes.",
            "best_time": "June-August (Summer) or September-March (Northern Lights)",
            "image_url": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
            "google_earth_url": "https://earth.google.com/web/@64.146582,-21.942636,10a,1000d,35y,0h,0t,0r"
        }
    ]


@app.post("/generate-itinerary")
async def generate_itinerary(request: ItineraryRequest):
    """
    Core Feature 1 (STABLE): Generates a personalized travel itinerary using the Gemini AI, 
    returning the entire response as JSON once complete.
    """
    
    prompt = f"""
    You are an expert travel planner. A user wants to visit: {request.destination}
    They will be there for {request.duration} days.
    Their interests include: {request.interests}.

    Create a detailed, day-by-day travel itinerary.
    
    IMPORTANT: Respond ONLY with a valid JSON object.
    The JSON object must have a single key named "itinerary".
    The value of "itinerary" must be an array of objects.
    Each object in the array must have two keys: "day" (e.g., "Day 1") and "activities" (an array of strings).

    Do not include any text, markdown, or any characters before or after the JSON object.
    """

    try:
        # Call the NON-STREAMING method
        response = global_model.generate_content(prompt)
        
        # Clean the response text to get pure JSON
        clean_json_response = response.text.strip().replace("```json", "").replace("```", "")
        
        # Include the raw prompt for Chain of Thought visualization
        return {"data_from_ai": clean_json_response, "prompt_used": prompt}

    except Exception as e:
        error_message = f"Error calling Gemini API for non-streaming: {e}"
        print(error_message)
        raise HTTPException(status_code=500, detail="AI Generation Failed.")


@app.get("/get-weather")
async def get_weather(city: str):
    """
    Bonus Feature: Gets the current weather for a given city.
    """
    if not WEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured.")

    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status() 
        weather_data = response.json()
        
        return {
            "city": weather_data["name"],
            "temperature": weather_data["main"]["temp"],
            "description": weather_data["weather"][0]["description"].title(),
            "icon": weather_data["weather"][0]["icon"]
        }
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"City not found: {city}")
        if e.response.status_code == 401:
            error_detail = "Weather API error: 401 Unauthorized. Check OpenWeatherMap API Key."
            raise HTTPException(status_code=500, detail=error_detail)
        
        raise HTTPException(status_code=500, detail=f"Weather API request failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unknown error occurred: {e}")