# EcoLearn Platform

A comprehensive environmental education platform that gamifies learning about sustainability, ecology, and environmental conservation through challenges, quizzes, and interactive games.

## 🌟 Features

### 👥 User Roles & Authentication

#### Student
- Complete environmental challenges and quizzes
- Earn Eco Points, Coins, and XP
- Track progress with level system (Eco Beginner → Eco Legend)
- View real-time leaderboards
- Play educational games
- Access personalized dashboard

#### Teacher
- Create and manage challenges (Quiz, Video, Physical)
- Generate AI-powered quizzes from topics or paragraphs
- Monitor student progress
- View classroom analytics
- Manage class assignments

#### HOD (Head of Department)
- Oversee multiple teachers and classes
- Access institute-wide analytics
- Manage institute settings
- Create institute-level challenges

#### Admin
- Full system access
- Manage all users and institutes
- Create global challenges
- System configuration

#### Sub-Admin
- Configurable permissions
- User management
- Content moderation
- Analytics access

#### Creator
- Create global environmental challenges
- Content creation tools
- Challenge management

#### Global User
- Access public challenges
- Join institutes with code
- Limited features until institute join

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
  - Paragraph only
  - Topic + Paragraph
- Automatic MCQ creation with 4 options
- Configurable difficulty and question count

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
- Teacher verification and grading

### 🎯 Quiz Features

#### Quiz Creation
- AI-powered generation with Gemini API
- Topic-based generation
- Paragraph-based generation
- Combined topic + paragraph generation
- Preview before publishing
- Class/section targeting
- Edit and regenerate questions
- Duplicate question prevention
- Paragraph expansion for more content

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
- Interactive waste sorting
- Multiple difficulty levels
- Real-time scoring
- XP and Coins rewards
- Level-based XP calculation (30 + level × 10)
- Integrated reward system

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

#### Menu Page (Mobile/Tablet)
- Profile widget with XP progress
- Quick access to all features
- Journey tracking
- Eco-explore section
- Help and resources

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

#### Global Leaderboard
- Cross-institute rankings
- Public challenges
- Achievement tracking

### 🤖 AI Integration

#### EcoBot Assistant
- Gemini AI-powered chatbot
- Environmental education support
- Context-aware responses
- Conversation history
- Floating chat interface

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

### 🎁 Achievements System

#### Badge Types
- First Steps
- Quiz Master
- Tree Hugger
- Water Saver
- Custom achievements

#### Achievement Display
- Visual badges
- Unlock animations
- Progress tracking
- Locked state indicators

### 🌐 Content Management

#### Challenge Management
- Create, edit, delete
- Visibility controls (Global/Institute)
- Class targeting
- Deadline management
- Status tracking

#### Content Types
- Quizzes (Auto/Manual)
- Videos
- Physical activities
- Games
- Articles

### 🔧 Technical Features

#### Frontend
- React 18
- React Router v6
- Framer Motion
- Tailwind CSS
- Firebase SDK
- Lucide Icons
- Material Symbols

#### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore Database
- Google Gemini AI API
- RESTful API architecture

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
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecolearn-platform
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
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Deploy Firestore rules
```bash
firebase deploy --only firestore:rules
```

5. Start development servers

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
ecolearn-platform/
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
│   │   └── Games/          # Game files
│   └── package.json
├── Backend/
│   ├── routes/             # API routes
│   ├── utils/              # Backend utilities
│   ├── migrations/         # Database migrations
│   └── server.js           # Express server
├── firestore.rules         # Firestore security rules
└── README.md
```

## 🎓 Recent Updates

### Quiz Management Enhancements
- **Review & Edit Mode**: Teachers and creators can now review and edit quizzes after creation
- **Question Regeneration**: Regenerate individual questions with AI while avoiding duplicates
- **Paragraph Expansion**: Automatically expand short paragraphs to enable more question variety
- **Duplicate Prevention**: AI actively avoids generating duplicate questions (up to 3 attempts)
- **Dashboard Navigation**: Click quiz challenges from dashboards to review/edit them
- **Strict Paragraph Mode**: Questions from paragraphs are strictly based on paragraph content only

## 🔑 User Roles & Permissions

| Feature | Student | Teacher | HOD | Admin | Sub-Admin | Creator | Global |
|---------|---------|---------|-----|-------|-----------|---------|--------|
| Take Quizzes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Challenges | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| Edit/Review Quizzes | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| View Analytics | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Manage Institutes | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Global Challenges | ❌ | ❌ | ❌ | ✅ | ✅* | ✅ | ✅ |

*Sub-Admin permissions are configurable

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

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact the development team or create an issue in the repository.

---

**Built with ❤️ for environmental education**ent variables

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
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Deploy Firestore rules
```bash
firebase deploy --only firestore:rules
```

5. Start development servers

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
ecolearn-platform/
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
│   │   └── Games/          # Game files
│   └── package.json
├── Backend/
│   ├── routes/             # API routes
│   ├── utils/              # Backend utilities
│   ├── migrations/         # Database migrations
│   └── server.js           # Express server
├── firestore.rules         # Firestore security rules
└── README.md
```

## 🔑 User Roles & Permissions

| Feature | Student | Teacher | HOD | Admin | Sub-Admin | Creator | Global |
|---------|---------|---------|-----|-------|-----------|---------|--------|
| Take Quizzes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Challenges | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| View Analytics | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Manage Institutes | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Global Challenges | ❌ | ❌ | ❌ | ✅ | ✅* | ✅ | ✅ |

*Sub-Admin permissions are configurable

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

## 🐛 Known Issues & Limitations

- Leaderboard API returns 500 error (backend issue)
- Some analytics features in development
- Limited offline support
- Mobile game performance varies by device

## 🔮 Future Enhancements

- Push notifications
- Offline mode
- Social features (teams, chat)
- More game types
- Advanced analytics
- Mobile app (React Native)
- Multilingual support
- Accessibility improvements

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, contact the development team or create an issue in the repository.

---

**Built with ❤️ for environmental education**
