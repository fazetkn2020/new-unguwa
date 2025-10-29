// src/pages/Dashboard/roles/DutyDisplay.jsx
import React, { useState, useEffect } from 'react';

export default function DutyDisplay() {
  const [todayDuty, setTodayDuty] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadTodayDuty();
    // Refresh every minute to check for updates
    const interval = setInterval(loadTodayDuty, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTodayDuty = () => {
    const dutyRoster = JSON.parse(localStorage.getItem('dutyRoster')) || {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    
    setTodayDuty(dutyRoster[todayName]);
  };

  if (!todayDuty || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Moving Text Announcement */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-8 font-bold text-lg">
                🚨 ATTENTION: Today's Duty Master is {todayDuty.teacherName} ({todayDuty.teacherRole}) 
                • Duty Prefect to be assigned • 
                <span className="text-yellow-300"> PLEASE WRITE REPORT AFTER DUTY - IT'S COMPULSORY</span>
                • All reports must be submitted to Senior Master •
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
