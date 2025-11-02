import React from 'react';

const FinanceLayout = () => {
  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🎉 FINANCE MODULE LOADED!</h1>
      <p style={{ fontSize: '24px' }}>If you can see this, the finance route is working correctly.</p>
      <div style={{ 
        background: 'rgba(255,255,255,0.2)', 
        padding: '30px', 
        borderRadius: '15px',
        marginTop: '30px',
        maxWidth: '500px',
        margin: '30px auto'
      }}>
        <h2>Finance System Status: ✅ ACTIVE</h2>
        <p>Default Password: school123</p>
      </div>
    </div>
  );
};

export default FinanceLayout;
