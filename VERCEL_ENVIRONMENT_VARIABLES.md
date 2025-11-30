# 🚨 CRITICAL: Vercel Environment Variables Setup

## The Problem You're Seeing

Error in console:
```
POST https://pixel-planet-frontend.vercel.app/dashboard/pixel-planet-pi.vercel.app/api/ecobot/chat
```

This malformed URL means **Vercel doesn't have the `VITE_API_URL` environment variable set**.

## ⚠️ IMPORTANT: Environment Variables in Vercel

Your `.env` file is **ONLY for local development**. Vercel **DOES NOT** read your `.env` file!

You must manually add environment variables in Vercel's dashboard.

## 🔧 How to Fix (Step-by-Step)

### Step 1: Go to Vercel Dashboard
1. Open [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Frontend** project (pixel-planet-frontend or similar)

### Step 2: Add Environment Variables
1. Click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar
3. Add each variable:

#### Required Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://pixel-planet-backend.vercel.app` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyArmCMwhpl3i0qzWYmASmw4u3UN9o7CPt4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `pixelplanet-fe176.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `pixelplanet-fe176` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `pixelplanet-fe176.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `804019280613` |
| `VITE_FIREBASE_APP_ID` | `1:804019280613:web:0b1b244949ccaeb9a3120c` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-19W11EQ27N` |

**CRITICAL**: Make sure `VITE_API_URL` includes `https://` at the start!

### Step 3: Select Environment
For each variable, select which environments to apply to:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** menu button
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional, makes it faster)
6. Click **"Redeploy"**

## 🔍 Verify It Worked

After redeployment:

1. Open your deployed site
2. Open browser console (F12)
3. Look for this log message:
   ```
   🔧 API_URL configured as: https://pixel-planet-backend.vercel.app
   ```

If you see `http://localhost:5000` instead, the environment variable wasn't set correctly.

## 📸 Visual Guide

### Where to Add Variables:
```
Vercel Dashboard
  → Your Project
    → Settings (top tab)
      → Environment Variables (left sidebar)
        → Add New Variable
```

### What to Enter:
```
Name:  VITE_API_URL
Value: https://pixel-planet-backend.vercel.app
Environment: ✅ Production ✅ Preview ✅ Development
```

## ❌ Common Mistakes

### Mistake 1: Forgetting `https://`
❌ Wrong: `pixel-planet-backend.vercel.app`
✅ Correct: `https://pixel-planet-backend.vercel.app`

### Mistake 2: Adding quotes
❌ Wrong: `"https://pixel-planet-backend.vercel.app"`
✅ Correct: `https://pixel-planet-backend.vercel.app`

### Mistake 3: Not redeploying
Environment variables only apply to **new deployments**. You must redeploy after adding them!

### Mistake 4: Wrong project
Make sure you're adding variables to the **Frontend** project, not the Backend!

## 🎯 Quick Checklist

- [ ] Opened Vercel dashboard
- [ ] Selected Frontend project
- [ ] Went to Settings → Environment Variables
- [ ] Added `VITE_API_URL` with value `https://pixel-planet-backend.vercel.app`
- [ ] Added all Firebase variables
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Went to Deployments tab
- [ ] Redeployed the latest deployment
- [ ] Checked console for `🔧 API_URL configured as:` message
- [ ] Tested EcoBot and Leaderboard

## 🆘 Still Not Working?

Check the console for the debug message. If you see:
- `🔧 API_URL configured as: http://localhost:5000` → Environment variable not set
- `🔧 API_URL configured as: https://pixel-planet-backend.vercel.app` → Variable is set correctly

If the variable is set correctly but you still get errors, the issue is with your backend deployment.
