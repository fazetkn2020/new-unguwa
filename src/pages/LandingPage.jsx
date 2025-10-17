import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      
      {/* Header */}
      <Header />

      {/* Main Content - Reduced height to 30vh */}
      <div
        className="flex-1 flex items-center justify-center px-4 py-2 md:py-3"
        style={{ minHeight: "30vh" }}
      >
        <div className="max-w-md mx-auto text-center">
          {/* App Logo/Title */}
          <div className="mb-4 md:mb-5 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-2">
              <span className="text-2xl text-white font-bold">🎓</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent leading-tight">
              School
              <span className="block text-emerald-600">Manager Pro</span>
            </h1>
            <p className="text-md text-gray-600 font-medium">
              Excellence in Education Management
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full group relative bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative">🚀 Launch Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full group relative border-2 border-emerald-500/80 text-emerald-700 hover:bg-emerald-500 hover:text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-white/60"
            >
              <span className="relative">Create Your Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer - Increased height for better visibility */}
      <footer className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-10 md:py-12 border-t border-emerald-500/20 shadow-inner">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
            © 2025 Faruk Bashir | fazetdev
          </div>
          <div className="text-emerald-300 text-lg font-medium">
            📞 07082921105
          </div>
          <div className="text-emerald-400 text-base md:text-lg font-light italic">
            “Empowering schools with modern management tools”
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
