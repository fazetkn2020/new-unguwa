import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const FinanceLayout = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log("🔧 FinanceLayout mounted");
    console.log("User:", user);
    console.log("Loading:", loading);
  }, [user, loading]);

  if (loading) {
    return <div className="p-8 text-center">Loading finance module...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-red-600">Please log in to access finance</h2>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 min-h-full text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">💰 Finance Module</h1>
        <p className="text-lg mb-8">Welcome to the Financial Management System</p>
        
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Hello, {user.name}!</h2>
          <p className="mb-4">Your role: <strong>{user.role}</strong></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-semibold">Fee Management</h3>
              <p className="text-sm opacity-90">Manage student payments</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <h3 className="font-semibold">Financial Reports</h3>
              <p className="text-sm opacity-90">View analytics & reports</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-green-500/20 border border-green-400 rounded-lg p-4 max-w-md mx-auto">
          <p className="font-semibold">✅ Module Status: Active</p>
          <p className="text-sm mt-2">Default password: school123</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceLayout;