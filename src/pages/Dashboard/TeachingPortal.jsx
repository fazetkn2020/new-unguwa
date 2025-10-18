import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ScoringFeature, 
  TeachingNavigation,
  useTeachingAssignments 
} from '../../components/scoring';

const TeachingPortal = () => {
  const { user } = useAuth();
  const teaching = useTeachingAssignments(user);

  // Redirect or show message if no teaching assignments
  if (!teaching.hasTeachingAssignments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Teaching Assignments</h2>
          <p className="text-gray-600 mb-6">
            You don't have any teaching assignments yet. Please contact the administrator to get assigned to classes and subjects.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Teaching Portal</h1>
              <p className="text-gray-600">
                Manage your teaching assignments, enter scores, and track student progress
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </p>
              <p className="text-xs text-blue-600">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Teaching Navigation */}
        <TeachingNavigation 
          teaching={teaching} 
          compact={false}
        />

        {/* Main Scoring Feature */}
        <ScoringFeature 
          user={user}
          context="portal"
        />

        {/* Quick Stats Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Teaching Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{teaching.classes.length}</div>
              <div className="text-sm text-blue-800">Classes Assigned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{teaching.subjects.length}</div>
              <div className="text-sm text-green-800">Subjects Assigned</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {teaching.getCurrentClassStudents().length}
              </div>
              <div className="text-sm text-purple-800">Students in Current Class</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {teaching.subjects.length * teaching.classes.length}
              </div>
              <div className="text-sm text-orange-800">Total Assignments</div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div className="space-y-2">
              <p><strong>Navigate:</strong> Use the class and subject selectors above to switch between your assignments</p>
              <p><strong>Save Progress:</strong> Remember to click "Save All Scores" after entering marks</p>
            </div>
            <div className="space-y-2">
              <p><strong>Search:</strong> Use the search box to quickly find students in large classes</p>
              <p><strong>Recent Activity:</strong> Check the Recent Activity tab to see your scoring history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingPortal;
