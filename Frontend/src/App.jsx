// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // remove AuthProvider import here
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterInstitutePage from './pages/RegisterInstitutePage';
import InstituteAdminPage from './pages/InstituteAdminPage';
import JoinInstitutePage from './pages/JoinInstitutePage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import ChallengePage from './pages/ChallengePage';
import CreatePhysicalChallengePage from './pages/CreatePhysicalChallengePage';
import CreateAutoQuizPage from './pages/CreateAutoQuizPage';
import CreateManualQuizPage from './pages/CreateManualQuizPage';
import CreateVideoChallengePage from './pages/CreateVideoChallengePage';
import SubmissionsPage from './pages/SubmissionsPage';
import MainAdminDashboard from './pages/MainAdminDashboard';
import SiteSettings from './components/SiteSettings';
import DashboardLayout from './components/DashboardLayout';

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

  if (currentUser && userRole) {
    switch (userRole) {
      case 'admin': return <Navigate to="/dashboard/admin" replace />;
      case 'hod': return <Navigate to="/dashboard/institute-admin" replace />;
      case 'teacher': return <Navigate to="/dashboard/teacher" replace />;
      case 'student': return <Navigate to="/dashboard/student" replace />;
      default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <HomePage />;

  //   Purpose: When the user lands on / (the root), this component decides where they should end up.
  // If not logged in → show HomePage.
  // If logged in → instantly push them to their role‑specific dashboard.
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/institute" element={<RegisterInstitutePage />} />
        <Route path="/join-institute/:instituteId/:role" element={<JoinInstitutePage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><p>Generic Dashboard - Role-based redirect expected</p></ProtectedRoute>}
        />
        <Route
          path="/dashboard/admin"
          element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><MainAdminDashboard /></DashboardLayout></ProtectedRoute>}
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
          path="/create-physical-challenge"
          element={<ProtectedRoute allowedRoles={['teacher']}><CreatePhysicalChallengePage /></ProtectedRoute>}
        />
        <Route
          path="/create-auto-quiz"
          element={<ProtectedRoute allowedRoles={['teacher']}><CreateAutoQuizPage /></ProtectedRoute>}
        />
        <Route
          path="/create-manual-quiz"
          element={<ProtectedRoute allowedRoles={['teacher']}><CreateManualQuizPage /></ProtectedRoute>}
        />
        <Route
          path="/create-video-challenge"
          element={<ProtectedRoute allowedRoles={['teacher']}><CreateVideoChallengePage /></ProtectedRoute>}
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher']}>
              <ChallengePage />
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
          path="/challenges/:challengeId/submissions"
          element={<ProtectedRoute allowedRoles={['teacher']}><SubmissionsPage /></ProtectedRoute>}
        />

        <Route // <--- NEW PROFILE ROUTE
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'hod']}> {/* All logged-in users can access */}
              <ProfilePage />
            </ProtectedRoute>
          }
        />

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