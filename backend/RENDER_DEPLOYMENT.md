# Render Deployment Guide for WanderAI Backend

## Prerequisites
- Render.com account
- GEMINI_API_KEY (required)
- WEATHER_API_KEY (optional)

## Deployment Steps

### 1. Push Code to GitHub
Ensure all files including `Procfile` and `render.yaml` are committed and pushed to your repository.

### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `WanderAI` repository

### 3. Configure Service Settings

- **Name**: `wanderai-backend-evy3` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 4. Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `GEMINI_API_KEY` | Your Gemini API key | **REQUIRED** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `WEATHER_API_KEY` | Your OpenWeatherMap API key | Optional - Get from [OpenWeatherMap](https://openweathermap.org/api) |

### 5. Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (2-5 minutes)
3. Check logs for any errors

### 6. Verify Deployment

Once deployed, test these endpoints:

- **Health Check**: `https://wanderai-backend-evy3.onrender.com/`
  - Should return: `{"message": "Welcome to the AI Travel Guide API!"}`

- **Suggested Trips**: `https://wanderai-backend-evy3.onrender.com/suggested-trips`
  - Should return: Array of trip suggestions

### 7. Update Frontend (if needed)

If your backend URL changed, update these files in the frontend:
- `frontend/src/pages/SuggestedTrips.js`
- `frontend/src/pages/ItineraryBuilder.js`

Change the `BASE_URL` to match your new backend URL.

## Troubleshooting

### Backend Not Starting
- Check Render logs for errors
- Verify `GEMINI_API_KEY` is set correctly
- Ensure `requirements.txt` has all dependencies

### CORS Errors
- Verify frontend URL is in the `origins` list in `main.py`
- Current allowed origin: `https://wanderai-frontend.onrender.com`

### 500 Errors
- Check if API keys are valid
- Review Render logs for detailed error messages

## Free Tier Limitations

Render's free tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of runtime

## Support

For issues, check:
- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
