# 🚀 Quick Start Guide

## Running Locally

### 1. Start Backend Server

```bash
cd Backend
npm start
```

Backend should start on `http://localhost:5000`

### 2. Start Frontend Server

```bash
cd Frontend
npm run dev
```

Frontend should start on `http://localhost:5173`

### 3. Access Application

Open your browser to: `http://localhost:5173`

---

## Troubleshooting

### ❌ "Failed to fetch" or "ERR_CONNECTION_REFUSED"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Make sure backend is running on port 5000
2. Check if `.env` file exists in Frontend folder
3. Verify `VITE_API_URL=http://localhost:5000` in Frontend/.env
4. Restart both servers after changing .env files

### ❌ EcoBot Not Working

**Problem**: EcoBot shows connection error

**Solutions**:
1. Ensure backend is running
2. Check if OpenAI API key is set in Backend/.env
3. Test backend endpoint: `curl http://localhost:5000/api/ecobot/chat`

### ❌ Leaderboard Not Loading

**Problem**: Leaderboard shows empty or error

**Solutions**:
1. Ensure backend is running
2. Check Firebase configuration
3. Verify user is logged in
4. Check browser console for specific errors

---

## Development Workflow

### Making Changes

1. **Frontend Changes**:
   - Edit files in `Frontend/src/`
   - Vite hot-reloads automatically
   - No restart needed

2. **Backend Changes**:
   - Edit files in `Backend/`
   - Restart backend server: `Ctrl+C` then `npm start`

3. **Environment Variables**:
   - Edit `.env` files
   - **Must restart both servers** after .env changes

### Testing

1. **Frontend**: Open browser DevTools (F12)
2. **Backend**: Check terminal logs
3. **Network**: Check Network tab in DevTools

---

## Common Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server
npm run dev          # Start with nodemon (auto-restart)
```

---

## Environment Setup Checklist

- [ ] Node.js 16+ installed
- [ ] npm installed
- [ ] Firebase project created
- [ ] Frontend/.env configured
- [ ] Backend/.env configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Browser opened to localhost:5173

---

## Need Help?

1. Check error messages in browser console (F12)
2. Check backend terminal for errors
3. Verify both servers are running
4. Check `.env` files are properly configured
5. Try restarting both servers

---

**Happy Coding! 🌱**

*Team Invictus*
