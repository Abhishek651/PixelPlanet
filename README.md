# PixelPlanet - Environmental Education Platform

A comprehensive environmental education platform that gamifies learning about sustainability, ecology, and environmental conservation through challenges, quizzes, and interactive games.

## 🌟 Features

### 👥 User Roles & Authentication

#### Student
- Complete environmental challenges and quizzes
- Earn Eco Points, Coins, and XP
- Track progress with level system (Eco Beginner → Eco Legend)
- View real-time leaderboards (Institute & Global)
- Play educational games (Waste Segregator)
- Access personalized dashboard
- Browse Green Feed for eco-tips
- Shop in the Eco Store

#### Teacher
- Create and manage challenges (Quiz, Video, Physical)
- Generate AI-powered quizzes from topics or paragraphs
- Monitor student progress and submissions
- View classroom analytics
- Manage class assignments
- Requires HOD approval to access features

#### HOD (Head of Department)
- Approve/reject teacher registrations
- Oversee multiple teachers and classes
- Access institute-wide analytics
- Manage institute settings
- Generate registration codes for teachers and students
- Create institute-level challenges

#### Admin
- Full system access
- Manage all users and institutes
- Create global challenges
- System configuration
- View system-wide analytics

#### Sub-Admin
- Configurable permissions
- User management
- Content moderation
- Analytics access

#### Creator
- Create global environmental challenges
- Content creation tools
- Challenge management
- Creator analytics dashboard

#### Global User
- Access public challenges without joining an institute
- Join institutes with registration code
- Compete on global leaderboard
- Self-paced learning

### 🎮 Gamification System

#### XP & Leveling
- **XP Calculation**: Exponential curve (100 × level^1.5)
- **8 Level Titles**: 
  - Eco Beginner (Level 1-4)
  - Green Explorer (Level 5-9)
  - Eco Warrior (Level 10-14)
  - Nature Defender (Level 15-19)
  - Eco Champion (Level 20-29)
  - Green Guardian (Level 30-39)
  - Planet Protector (Level 40-49)
  - Eco Legend (Level 50+)
- **Real-time Progress Tracking**: Animated progress bars with live updates

#### Rewards System
- **Eco Points**: Main progression currency (100 per quiz completion)
- **Coins**: Activity rewards (10 per correct answer)
- **XP Rewards**:
  - Quiz: 50-150 XP based on performance
  - Perfect Score Bonus: +50 XP
  - Game: 30-80 XP based on level completed

#### Visual Feedback
- Animated badges with hover effects
- Shine effects on score displays
- Sparkle particles on progress changes
- Color-coded level badges with gradients
- Real-time value updates with spring animations

### 📚 Challenge Types

#### 1. Auto-Generated Quiz
- AI-powered question generation using Gemini API
- Generate from:
  - Topic only
  - Paragraph only (short/medium/long)
  - Topic + Paragraph
- Automatic MCQ creation with 4 options
- Configurable difficulty and question count
- Duplicate question prevention
- Paragraph expansion for more content

#### 2. Manual Quiz
- Custom question creation
- Multiple choice format
- Teacher-defined correct answers
- Flexible question count

#### 3. Video Challenge
- YouTube video integration
- Educational content delivery
- Progress tracking

#### 4. Physical Challenge
- Real-world environmental activities
- Photo/video submission
- **AI-Powered Verification** with Amazon Nova 2 Lite (Free)
- Toggle AI verification on/off per challenge
- Automatic image authenticity detection
- Challenge completion verification
- Instant feedback and approval

### 🎯 Quiz Features

#### Quiz Creation
- AI-powered generation with Gemini API
- Topic-based generation
- Paragraph-based generation (with length options)
- Combined topic + paragraph generation
- Preview before publishing
- Class/section targeting
- Visibility controls (Global/Institute)
- Edit and regenerate questions
- Duplicate question prevention

#### Quiz Management (Teachers/Creators)
- Review mode: View all questions with answers
- Edit mode: Modify questions, options, and answers
- Regenerate individual questions with AI
- Delete unwanted questions
- Expand paragraphs for more question variety
- Navigate quizzes from dashboard

#### Quiz Taking
- Clean, intuitive interface
- Progress indicator
- Question navigation (Previous/Next)
- Answer selection tracking
- Paragraph display (if provided)
- Timer support

#### Quiz Results
- Percentage score with color coding:
  - Green: ≥80%
  - Yellow: ≥60%
  - Red: <60%
- Detailed answer review
- Correct/incorrect indicators
- Visual checkmarks
- Reward summary (Eco Points, Coins, XP)
- Navigation options

### 🎲 Educational Games

#### Waste Segregator Game
- Interactive waste sorting with Phaser 3
- Progressive difficulty system (10+ levels)
- 4 waste categories: Organic, Recyclable, Hazardous, E-waste
- Adaptive learning algorithm
- Real-time scoring and feedback
- XP and Coins rewards
- Level-based XP calculation (30 + level × 10)
- Profile persistence across sessions

### 📊 Dashboard Features

#### Student Dashboard
- **Desktop View**:
  - Welcome header with streak tracking
  - Animated score badges (Level, Eco Points, Coins)
  - Profile widget with XP progress
  - Active challenges section
  - Daily quests
  - Recommended challenges
  - Leaderboard widget
  - Achievements display

- **Mobile View**:
  - Compact header with location
  - Horizontal scrollable score badges
  - Continue learning section
  - Daily quests grid
  - Featured challenges
  - Categories browser
  - Leaderboard integration

#### Teacher Dashboard
- Class overview
- Student progress tracking
- Challenge management
- Analytics and insights
- Submission review
- Pending approval screen (for unapproved teachers)

#### Creator Dashboard
- Global challenge creation
- Content management
- Creator analytics
- Performance metrics

#### HOD Dashboard
- Teacher approval system
- Institute-wide analytics
- Registration code generation
- Class and section management

#### Main Admin Dashboard
- System-wide analytics
- User management
- Institute management
- Global challenge oversight

### 🔄 Real-Time Features

#### Live Updates
- Firestore `onSnapshot` listeners
- Instant score updates
- Real-time leaderboard
- Live XP progress
- Automatic level calculation

#### Animations
- Framer Motion integration
- Spring-based transitions
- Hover and tap effects
- Value change animations
- Progress bar fills
- Sparkle effects

### 🏆 Leaderboard System

#### Institute Leaderboard
- Top students by Eco Points
- Real-time ranking
- Profile pictures
- Score display
- Rank indicators (top 3 highlighted)
- Class/section filtering

#### Global Leaderboard
- Cross-institute rankings
- Public challenges
- Achievement tracking
- Worldwide competition

### 🤖 AI Integration

#### EcoBot Assistant
- Gemini AI-powered chatbot
- Environmental education support
- Context-aware responses
- Conversation history
- Floating chat interface
- Real-time assistance

#### AI Quiz Generation
- Gemini API integration
- Natural language processing
- Automatic question formatting
- Answer validation
- Multiple generation modes
- Duplicate question detection
- Context-aware regeneration
- Paragraph expansion capability
- Strict paragraph-based questions (when paragraph provided)

#### AI Physical Challenge Verification (Amazon Nova 2 Lite)
- **100% Free** - No API costs via OpenRouter
- **Toggle Control** - Enable/disable per challenge
- **Multi-format Support** - JPEG, PNG, WebP (auto-converted)
- **AI-Generated Detection** - Identifies fake/AI images
- **Challenge Completion Verification** - Matches photo to requirements
- **Detailed Feedback** - Reasoning, suggestions, and concerns
- **Metadata Verification** - EXIF data and GPS location (optional)
- **Instant Results** - Real-time verification and approval

### 🎨 UI/UX Features

#### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Breakpoints: sm (640px), md (768px), lg (1024px)

#### Dark Mode
- System-wide dark theme support
- Automatic color adjustments
- Smooth transitions

#### Animations
- Framer Motion library
- Spring physics
- Staggered animations
- Micro-interactions
- Loading states

#### Navigation
- Bottom navbar (mobile)
- Side navbar (desktop)
- Role-based menu items
- Active state indicators
- Smooth transitions

### 🔐 Security & Permissions

#### Firestore Rules
- Role-based access control
- User data protection
- Challenge visibility rules
- Submission permissions
- Institute isolation

#### Authentication
- Firebase Authentication
- Email/password login
- Role assignment
- Token-based authorization
- Custom claims

#### Teacher Approval System
- New teachers register with `approved: false`
- HOD reviews and approves/rejects
- Pending teachers see approval screen
- Real-time status updates via Firestore listeners

### 📱 Mobile Features

#### Bottom Navigation
- 5-tab layout
- Role-specific items
- Active indicators
- Smooth animations
- Touch-optimized

#### Mobile Optimizations
- Touch-friendly buttons
- Swipe gestures
- Compact layouts
- Optimized images
- Fast loading

### 🎓 Institute Management

#### Institute Features
- Unique institute codes
- Class and section management
- Student enrollment
- Teacher assignment
- Institute-specific challenges
- Registration code system

#### Join Institute
- Code-based joining
- Global to institute conversion
- Automatic class assignment
- Permission updates

### 📈 Analytics & Tracking

#### Student Analytics
- Challenge completion rates
- Quiz scores
- XP progression
- Activity history
- Achievement tracking

#### Teacher Analytics
- Class performance
- Student engagement
- Challenge statistics
- Submission tracking

#### Creator Analytics
- Global challenge performance
- User engagement metrics
- Content reach statistics

### 🌐 Additional Features

#### Green Feed
- Environmental tips and news
- Educational content
- Community posts
- Eco-friendly practices

#### Eco Store
- Redeem coins for rewards
- Virtual items
- Achievement badges
- Profile customization

#### About Page
- Platform information
- Mission and vision
- Team details
- Contact information

### 🔧 Technical Features

#### Frontend
- React 18
- Vite (Build tool)
- React Router v6
- Framer Motion
- Tailwind CSS
- Firebase SDK v9+
- Phaser 3 (Game engine)
- Lucide Icons

#### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore Database
- Google Gemini AI API
- Amazon Nova 2 Lite (via OpenRouter)
- Backblaze B2 Storage
- Sharp (Image processing)
- RESTful API architecture
- Vercel deployment

#### State Management
- React Context API
- Custom hooks
- Real-time listeners
- Local state management

#### Performance
- Code splitting
- Lazy loading
- Optimized images
- Efficient re-renders
- Memoization

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Firebase project
- Google Gemini API key (for quiz generation)
- OpenRouter API key (for physical challenge verification - free)
- Backblaze B2 account (for image storage)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd PixelPlanet
```

2. Install dependencies
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

3. Configure environment variables

**Frontend** (`.env`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5001
```

**Backend** (`.env`):
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

4. Add Firebase Service Account
- Download service account key from Firebase Console
- Save as `Backend/serviceAccountKey.json` (for local development)
- For Vercel: Set `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable

5. Deploy Firestore rules
```bash
firebase deploy --only firestore:rules
```

6. Start development servers

**Frontend**:
```bash
cd Frontend
npm run dev
```

**Backend**:
```bash
cd Backend
npm start
```

## 📦 Project Structure

```
PixelPlanet/
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API and Firebase services
│   │   ├── utils/          # Utility functions
│   │   ├── data/           # Static data
│   │   └── App.jsx         # Main app component
│   ├── public/
│   │   └── Games/          # Game files (Phaser 3)
│   └── package.json
├── Backend/
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── quiz.js
│   │   ├── challenges.js
│   │   ├── analytics.js
│   │   ├── ecobot.js
│   │   ├── leaderboard.js
│   │   ├── admin-management.js
│   │   ├── creator-analytics.js
│   │   └── game-profile.js
│   ├── middleware/         # Express middleware
│   ├── utils/              # Backend utilities
│   ├── migrations/         # Database migrations
│   ├── server.js           # Express server
│   ├── firebaseConfig.js   # Firebase initialization
│   └── package.json
├── firestore.rules         # Firestore security rules
└── README.md
```

## 🔑 User Roles & Permissions

| Feature | Student | Teacher | HOD | Admin | Sub-Admin | Creator | Global |
|---------|---------|---------|-----|-------|-----------|---------|--------|
| Take Quizzes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Challenges | ❌ | ✅* | ✅ | ✅ | ✅** | ✅ | ❌ |
| Edit/Review Quizzes | ❌ | ✅* | ✅ | ✅ | ✅** | ✅ | ❌ |
| View Analytics | ❌ | ✅* | ✅ | ✅ | ✅** | ✅ | ❌ |
| Approve Teachers | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Users | ❌ | ❌ | ✅ | ✅ | ✅** | ❌ | ❌ |
| Manage Institutes | ❌ | ❌ | ✅ | ✅ | ✅** | ❌ | ❌ |
| Global Challenges | ❌ | ❌ | ❌ | ✅ | ✅** | ✅ | ✅ |

*Requires HOD approval  
**Sub-Admin permissions are configurable

## 🎯 Reward Calculations

### Quiz Rewards
- **Eco Points**: 100 (fixed)
- **Coins**: 10 × correct answers
- **XP**: 50 (base) + 50 (perfect bonus) + performance bonus (0-50)

### Game Rewards
- **Eco Points**: 50 × level
- **Coins**: Game score
- **XP**: 30 + (level × 10)

### Level Progression
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 282 XP
- Level 4: 500 XP
- Level 5: 750 XP
- Formula: 100 × level^1.5

## 🎨 Design System

### Colors
- **Primary**: Green (#22C55E)
- **Secondary**: Emerald (#10B981)
- **Accent**: Yellow (#F59E0B)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold, larger sizes
- **Body**: Regular, readable sizes
- **Mobile**: Smaller, optimized sizes

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd Frontend
vercel --prod
```

### Backend (Vercel)
```bash
cd Backend
vercel --prod
```

**Important**: Set environment variables in Vercel dashboard:
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (entire service account JSON)
- `FIREBASE_PROJECT_ID`
- `CORS_ORIGIN`
- `NODE_ENV=production`

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact the development team.

---

**Built with ❤️ for environmental education**
