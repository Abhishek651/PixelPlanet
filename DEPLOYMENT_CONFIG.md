# Deployment Configuration

## Architecture Overview

```
Frontend (Vercel) → Backend (Vercel) → External APIs (OpenAI, etc.)
```

**IMPORTANT**: API keys are NEVER stored in the frontend. The admin panel manages API keys in the backend, and the frontend only needs to know the backend URL.

## Environment Variables

### Frontend (.env)
Only ONE environment variable needed for the backend connection:

```
VITE_FIREBASE_API_KEY=AIzaSyArmCMwhpl3i0qzWYmASmw4u3UN9o7CPt4
VITE_FIREBASE_AUTH_DOMAIN=pixelplanet-fe176.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pixelplanet-fe176
VITE_FIREBASE_STORAGE_BUCKET=pixelplanet-fe176.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=804019280613
VITE_FIREBASE_APP_ID=1:804019280613:web:0b1b244949ccaeb9a3120c
VITE_FIREBASE_MEASUREMENT_ID=G-19W11EQ27N
VITE_API_URL=https://pixel-planet-backend.vercel.app
```

### Backend (.env)
The backend stores all sensitive API keys:

```
OPENAI_API_KEY=<your-openai-key>
GEMINI_API_KEY=<your-gemini-key>
# Other API keys managed through admin panel
```

## How It Works

1. **Admin Panel**: Admin updates API keys through the frontend admin panel
2. **Backend Storage**: Keys are stored securely in backend database/environment
3. **Frontend Requests**: Frontend sends requests to backend (e.g., `/api/ecobot/chat`)
4. **Backend Processing**: Backend uses stored API keys to call external services
5. **Response**: Backend returns processed data to frontend

## Benefits

✅ API keys never exposed to frontend/users
✅ Admin can change keys without redeploying frontend
✅ Centralized key management
✅ Better security

## Deployment Steps

### Frontend (Vercel)
1. Set `VITE_API_URL` environment variable in Vercel project settings
2. Deploy frontend
3. No need to redeploy when API keys change!

### Backend (Vercel)
1. Set all API keys in Vercel project settings
2. Deploy backend
3. Admin can update keys through admin panel
4. Backend automatically uses updated keys

## Fixed Issues

1. **EcoBot**: Now correctly routes through backend
2. **Leaderboard**: Uses backend API
3. **All External APIs**: Proxied through backend
4. **Security**: No API keys in frontend code
