import React, { useState, useEffect } from "react";

function UserManagementPanel({ users: propUsers, onUsersUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("staff");
  const [users, setUsers] = useState([]);
  const [collapsedSections, setCollapsedSections] = useState({
    pendingStaff: false,
    pendingStudents: false,
    activeUsers: false
  });
  const [loadingStates, setLoadingStates] = useState({});

  // Load fresh data from localStorage
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(savedUsers);
    };
    
    loadUsers();
    
    // Refresh every 3 seconds to catch new students
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter users
  const pendingStaff = users.filter(user => 
    user.role === "pending" && (!user.userType || user.userType !== "student")
  );

  const pendingStudents = users.filter(user => {
    // Multiple ways to identify pending students
    return (
      // Method 1: Standard way
      (user.role === "pending" && user.userType === "student") ||
      // Method 2: If they have student data but no userType
      (user.role === "pending" && (user.studentId || user.class || user.formClass)) ||
      // Method 3: If they have pending status
      (user.status === "pending" && (user.studentId || user.class))
    );
  });

  const activeUsers = users.filter(user => user.role !== "pending");

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setLoading = (id, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: isLoading
    }));
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(userId, true);

    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      if (onUsersUpdate) onUsersUpdate(updatedUsers);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      alert("✅ User deleted successfully");
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(userId, false);
    }
  };

  const approveUser = async (userId) => {
    setLoading(userId, true);
    const userToApprove = users.find(user => user.id === userId);
    
    if (!userToApprove) {
      alert("User not found");
      setLoading(userId, false);
      return;
    }

    try {
      const updatedUsers = users.map(user =>
        user.id === userId
          ? {
              ...user,
              role: "Subject Teacher",
              status: "active",
              approvedAt: new Date().toISOString()
            }
          : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      if (onUsersUpdate) onUsersUpdate(updatedUsers);
      
      alert(`✅ ${userToApprove.name} has been approved!`);
    } catch (error) {
      alert("Error approving user");
    } finally {
      setLoading(userId, false);
    }
  };

  const approveStudent = async (userId) => {
    setLoading(userId, true);
    const studentToApprove = users.find(user => user.id === userId);
    
    if (!studentToApprove) {
      alert("Student not found");
      setLoading(userId, false);
      return;
    }

    try {
      // Create exam bank entries
      const examData = JSON.parse(localStorage.getItem('examData')) || {};
      const classSubjects = getClassSubjects(studentToApprove.class || studentToApprove.formClass);

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
              assignedClasses: [studentToApprove.class || studentToApprove.formClass],
              approvedAt: new Date().toISOString()
            }
          : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      if (onUsersUpdate) onUsersUpdate(updatedUsers);
      
      alert(`✅ ${studentToApprove.name} approved as Student!`);
    } catch (error) {
      alert("Error approving student");
    } finally {
      setLoading(userId, false);
    }
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
    <div className="p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">User Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-300"
            />
            <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
          </div>
          <button
            onClick={() => {
              const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
              setUsers(savedUsers);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 font-medium ${
            activeTab === "staff"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Staff Approval ({pendingStaff.length})
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 font-medium ${
            activeTab === "students"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Student Approval ({pendingStudents.length})
        </button>
      </div>

      {/* DEBUG INFO */}
      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4">
        <p className="text-sm">
          <strong>Debug:</strong> Total Users: {users.length} | 
          Pending Staff: {pendingStaff.length} | 
          Pending Students: {pendingStudents.length}
        </p>
      </div>

      {/* STAFF TAB */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          {/* Pending Staff */}
          <div className="bg-blue-50 rounded-lg border border-blue-200">
            <button
              onClick={() => toggleSection('pendingStaff')}
              className="w-full p-4 flex justify-between items-center hover:bg-blue-100 rounded-t-lg"
            >
              <div>
                <h4 className="text-lg font-semibold text-blue-800">
                  Pending Staff ({pendingStaff.length})
                </h4>
              </div>
              <span className="text-blue-600 font-bold text-xl">
                {collapsedSections.pendingStaff ? '+' : '-'}
              </span>
            </button>

            {!collapsedSections.pendingStaff && (
              <div className="p-4">
                {pendingStaff.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">Staff Member</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStaff.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                                  <div className="text-xs text-gray-500">Pending</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => approveUser(user.id)}
                                disabled={loadingStates[user.id]}
                                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                              >
                                {loadingStates[user.id] ? '⏳' : '✅'} Approve
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                disabled={loadingStates[user.id]}
                                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                              >
                                {loadingStates[user.id] ? '⏳' : '❌'} Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">👨‍💼</div>
                    <p>No pending staff registrations</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Staff */}
          <div className="bg-green-50 rounded-lg border border-green-200">
            <button
              onClick={() => toggleSection('activeUsers')}
              className="w-full p-4 flex justify-between items-center hover:bg-green-100 rounded-t-lg"
            >
              <div>
                <h4 className="text-lg font-semibold text-green-800">
                  Active Staff ({activeUsers.filter(u => u.role !== 'Student').length})
                </h4>
              </div>
              <span className="text-green-600 font-bold text-xl">
                {collapsedSections.activeUsers ? '+' : '-'}
              </span>
            </button>

            {!collapsedSections.activeUsers && (
              <div className="p-4">
                {activeUsers.filter(u => u.role !== 'Student').length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm bg-white rounded-lg border border-gray-200">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">User</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Classes</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {activeUsers.filter(u => u.role !== 'Student').map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.role === "Admin" ? "bg-purple-100 text-purple-800" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {user.assignedClasses?.join(", ") || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {user.status || "active"}
                              </span>
                            </td>
                            <td className="px-4 py-3 flex gap-1">
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">👥</div>
                    <p>No active staff found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENTS TAB - COMPLETE SECTION */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {/* Pending Students */}
          <div className="bg-green-50 rounded-lg border border-green-200">
            <button
              onClick={() => toggleSection('pendingStudents')}
              className="w-full p-4 flex justify-between items-center hover:bg-green-100 rounded-t-lg"
            >
              <div>
                <h4 className="text-lg font-semibold text-green-800">
                  Pending Students ({pendingStudents.length})
                </h4>
                <p className="text-sm text-green-600">Students waiting for approval</p>
              </div>
              <span className="text-green-600 font-bold text-xl">
                {collapsedSections.pendingStudents ? '+' : '-'}
              </span>
            </button>

            {!collapsedSections.pendingStudents && (
              <div className="p-4">
                {pendingStudents.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">Student</th>
                          <th className="px-4 py-3 text-left">Student ID</th>
                          <th className="px-4 py-3 text-left">Class</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStudents.map((student) => (
                          <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {(student.fullName || student.name)?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-semibold text-gray-800">
                                    {student.fullName || student.name}
                                  </div>
                                  <div className="text-xs text-gray-500">Pending Approval</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {student.studentId}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {student.class || student.formClass}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => approveStudent(student.id)}
                                disabled={loadingStates[student.id]}
                                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 font-medium flex items-center gap-1"
                              >
                                {loadingStates[student.id] ? '⏳' : '✅'} Approve
                              </button>
                              <button
                                onClick={() => deleteUser(student.id)}
                                disabled={loadingStates[student.id]}
                                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:bg-gray-400 font-medium"
                              >
                                {loadingStates[student.id] ? '⏳' : '❌'} Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">🎒</div>
                    <p>No pending student approvals</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Students added by Form Masters will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPanel;
