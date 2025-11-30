# Backend Vercel Setup

## 🚨 CRITICAL: Backend Environment Variables

Your backend also needs environment variables set in Vercel!

## Required Backend Environment Variables

Go to your **Backend** project in Vercel → Settings → Environment Variables

Add these:

| Name | Value | Notes |
|------|-------|-------|
| `CORS_ORIGIN` | `https://pixel-planet-frontend.vercel.app` | Your frontend URL |
| `PORT` | `5001` | Optional, Vercel handles this |
| `OPENAI_API_KEY` | `your-openai-key` | For EcoBot |
| `GEMINI_API_KEY` | `your-gemini-key` | Alternative AI provider |

**CRITICAL**: Replace `https://pixel-planet-frontend.vercel.app` with your actual frontend URL!

## 🔧 How to Find Your Frontend URL

1. Go to Vercel Dashboard
2. Click on your Frontend project
3. Copy the URL shown at the top (e.g., `https://pixel-planet-frontend.vercel.app`)
4. Use this as your `CORS_ORIGIN` value in the Backend project

## 🎯 Complete Setup Checklist

### Backend Project:
- [ ] Go to Backend project in Vercel
- [ ] Settings → Environment Variables
- [ ] Add `CORS_ORIGIN` = `https://your-frontend-url.vercel.app`
- [ ] Add `OPENAI_API_KEY` = your OpenAI key
- [ ] Add `GEMINI_API_KEY` = your Gemini key (if using)
- [ ] Redeploy backend

### Frontend Project:
- [ ] Go to Frontend project in Vercel
- [ ] Settings → Environment Variables
- [ ] Add `VITE_API_URL` = `https://your-backend-url.vercel.app`
- [ ] Add all Firebase variables (see VERCEL_ENVIRONMENT_VARIABLES.md)
- [ ] Redeploy frontend

## 🔄 Deployment Order

1. **Deploy Backend first** (with CORS_ORIGIN set to frontend URL)
2. **Copy backend URL**
3. **Deploy Frontend** (with VITE_API_URL set to backend URL)

## ⚠️ Common CORS Issues

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause**: Backend's `CORS_ORIGIN` doesn't match your frontend URL

**Fix**: 
1. Check your frontend URL (e.g., `https://pixel-planet-frontend.vercel.app`)
2. Update backend's `CORS_ORIGIN` to match exactly
3. Redeploy backend

### Multiple Frontend URLs?

If you have multiple frontend URLs (production, preview, etc.), you can:

**Option 1**: Allow all origins (less secure)
```javascript
// In Backend/server.js
const corsOptions = {
    origin: '*',  // Allow all origins
    // ... rest of config
};
```

**Option 2**: Allow multiple specific origins (recommended)
```javascript
// In Backend/server.js
const allowedOrigins = [
    'https://pixel-planet-frontend.vercel.app',
    'https://pixel-planet-frontend-preview.vercel.app',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // ... rest of config
};
```

## 🧪 Testing

After deployment, test these endpoints:

1. **Backend Health Check**:
   - Open: `https://your-backend-url.vercel.app/api/ecobot/chat`
   - Should return an error (not 404)

2. **Frontend API Calls**:
   - Open your frontend
   - Open console (F12)
   - Try EcoBot
   - Check Network tab for API calls

## 📝 Environment Variable Summary

### Backend (.env for local, Vercel for production):
```
CORS_ORIGIN=https://pixel-planet-frontend.vercel.app
PORT=5001
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

### Frontend (.env for local, Vercel for production):
```
VITE_API_URL=https://pixel-planet-backend.vercel.app
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase vars
```
