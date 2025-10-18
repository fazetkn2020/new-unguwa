import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 lg:px-20 py-10 md:py-16">
        <div className="max-w-2xl text-center space-y-6">
          
          {/* Logo & App Name */}
          <div className="inline-flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
              <span className="text-3xl md:text-4xl font-extrabold">🎓</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              School
              <span className="block text-cyan-300">Manager Pro</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium tracking-wide">
              Smart, Tech-Driven Education Management
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
            <button
              onClick={() => navigate("/login")}
              className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              🚀 Launch Dashboard
            </button>

            <button
              onClick={() => navigate("/register")}
              className="group w-full sm:w-auto border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-gray-900 py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-gray-900/30"
            >
              Create Your Account
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-cyan-800/30 py-12 text-center shadow-inner">
        <div className="space-y-3">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            © 2025 Faruk Bashir | fazetdev
          </div>
          <a
            href="https://wa.me/2347082921105"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 text-lg font-medium hover:text-cyan-200 transition-colors duration-300"
          >
            📞 Chat on WhatsApp
          </a>
          <div className="text-gray-400 text-base md:text-lg font-light italic">
            “Empowering schools with cutting-edge management tools”
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
