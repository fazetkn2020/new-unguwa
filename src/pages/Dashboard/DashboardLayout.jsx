import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Layout Components
import TopBar from "./layout/TopBar";
import WelcomeSection from "./layout/WelcomeSection";
import ProfileSummary from "./layout/ProfileSummary";

export default function DashboardLayout() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    const toggleDetails = useCallback(() => setDetailsExpanded((prev) => !prev), []);

    const handleProfileNavigation = useCallback(() => {
        setDetailsExpanded(true);
        navigate("/dashboard/profile");
    }, [navigate]);

    // FIXED: Only redirect if NOT on finance route
    useEffect(() => {
        console.log('🔍 DashboardLayout Debug:');
        console.log(' - Path:', location.pathname);
        console.log(' - User:', user);
        console.log(' - Loading:', loading);
        
        if (!loading && !user && !location.pathname.includes('/finance')) {
            console.log('🔄 Redirecting to login (not finance route)');
            navigate("/login");
        }
    }, [user, loading, navigate, location.pathname]);

    useEffect(() => {
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

    // Show redirect message if no user (but allow finance route)
    if (!user && !location.pathname.includes('/finance')) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* === Top Navigation Bar === */}
            {user && <TopBar userProfile={user} onTogglePanel={handleProfileNavigation} />}

            {/* === Welcome Banner === */}
            {user && <WelcomeSection userProfile={user} />}

            {/* === Profile Summary Section === */}
            {user && (
                <ProfileSummary
                    userProfile={user}
                    detailsExpanded={detailsExpanded}
                    toggleDetails={toggleDetails}
                />
            )}

            {/* === Main Content Area === */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px] p-6">
                    <Outlet />
                </div>
            </main>

            {/* === Logout Button === */}
            {user && (
                <div className="fixed bottom-6 right-6 z-20">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow font-medium transition-colors duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
