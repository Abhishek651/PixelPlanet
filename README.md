# 🌍 PixelPlanet - Gamified Environmental Education Platform

<div align="center">

![PixelPlanet Logo](Frontend/public/android-chrome-192x192.png)

**Transform environmental education into an engaging adventure**

[![Built with React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-FF0055)](https://www.framer.com/motion/)

[Live Demo](https://pixel-planet-frontend.vercel.app) • [Report Bug](https://github.com/yourusername/pixelplanet/issues) • [Request Feature](https://github.com/yourusername/pixelplanet/issues)

</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Team Invictus](#team-invictus)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**PixelPlanet** is a revolutionary gamified learning platform that transforms environmental education into an engaging, interactive experience. Built by **Team Invictus**, we combine cutting-edge technology with educational best practices to inspire the next generation of environmental stewards.

### Our Mission
To make environmental education fun, accessible, and impactful through gamification, real-time competition, and measurable results.

### Why PixelPlanet?
- 🎮 **Gamified Learning** - Turn education into an adventure
- 🏆 **Real-time Competition** - Compete with peers globally
- 📊 **Impact Tracking** - See your environmental footprint shrink
- 🎓 **Curriculum Integration** - Seamlessly fits into educational programs
- 🌱 **Real-world Impact** - Digital actions inspire physical change

---

## ✨ Features

### For Students
- 🎯 **Interactive Challenges** - Complete eco-quests and earn points
- 🎮 **Educational Games** - Waste segregation, climate quizzes, and more
- 🏅 **Achievement System** - Unlock badges and climb leaderboards
- 📈 **Progress Tracking** - Monitor your environmental impact
- 🤖 **EcoBot Assistant** - AI-powered environmental guidance
- 🌟 **Daily Quests** - New challenges every day

### For Teachers
- 📚 **Custom Challenges** - Create tailored learning experiences
- 📊 **Student Analytics** - Track class progress and engagement
- ✅ **Automated Grading** - Save time with smart assessment
- 🎓 **Curriculum Tools** - Integrate with existing lesson plans
- 👥 **Class Management** - Organize students and assignments

### For Institutions
- 🏫 **Multi-user Support** - Students, teachers, and administrators
- 📈 **Institute Analytics** - Track school-wide environmental impact
- 🎨 **Customizable** - Brand with your institution's identity
- 🔐 **Secure** - Enterprise-grade security and privacy
- 🌐 **Scalable** - From single classrooms to entire districts

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom components with Lucide icons
- **Game Engine**: Phaser 3

### Backend
- **Runtime**: Node.js with Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **API**: RESTful architecture

### DevOps
- **Hosting**: Vercel (Frontend & Backend)
- **Version Control**: Git & GitHub
- **CI/CD**: Vercel automatic deployments
- **Environment**: Environment variables for configuration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pixelplanet.git
   cd pixelplanet
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

   **Frontend** (`Frontend/.env`):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_API_URL=http://localhost:5000
   ```

   **Backend** (`Backend/.env`):
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your_project_id
   OPENAI_API_KEY=your_openai_key
   # Add other API keys as needed
   ```

5. **Run Development Servers**

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

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 📁 Project Structure

```
pixelplanet/
├── Frontend/
│   ├── public/
│   │   ├── Games/              # Phaser game files
│   │   └── assets/             # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context providers
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── data/               # Static data
│   │   └── App.jsx             # Main app component
│   ├── .env                    # Environment variables
│   └── package.json
│
├── Backend/
│   ├── routes/                 # API routes
│   ├── firebaseConfig.js       # Firebase configuration
│   ├── server.js               # Express server
│   ├── .env                    # Environment variables
│   └── package.json
│
├── DEPLOYMENT_CONFIG.md        # Deployment guide
├── ADMIN_PANEL_GUIDE.md        # Admin panel documentation
└── README.md                   # This file
```

---

## 👥 Team Invictus

**Unconquered. Undefeated. Unstoppable.**

We are a diverse team of innovators, educators, and environmental advocates united by a common goal: to transform environmental education through technology.

### Our Values
- 💪 **Invictus Spirit** - Unconquered in our mission
- 🌱 **Sustainability First** - Every decision considers environmental impact
- 🤝 **Collaboration** - Working together globally
- 💡 **Innovation** - Constantly pushing boundaries
- 🎯 **Impact Driven** - Measuring success by real-world improvements
- 🌟 **Excellence** - Committed to highest quality

### Our Vision
Starting locally, dreaming globally. We're building the future of environmental education, one student at a time.

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Import project to Vercel
   - Select `Frontend` as root directory

2. **Configure Environment Variables**
   - Add all `VITE_*` variables from `.env`
   - Set `VITE_API_URL` to your backend URL

3. **Deploy**
   - Vercel automatically deploys on push to main branch

### Backend Deployment (Vercel)

1. **Connect Repository**
   - Import project to Vercel
   - Select `Backend` as root directory

2. **Configure Environment Variables**
   - Add all backend environment variables
   - Include Firebase credentials and API keys

3. **Deploy**
   - Backend deploys automatically

For detailed deployment instructions, see [DEPLOYMENT_CONFIG.md](DEPLOYMENT_CONFIG.md)

---

## 🎮 Games

### Waste Segregator
- **Description**: Sort waste into correct bins before time runs out
- **Features**: 5 difficulty levels, responsive design, touch controls
- **Learning**: Proper waste segregation and recycling practices

### Eco Quiz Challenge
- **Description**: Test environmental knowledge in timed quizzes
- **Features**: Multiple categories, leaderboards, achievements
- **Learning**: Climate change, sustainability, conservation

---

## 🔐 Security

- 🔒 Firebase Authentication
- 🛡️ Role-based access control (Student, Teacher, HOD, Admin)
- 🔑 API keys stored securely in backend
- 🌐 CORS configured properly
- 📝 Audit logging for admin actions

---

## 📱 Responsive Design

PixelPlanet works seamlessly across all devices:
- 📱 Mobile (Portrait & Landscape)
- 📱 Tablet
- 💻 Desktop
- 🖥️ Large Screens

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Phaser for game engine
- Framer Motion for animations
- Tailwind CSS for styling
- All our beta testers and early adopters

---

## 📞 Contact

**Team Invictus**

- Website: [pixelplanet.eco](https://pixel-planet-frontend.vercel.app)
- Email: team@invictus.eco
- Twitter: [@PixelPlanetEco](https://twitter.com/pixelplaneteco)

---

<div align="center">

**Made with 💚 by Team Invictus**

*Starting small, thinking big. Building the future of environmental education.*

[⬆ Back to Top](#-pixelplanet---gamified-environmental-education-platform)

</div>
