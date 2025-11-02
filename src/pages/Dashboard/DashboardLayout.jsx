import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

// Layout Components
import TopBar from "./layout/TopBar";
import WelcomeSection from "./layout/WelcomeSection";
import ProfileSummary from "./layout/ProfileSummary";

export default function DashboardLayout() {
    const { user, logout, loading } = useAuth(); // Use "loading" instead of "isLoading"
    const navigate = useNavigate();
    const location = useLocation(); 
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    const toggleDetails = useCallback(() => setDetailsExpanded((prev) => !prev), []);

    const handleProfileNavigation = useCallback(() => {
        setDetailsExpanded(true);
        navigate("/dashboard/profile");
    }, [navigate]);

    useEffect(() => {
        // Only run if we have location state
        if (location.state?.profileUpdated) {
            setDetailsExpanded(false); 
        }
    }, [location.state]);

    const handleLogout = useCallback(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if no user
    if (!user) {
        useEffect(() => {
            navigate("/login");
        }, [navigate]);
        
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* === Top Navigation Bar === */}
            <TopBar userProfile={user} onTogglePanel={handleProfileNavigation} />

            {/* === Welcome Banner === */}
            <WelcomeSection userProfile={user} />

            {/* === Profile Summary Section === */}
            <ProfileSummary
                userProfile={user}
                detailsExpanded={detailsExpanded}
                toggleDetails={toggleDetails}
            />

            {/* === Main Content Area === */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px] p-6">
                    <Outlet />
                </div>
            </main>

            {/* === Logout Button === */}
            <div className="fixed bottom-6 right-6 z-20">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow font-medium transition-colors duration-200"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}