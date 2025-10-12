import React from "react";
import Header from "../components/Header";
import bgImage from "../assets/rimi.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Image Section */}
      <div
        className="w-full h-96 md:h-[28rem] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Buttons Section */}
      <div className="flex flex-col items-center justify-center py-12 bg-white">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        ©2025 Faruk Bashir | fazetdev
      </footer>
    </div>
  );
};

export default LandingPage;
