
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to GSS Unguwar Rimi</h1>
        <p className="mb-6">Our Vision and Mission: Excellence in education for all students.</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Login</Link>
          <Link to="/register" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Register</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
