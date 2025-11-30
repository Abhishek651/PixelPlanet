# 🚀 Complete Deployment Checklist

## Current Issue

You're seeing this error:
```
POST https://pixel-planet-frontend.vercel.app/dashboard/pixel-planet-pi.vercel.app/api/ecobot/chat
```

This means **environment variables are not set in Vercel**.

## ✅ Step-by-Step Fix

### Step 1: Deploy Backend

1. **Go to Vercel Dashboard** → Backend Project
2. **Settings** → **Environment Variables**
3. **Add these variables**:
   ```
   CORS_ORIGIN = https://pixel-planet-frontend.vercel.app
   OPENAI_API_KEY = your-openai-api-key
   GEMINI_API_KEY = your-gemini-api-key
   ```
4. **Select**: Production, Preview, Development
5. **Deployments** → **Redeploy** latest
6. **Copy your backend URL** (e.g., `https://pixel-planet-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Go to Vercel Dashboard** → Frontend Project
2. **Settings** → **Environment Variables**
3. **Add these variables**:
   ```
   VITE_API_URL = https://pixel-planet-backend.vercel.app
   VITE_FIREBASE_API_KEY = AIzaSyArmCMwhpl3i0qzWYmASmw4u3UN9o7CPt4
   VITE_FIREBASE_AUTH_DOMAIN = pixelplanet-fe176.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = pixelplanet-fe176
   VITE_FIREBASE_STORAGE_BUCKET = pixelplanet-fe176.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 804019280613
   VITE_FIREBASE_APP_ID = 1:804019280613:web:0b1b244949ccaeb9a3120c
   VITE_FIREBASE_MEASUREMENT_ID = G-19W11EQ27N
   ```
4. **Select**: Production, Preview, Development
5. **Deployments** → **Redeploy** latest

### Step 3: Verify

1. **Open your deployed frontend**
2. **Open browser console** (F12)
3. **Look for**: `🔧 API_URL configured as: https://pixel-planet-backend.vercel.app`
4. **Test EcoBot** - should work now!

## 🎯 Quick Reference

### What Goes Where?

**Backend Vercel Environment Variables:**
- `CORS_ORIGIN` → Your frontend URL
- `OPENAI_API_KEY` → Your OpenAI key
- `GEMINI_API_KEY` → Your Gemini key

**Frontend Vercel Environment Variables:**
- `VITE_API_URL` → Your backend URL
- All `VITE_FIREBASE_*` variables

## ⚠️ Important Notes

1. **URLs must include `https://`**
   - ✅ `https://pixel-planet-backend.vercel.app`
   - ❌ `pixel-planet-backend.vercel.app`

2. **No quotes in Vercel**
   - ✅ `https://example.com`
   - ❌ `"https://example.com"`

3. **Must redeploy after adding variables**
   - Environment variables only apply to new deployments

4. **Backend must be deployed first**
   - You need the backend URL for the frontend

## 🔍 Troubleshooting

### Still seeing localhost errors?
→ Environment variables not set in Vercel. Check Step 2.

### CORS errors?
→ Backend's `CORS_ORIGIN` doesn't match frontend URL. Check Step 1.

### 404 errors?
→ Backend not deployed or wrong URL. Check backend deployment.

### "Unexpected token '<'" error?
→ API URL is wrong, getting HTML instead of JSON. Check `VITE_API_URL`.

## 📚 Detailed Guides

- **Frontend Setup**: See `VERCEL_ENVIRONMENT_VARIABLES.md`
- **Backend Setup**: See `BACKEND_VERCEL_SETUP.md`
- **Local Development**: See `QUICK_START.md`

## 🆘 Need Help?

1. Check console for `🔧 API_URL configured as:` message
2. Check Network tab in browser DevTools
3. Verify environment variables are set in Vercel
4. Make sure you redeployed after adding variables
