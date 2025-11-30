# Vercel Deployment - Step by Step

## ✅ What I Fixed

All hardcoded `localhost:5000` URLs have been removed. Your app now uses the centralized API service that reads from environment variables.

## 🚀 For Local Development

1. **Stop your dev server** (Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   cd Frontend
   npm run dev
   ```

Your `.env` file already has:
```
VITE_API_URL=https://pixel-planet-backend.vercel.app
```

## 🌐 For Vercel Deployment

### Step 1: Deploy Backend First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your repository
4. **Root Directory**: Set to `Backend`
5. **Environment Variables** - Add these:
   ```
   OPENAI_API_KEY=your_openai_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```
6. Click "Deploy"
7. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. Go back to Vercel Dashboard
2. Click "Add New Project" again
3. Import the same repository
4. **Root Directory**: Set to `Frontend`
5. **Environment Variables** - Add ALL of these:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyArmCMwhpl3i0qzWYmASmw4u3UN9o7CPt4
   VITE_FIREBASE_AUTH_DOMAIN=pixelplanet-fe176.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=pixelplanet-fe176
   VITE_FIREBASE_STORAGE_BUCKET=pixelplanet-fe176.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=804019280613
   VITE_FIREBASE_APP_ID=1:804019280613:web:0b1b244949ccaeb9a3120c
   VITE_FIREBASE_MEASUREMENT_ID=G-19W11EQ27N
   VITE_API_URL=https://your-backend.vercel.app
   ```
   
   **IMPORTANT**: Replace `https://your-backend.vercel.app` with the actual URL from Step 1!

6. Click "Deploy"

### Step 3: Update Backend URL (If Needed)

If you already deployed and need to update the backend URL:

1. Go to your Frontend project in Vercel
2. Click "Settings" → "Environment Variables"
3. Find `VITE_API_URL`
4. Click "Edit" and update the value
5. Go to "Deployments" tab
6. Click "..." on latest deployment → "Redeploy"

## 🔍 Verify It's Working

After deployment:

1. Open your deployed frontend URL
2. Open browser console (F12)
3. Try using EcoBot or viewing leaderboard
4. Check the Network tab - you should see requests going to your backend URL (not localhost!)

## ❌ Common Issues

### "Failed to fetch" or "ERR_CONNECTION_REFUSED"
- **Cause**: Backend URL not set or incorrect
- **Fix**: Check `VITE_API_URL` in Vercel environment variables

### "CORS Error"
- **Cause**: Backend not allowing frontend domain
- **Fix**: Update CORS settings in `Backend/server.js`

### "API key not found"
- **Cause**: Backend environment variables not set
- **Fix**: Add API keys in Backend project settings on Vercel

## 📝 Key Points

- ✅ All API calls now use `VITE_API_URL` from environment variables
- ✅ No hardcoded localhost URLs remain
- ✅ EcoBot, Leaderboard, and all features use centralized API
- ✅ Local dev uses `.env` file
- ✅ Production uses Vercel environment variables
