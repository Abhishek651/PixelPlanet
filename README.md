<div align="center">

# 🌍 PixelPlanet

### *Gamifying Environmental Education for a Sustainable Future*

[![Made with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**Transform environmental learning into an engaging adventure with challenges, quizzes, games, and AI-powered education.**

*Developed by Team Invictus*

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**PixelPlanet** is a comprehensive environmental education platform that makes learning about sustainability fun and engaging. Through gamification, AI-powered content generation, and interactive challenges, students embark on a journey from **Eco Beginner** to **Eco Legend** while earning rewards and competing on leaderboards.


---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎮 **Gamification System**
- **8 Progressive Levels** from Eco Beginner to Eco Legend
- **XP System** with exponential curve (100 × level^1.5)
- **Dual Currency**: Eco Points & Coins
- **Real-time Progress** with animated bars
- **Visual Rewards** with sparkle effects

</td>
<td width="50%">

### 🤖 **AI-Powered Learning**
- **Auto-Generated Quizzes** using Gemini AI
- **Smart Question Generation** from topics/paragraphs
- **EcoBot Assistant** for instant help
- **Duplicate Prevention** algorithm
- **Context-Aware** content creation

</td>
</tr>
<tr>
<td width="50%">

### 📚 **Challenge Types**
- ✅ **Auto Quiz** - AI-generated questions
- ✏️ **Manual Quiz** - Custom teacher questions
- 🎥 **Video Challenge** - YouTube integration
- 🏃 **Physical Challenge** - Real-world activities
- 🎲 **Educational Games** - Interactive learning

</td>
<td width="50%">

### 👥 **Multi-Role System**
- 🎓 **Students** - Learn and compete
- 👨‍🏫 **Teachers** - Create and manage
- 🏛️ **HOD** - Institute oversight
- 👑 **Admin** - Full system control
- ⚙️ **Sub-Admin** - Configurable permissions
- ✍️ **Creator** - Global content creation

</td>
</tr>
</table>

---

## 🎯 Key Highlights

<div align="center">

| 🏆 Leaderboards | 📊 Analytics | 🎨 Beautiful UI | 📱 Responsive |
|:---:|:---:|:---:|:---:|
| Real-time rankings | Detailed insights | Dark mode support | Mobile-first design |
| Institute & Global | Progress tracking | Framer Motion | Touch-optimized |

</div>

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js v16+  |  npm/yarn  |  Firebase Project  |  Gemini API Key
```

### Quick Setup

<details>
<summary><b>1️⃣ Clone & Install</b></summary>

```bash
# Clone the repository
git clone <repository-url>
cd PixelPlanet

# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```
</details>

<details>
<summary><b>2️⃣ Configure Environment</b></summary>

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
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
GEMINI_API_KEY=your_gemini_api_key
```
</details>

<details>
<summary><b>3️⃣ Deploy & Run</b></summary>

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Start frontend (in Frontend directory)
npm run dev

# Start backend (in Backend directory)
npm start
```
</details>

---

## 🏗️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)

</div>

---

## 📂 Project Structure

```
PixelPlanet/
│
├── 🎨 Frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components & routes
│   │   ├── context/        # React Context (Auth, etc.)
│   │   ├── services/       # API & Firebase services
│   │   ├── utils/          # Helper functions & XP system
│   │   ├── data/           # Static data & configurations
│   │   └── App.jsx         # Main application component
│   ├── public/
│   │   └── Games/          # Interactive game files
│   └── package.json
│
├── ⚙️ Backend/
│   ├── routes/             # Express API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── challenges.js   # Challenge management
│   │   ├── quiz.js         # Quiz operations
│   │   ├── ecobot.js       # AI chatbot
│   │   └── leaderboard.js  # Rankings & scores
│   ├── middleware/         # Auth & validation
│   ├── utils/              # Backend utilities
│   ├── migrations/         # Database migrations
│   └── server.js           # Express server setup
│
├── 🔥 firestore.rules      # Firestore security rules
└── 📖 README.md            # You are here!
```

---

## 🎓 User Roles & Permissions

<div align="center">

| Feature | 🎓 Student | 👨‍🏫 Teacher | 🏛️ HOD | 👑 Admin | ⚙️ Sub-Admin | ✍️ Creator | 🌍 Global |
|---------|:----------:|:---------:|:------:|:--------:|:------------:|:----------:|:---------:|
| Take Quizzes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Challenges | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| Edit/Review Quizzes | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| View Analytics | ❌ | ✅ | ✅ | ✅ | ✅* | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Manage Institutes | ❌ | ❌ | ✅ | ✅ | ✅* | ❌ | ❌ |
| Global Challenges | ❌ | ❌ | ❌ | ✅ | ✅* | ✅ | ✅ |

<sub>*Sub-Admin permissions are configurable</sub>

</div>

---

## 🎮 Gamification Details

### 🏅 Level Progression

<table>
<tr>
<td align="center">

**Level 1-4**<br>
🌱 Eco
 Beginner

</td>
<td align="center">

**Level 5-9**<br>
🔍 Green Explorer

</td>
<td align="center">

**Level 10-14**<br>
⚔️ Eco Warrior

</td>
<td align="center">

**Level 15-19**<br>
🛡️ Nature Defender

</td>
</tr>
<tr>
<td align="center">

**Level 20-29**<br>
🏆 Eco Champion

</td>
<td align="center">

**Level 30-39**<br>
👑 Green Guardian

</td>
<td align="center">

**Level 40-49**<br>
🌟 Planet Protector

</td>
<td align="center">

**Level 50+**<br>
⚡ Eco Legend

</td>
</tr>
</table>

### 💰 Reward System

```
📊 Quiz Completion
├─ Eco Points: 100 (fixed)
├─ Coins: 10 × correct answers
└─ XP: 50 (base) + 50 (perfect bonus) + 0-50 (performance)

🎮 Game Completion
├─ Eco Points: 50 × level
├─ Coins: Game score
└─ XP: 30 + (level × 10)

📈 XP Formula: 100 × level^1.5
```

---

## 🎨 Design System

<table>
<tr>
<td>

### 🎨 Color Palette
- **Primary**: `#22C55E` 🟢
- **Secondary**: `#10B981` 💚
- **Accent**: `#F59E0B` 🟡
- **Success**: `#22C55E` ✅
- **Warning**: `#F59E0B` ⚠️
- **Error**: `#EF4444` ❌

</td>
<td>

### 📱 Responsive Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### ✨ Animations
- Framer Motion spring physics
- Micro-interactions
- Loading states

</td>
</tr>
</table>

---

## 🔐 Security Features

- ✅ **Firebase Authentication** - Secure email/password login
- ✅ **Role-Based Access Control** - Firestore security rules
- ✅ **Token Authorization** - Custom claims & JWT
- ✅ **Data Protection** - User data isolation
- ✅ **Institute Isolation** - Separate data per institute

---

## 📊 Recent Updates

### ✨ Quiz Management Enhancements
- 📝 **Review & Edit Mode** - Teachers can review and edit quizzes after creation
- 🔄 **Question Regeneration** - Regenerate individual questions with AI
- 📄 **Paragraph Expansion** - Auto-expand short paragraphs for more questions
- 🚫 **Duplicate Prevention** - AI avoids generating duplicate questions (3 attempts)
- 🎯 **Dashboard Navigation** - Click quiz challenges to review/edit
- 📖 **Strict Paragraph Mode** - Questions strictly based on paragraph content

---

## 🎯 Educational Games

### 🗑️ Waste Segregator Game
- Interactive waste sorting simulation
- Multiple difficulty levels
- Real-time scoring system
- XP and Coins rewards
- Level-based progression

---

## 🔮 Future Roadmap

<table>
<tr>
<td>

- [ ] 📱 Mobile app (React Native)
- [ ] 🔔 Push notifications
- [ ] 🌐 Multilingual support
- [ ] ♿ Accessibility improvements

</td>
<td>

- [ ] 👥 Social features (teams, chat)
- [ ] 📴 Offline mode
- [ ] 🎮 More game types
- [ ] 📈 Advanced analytics

</td>
</tr>
</table>

---

## 📚 Documentation

<details>
<summary><b>🎮 How to Play</b></summary>

1. **Register** as a student with your institute code
2. **Complete challenges** to earn Eco Points, Coins, and XP
3. **Level up** from Eco Beginner to Eco Legend
4. **Compete** on leaderboards
5. **Play games** for extra rewards
6. **Chat with EcoBot** for environmental questions

</details>

<details>
<summary><b>👨‍🏫 For Teachers</b></summary>

1. **Create challenges** using AI or manual entry
2. **Assign to classes** or sections
3. **Monitor progress** through analytics
4. **Review submissions** for physical challenges
5. **Edit quizzes** anytime after creation
6. **Regenerate questions** with AI assistance

</details>

<details>
<summary><b>🔧 For Developers</b></summary>

- **API Documentation**: Check `/Backend/routes/` for endpoint details
- **Component Library**: Reusable components in `/Frontend/src/components/`
- **State Management**: React Context in `/Frontend/src/context/`
- **Utilities**: Helper functions in `/Frontend/src/utils/`
- **Styling**: Tailwind CSS with custom configurations

</details>

---

## 🐛 Known Issues

- ⚠️ Leaderboard API occasionally returns 500 error
- 🔧 Some analytics features still in development
- 📴 Limited offline support
- 📱 Mobile game performance varies by device

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is **proprietary and confidential**.

---

## 💬 Support

Need help? Reach out to us:

- � Crealte an issue in the repository
- � Crheck the documentation
- �  Contact Team Invictus

---

<div align="center">

### 🌱 Built with ❤️ by Team Invictus

**Making sustainability education engaging, one challenge at a time.**

---

**PixelPlanet** - Where Environmental Education Meets Innovation

⭐ **Star this repo** if you find it helpful! | 🐛 **Report bugs** to help us improve

</div>
