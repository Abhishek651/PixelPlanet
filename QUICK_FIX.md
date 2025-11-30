# 🚨 QUICK FIX - Do This Now!

## The Problem
Your app is deployed but environment variables are missing in Vercel.

## The Solution (5 minutes)

### 1️⃣ Backend Environment Variables

Go to: **Vercel Dashboard → Backend Project → Settings → Environment Variables**

Add:
```
Name: CORS_ORIGIN
Value: https://pixel-planet-frontend.vercel.app

Name: OPENAI_API_KEY  
Value: [your OpenAI key]
```

Click **Save** → Go to **Deployments** → Click **"..."** → **Redeploy**

---

### 2️⃣ Frontend Environment Variables

Go to: **Vercel Dashboard → Frontend Project → Settings → Environment Variables**

Add:
```
Name: VITE_API_URL
Value: https://pixel-planet-backend.vercel.app
```

Also add all these Firebase variables:
```
VITE_FIREBASE_API_KEY = AIzaSyArmCMwhpl3i0qzWYmASmw4u3UN9o7CPt4
VITE_FIREBASE_AUTH_DOMAIN = pixelplanet-fe176.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = pixelplanet-fe176
VITE_FIREBASE_STORAGE_BUCKET = pixelplanet-fe176.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 804019280613
VITE_FIREBASE_APP_ID = 1:804019280613:web:0b1b244949ccaeb9a3120c
VITE_FIREBASE_MEASUREMENT_ID = G-19W11EQ27N
```

Click **Save** → Go to **Deployments** → Click **"..."** → **Redeploy**

---

### 3️⃣ Test

1. Open your deployed site
2. Press F12 (open console)
3. Look for: `🔧 API_URL configured as: https://pixel-planet-backend.vercel.app`
4. Try EcoBot - it should work!

---

## ⚠️ Critical Points

- ✅ Include `https://` in URLs
- ✅ No quotes around values
- ✅ Must redeploy after adding variables
- ✅ Do backend first, then frontend

## 📸 Where to Add Variables

```
Vercel.com
  → Dashboard
    → [Your Project]
      → Settings (top tab)
        → Environment Variables (left menu)
          → Add New
```

---

## Still Not Working?

Check the console message:
- If you see `http://localhost:5000` → Variables not set
- If you see `https://pixel-planet-backend.vercel.app` → Variables are correct

For detailed help, see: `DEPLOYMENT_CHECKLIST.md`
