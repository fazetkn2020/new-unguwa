import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import bgImage from "../assets/rimi.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <Header />

      {/* Image Section */}
      <div
        className="w-full h-96 md:h-[28rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Buttons Section */}
      <div className="flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 py-4">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded"
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        @2025 Faruk Bashir | fazetdev
      </footer>
    </div>
  );
};

export default LandingPage;
