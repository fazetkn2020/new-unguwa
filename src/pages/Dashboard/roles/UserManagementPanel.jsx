// src/pages/Dashboard/roles/UserManagementPanel.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect } from "react";

function UserManagementPanel({ users: propUsers, onUsersUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [collapsedSections, setCollapsedSections] = useState({
    pendingStaff: false,
    pendingStudents: false,
    activeTeachers: false,
    activeStudents: false,
    allUsers: false
  });
  const [loadingStates, setLoadingStates] = useState({});

  // Load fresh data from localStorage
  useEffect(() => {
    const loadUsers = () => {
      const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(savedUsers);
    };

    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter users - COMPREHENSIVE FILTERING
  const pendingStaff = users.filter(
    (user) =>
      user.role === "pending" &&
      (!user.userType || user.userType !== "student")
  );

  const pendingStudents = users.filter((user) => {
    return (
      (user.role === "pending" && user.userType === "student") ||
      (user.role === "pending" && (user.studentId || user.class || user.formClass)) ||
      (user.status === "pending" && (user.studentId || user.class))
    );
  });

  const activeTeachers = users.filter(user => 
    user.status === 'active' && 
    ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer', 'Admin'].includes(user.role)
  );

  const activeStudents = users.filter(user => 
    user.status === 'active' && user.role === 'Student'
  );

  const allActiveUsers = users.filter(user => user.status === 'active');
  const allPendingUsers = users.filter(user => user.status === 'pending' || user.role === 'pending');

  // Get admin-created classes only (no hardcoded classes)
  const getAdminCreatedClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    return Object.keys(classLists);
  };

  const getClassSubjects = (className) => {
    // Get subjects from localStorage instead of hardcoded
    const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    return savedSubjects.length > 0 ? savedSubjects : ["Mathematics", "English", "Science"];
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const setLoading = (id, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: isLoading,
    }));
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(userId, true);

    try {
      const updatedUsers = users.filter((user) => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      if (onUsersUpdate) onUsersUpdate(updatedUsers);

      await new Promise((resolve) => setTimeout(resolve, 300));
      alert("✅ User deleted successfully");
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(userId, false);
    }
  };

  const approveUser = async (userId) => {
    setLoading(userId, true);
    const userToApprove = users.find((user) => user.id === userId);

    if (!userToApprove) {
      alert("User not found");
      setLoading(userId, false);
      return;
    }

    try {
      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: userToApprove.role || "Subject Teacher",
              status: "active",
              approvedAt: new Date().toISOString(),
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
    const studentToApprove = users.find((user) => user.id === userId);

    if (!studentToApprove) {
      alert("Student not found");
      setLoading(userId, false);
      return;
    }

    try {
      const examData = JSON.parse(localStorage.getItem("examData")) || {};
      const classSubjects = getClassSubjects(
        studentToApprove.class || studentToApprove.formClass
      );

      classSubjects.forEach((subject) => {
        if (!examData[studentToApprove.id]) {
          examData[studentToApprove.id] = {};
        }
        examData[studentToApprove.id][subject] = {
          ca: "",
          exam: "",
          total: "",
        };
      });
      localStorage.setItem("examData", JSON.stringify(examData));

      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: "Student",
              status: "active",
              assignedClasses: [
                studentToApprove.class || studentToApprove.formClass,
              ],
              approvedAt: new Date().toISOString(),
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

  // User card component for better UI
  const UserCard = ({ user, type, onApprove, onDelete }) => {
    const isPending = type === 'pending';
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {user.fullName || user.name}
            </h4>
            <div className="text-sm text-gray-600 mt-1">
              {user.email && <div>📧 {user.email}</div>}
              {user.studentId && <div>🎫 ID: {user.studentId}</div>}
              {user.class && <div>🏫 Class: {user.class}</div>}
              {user.role && <div>👤 Role: {user.role}</div>}
              {user.registeredAt && (
                <div className="text-xs text-gray-500 mt-1">
                  Registered: {new Date(user.registeredAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            {isPending ? (
              <>
                <button
                  onClick={() => onApprove(user.id)}
                  disabled={loadingStates[user.id]}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 min-w-20"
                >
                  {loadingStates[user.id] ? "⏳" : "✅"} Approve
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  disabled={loadingStates[user.id]}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:bg-gray-400 min-w-20"
                >
                  {loadingStates[user.id] ? "⏳" : "❌"} Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => onDelete(user.id)}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 min-w-20"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        
        {isPending && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              ⏳ Pending Approval
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
            User Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total: {users.length} users | Active: {allActiveUsers.length} | Pending: {allPendingUsers.length}
          </p>
        </div>
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
              const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
              setUsers(savedUsers);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "pending"
              ? "border-b-2 border-yellow-500 text-yellow-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending Approval ({allPendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "active"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Users ({allActiveUsers.length})
        </button>
      </div>

      {/* ALL USERS TAB */}
      {activeTab === "all" && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{allActiveUsers.length}</div>
              <div className="text-sm text-green-800">Active Users</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{allPendingUsers.length}</div>
              <div className="text-sm text-yellow-800">Pending Approval</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{activeTeachers.length}</div>
              <div className="text-sm text-purple-800">Active Teachers</div>
            </div>
          </div>

          {/* Pending Staff */}
          <div className="bg-yellow-50 rounded-lg border border-yellow-200">
            <button
              onClick={() => toggleSection("pendingStaff")}
              className="w-full p-4 flex justify-between items-center hover:bg-yellow-100 rounded-t-lg"
            >
              <h4 className="text-lg font-semibold text-yellow-800">
                ⏳ Pending Staff ({pendingStaff.length})
              </h4>
              <span className="text-yellow-600 font-bold text-xl">
                {collapsedSections.pendingStaff ? "+" : "-"}
              </span>
            </button>
            {!collapsedSections.pendingStaff && (
              <div className="p-4">
                {pendingStaff.length > 0 ? (
                  <div className="grid gap-3">
                    {pendingStaff.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        type="pending"
                        onApprove={approveUser}
                        onDelete={deleteUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                    <div className="text-4xl mb-2">👨‍💼</div>
                    <p>No pending staff registrations</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pending Students */}
          <div className="bg-orange-50 rounded-lg border border-orange-200">
            <button
              onClick={() => toggleSection("pendingStudents")}
              className="w-full p-4 flex justify-between items-center hover:bg-orange-100 rounded-t-lg"
            >
              <h4 className="text-lg font-semibold text-orange-800">
                🎓 Pending Students ({pendingStudents.length})
              </h4>
              <span className="text-orange-600 font-bold text-xl">
                {collapsedSections.pendingStudents ? "+" : "-"}
              </span>
            </button>
            {!collapsedSections.pendingStudents && (
              <div className="p-4">
                {pendingStudents.length > 0 ? (
                  <div className="grid gap-3">
                    {pendingStudents.map((student) => (
                      <UserCard
                        key={student.id}
                        user={student}
                        type="pending"
                        onApprove={approveStudent}
                        onDelete={deleteUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                    <div className="text-4xl mb-2">🎓</div>
                    <p>No pending student registrations</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Teachers */}
          <div className="bg-green-50 rounded-lg border border-green-200">
            <button
              onClick={() => toggleSection("activeTeachers")}
              className="w-full p-4 flex justify-between items-center hover:bg-green-100 rounded-t-lg"
            >
              <h4 className="text-lg font-semibold text-green-800">
                👨‍🏫 Active Teachers ({activeTeachers.length})
              </h4>
              <span className="text-green-600 font-bold text-xl">
                {collapsedSections.activeTeachers ? "+" : "-"}
              </span>
            </button>
            {!collapsedSections.activeTeachers && (
              <div className="p-4">
                {activeTeachers.length > 0 ? (
                  <div className="grid gap-3">
                    {activeTeachers.map((teacher) => (
                      <UserCard
                        key={teacher.id}
                        user={teacher}
                        type="active"
                        onDelete={deleteUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                    <div className="text-4xl mb-2">👨‍🏫</div>
                    <p>No active teachers</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Students */}
          <div className="bg-blue-50 rounded-lg border border-blue-200">
            <button
              onClick={() => toggleSection("activeStudents")}
              className="w-full p-4 flex justify-between items-center hover:bg-blue-100 rounded-t-lg"
            >
              <h4 className="text-lg font-semibold text-blue-800">
                🎒 Active Students ({activeStudents.length})
              </h4>
              <span className="text-blue-600 font-bold text-xl">
                {collapsedSections.activeStudents ? "+" : "-"}
              </span>
            </button>
            {!collapsedSections.activeStudents && (
              <div className="p-4">
                {activeStudents.length > 0 ? (
                  <div className="grid gap-3">
                    {activeStudents.map((student) => (
                      <UserCard
                        key={student.id}
                        user={student}
                        type="active"
                        onDelete={deleteUser}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                    <div className="text-4xl mb-2">🎒</div>
                    <p>No active students</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PENDING APPROVAL TAB */}
      {activeTab === "pending" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Staff */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <h4 className="text-lg font-semibold text-yellow-800 mb-4">
                👨‍💼 Pending Staff ({pendingStaff.length})
              </h4>
              {pendingStaff.length > 0 ? (
                <div className="space-y-3">
                  {pendingStaff.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      type="pending"
                      onApprove={approveUser}
                      onDelete={deleteUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                  <div className="text-4xl mb-2">👨‍💼</div>
                  <p>No pending staff</p>
                </div>
              )}
            </div>

            {/* Pending Students */}
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
              <h4 className="text-lg font-semibold text-orange-800 mb-4">
                🎓 Pending Students ({pendingStudents.length})
              </h4>
              {pendingStudents.length > 0 ? (
                <div className="space-y-3">
                  {pendingStudents.map((student) => (
                    <UserCard
                      key={student.id}
                      user={student}
                      type="pending"
                      onApprove={approveStudent}
                      onDelete={deleteUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                  <div className="text-4xl mb-2">🎓</div>
                  <p>No pending students</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE USERS TAB */}
      {activeTab === "active" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Teachers */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">
                👨‍🏫 Active Teachers ({activeTeachers.length})
              </h4>
              {activeTeachers.length > 0 ? (
                <div className="space-y-3">
                  {activeTeachers.map((teacher) => (
                    <UserCard
                      key={teacher.id}
                      user={teacher}
                      type="active"
                      onDelete={deleteUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                  <div className="text-4xl mb-2">👨‍🏫</div>
                  <p>No active teachers</p>
                </div>
              )}
            </div>

            {/* Active Students */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">
                🎒 Active Students ({activeStudents.length})
              </h4>
              {activeStudents.length > 0 ? (
                <div className="space-y-3">
                  {activeStudents.map((student) => (
                    <UserCard
                      key={student.id}
                      user={student}
                      type="active"
                      onDelete={deleteUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                  <div className="text-4xl mb-2">🎒</div>
                  <p>No active students</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementPanel;
