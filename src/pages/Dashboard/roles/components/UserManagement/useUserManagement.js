import { useState, useEffect } from "react";

export const useUserManagement = (propUsers, onUsersUpdate) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  // Load fresh data from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(savedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers([]);
      }
    };

    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const setLoading = (id, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: isLoading,
    }));
  };

  const saveUsers = (updatedUsers) => {
    try {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      if (onUsersUpdate) onUsersUpdate(updatedUsers);
      return true;
    } catch (error) {
      alert("Error saving users");
      return false;
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(userId, true);

    try {
      const updatedUsers = users.filter((user) => user.id !== userId);
      const success = saveUsers(updatedUsers);

      if (success) {
        alert("✅ User deleted successfully");
      }
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(userId, false);
    }
  };

  const approveUser = async (userId, role = "Subject Teacher") => {
    setLoading(userId, true);

    try {
      const userToApprove = users.find((user) => user.id === userId);

      if (!userToApprove) {
        alert("User not found");
        return;
      }

      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: role, // Use the selected role instead of hardcoded "Subject Teacher"
              status: "active",
              approvedAt: new Date().toISOString(),
            }
          : user
      );

      const success = saveUsers(updatedUsers);

      if (success) {
        alert(`✅ ${userToApprove.name || userToApprove.fullName || 'User'} has been approved as ${role}!`);
      }
    } catch (error) {
      alert("Error approving user");
    } finally {
      setLoading(userId, false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setLoading(userId, true);

    try {
      const userToUpdate = users.find((user) => user.id === userId);

      if (!userToUpdate) {
        alert("User not found");
        return;
      }

      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: newRole,
              roleUpdatedAt: new Date().toISOString(),
            }
          : user
      );

      const success = saveUsers(updatedUsers);

      if (success) {
        alert(`✅ ${userToUpdate.name || userToUpdate.fullName || 'User'} role updated to ${newRole}!`);
      }
    } catch (error) {
      alert("Error updating user role");
    } finally {
      setLoading(userId, false);
    }
  };

  const approveStudent = async (userId) => {
    setLoading(userId, true);

    try {
      const studentToApprove = users.find((user) => user.id === userId);

      if (!studentToApprove) {
        alert("Student not found");
        return;
      }

      // Initialize exam data for the student
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
      } catch (error) {
        console.error("Error initializing exam data:", error);
      }

      const updatedUsers = users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: "Student",
              status: "active",
              assignedClasses: [
                studentToApprove.class || studentToApprove.formClass || "Default Class",
              ],
              approvedAt: new Date().toISOString(),
            }
          : user
      );

      const success = saveUsers(updatedUsers);

      if (success) {
        alert(`✅ ${studentToApprove.name || studentToApprove.fullName || 'Student'} approved as Student!`);
      }
    } catch (error) {
      alert("Error approving student");
    } finally {
      setLoading(userId, false);
    }
  };

  const getClassSubjects = (className) => {
    try {
      const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
      return savedSubjects.length > 0 ? savedSubjects : ["Mathematics", "English", "Science"];
    } catch (error) {
      return ["Mathematics", "English", "Science"];
    }
  };

  const loadUsers = () => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(savedUsers);
      alert(`🔄 Loaded ${savedUsers.length} users`);
    } catch (error) {
      alert("Error loading users");
    }
  };

  return {
    users,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    loadingStates,
    setLoading,
    loadUsers,
    deleteUser,
    approveUser,
    approveStudent,
    updateUserRole
  };
};
