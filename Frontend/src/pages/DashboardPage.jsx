// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from "firebase/auth";
import api from '../services/api'; // Use centralized API service

function DashboardPage() {
  // Get the currently logged-in user from Firebase Auth
  const user = auth.currentUser;
  const navigate = useNavigate();
  // State to hold the message from our protected backend route
  const [protectedMessage, setProtectedMessage] = useState('');

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After successful logout, redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // This function runs when the component mounts
  useEffect(() => {
    const fetchProtectedData = async () => {
      // Make sure there is a logged-in user
      if (user) {
        try {
          // Make a GET request to our protected backend endpoint
          // The api service automatically attaches the Authorization header
          const response = await api.get('/api/protected');

          // Set the message from the backend's response
          setProtectedMessage(response.data.message);
        } catch (error) {
          // If the request fails (e.g., token is invalid), log the error
          console.error('Could not fetch protected data:', error);
          setProtectedMessage('Could not access protected data. Your session might be invalid.');
        }
      }
    };

    fetchProtectedData();
  }, [user]); // Re-run this effect if the user object changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
        {user ? (
          <div>
            <p className="text-lg text-gray-600">Welcome, <span className="font-semibold">{user.email}</span>!</p>
            <p className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <strong>Backend says:</strong> {protectedMessage || "Loading..."}
            </p>
            <button
              onClick={handleLogout}
              className="w-full mt-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-600">You are not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;