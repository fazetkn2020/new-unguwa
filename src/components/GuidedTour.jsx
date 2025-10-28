import React, { useState } from 'react';

export default function GuidedTour({ user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(true);

  const tourSteps = {
    'Subject Teacher': [
      {
        title: "Welcome to Your Teaching Dashboard!",
        message: "This is where you enter student scores for your subjects.",
        target: "scoring",
        position: "center"
      },
      {
        title: "Enter Student Scores",
        message: "Click here to access your class lists and enter Continuous Assessment (CA) and Exam scores.",
        target: "scoring",
        position: "bottom"
      },
      {
        title: "View Your Assignments",
        message: "See which classes and subjects you're assigned to teach.",
        target: "assignments", 
        position: "bottom"
      }
    ],
    'Form Master': [
      {
        title: "Welcome Form Master!",
        message: "You manage students in your class and their daily activities.",
        target: "students",
        position: "center"
      },
      {
        title: "Add Students to Your Class",
        message: "Click here to register new students. They'll need admin approval first.",
        target: "students",
        position: "bottom"
      },
      {
        title: "Create Duty Rosters",
        message: "Assign cleaning and monitoring duties to your students here.",
        target: "roster",
        position: "bottom"
      }
    ],
    'Student': [
      {
        title: "Welcome to Student Portal!",
        message: "View your academic progress and communicate with teachers.",
        target: "scores",
        position: "center"
      },
      {
        title: "Check Your Scores",
        message: "See your marks for all subjects here.",
        target: "scores",
        position: "bottom"
      },
      {
        title: "Message Your Principal",
        message: "Have a concern? Send a message directly to the principal.",
        target: "message",
        position: "bottom"
      }
    ]
  };

  const userTour = tourSteps[user.role] || [];

  if (!showTour || userTour.length === 0) return null;

  const currentGuide = userTour[currentStep];

  const handleNext = () => {
    if (currentStep < userTour.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTour(false);
      localStorage.setItem(`tour_completed_${user.role}`, 'true');
      onComplete?.();
    }
  };

  const handleSkip = () => {
    setShowTour(false);
    localStorage.setItem(`tour_completed_${user.role}`, 'true');
    onComplete?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-600 text-xl">🎓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{currentGuide.title}</h3>
          <p className="text-gray-600 mt-2">{currentGuide.message}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {userTour.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentStep < userTour.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
