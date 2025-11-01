# WanderAI

> AI-Powered Travel Planning Platform

WanderAI is a modern, intelligent travel planning application that leverages Google's Gemini AI to create personalized travel itineraries. Discover destinations, plan your perfect trip, and explore the world with AI-powered recommendations.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://www.python.org/)

## 🌟 Features

### Core Features
- **🤖 AI-Powered Itineraries**: Generate personalized day-by-day travel plans using Google Gemini AI
- **🌍 Destination Discovery**: Explore curated destinations from every continent with country flags
- **🌤️ Real-Time Weather**: Get current weather information for your destination
- **🗺️ Google Earth Integration**: Explore destinations in 3D with direct Google Earth links
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **📄 PDF Export**: Download your itinerary as a professionally formatted PDF

### User Experience
- **🎨 Dark/Light Mode**: Toggle between themes with persistent preference
- **⚡ Snap Scrolling**: Smooth, full-page scrolling experience
- **🎯 Professional UI**: Modern, clean interface with glass-morphism effects
- **🎉 Celebration Effects**: Confetti animation and toast notifications
- **💫 Smooth Animations**: Page transitions, button ripples, and micro-interactions
- **⌨️ Keyboard Accessible**: Full keyboard navigation support
- **♿ Accessible**: WCAG compliant with proper ARIA labels and reduced motion support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Google Gemini API Key
- OpenWeatherMap API Key (optional, for weather feature)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WanderAI
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Create `.env` file in backend folder**
```env
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend** (Terminal 1)
```bash
cd backend
python -m uvicorn main:app --reload
```
Backend will run on `http://127.0.0.1:8000`

2. **Start the Frontend** (Terminal 2)
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 📁 Project Structure

```
GradGuide2 - Copy/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── .env                 # Environment variables (create this)
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── ItineraryResult.js
│   │   │   ├── ItineraryResult.css
│   │   │   ├── TripCard.js
│   │   │   └── TripCard.css
│   │   ├── pages/          # Page components
│   │   │   ├── ItineraryBuilder.js
│   │   │   ├── ItineraryBuilder.css
│   │   │   ├── SuggestedTrips.js
│   │   │   └── SuggestedTrips.css
│   │   ├── App.js          # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - AI-powered itinerary generation
- **OpenWeatherMap API** - Real-time weather data
- **Python 3.8+** - Backend language
- **Uvicorn** - ASGI server

### External Services
- **Unsplash** - Destination images
- **FlagCDN** - Country flag images
- **Google Earth** - 3D destination exploration

## 🎯 API Endpoints

### Backend API (`http://127.0.0.1:8000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API health check |
| `/suggested-trips` | GET | Get list of curated destinations |
| `/generate-itinerary` | POST | Generate AI-powered itinerary |
| `/get-weather` | GET | Get current weather for a city |

### Example API Request

**Generate Itinerary:**
```bash
curl -X POST "http://127.0.0.1:8000/generate-itinerary" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris",
    "duration": 3,
    "interests": "art, food, history"
  }'
```

## 🌍 Supported Destinations

WanderAI includes curated destinations from all continents:
- 🇯🇵 Kyoto, Japan
- 🇮🇹 Amalfi Coast, Italy
- 🇮🇳 Mumbai, India
- 🇿🇦 Cape Town, South Africa
- 🇦🇷 Patagonia, Argentina
- 🇬🇷 Santorini, Greece
- 🇨🇦 Banff, Canada
- 🇦🇺 Sydney, Australia
- 🇮🇸 Reykjavik, Iceland

## 🎨 Features in Detail

### AI Itinerary Generation
- Powered by Google Gemini 2.5 Flash
- Personalized based on destination, duration, and interests
- Day-by-day activity breakdown
- Includes weather information
- Confetti celebration on successful generation
- Toast notifications for feedback

### PDF Export
- One-click download of complete itinerary
- Professional formatting with branding
- Includes all trip details and weather
- Automatic page breaks and pagination
- Downloadable filename: `{destination}_{timestamp}.pdf`

### Visual Enhancements
- **Skeleton Loaders**: Shimmer effect while loading destinations
- **Button Ripple Effects**: Material Design-style interactions
- **Smooth Animations**: Page transitions, hover effects, icon animations
- **Custom Scrollbar**: Gradient blue scrollbar matching brand
- **Form Validation**: Visual indicators for valid/invalid inputs
- **Progress Indicators**: Animated progress during AI generation

### Dark Mode
- System-wide theme toggle with professional switch
- Persistent preference (localStorage)
- Optimized color palette for readability
- Smooth transitions for all elements
- Adapted skeleton loaders and components

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (mobile), 1024px (desktop)
- Touch-friendly interface
- Adaptive layouts
- Optimized navigation for small screens

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
GEMINI_API_KEY=your_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

### Getting API Keys

1. **Google Gemini API**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `.env` file

2. **OpenWeatherMap API** (Optional)
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for free API key
   - Add to `.env` file

## 🚢 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Backend Deployment (Railway/Render)
```bash
cd backend
# Ensure requirements.txt is up to date
pip freeze > requirements.txt
# Deploy with your preferred platform
```

### Environment Variables for Production
- Set `GEMINI_API_KEY` in production environment
- Set `WEATHER_API_KEY` in production environment
- Update CORS origins in `main.py` to include production URL

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test API endpoints
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/suggested-trips
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Unsplash Source API may occasionally return cached images
- Weather API requires valid city names (no typo tolerance)

## ✨ Recent Updates

### Version 2.0 (Latest)
- ✅ PDF export functionality
- ✅ Confetti celebration effects
- ✅ Toast notifications
- ✅ Skeleton loaders for better UX
- ✅ Custom styled scrollbar
- ✅ Button ripple effects
- ✅ Form validation indicators
- ✅ Enhanced animations and micro-interactions
- ✅ Professional theme toggle switch
- ✅ Accessibility improvements (keyboard navigation, reduced motion)

## 🔮 Future Enhancements

- [ ] User authentication and saved itineraries
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Booking integration
- [ ] Collaborative trip planning
- [ ] Mobile app (React Native)
- [ ] Email itinerary delivery
- [ ] Budget calculator
- [ ] Packing list generator

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini AI for powering intelligent itinerary generation
- Unsplash for beautiful destination imagery
- OpenWeatherMap for weather data
- FlagCDN for country flags
- React and FastAPI communities

---

**Made with ❤️ for travelers worldwide**
