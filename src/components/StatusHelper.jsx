import React from 'react';

export default function StatusHelper({ type, showIcon = true }) {
  const statusInfo = {
    pending: {
      icon: "⏳",
      title: "Waiting for Approval",
      description: "This item is waiting for admin approval. You'll be notified when it's approved.",
      color: "yellow"
    },
    approved: {
      icon: "✅", 
      title: "Approved & Active",
      description: "This has been approved and is now active in the system.",
      color: "green"
    },
    rejected: {
      icon: "❌",
      title: "Not Approved",
      description: "This was not approved. Please contact admin for more information.",
      color: "red"
    },
    scoring: {
      icon: "📝",
      title: "About Scoring",
      description: "CA = Continuous Assessment (40 marks max), Exam = Final Exam (60 marks max), Total = CA + Exam",
      color: "blue"
    },
    student_workflow: {
      icon: "👨‍🎓",
      title: "Student Registration Process",
      description: "1. Form Master adds student → 2. Admin approves → 3. Student gets access → 4. Teachers can enter scores",
      color: "purple"
    }
  };

  const info = statusInfo[type];
  if (!info) return null;

  const colorClasses = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "bg-green-50 border-green-200 text-green-800", 
    red: "bg-red-50 border-red-200 text-red-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800"
  };

  return (
    <div className={`${colorClasses[info.color]} border rounded-lg p-3 text-sm mb-4`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <span className="text-lg flex-shrink-0">{info.icon}</span>
        )}
        <div>
          <div className="font-medium">{info.title}</div>
          <div className="mt-1">{info.description}</div>
        </div>
      </div>
    </div>
  );
}
