// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; // Added useCallback
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [instituteId, setInstituteId] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const fetchUserData = async (user) => {
        if (user) {
            console.log("AuthContext: fetchUserData for user:", user.uid);
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("AuthContext: Fetched user data:", userData);
                setInstituteId(userData.instituteId);
            } else {
                console.log("AuthContext: User document not found for user:", user.uid);
            }
        }
    };

    // Added refreshAuth function for clarity and proper dependency handling
    const refreshAuth = useCallback(async () => {
        setLoading(true); // Indicate loading when refreshing
        if (auth.currentUser) { // Use auth.currentUser directly for refresh
            try {
                const tokenResult = await auth.currentUser.getIdTokenResult(true); // Force refresh
                console.log("AuthContext: refreshed tokenResult:", tokenResult);
                setCurrentUser(auth.currentUser);
                setUserRole(tokenResult.claims.role || null); // Use null instead of 'global' if no role
                await fetchUserData(auth.currentUser);
                console.log("AuthContext: Claims refreshed - Role:", tokenResult.claims.role);
            } catch (error) {
                console.error("AuthContext: Error refreshing auth token/claims:", error);
                setCurrentUser(null);
                setUserRole(null);
                setInstituteId(null);
            }
        } else {
            setCurrentUser(null);
            setUserRole(null);
            setInstituteId(null);
        }
        setLoading(false);
    }, []); // No dependencies for useCallback, as auth.currentUser is always current

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("AuthContext: onAuthStateChanged triggered. User:", user ? user.uid : "null");
            console.log("AuthContext: onAuthStateChanged user object:", user);
            setCurrentUser(user); // Set currentUser regardless
            if (user) {
                try {
                    // Get ID token result to access custom claims (force refresh on state change too)
                    const tokenResult = await user.getIdTokenResult(true); // Pass `true` to force refresh
                    console.log("AuthContext: tokenResult:", tokenResult);
                    setUserRole(tokenResult.claims.role || null); // Use null for no role
                    await fetchUserData(user);
                    console.log("AuthContext: User logged in. Role:", tokenResult.claims.role);
                } catch (error) {
                    console.error("AuthContext: Error getting ID token result during onAuthStateChanged:", error);
                    setUserRole(null);
                }
            } else {
                setUserRole(null); // Clear role if no user
                setInstituteId(null);
                console.log("AuthContext: User logged out.");
            }
            setLoading(false); // Auth state determined
        });

        return unsubscribe; // Cleanup subscription on unmount
    }, []); // Empty dependency array means this runs once on mount

    const value = {
        currentUser,
        userRole,
        instituteId,
        loading,
        login,
        refreshAuth // Make refreshAuth available via context
    };

    return (
        <AuthContext.Provider value={value}>
            {children} {/* RENDER CHILDREN ALWAYS */}
        </AuthContext.Provider>
    );
};