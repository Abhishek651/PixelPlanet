# PixelPlanet - Environmental Education Platform

A comprehensive educational platform designed to promote environmental awareness and sustainability through interactive challenges, quizzes, and gamification.

## 🌟 Features

### For Students
- **Interactive Dashboard** - Track progress, eco points, coins, and XP
- **Challenges** - Participate in physical, video, and quiz challenges
- **Educational Games** - Play the Waste Segregator adaptive learning game
- **Leaderboards** - Compete with classmates (Institute) or globally
- **Profile Management** - Customize profile and track achievements
- **EcoBot Assistant** - AI-powered environmental guidance

### For Teachers
- **Challenge Creation** - Create physical, video, manual quiz, and AI-generated quiz challenges
- **Auto Quiz Generator** - Generate quizzes from topics or paragraphs with customizable length
- **Student Management** - Track student progress and submissions
- **Analytics Dashboard** - View class performance and engagement metrics
- **Approval System** - Requires HOD/Admin approval before accessing features

### For HOD/Admins
- **Institute Management** - Manage teachers, students, and classes
- **Teacher Approval** - Approve or reject teacher registrations
- **Registration Codes** - Generate codes for teachers and students
- **Analytics** - View institute-wide performance metrics

### For Global Users
- **No Institute Required** - Access platform features without joining an institute
- **Global Leaderboard** - Compete with users worldwide
- **Self-paced Learning** - Access educational content independently

## 🎮 Games

### Waste Segregator (Adaptive Learning)
- Progressive difficulty system (10+ levels)
- 4 waste categories: Organic, Recyclable, Hazardous, E-waste
- Adaptive learning algorithm tracks mastery and confusion
- Real-time feedback and scoring
- Profile persistence across sessions

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Phaser 3** - Game engine
- **Firebase Auth** - Authentication
- **Firestore** - Real-time database

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Firebase Admin SDK** - Server-side Firebase operations
- **Gemini AI** - Quiz generation
- **Vercel** - Deployment

## 📁 Project Structure

```
PixelPlanet/
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API and Firebase services
│   │   ├── utils/          # Utility functions
│   │   └── data/           # Static data
│   ├── public/
│   │   └── Games/          # Game files
│   └── package.json
├── Backend/
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── migrations/         # Database migrations
│   └── server.js
├── firestore.rules         # Firestore security rules
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Gemini AI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd PixelPlanet
```

2. **Install Frontend Dependencies**
```bash
cd Frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../Backend
npm install
```

4. **Configure Environment Variables**

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Backend `.env`:
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key
```

5. **Add Firebase Service Account**
- Download service account key from Firebase Console
- Save as `Backend/serviceAccountKey.json`

### Running the Application

1. **Start Backend Server**
```bash
cd Backend
npm start
```

2. **Start Frontend Development Server**
```bash
cd Frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 🔐 User Roles

### Admin
- Full system access
- Manage all institutes and users
- System-wide analytics

### HOD (Head of Department)
- Institute management
- Approve/reject teachers
- View institute analytics
- Generate registration codes

### Teacher
- Create challenges and quizzes
- View student submissions
- Track class performance
- Requires HOD approval

### Student
- Participate in challenges
- Complete quizzes and games
- Track personal progress
- View leaderboards

### Global User
- Access without institute
- Self-paced learning
- Global leaderboard participation

## 📊 Key Features Implementation

### Teacher Approval System
- New teachers register with `approved: false`
- HOD reviews and approves/rejects
- Pending teachers see approval screen
- Real-time status updates via Firestore listeners

### Adaptive Learning Game
- Progressive difficulty (1→4 bins gradually)
- Mastery tracking per category
- Confusion matrix for struggling areas
- Smart level progression (85% advance, 60-85% repeat, <60% easier)

### Quiz Generation
- Topic-based generation
- Paragraph-based generation
- Customizable paragraph length (short/medium/long)
- AI-powered question creation
- Multiple choice format

### Leaderboard System
- Institute-specific rankings
- Global rankings
- Real-time updates
- Filtered by class/activity type

## 🔒 Security

- Firebase Authentication
- Custom claims for role-based access
- Firestore security rules
- Token verification middleware
- Input validation and sanitization

## 📝 API Documentation

See `START_BACKEND.md` for detailed API endpoint documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

Developed by the PixelPlanet team.

## 📞 Support

For support, please contact the development team.

---

**Note**: This is an educational platform designed to promote environmental awareness and sustainability. All features are designed with student engagement and learning outcomes in mind.
