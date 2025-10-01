import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { signOut } from 'firebase/auth'; // Logout is now primarily on dashboards
// import { auth } from '../services/firebase';
import InstituteCodeModal from '../components/InstituteCodeModal';

function HomePage() {
    const { currentUser, loading, userRole } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Effect to redirect logged-in users to their dashboard
    useEffect(() => {
        if (!loading && currentUser && userRole) {
            const path = getDashboardPath(userRole);
            if (path !== '/') { // Avoid infinite loop if getDashboardPath returns '/'
                navigate(path, { replace: true });
            }
        }
    }, [currentUser, loading, userRole, navigate]);

    // Helper function to determine dashboard path based on role
    const getDashboardPath = (role) => {
        switch (role) {
            case 'hod':
                return '/dashboard/institute-admin';
            case 'teacher':
                return '/dashboard/teacher';
            case 'student':
                return '/dashboard/student';
            default:
                return '/'; // Fallback to home if no role or unknown role
        }
    };

    // If loading, show a simple loading message
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 text-center p-4">
                <p className="text-xl text-gray-600 animate-pulse">Loading user status...</p>
            </div>
        );
    }

    // If currentUser exists and has a role, the useEffect above will redirect them.
    // So, if we reach here, it means currentUser is null (user is not logged in).
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-4">
            <h1 className="text-5xl font-bold text-green-800 mb-4">Welcome to PixelPlanet!</h1>
            <p className="text-xl text-green-600 mb-12">
                The gamified platform for environmental education. Choose your path to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {/* Go Global - Student Login */}
                <Link to="/login?role=student&mode=global" className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-blue-600">Go Global</h2>
                    <p className="mt-2 text-gray-600">Compete as an individual student on the global leaderboard.</p>
                </Link>

                {/* Join Institute - Now opens the modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col items-center justify-center text-left w-full"
                >
                    <h2 className="text-2xl font-bold text-purple-600">Join Institute</h2>
                    <p className="mt-2 text-gray-600">Are you a teacher or student with an Institute ID?</p>
                </button>

                {/* Register Institute - HOD registration */}
                <Link to="/register/institute" className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-red-600">Register Institute</h2>
                    <p className="mt-2 text-gray-600">Administrators, get your school or college started here.</p>
                </Link>

                {/* Explicit Login (for general login, if not covered by above paths) */}
                <Link to="/login" className="col-span-full p-4 mt-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                    Already have an account? Login here!
                </Link>
            </div>

            {/* Render the modal */}
            <InstituteCodeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default HomePage;