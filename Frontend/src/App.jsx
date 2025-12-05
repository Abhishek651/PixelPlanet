// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth'; // remove AuthProvider import here
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RegisterInstitutePage from './pages/RegisterInstitutePage';
import InstituteAdminPage from './pages/InstituteAdminPage';
import JoinInstitutePage from './pages/JoinInstitutePage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import TeacherClassroomPage from './pages/TeacherClassroomPage';
import ChallengePage from './pages/ChallengePage';
import CreateChallengePage from './pages/CreateChallengePage';
import CreatePhysicalChallengePage from './pages/CreatePhysicalChallengePage';
import CreateAutoQuizPage from './pages/CreateAutoQuizPage';
import CreateManualQuizPage from './pages/CreateManualQuizPage';
import CreateVideoChallengePage from './pages/CreateVideoChallengePage';
import SubmissionsPage from './pages/SubmissionsPage';
import MainAdminDashboard from './pages/MainAdminDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import SiteSettings from './components/SiteSettings';
import QuizPage from './pages/QuizPage';
import GamesPage from './pages/GamesPage';
import WasteSegregatorGame from './pages/WasteSegregatorGame';
import QuizGame from './pages/QuizGame';
import DashboardLayout from './components/DashboardLayout';
import MobileDashboardPage from './pages/MobileDashboardPage';
import WebDashboardPage from './pages/WebDashboardPage';
import StorePage from './pages/StorePage';
import GreenFeedPage from './pages/GreenFeedPage';
import AboutPage from './pages/AboutPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
  return children;

  // Check	What it does	Result
  // loading	Auth state still initializing (e.g., waiting for Firebase / API).	Shows a centered “Loading…” spinner.
  // !currentUser	No user logged in.	Redirects to /login.
  // allowedRoles && !allowedRoles.includes(userRole)	User’s role isn’t allowed on this route.	Redirects to home (/).
  // Otherwise	All checks pass.	Renders the protected component (children).
}

function MainRedirect() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;

  if (currentUser) {
    // If user is logged in but role is still loading/null, wait a bit
    if (userRole === null || userRole === undefined) {
      return <div className="flex justify-center items-center min-h-screen text-xl">Setting up your account...</div>;
    }
    
    switch (userRole) {
      case 'admin': return <Navigate to="/dashboard/admin" replace />;
      case 'sub-admin': return <Navigate to="/dashboard/sub-admin" replace />;
      case 'creator': return <Navigate to="/dashboard/creator" replace />;
      case 'hod': return <Navigate to="/dashboard/institute-admin" replace />;
      case 'teacher': return <Navigate to="/dashboard/teacher" replace />;
      case 'student': return <Navigate to="/dashboard/student" replace />;
      case 'global': return <Navigate to="/dashboard" replace />; // Global users go to generic dashboard
      default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <HomePage />;

  //   Purpose: When the user lands on / (the root), this component decides where they should end up.
  // If not logged in → show HomePage.
  // If logged in → instantly push them to their role‑specific dashboard.
  // Global users → generic dashboard with games, ecobot, global leaderboard
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainRedirect />} />
        <Route path="/login" element={<LoginPage />} />`r`n        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/institute" element={<RegisterInstitutePage />} />
        <Route path="/join-institute/:instituteId/:role" element={<JoinInstitutePage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRoles={['global']}><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/admin"
          element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><MainAdminDashboard /></DashboardLayout></ProtectedRoute>}
        />
        <Route
          path="/dashboard/sub-admin"
          element={<ProtectedRoute allowedRoles={['sub-admin']}><DashboardLayout><SubAdminDashboard /></DashboardLayout></ProtectedRoute>}
        />
        <Route
          path="/dashboard/creator"
          element={<ProtectedRoute allowedRoles={['creator']}><DashboardLayout><CreatorDashboard /></DashboardLayout></ProtectedRoute>}
        />
        <Route
          path="/admin/settings"
          element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><SiteSettings /></DashboardLayout></ProtectedRoute>}
        />
        <Route
          path="/dashboard/institute-admin"
          element={<ProtectedRoute allowedRoles={['hod']}><DashboardLayout><InstituteAdminPage /></DashboardLayout></ProtectedRoute>}
        />
        <Route
          path="/dashboard/teacher"
          element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/teacher/classroom"
          element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClassroomPage /></ProtectedRoute>}
        />
        <Route
          path="/create-challenge"
          element={<ProtectedRoute allowedRoles={['teacher']}><CreateChallengePage /></ProtectedRoute>}
        />
        <Route
          path="/create-physical-challenge"
          element={<ProtectedRoute allowedRoles={['teacher', 'hod', 'admin', 'creator']}><CreatePhysicalChallengePage /></ProtectedRoute>}
        />
        <Route
          path="/create-auto-quiz"
          element={<ProtectedRoute allowedRoles={['teacher', 'hod', 'admin', 'creator']}><CreateAutoQuizPage /></ProtectedRoute>}
        />
        <Route
          path="/create-manual-quiz"
          element={<ProtectedRoute allowedRoles={['teacher', 'hod', 'admin', 'creator']}><CreateManualQuizPage /></ProtectedRoute>}
        />
        <Route
          path="/create-video-challenge"
          element={<ProtectedRoute allowedRoles={['teacher', 'hod', 'admin', 'creator']}><CreateVideoChallengePage /></ProtectedRoute>}
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'global']}>
              <DashboardLayout>
                <ChallengePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}>
              <MobileDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/web"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod']}>
              <WebDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}>
              <StorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/green-feed"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}>
              <GreenFeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges/:challengeId/submissions"
          element={<ProtectedRoute allowedRoles={['teacher']}><SubmissionsPage /></ProtectedRoute>}
        />

        <Route
          path="/quiz/:challengeId"
          element={<ProtectedRoute allowedRoles={['student', 'global', 'creator', 'teacher', 'hod', 'admin']}><QuizPage /></ProtectedRoute>}
        />

        <Route
          path="/challenge/:challengeId"
          element={<ProtectedRoute allowedRoles={['student', 'global']}><ChallengeDetailPage /></ProtectedRoute>}
        />

        <Route // <--- NEW PROFILE ROUTE
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}> {/* All logged-in users can access */}
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/games">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}> 
                <DashboardLayout><GamesPage /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="waste-segregator"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}>
                <WasteSegregatorGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="quiz"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'hod', 'global']}>
                <QuizGame />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );


  // Public routes (/, /login, etc.) are accessible without any guard.
  // Protected routes are wrapped in <ProtectedRoute>.
  // If you want role‑based access, pass allowedRoles (array of strings).
  // If no allowedRoles is passed, the component simply checks for a logged‑in user.
  // The generic /dashboard route shows a placeholder paragraph.
  // In practice you might render an <Outlet> and let nested routes decide where to go.
}

export default App;
