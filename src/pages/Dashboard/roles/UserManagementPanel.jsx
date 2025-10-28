import React, { useState } from "react";

function UserManagementPanel({ users, onUsersUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("staff");

  // FIXED: Proper user filtering with better identification
  const pendingStaff = users.filter(user => 
    user.role === "pending" && 
    (!user.userType || user.userType !== "student") // Not students
  );
  
  const pendingStudents = users.filter(user => 
    user.role === "pending" && user.userType === "student"
  );

  const activeUsers = users.filter(user => user.role !== "pending");

  // FIXED: Use user.id instead of user.email
  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      onUsersUpdate();
      alert("User deleted successfully");
    }
  };

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
  };

  // FIXED: Simple approve function for staff
  const approveUser = (userId) => {
    const userToApprove = users.find(user => user.id === userId);
    if (!userToApprove) {
      alert("User not found");
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === userId
        ? { 
            ...user, 
            role: "Subject Teacher", // Default role
            status: "active",
            approvedAt: new Date().toISOString()
          }
        : user
    );
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
    alert(`${userToApprove.name} has been approved!`);
  };

  // FIXED: Approve students with exam bank creation
  const approveStudent = (userId) => {
    const studentToApprove = users.find(user => user.id === userId);
    if (!studentToApprove) {
      alert("Student not found");
      return;
    }

    // Create exam bank entries
    const examData = JSON.parse(localStorage.getItem('examData')) || {};
    const classSubjects = getClassSubjects(studentToApprove.formClass);
    
    classSubjects.forEach(subject => {
      if (!examData[studentToApprove.id]) {
        examData[studentToApprove.id] = {};
      }
      examData[studentToApprove.id][subject] = { ca: "", exam: "", total: "" };
    });
    localStorage.setItem('examData', JSON.stringify(examData));

    const updatedUsers = users.map(user =>
      user.id === userId
        ? { 
            ...user, 
            role: "Student",
            status: "active",
            assignedClasses: [studentToApprove.formClass],
            approvedAt: new Date().toISOString()
          }
        : user
    );
    
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUsersUpdate();
    alert(`${studentToApprove.name} approved as Student! Exam Bank entries created.`);
  };

  const getClassSubjects = (className) => {
    const defaultSubjects = {
      'SS1': ['Mathematics', 'English', 'Science', 'Social Studies'],
      'SS2': ['Mathematics', 'English', 'Science', 'Social Studies'],
      'SS3': ['Mathematics', 'English', 'Science', 'Social Studies']
    };
    return defaultSubjects[className] || ['Mathematics', 'English', 'Science'];
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-400">User Management</h3>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 font-medium ${
            activeTab === "staff"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Staff Approval ({pendingStaff.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 font-medium ${
            activeTab === "students"
              ? "border-b-2 border-green-500 text-green-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Student Approval ({pendingStudents.length})
        </button>
      </div>

      {/* Staff Approval Section */}
      {activeTab === "staff" && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400">
            Pending Staff Registrations ({pendingStaff.length})
          </h4>
          {pendingStaff.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Staff Member</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Registration Date</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStaff.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold">{user.name}</div>
                            <div className="text-xs text-gray-400">Pending Approval</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-4 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => approveUser(user.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 font-medium"
                        >
                          ❌ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👨‍💼</div>
              <p>No pending staff registrations</p>
              <p className="text-sm text-gray-400 mt-1">New staff registrations will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Student Approval Section */}
      {activeTab === "students" && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-green-400">
            Pending Student Approvals ({pendingStudents.length})
          </h4>
          {pendingStudents.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Class</th>
                    <th className="px-4 py-3 text-left">Student ID</th>
                    <th className="px-4 py-3 text-left">Added</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStudents.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold">{user.name}</div>
                            <div className="text-xs text-gray-400">Waiting for approval</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {user.formClass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {user.studentId}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </td>
                      <td className="px-4 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => approveStudent(user.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 font-medium"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 font-medium"
                        >
                          ❌ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👨‍🎓</div>
              <p>No pending student approvals</p>
              <p className="text-sm text-gray-400 mt-1">Form Masters will add students here</p>
            </div>
          )}
        </div>
      )}

      {/* Active Users */}
      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold mb-4 text-blue-400">
          Active Users ({activeUsers.length})
        </h4>
        {activeUsers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Class/Details</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {activeUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                        user.role === "Student" ? "bg-green-600" : "bg-blue-600"
                      }`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "Admin" ? "bg-purple-700 text-purple-100" :
                      user.role === "Student" ? "bg-green-700 text-green-100" :
                      "bg-blue-700 text-blue-100"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">
                    {user.role === "Student" 
                      ? user.assignedClasses?.join(", ") || user.formClass 
                      : user.assignedClasses?.join(", ") || "-"
                    }
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-700 text-green-100"
                        : "bg-red-700 text-red-100"
                    }`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2 py-1 rounded ${
                        user.status === "active"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p>No active users found</p>
            <p className="text-sm text-gray-400 mt-1">Approve some users to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPanel;
