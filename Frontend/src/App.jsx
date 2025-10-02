// Your App.jsx (as provided previously, it's correct for this setup)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // Ensure this is correct path if nested
import RegisterInstitutePage from './pages/RegisterInstitutePage';
import InstituteAdminPage from './pages/InstituteAdminPage';
import JoinInstitutePage from './pages/JoinInstitutePage';
import TeacherDashboard from './pages/TeacherDashboard'; // Correct
import StudentDashboard from './pages/StudentDashboard'; // Correct

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
}

function MainRedirect() {
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>;
  if (currentUser && userRole) {
    switch (userRole) {
      case 'hod': return <Navigate to="/dashboard/institute-admin" replace />;
      case 'teacher': return <Navigate to="/dashboard/teacher" replace />; // Teacher redirected here
      case 'student': return <Navigate to="/dashboard/student" replace />; // Student redirected here
      default: return <Navigate to="/dashboard" replace />;
    }
  }
  return <HomePage />;
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
          path="/dashboard/institute-admin"
          element={<ProtectedRoute allowedRoles={['hod']}><InstituteAdminPage /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/teacher"
          element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;