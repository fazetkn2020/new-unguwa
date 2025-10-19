// src/pages/Dashboard/roles/TeacherAssignmentPanel.jsx
import React, { useState, useEffect } from "react";

<<<<<<< HEAD
/**
 * Full-featured TeacherAssignmentPanel
 * Props expected by your AdminDashboard:
 *   - users: array of user objects (saved in localStorage as "users")
 *   - onUsersUpdate: callback to refresh users in parent (e.g., loadUsers)
 *
 * This component preserves full logic (subjects, classes, form-master handling,
 * custom class creation) while using a dark admin theme to match the dashboard.
 */

// All subjects (kept as your canonical list)
=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
const ALL_SUBJECTS = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Geography",
  "Government",
  "Civic Education",
  "Islamic Studies",
  "Hausa",
  "Animal Husbandry",
].sort();

// Base classes to show plus any classes defined in localStorage.classLists
const BASE_CLASSES = ["SS1", "SS2", "SS3", "JSS1", "JSS2", "JSS3"];

export default function TeacherAssignmentPanel({ users = [], onUsersUpdate = () => {} }) {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [isFormMaster, setIsFormMaster] = useState(false);
  const [customClass, setCustomClass] = useState("");

<<<<<<< HEAD
  // Populate teaching staff from users whenever users change
=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
  useEffect(() => {
    const teachingStaff = Array.isArray(users)
      ? users.filter((user) =>
          [
            "Subject Teacher",
            "Form Master",
            "Principal",
            "Senior Master",
            "VP Academic",
            "VP Admin",
            "Exam Officer",
          ].includes(user.role)
        )
      : [];
    setStaff(teachingStaff);
  }, [users]);

<<<<<<< HEAD
  // When selected staff changes, load that staff's assignments and available options
  useEffect(() => {
    // Load classes that exist in classLists (user-created classes)
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    const existingClasses = Object.keys(classLists || {});

=======
  useEffect(() => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    const existingClasses = Object.keys(classLists || {});
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    if (selectedStaff) {
      const staffMember = users.find((u) => u.id === selectedStaff || u.email === selectedStaff);
      if (staffMember) {
        const subj = Array.isArray(staffMember.assignedSubjects) ? staffMember.assignedSubjects : [];
        const cls = Array.isArray(staffMember.assignedClasses) ? staffMember.assignedClasses : [];
<<<<<<< HEAD

=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        setAssignedSubjects(subj);
        setAssignedClasses(cls);
        setIsFormMaster(staffMember.role === "Form Master");
        setCustomClass(staffMember.formClass || "");
<<<<<<< HEAD

        // Compute available subjects & classes (exclude already assigned)
        setAvailableSubjects(ALL_SUBJECTS.filter((s) => !subj.includes(s)));
        setAvailableClasses(
          [...BASE_CLASSES, ...existingClasses].filter((c) => !cls.includes(c))
        );
      } else {
        // if staff not found, reset
=======
        setAvailableSubjects(ALL_SUBJECTS.filter((s) => !subj.includes(s)));
        setAvailableClasses([...BASE_CLASSES, ...existingClasses].filter((c) => !cls.includes(c)));
      } else {
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        setAssignedSubjects([]);
        setAssignedClasses([]);
        setAvailableSubjects(ALL_SUBJECTS);
        setAvailableClasses([...BASE_CLASSES, ...existingClasses]);
        setIsFormMaster(false);
        setCustomClass("");
      }
    } else {
      // Nothing selected — reset lists
      setAssignedSubjects([]);
      setAssignedClasses([]);
      setAvailableSubjects(ALL_SUBJECTS);
      setAvailableClasses([...BASE_CLASSES, ...existingClasses]);
      setIsFormMaster(false);
      setCustomClass("");
    }
  }, [selectedStaff, users]);

  // Subject helpers
  const addSubject = (subject) => {
    if (!subject || assignedSubjects.includes(subject)) return;
<<<<<<< HEAD
    const nextAssigned = [...assignedSubjects, subject];
    setAssignedSubjects(nextAssigned);
=======
    setAssignedSubjects([...assignedSubjects, subject]);
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    setAvailableSubjects(availableSubjects.filter((s) => s !== subject));
  };

  const removeSubject = (subject) => {
<<<<<<< HEAD
    const nextAssigned = assignedSubjects.filter((s) => s !== subject);
    setAssignedSubjects(nextAssigned);
=======
    setAssignedSubjects(assignedSubjects.filter((s) => s !== subject));
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    setAvailableSubjects([...availableSubjects, subject].sort());
  };

  // Class helpers
  const addClass = (className) => {
    if (!className || assignedClasses.includes(className)) return;
<<<<<<< HEAD
    const nextAssigned = [...assignedClasses, className];
    setAssignedClasses(nextAssigned);
=======
    setAssignedClasses([...assignedClasses, className]);
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    setAvailableClasses(availableClasses.filter((c) => c !== className));
  };

  const removeClass = (className) => {
<<<<<<< HEAD
    const nextAssigned = assignedClasses.filter((c) => c !== className);
    setAssignedClasses(nextAssigned);
=======
    setAssignedClasses(assignedClasses.filter((c) => c !== className));
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    setAvailableClasses([...availableClasses, className].sort());
  };

  // Create custom class and persist to classLists
  const createCustomClass = () => {
    const name = (customClass || "").trim();
    if (!name) {
      alert("Please enter a class name");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    if (!classLists[name]) {
      classLists[name] = [];
      localStorage.setItem("classLists", JSON.stringify(classLists));
    }
    if (!assignedClasses.includes(name)) {
      setAssignedClasses([...assignedClasses, name]);
      setAvailableClasses(availableClasses.filter((c) => c !== name));
    }
    setCustomClass("");
    alert(`Class "${name}" created successfully!`);
  };

  // Save assignments back into users array and localStorage
  const saveAssignments = () => {
    if (!selectedStaff) {
      alert("Please select a staff member first.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    if (isFormMaster && assignedClasses.length !== 1) {
      alert("Form Master must be assigned exactly ONE class.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    const updatedUsers = users.map((user) => {
      if (user.id === selectedStaff || user.email === selectedStaff) {
        const updatedUser = {
          ...user,
          assignedSubjects,
          assignedClasses,
        };
        if (isFormMaster && assignedClasses.length === 1) {
          updatedUser.formClass = assignedClasses[0];
<<<<<<< HEAD
        } else {
          // if not form master, ensure formClass is removed
          if (updatedUser.formClass && !isFormMaster) delete updatedUser.formClass;
        }
=======
        } else if (updatedUser.formClass && !isFormMaster) delete updatedUser.formClass;
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        return updatedUser;
      }
      return user;
    });
<<<<<<< HEAD

    // persist
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // update currentUser if needed (keeps session in sync)
=======
    localStorage.setItem("users", JSON.stringify(updatedUsers));
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && (currentUser.id === selectedStaff || currentUser.email === selectedStaff)) {
      const updatedCurrentUser = updatedUsers.find((u) => u.id === selectedStaff || u.email === selectedStaff);
      if (updatedCurrentUser) localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
    }
<<<<<<< HEAD

    // tell parent to refresh
=======
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
    onUsersUpdate();
    alert("Assignments saved successfully!");
  };

  const getSelectedStaffInfo = () => {
    const staffMember = users.find((u) => u.id === selectedStaff || u.email === selectedStaff);
    return staffMember ? `${staffMember.name} (${staffMember.role})` : "Select a staff member";
  };

  return (
<<<<<<< HEAD
    <div className="p-6 bg-[#0e1420] rounded-2xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-cyan-300 mb-6">Staff Assignment Management</h2>

      {/* Staff Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Staff Member</label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="w-full max-w-xl p-2 bg-[#1a2233] border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
=======
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-200 w-full overflow-x-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6 text-center sm:text-left">
        Teache  Assignment panel
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select Staff Member</label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="w-full p-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
        >
          <option value="">Choose a staff member...</option>
          {staff.map((s) => (
            <option key={s.id || s.email} value={s.id || s.email}>
              {s.name} — {s.role}
            </option>
          ))}
        </select>
      </div>

      {selectedStaff ? (
        <div className="space-y-6">
<<<<<<< HEAD
          {/* Summary Card */}
          <div className="bg-[#111827] border border-cyan-700/20 p-4 rounded-lg">
            <h3 className="font-semibold text-cyan-300 mb-2">Current Assignments for {getSelectedStaffInfo()}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
              <div>
                <div className="text-sm text-gray-300">Subjects</div>
                <div className="font-medium">
=======
          <div className="bg-gray-50 border border-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">
              Current Assignments for {getSelectedStaffInfo()}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <div className="text-sm text-gray-600">Subjects</div>
                <div className="font-medium break-words">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                  {assignedSubjects.length > 0 ? assignedSubjects.join(", ") : "None assigned"}
                </div>
              </div>
              <div>
<<<<<<< HEAD
                <div className="text-sm text-gray-300">Classes</div>
                <div className="font-medium">
                  {assignedClasses.length > 0 ? assignedClasses.join(", ") : "None assigned"}
                </div>
                {isFormMaster && assignedClasses.length > 0 && (
                  <div className="text-sm text-green-400 mt-1">✓ Form Master of {assignedClasses[0]}</div>
=======
                <div className="text-sm text-gray-600">Classes</div>
                <div className="font-medium break-words">
                  {assignedClasses.length > 0 ? assignedClasses.join(", ") : "None assigned"}
                </div>
                {isFormMaster && assignedClasses.length > 0 && (
                  <div className="text-xs text-green-600 mt-1">✓ Form Master of {assignedClasses[0]}</div>
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                )}
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Subjects Assignment (hidden for Form Masters) */}
          {!isFormMaster && (
            <div className="border border-gray-700 rounded-lg p-4 bg-[#0f1724]">
              <h4 className="font-semibold text-gray-200 mb-3">Assign Subjects</h4>

              <div className="mb-3">
                <label className="text-sm text-gray-300 block mb-2">Available Subjects</label>
=======
          {!isFormMaster && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Assign Subjects</h4>
              <div className="mb-3">
                <label className="text-sm text-gray-600 block mb-2">Available Subjects</label>
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                <select
                  onChange={(e) => {
                    addSubject(e.target.value);
                    e.target.value = "";
                  }}
                  defaultValue=""
<<<<<<< HEAD
                  className="w-full p-2 bg-[#1a2233] border border-gray-700 text-gray-200 rounded mb-2"
=======
                  className="w-full p-2 bg-gray-50 border border-gray-300 text-gray-800 rounded mb-2"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                >
                  <option value="">Select subject to add...</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400">{availableSubjects.length} subjects available</p>
              </div>

              <div>
<<<<<<< HEAD
                <label className="text-sm text-gray-300 block mb-2">Assigned Subjects ({assignedSubjects.length})</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {assignedSubjects.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-2">No subjects assigned</p>
                  ) : (
                    assignedSubjects.map((sub) => (
                      <div key={sub} className="flex items-center justify-between bg-[#12202f] p-2 rounded">
                        <span className="text-gray-100">{sub}</span>
                        <button
                          onClick={() => removeSubject(sub)}
                          className="text-red-400 hover:text-red-600 text-sm"
=======
                <label className="text-sm text-gray-600 block mb-2">Assigned Subjects ({assignedSubjects.length})</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {assignedSubjects.length === 0 ? (
                    <p className="text-gray-400 italic text-center py-2">No subjects assigned</p>
                  ) : (
                    assignedSubjects.map((sub) => (
                      <div key={sub} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="text-gray-700 text-sm sm:text-base">{sub}</span>
                        <button
                          onClick={() => removeSubject(sub)}
                          className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {/* Class Assignment */}
          <div className="border border-gray-700 rounded-lg p-4 bg-[#0f1724]">
            <h4 className="font-semibold text-gray-200 mb-3">Assign Classes {isFormMaster && "(Form Master)"}</h4>

            {isFormMaster && (
              <div className="mb-3 bg-yellow-900/10 border border-yellow-700/20 p-3 rounded">
                <h5 className="font-medium text-yellow-300 mb-2">Create Class (for Form Master)</h5>
                <div className="flex gap-2">
=======
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Assign Classes {isFormMaster && "(Form Master)"}
            </h4>

            {isFormMaster && (
              <div className="mb-3 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <h5 className="font-medium text-yellow-700 mb-2 text-sm sm:text-base">Create Class</h5>
                <div className="flex flex-col sm:flex-row gap-2">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                  <input
                    type="text"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    placeholder="e.g., SS1A, SS2B"
<<<<<<< HEAD
                    className="flex-1 p-2 bg-[#1a2233] border border-gray-700 text-gray-200 rounded"
=======
                    className="flex-1 p-2 bg-gray-50 border border-gray-300 text-gray-800 rounded"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                  />
                  <button
                    onClick={createCustomClass}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Create
                  </button>
                </div>
<<<<<<< HEAD
                <p className="text-xs text-yellow-200 mt-1">Create custom class names like SS1A, SS1B etc.</p>
=======
                <p className="text-xs text-yellow-600 mt-1">Example: SS1A, SS2B</p>
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              </div>
            )}

            <div className="mb-3">
<<<<<<< HEAD
              <label className="text-sm text-gray-300 block mb-2">Available Classes</label>
=======
              <label className="text-sm text-gray-600 block mb-2">Available Classes</label>
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              <select
                onChange={(e) => {
                  addClass(e.target.value);
                  e.target.value = "";
                }}
                defaultValue=""
<<<<<<< HEAD
                className="w-full p-2 bg-[#1a2233] border border-gray-700 text-gray-200 rounded mb-2"
=======
                className="w-full p-2 bg-gray-50 border border-gray-300 text-gray-800 rounded mb-2"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              >
                <option value="">Select class to add...</option>
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
<<<<<<< HEAD
              <p className="text-xs text-gray-400">{availableClasses.length} classes available</p>
              {isFormMaster && <p className="text-xs text-orange-400 mt-1">⚠️ Form Master must be assigned exactly ONE class</p>}
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Assigned Classes ({assignedClasses.length}) {isFormMaster && " - Must be exactly 1"}</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {assignedClasses.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-2">No classes assigned</p>
                ) : (
                  assignedClasses.map((c) => (
                    <div key={c} className="flex items-center justify-between bg-[#12202f] p-2 rounded">
                      <span className="text-gray-100">
                        {c}
                        {isFormMaster && " (Form Master)"}
                      </span>
                      <button onClick={() => removeClass(c)} className="text-red-400 hover:text-red-600 text-sm">
=======
              {isFormMaster && (
                <p className="text-xs text-orange-500 mt-1">⚠️ Form Master must be assigned exactly ONE class</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Assigned Classes ({assignedClasses.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {assignedClasses.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-2">No classes assigned</p>
                ) : (
                  assignedClasses.map((c) => (
                    <div key={c} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <span className="text-gray-700 text-sm sm:text-base">
                        {c}
                        {isFormMaster && " (Form Master)"}
                      </span>
                      <button
                        onClick={() => removeClass(c)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                      >
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Save */}
          <div className="flex justify-end">
=======
          <div className="flex justify-center sm:justify-end">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
            <button
              onClick={saveAssignments}
              disabled={isFormMaster && assignedClasses.length !== 1}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium ${
                isFormMaster && assignedClasses.length !== 1
<<<<<<< HEAD
                  ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600"
=======
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500"
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
              }`}
            >
              Save Assignments
            </button>
          </div>
        </div>
      ) : (
<<<<<<< HEAD
        <div className="py-10 bg-[#07111a] rounded-lg text-center text-gray-400">
=======
        <div className="py-10 bg-gray-50 rounded-lg text-center text-gray-500 text-sm sm:text-base">
>>>>>>> 2175b50 (Updated scoring, teaching portal, and role management features)
          Select a staff member to manage their assignments
        </div>
      )}
    </div>
  );
}
