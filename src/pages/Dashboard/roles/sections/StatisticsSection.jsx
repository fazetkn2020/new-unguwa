import React from 'react';

export default function StatisticsSection({ users }) {
  const stats = {
    admins: users.filter(u => u.role === 'Admin').length,
    leadership: users.filter(u => ['Principal', 'VP Academic', 'VP Admin'].includes(u.role)).length,
    teachers: users.filter(u => ['Form Master', 'Subject Teacher'].includes(u.role)).length,
    total: users.length
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b bg-purple-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-purple-800">Role Statistics</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg shadow p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.leadership}</div>
            <div className="text-sm text-gray-600">Leadership</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.teachers}</div>
            <div className="text-sm text-gray-600">Teachers</div>
          </div>
          <div className="bg-orange-50 rounded-lg shadow p-4 text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
        </div>
      </div>
    </div>
  );
}