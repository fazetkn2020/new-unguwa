import React, { useState, useEffect } from "react";

// Available subjects and classes
const ALL_SUBJECTS = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology", 
  "Economics", "Geography", "Government", "Civic Education",
  "Islamic Studies", "Hausa", "Animal Husbandry"
].sort();

const BASE_CLASSES = ["SS1", "SS2", "SS3", "JSS1", "JSS2", "JSS3"];

export default function TeacherAssignmentPanel({ users, onUsersUpdate }) {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [isFormMaster, setIsFormMaster] = useState(false);
  const [customClass, setCustomClass] = useState("");

  // Filter teaching staff from users
  useEffect(() => {
    const teachingStaff = users.filter(user => 
      user.role === "Subject Teacher" || 
      user.role === "Form Master" ||
      user.role === "Principal" ||
      user.role === "Senior Master" ||
      user.role === "VP Academic"
    );
    setStaff(teachingStaff);
  }, [users]);

  // When staff is selected, load their assignments
  useEffect(() => {
    if (selectedStaff) {
      const staffMember = users.find(u => u.id === selectedStaff);
      if (staffMember) {
        setAssignedSubjects(staffMember.assignedSubjects || []);
        setAssignedClasses(staffMember.assignedClasses || []);
        setIsFormMaster(staffMember.role === "Form Master");
        setCustomClass(staffMember.formClass || "");
        
        // Set available options
        setAvailableSubjects(ALL_SUBJECTS.filter(sub => 
          !staffMember.assignedSubjects?.includes(sub)
        ));
        
        // Load existing classes from localStorage
        const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
        const existingClasses = Object.keys(classLists);
        setAvailableClasses([...BASE_CLASSES, ...existingClasses].filter(cls => 
          !staffMember.assignedClasses?.includes(cls)
        ));
      }
    } else {
      setAssignedSubjects([]);
      setAssignedClasses([]);
      setAvailableSubjects(ALL_SUBJECTS);
      
      // Load all available classes
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const existingClasses = Object.keys(classLists);
      setAvailableClasses([...BASE_CLASSES, ...existingClasses]);
      
      setIsFormMaster(false);
      setCustomClass("");
    }
  }, [selectedStaff, users]);

  const addSubject = (subject) => {
    if (subject && !assignedSubjects.includes(subject)) {
      setAssignedSubjects([...assignedSubjects, subject]);
      setAvailableSubjects(availableSubjects.filter(sub => sub !== subject));
    }
  };

  const removeSubject = (subject) => {
    setAssignedSubjects(assignedSubjects.filter(sub => sub !== subject));
    setAvailableSubjects([...availableSubjects, subject].sort());
  };

  const addClass = (className) => {
    if (className && !assignedClasses.includes(className)) {
      setAssignedClasses([...assignedClasses, className]);
      setAvailableClasses(availableClasses.filter(cls => cls !== className));
    }
  };

  const removeClass = (className) => {
    setAssignedClasses(assignedClasses.filter(cls => cls !== className));
    setAvailableClasses([...availableClasses, className].sort());
  };

  const createCustomClass = () => {
    if (!customClass.trim()) {
      alert("Please enter a class name");
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    // Initialize the class if it doesn't exist
    if (!classLists[customClass]) {
      classLists[customClass] = [];
      localStorage.setItem('classLists', JSON.stringify(classLists));
    }

    // Add to assigned classes
    if (!assignedClasses.includes(customClass)) {
      setAssignedClasses([...assignedClasses, customClass]);
    }

    setCustomClass("");
    alert(`Class "${customClass}" created successfully!`);
  };

  const saveAssignments = () => {
    if (!selectedStaff) {
      alert("Please select a staff member first.");
      return;
    }

    // For Form Master, ensure they have exactly one class
    if (isFormMaster && assignedClasses.length !== 1) {
      alert("Form Master must be assigned exactly ONE class.");
      return;
    }

    const updatedUsers = users.map(user => {
      if (user.id === selectedStaff) {
        const updatedUser = {
          ...user,
          assignedSubjects: assignedSubjects,
          assignedClasses: assignedClasses,
        };

        // For Form Master, set the formClass
        if (isFormMaster && assignedClasses.length === 1) {
          updatedUser.formClass = assignedClasses[0];
        }

        return updatedUser;
      }
      return user;
    });

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Update current user if they are editing their own profile
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.id === selectedStaff) {
      const updatedCurrentUser = updatedUsers.find(u => u.id === selectedStaff);
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    }

    onUsersUpdate();
    alert("Assignments saved successfully!");
  };

  const getSelectedStaffInfo = () => {
    const staffMember = users.find(u => u.id === selectedStaff);
    return staffMember ? `${staffMember.name} (${staffMember.role})` : "Select a staff member";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Assignment Management</h2>
      
      {/* Staff Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Staff Member
        </label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a staff member...</option>
          {staff.map(staffMember => (
            <option key={staffMember.id} value={staffMember.id}>
              {staffMember.name} - {staffMember.role}
            </option>
          ))}
        </select>
      </div>

      {selectedStaff && (
        <div className="space-y-8">
          {/* Current Assignments Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Current Assignments for {getSelectedStaffInfo()}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-blue-600">Subjects: </span>
                <span className="font-medium">
                  {assignedSubjects.length > 0 ? assignedSubjects.join(", ") : "None assigned"}
                </span>
              </div>
              <div>
                <span className="text-sm text-blue-600">Classes: </span>
                <span className="font-medium">
                  {assignedClasses.length > 0 ? assignedClasses.join(", ") : "None assigned"}
                </span>
                {isFormMaster && assignedClasses.length > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    ✓ Form Master of {assignedClasses[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subject Assignment (Hide for Form Masters) */}
          {!isFormMaster && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Assign Subjects</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Subjects
                </label>
                <select
                  onChange={(e) => addSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  defaultValue=""
                >
                  <option value="">Select subject to add...</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  {availableSubjects.length} subjects available
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Subjects ({assignedSubjects.length})
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {assignedSubjects.map(subject => (
                    <div key={subject} className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span className="text-green-700">{subject}</span>
                      <button
                        onClick={() => removeSubject(subject)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {assignedSubjects.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-2">No subjects assigned</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Class Assignment */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Assign Classes {isFormMaster && "(Form Master)"}
            </h3>
            
            {/* Create Custom Class (Especially for Form Masters) */}
            {isFormMaster && (
              <div className="mb-4 bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Create Class for Form Master</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    placeholder="e.g., SS1A, SS1B, SS1G, etc."
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={createCustomClass}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                  >
                    Create Class
                  </button>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Create custom class names like SS1A, SS1B, etc.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Classes
              </label>
              <select
                onChange={(e) => addClass(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                defaultValue=""
              >
                <option value="">Select class to add...</option>
                {availableClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                {availableClasses.length} classes available
              </p>
              {isFormMaster && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Form Master must be assigned exactly ONE class
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Classes ({assignedClasses.length})
                {isFormMaster && " - Must be exactly 1"}
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {assignedClasses.map(className => (
                  <div key={className} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                    <span className="text-blue-700">
                      {className}
                      {isFormMaster && " (Form Master)"}
                    </span>
                    <button
                      onClick={() => removeClass(className)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {assignedClasses.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-2">No classes assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveAssignments}
              disabled={isFormMaster && assignedClasses.length !== 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                isFormMaster && assignedClasses.length !== 1
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Save Assignments
            </button>
          </div>
        </div>
      )}

      {!selectedStaff && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Select a staff member to manage their assignments</p>
        </div>
      )}
    </div>
  );
}