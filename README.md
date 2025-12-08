<div align="center">

# 🌍 PixelPlanet

### *Gamified Environmental Education Platform*

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

**Transform environmental education through gamification, AI-powered challenges, and real-world impact tracking.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

**PixelPlanet** is a comprehensive environmental education platform that gamifies learning about sustainability, ecology, and environmental conservation. Students earn rewards by completing challenges, teachers create AI-powered quizzes, and institutions track real-world environmental impact.

### 🎯 Mission
Empower the next generation to become environmental stewards through engaging, interactive, and measurable learning experiences.

### 📊 Platform Stats
- **8 User Roles** with granular permissions
- **4 Challenge Types** (Quiz, Video, Physical, Manual)
- **AI-Powered** quiz generation and verification
- **Real-time** leaderboards and progress tracking
- **Gamification** with XP, levels, coins, and badges

---

## ✨ Key Features

### 🎮 Gamification System

<table>
<tr>
<td width="50%">

#### XP & Leveling
- **8 Level Titles**: Eco Beginner → Eco Legend
- **Exponential Curve**: 100 × level^1.5
- **Real-time Progress**: Animated bars with live updates
- **Visual Feedback**: Badges, shine effects, sparkles

</td>
<td width="50%">

#### Rewards System
- **Eco Points**: Main progression currency
- **Coins**: Activity rewards (10 per correct answer)
- **XP Bonuses**: Perfect score +50 XP
- **Game Rewards**: 30-80 XP based on performance

</td>
</tr>
</table>

### 🤖 AI Integration

| Feature | Technology | Status |
|---------|-----------|--------|
| **Quiz Generation** | Google Gemini AI | ✅ Active |
| **Physical Challenge Verification** | Amazon Nova 2 Lite (Free) | ✅ Active |
| **EcoBot Assistant** | Gemini AI | ✅ Active |
| **Image Authenticity Detection** | Nova AI + Metadata | ✅ Active |

#### AI Quiz Generation
- **3 Generation Modes**:
  - Topic-based (general knowledge)
  - Paragraph-based (strict content adherence)
  - Combined (topic + paragraph)
- **Smart Features**:
  - Duplicate question prevention
  - Paragraph expansion for variety
  - Context-aware regeneration
  - Automatic MCQ formatting

#### AI Physical Challenge Verification
- **100% Free** via OpenRouter
- **Toggle Control** per challenge
- **Multi-format Support** (JPEG, PNG, WebP)
- **Instant Feedback** with reasoning
- **Metadata Verification** (EXIF, GPS)


### 📚 Challenge Types

<details>
<summary><b>1. Auto-Generated Quiz</b> (AI-Powered)</summary>

- Generate from topic, paragraph, or both
- Configurable difficulty and question count
- Automatic MCQ creation with 4 options
- Duplicate prevention
- Edit and regenerate individual questions
- Review mode for teachers

</details>

<details>
<summary><b>2. Manual Quiz</b></summary>

- Custom question creation
- Multiple choice format
- Teacher-defined correct answers
- Flexible question count

</details>

<details>
<summary><b>3. Video Challenge</b></summary>

- YouTube video integration
- Educational content delivery
- Progress tracking
- Engagement metrics

</details>

<details>
<summary><b>4. Physical Challenge</b> (AI-Verified)</summary>

- Real-world environmental activities
- Photo/video submission
- AI-powered verification (toggle on/off)
- Automatic authenticity detection
- Instant approval/feedback

</details>

### 🎲 Educational Games

#### Waste Segregator Game
- **Engine**: Phaser 3
- **Levels**: 10+ progressive difficulty
- **Categories**: Organic, Recyclable, Hazardous, E-waste
- **Features**: Adaptive learning, real-time scoring
- **Rewards**: XP (30 + level × 10) + Coins


---

## 👥 User Roles

<table>
<thead>
<tr>
<th>Role</th>
<th>Key Permissions</th>
<th>Dashboard Features</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>🎓 Student</b></td>
<td>
• Complete challenges<br>
• Earn rewards<br>
• Play games<br>
• View leaderboards
</td>
<td>
• XP progress tracking<br>
• Active challenges<br>
• Daily quests<br>
• Achievements
</td>
</tr>
<tr>
<td><b>👨‍🏫 Teacher</b></td>
<td>
• Create challenges<br>
• Generate AI quizzes<br>
• Monitor students<br>
• Review submissions<br>
<i>*Requires HOD approval</i>
</td>
<td>
• Class overview<br>
• Student progress<br>
• Challenge management<br>
• Analytics
</td>
</tr>
<tr>
<td><b>🏛️ HOD</b></td>
<td>
• Approve teachers<br>
• Institute analytics<br>
• Generate reg codes<br>
• Manage classes
</td>
<td>
• Teacher approval<br>
• Institute-wide stats<br>
• Registration codes<br>
• Class management
</td>
</tr>
<tr>
<td><b>👑 Admin</b></td>
<td>
• Full system access<br>
• Manage all users<br>
• Global challenges<br>
• System config
</td>
<td>
• System-wide analytics<br>
• User management<br>
• Institute management<br>
• API settings
</td>
</tr>
<tr>
<td><b>🎨 Creator</b></td>
<td>
• Create global challenges<br>
• Content management<br>
• Creator analytics
</td>
<td>
• Global challenge stats<br>
• Engagement metrics<br>
• Content reach
</td>
</tr>
<tr>
<td><b>🌐 Global User</b></td>
<td>
• Access public challenges<br>
• Join institutes<br>
• Global leaderboard<br>
• Self-paced learning
</td>
<td>
• Public challenges<br>
• Global rankings<br>
• Games access<br>
• EcoBot
</td>
</tr>
<tr>
<td><b>⚙️ Sub-Admin</b></td>
<td colspan="2">
<i>Configurable permissions (user management, content moderation, analytics)</i>
</td>
</tr>
</tbody>
</table>


---

## 🛠️ Tech Stack

### Frontend
```
React 19.1.1          - UI framework
Vite 7.1.7            - Build tool & dev server
React Router 7.9.3    - Client-side routing
Framer Motion 12.23   - Animations
Tailwind CSS 3.4.4    - Styling
Firebase SDK 12.3.0   - Authentication & Firestore
Phaser 3              - Game engine
Lucide React          - Icons
Axios 1.12.2          - HTTP client
```

### Backend
```
Node.js 20.x          - Runtime
Express 4.21.2        - Web framework
Firebase Admin 13.5.0 - Server-side Firebase
Google Gemini AI      - Quiz generation & chatbot
Amazon Nova 2 Lite    - Image verification (Free)
Backblaze B2          - Image storage
Sharp 0.33.5          - Image processing
Multer 2.0.2          - File uploads
```

### Database & Storage
```
Firebase Firestore    - NoSQL database
Firebase Auth         - User authentication
Backblaze B2          - Object storage (91% cheaper than Firebase)
```

### AI & APIs
```
Google Gemini API     - Quiz generation, EcoBot
OpenRouter API        - Amazon Nova 2 Lite access (Free)
```

### Deployment
```
Vercel                - Frontend & Backend hosting
Firebase Hosting      - Alternative hosting
```


---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Dashboard │  │Challenges│  │  Games   │  │ Profile  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         React Router + Context API                   │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │   Quiz   │  │Challenge │  │Analytics │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ EcoBot   │  │Leaderboard│ │GreenFeed │  │  Games   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│  Firebase        │ │  AI Services │ │  Backblaze   │
│  - Firestore     │ │  - Gemini AI │ │  - B2 Storage│
│  - Auth          │ │  - Nova AI   │ │  - Images    │
│  - Real-time     │ │  - OpenRouter│ │  - Videos    │
└──────────────────┘ └──────────────┘ └──────────────┘
```

### Data Flow

```
User Action → Frontend → API Request → Backend Validation
                                            ↓
                                    Firebase/AI/Storage
                                            ↓
                                    Response Processing
                                            ↓
                                    Frontend Update
                                            ↓
                                    Real-time Sync
```


---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Firebase** project
- **Google Gemini API** key (for quiz generation)
- **OpenRouter API** key (for physical challenge verification - free)
- **Backblaze B2** account (for image storage)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd PixelPlanet
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd Frontend
npm install
```

**Backend:**
```bash
cd Backend
npm install
```

#### 3. Configure Environment Variables

**Frontend** (`Frontend/.env`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5001
```

**Backend** (`Backend/.env`):
```env
PORT=5001
FIREBASE_PROJECT_ID=your_project_id
CORS_ORIGIN=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS_JSON=<service_account_json>
OPENROUTER_API_KEY=your_openrouter_api_key
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_app_key
B2_BUCKET_NAME=your_bucket_name
B2_ENDPOINT=your_b2_endpoint
```

#### 4. Firebase Setup

1. Download service account key from [Firebase Console](https://console.firebase.google.com/)
2. Save as `Backend/serviceAccountKey.json` (for local development)
3. For Vercel: Set `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable

#### 5. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

#### 6. Start Development Servers

**Frontend:**
```bash
cd Frontend
npm run dev
# Opens at http://localhost:5173
```

**Backend:**
```bash
cd Backend
npm start
# Runs at http://localhost:5001
```


---

## 📁 Project Structure

```
PixelPlanet/
├── Frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── base/            # Base components (buttons, inputs)
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── EcoBot.jsx       # AI chatbot
│   │   │   ├── XPProgressBar.jsx
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── CreateAutoQuizPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── GreenFeedPage.jsx
│   │   │   └── ...
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx  # Authentication state
│   │   │   └── useAuth.js       # Auth hook
│   │   ├── services/            # API and Firebase services
│   │   │   ├── api.js           # API client
│   │   │   ├── firebase.js      # Firebase config
│   │   │   └── ...
│   │   ├── utils/               # Utility functions
│   │   │   ├── xpSystem.js      # XP calculations
│   │   │   ├── logger.js        # Logging
│   │   │   └── ...
│   │   ├── data/                # Static data
│   │   │   └── games.js         # Game configurations
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── public/
│   │   └── Games/               # Phaser 3 game files
│   │       ├── waste-segregator-game.js
│   │       └── ...
│   └── package.json
│
├── Backend/
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication
│   │   ├── quiz.js              # Quiz generation
│   │   ├── challenges.js        # Challenge management
│   │   ├── physical-challenge.js # AI verification
│   │   ├── green-feed.js        # Social feed
│   │   ├── ecobot.js            # AI chatbot
│   │   ├── leaderboard.js       # Rankings
│   │   ├── analytics.js         # Analytics
│   │   ├── game-profile.js      # Game progress
│   │   ├── admin-management.js  # Admin tools
│   │   └── creator-analytics.js # Creator stats
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT verification
│   ├── utils/                   # Backend utilities
│   │   ├── novaVerification.js  # Nova AI integration
│   │   ├── imageVerification.js # Image analysis
│   │   ├── signedUrl.js         # B2 signed URLs
│   │   └── logger.js            # Logging
│   ├── config/                  # Configuration
│   │   └── backblazeConfig.js   # B2 setup
│   ├── migrations/              # Database migrations
│   ├── server.js                # Express server
│   ├── firebaseConfig.js        # Firebase initialization
│   └── package.json
│
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── firebase.json                # Firebase config
└── README.md                    # This file
```


---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5001`
- **Production**: `https://your-backend.vercel.app`

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
```
POST   /api/auth/register-institute    # Register new institute
POST   /api/auth/register-teacher      # Register teacher
POST   /api/auth/register-student      # Register student
POST   /api/auth/login                 # User login
POST   /api/auth/sync-user             # Sync user data
```

#### Quiz Management
```
POST   /api/quiz/generate              # Generate AI quiz
POST   /api/quiz/expand-paragraph      # Expand paragraph for more questions
GET    /api/challenges                 # Get all challenges
POST   /api/challenges                 # Create challenge
PUT    /api/challenges/:id             # Update challenge
DELETE /api/challenges/:id             # Delete challenge
```

#### Physical Challenges
```
POST   /api/physical-challenge/submit/:challengeId    # Submit with AI verification
GET    /api/physical-challenge/submissions            # Get user submissions
```

#### Leaderboard
```
GET    /api/leaderboard/institute/:instituteId        # Institute rankings
GET    /api/leaderboard/global                        # Global rankings
```

#### Green Feed
```
GET    /api/green-feed/posts                          # Get posts
POST   /api/green-feed/posts                          # Create post
POST   /api/green-feed/posts/:postId/like             # Like/unlike
GET    /api/green-feed/posts/:postId/comments         # Get comments
POST   /api/green-feed/posts/:postId/comments         # Add comment
DELETE /api/green-feed/posts/:postId                  # Delete post
```

#### EcoBot
```
POST   /api/ecobot/chat                               # Chat with AI
```

#### Analytics
```
GET    /api/analytics/student/:studentId              # Student analytics
GET    /api/analytics/teacher/:teacherId              # Teacher analytics
GET    /api/creator/analytics                         # Creator analytics
```

#### Game Profile
```
GET    /api/game/profile                              # Get game progress
POST   /api/game/profile/update                       # Update game progress
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```


---

## 🎯 Reward Calculations

### Quiz Rewards
```javascript
Eco Points: 100 (fixed)
Coins: 10 × correct_answers
XP: 50 (base) + 50 (perfect bonus) + performance_bonus (0-50)

Example:
- 8/10 correct answers
- Eco Points: 100
- Coins: 80
- XP: 50 + 0 + 40 = 90 XP
```

### Game Rewards
```javascript
Eco Points: 50 × level
Coins: game_score
XP: 30 + (level × 10)

Example (Level 5):
- Eco Points: 250
- Coins: 1500 (game score)
- XP: 30 + 50 = 80 XP
```

### Level Progression
```javascript
Formula: 100 × level^1.5

Level 1:  0 XP      (Eco Beginner)
Level 2:  100 XP    (Eco Beginner)
Level 3:  282 XP    (Eco Beginner)
Level 4:  500 XP    (Eco Beginner)
Level 5:  750 XP    (Green Explorer)
Level 10: 2,236 XP  (Green Explorer)
Level 20: 7,155 XP  (Eco Champion)
Level 50: 35,355 XP (Eco Legend)
```

### Level Titles
| Level Range | Title | Badge Color |
|-------------|-------|-------------|
| 1-4 | Eco Beginner | Gray |
| 5-9 | Green Explorer | Green |
| 10-14 | Eco Warrior | Blue |
| 15-19 | Nature Defender | Purple |
| 20-29 | Eco Champion | Orange |
| 30-39 | Green Guardian | Red |
| 40-49 | Planet Protector | Gold |
| 50+ | Eco Legend | Rainbow |


---

## 🚢 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd Frontend
vercel --prod
```

3. **Environment Variables** (Vercel Dashboard)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_URL=https://your-backend.vercel.app
```

### Backend (Vercel)

1. **Deploy**
```bash
cd Backend
vercel --prod
```

2. **Environment Variables** (Vercel Dashboard)
```
NODE_ENV=production
PORT=5001
FIREBASE_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS_JSON=<entire_service_account_json>
CORS_ORIGIN=https://your-frontend.vercel.app
OPENROUTER_API_KEY
B2_KEY_ID
B2_APPLICATION_KEY
B2_BUCKET_NAME
B2_ENDPOINT
```

### Firestore Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Backblaze B2 Setup

1. **Create Bucket**
   - Go to [Backblaze Console](https://secure.backblaze.com/)
   - Create bucket (Private)
   - Note bucket name and ID

2. **Create Application Key**
   - Generate application key (not master key)
   - Note key ID and application key

3. **Configure CORS**
   - Add CORS rules for your domains
   - See `BACKBLAZE_CORS_SETUP.md` for details


---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-green: #22C55E;
--secondary-emerald: #10B981;
--accent-yellow: #F59E0B;

/* Status Colors */
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Neutral Colors */
--background: #F9FAFB;
--card: #FFFFFF;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

```css
/* Tailwind spacing scale */
0.5 = 2px
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
```

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```


---

## 📚 Documentation

### Feature Documentation
- [Green Feed Architecture](GREEN_FEED_ARCHITECTURE.md) - Social feed system design
- [Green Feed Features](GREEN_FEED_FEATURES.md) - Feature overview
- [Physical Challenge AI Verification](PHYSICAL_CHALLENGE_AI_VERIFICATION.md) - AI verification system
- [Nova AI Integration](NOVA_AI_INTEGRATION.md) - Amazon Nova 2 Lite setup
- [Final Checklist](FINAL_CHECKLIST.md) - Implementation status

### Setup Guides
- [Backblaze Setup](BACKBLAZE_SETUP.md) - Complete B2 configuration
- [CORS Setup](BACKBLAZE_CORS_SETUP.md) - CORS configuration
- [Deployment Guide](DEPLOYMENT_VERCEL.md) - Production deployment

### Research
- [Environmental Education Research](Environmental_Education_Research.md) - Background research

---

## 🔒 Security Features

### Authentication
- Firebase Authentication with JWT
- Role-based access control (RBAC)
- Custom claims for permissions
- Token refresh mechanism

### Data Protection
- Firestore security rules
- User data isolation
- Institute-level data separation
- Encrypted API communication

### File Upload Security
- File type validation
- Size limits (10MB)
- Virus scanning (planned)
- Sanitized filenames
- User-specific folders

### AI Verification
- Metadata extraction (EXIF)
- GPS verification
- AI-generated image detection
- Challenge completion verification

---

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd Frontend
npm test

# Backend tests
cd Backend
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Challenge creation (all types)
- [ ] Quiz generation (topic, paragraph, combined)
- [ ] Physical challenge submission with AI verification
- [ ] Leaderboard updates
- [ ] XP and level progression
- [ ] Game integration
- [ ] Green Feed posts and interactions
- [ ] EcoBot responses
- [ ] Mobile responsiveness


---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>Firebase Authentication Error</b></summary>

**Problem**: "Firebase: Error (auth/invalid-api-key)"

**Solution**:
1. Check `.env` file has correct Firebase credentials
2. Verify Firebase project is active
3. Ensure API key is not restricted
4. Restart development server

</details>

<details>
<summary><b>CORS Error</b></summary>

**Problem**: "Access to fetch blocked by CORS policy"

**Solution**:
1. Check `CORS_ORIGIN` in backend `.env`
2. Verify frontend URL matches CORS origin
3. For Backblaze: Configure CORS rules in B2 console
4. Restart backend server

</details>

<details>
<summary><b>AI Quiz Generation Fails</b></summary>

**Problem**: "Quiz generation unavailable"

**Solution**:
1. Verify Gemini API key in admin settings
2. Check API quota limits
3. Test with smaller question count
4. Review backend logs for errors

</details>

<details>
<summary><b>Physical Challenge Verification Fails</b></summary>

**Problem**: "AI verification failed"

**Solution**:
1. Check OpenRouter API key
2. Ensure image has EXIF metadata
3. Verify image format (JPEG/PNG)
4. Try disabling AI verification toggle
5. Check backend logs

</details>

<details>
<summary><b>Images Not Loading</b></summary>

**Problem**: Images show broken link icon

**Solution**:
1. Verify Backblaze B2 credentials
2. Check bucket permissions (public read)
3. Confirm CORS configuration
4. Test image URL directly in browser
5. Check browser console for errors

</details>

---

## 📊 Performance Optimization

### Frontend
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Lazy loading with Intersection Observer
- **Caching**: Service Worker for offline support (planned)
- **Bundle Size**: Tree shaking and minification

### Backend
- **Database Queries**: Indexed fields for fast lookups
- **Pagination**: Limit results to 10-20 per page
- **Caching**: Redis for frequently accessed data (planned)
- **CDN**: Backblaze B2 with CDN integration (planned)

### Monitoring
- **Frontend**: Browser DevTools, Lighthouse
- **Backend**: Express logging, Firebase monitoring
- **Database**: Firestore usage metrics
- **Storage**: Backblaze bandwidth tracking


---

## 🌍 Environmental Impact

### Tracking Metrics (Planned)
- **Trees Planted**: From physical challenges
- **Plastic Removed**: Weight in kg
- **Carbon Offset**: Tons of CO2
- **Community Events**: Number of participants
- **Global Impact Map**: Visualize worldwide activities

### Integration with Challenges
- Link posts to challenges
- Verify challenge completion
- Award bonus XP for impact
- Leaderboard for environmental impact

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] User authentication and roles
- [x] Challenge creation (all types)
- [x] AI quiz generation
- [x] Physical challenge AI verification
- [x] Gamification system
- [x] Leaderboard
- [x] Green Feed
- [x] Educational games
- [x] EcoBot assistant

### Phase 2 (Q1 2025) 🚧
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Video challenge verification
- [ ] Social features (follow, share)
- [ ] Achievement badges
- [ ] Eco Store items

### Phase 3 (Q2 2025) 📋
- [ ] Live streaming events
- [ ] Virtual reality experiences
- [ ] Blockchain certificates
- [ ] NFT rewards
- [ ] Carbon credit integration
- [ ] Partnership with NGOs
- [ ] Multi-language support

### Phase 4 (Q3 2025) 💡
- [ ] AI-powered personalized learning paths
- [ ] Augmented reality challenges
- [ ] Satellite imagery verification
- [ ] Global impact dashboard
- [ ] API for third-party integrations
- [ ] White-label solution for schools


---

## 💰 Cost Analysis

### Monthly Costs (1000 active users)

| Service | Usage | Cost | Notes |
|---------|-------|------|-------|
| **Firebase Firestore** | 50K reads/day | $0 | Free tier |
| **Firebase Auth** | 1000 users | $0 | Free tier |
| **Backblaze B2** | 10GB storage | $0 | Free tier |
| **Backblaze Bandwidth** | 30GB/month | $0 | 1GB/day free |
| **Gemini AI** | 30K requests | $7.50 | $0.00025/request |
| **Nova AI** | Unlimited | $0 | 100% Free |
| **Vercel Hosting** | 100GB bandwidth | $0 | Free tier |
| **Total** | | **$7.50/month** | |

### Cost Savings
- **91% cheaper** than Firebase Storage
- **100% free** AI verification (Nova vs Gemini)
- **Scalable** to 10K users for ~$50/month

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: ESLint
- **Commits**: Conventional Commits format
- **Documentation**: Update README for new features

### Testing Requirements

- Unit tests for utilities
- Integration tests for API endpoints
- E2E tests for critical flows
- Manual testing checklist


---

## 📞 Support & Contact

### Getting Help

- **Documentation**: Check the docs in this repository
- **Issues**: Open a GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@pixelplanet.com (if available)

### Reporting Bugs

When reporting bugs, please include:
1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**: Browser, OS, device
7. **Console Logs**: Any error messages

### Feature Requests

We love feature ideas! Please include:
1. **Use Case**: Why is this needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Impact**: Who benefits from this?

---

## 📜 License

This project is **proprietary and confidential**. All rights reserved.

Unauthorized copying, distribution, or use of this software is strictly prohibited.

---

## 🙏 Acknowledgments

### Technologies
- [React](https://reactjs.org/) - UI framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- [Amazon Nova](https://aws.amazon.com/bedrock/nova/) - Image verification
- [Backblaze B2](https://www.backblaze.com/b2/) - Object storage
- [Phaser](https://phaser.io/) - Game engine
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Inspiration
- Environmental education initiatives worldwide
- Gamification in education research
- Open-source community

---

<div align="center">

## 🌱 Built with ❤️ for Environmental Education

**PixelPlanet** - *Empowering the next generation of environmental stewards*

[⬆ Back to Top](#-pixelplanet)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready

</div>
