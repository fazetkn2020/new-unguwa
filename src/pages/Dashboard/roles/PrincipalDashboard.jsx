// src/pages/Dashboard/roles/PrincipalDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function PrincipalDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    classesComplete: 0,
    pendingScores: 0,
  });

  // All collapsibles start closed by default
  const [openSections, setOpenSections] = useState({
    overview: false,
    tools: false,
    performance: false,
    activities: false,
  });

  const [weeklyPerformance, setWeeklyPerformance] = useState([
    {
      id: "lessonPlans",
      label: "Lesson Plans Submitted",
      value: 42,
      description: "Teachers submitted lesson plans this week",
    },
    {
      id: "dutyMasters",
      label: "Duty Masters on Schedule",
      value: 6,
      description: "Duty masters who fulfilled duty this week",
    },
    {
      id: "reports",
      label: "Reports Written",
      value: 18,
      description: "Weekly reports composed by staff",
    },
    {
      id: "activities",
      label: "Activities Conducted",
      value: 9,
      description: "School activities & events recorded",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, activity: "Form Masters submitted weekly reports", time: "2 hours ago", tag: "report" },
    { id: 2, activity: "JSS3 Mathematics lesson plan reviewed", time: "5 hours ago", tag: "lesson" },
    { id: 3, activity: "Staff meeting held for mid-term evaluation", time: "1 day ago", tag: "meeting" },
    { id: 4, activity: "Science Week activities concluded", time: "2 days ago", tag: "activity" },
    { id: 5, activity: "New student orientation conducted", time: "3 days ago", tag: "event" },
  ]);

  useEffect(() => {
    try {
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      let totalStudents = 0;
      Object.values(classLists).forEach((students) => {
        totalStudents += Array.isArray(students) ? students.length : 0;
      });

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const teachers = users.filter((u) =>
        ["Subject Teacher", "Form Master", "Principal", "VP"].includes(u.role)
      );

      setStats({
        totalStudents,
        totalTeachers: teachers.length,
        classesComplete: Object.keys(classLists).length,
        pendingScores: 0,
      });
    } catch (err) {
      // console.error("Dashboard load error:", err);
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activityTagClass = (tag) => {
    switch (tag) {
      case "lesson":
        return "bg-blue-100 text-blue-800";
      case "report":
        return "bg-emerald-100 text-emerald-800";
      case "meeting":
        return "bg-purple-100 text-purple-800";
      case "activity":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-lg text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-300/60 to-slate-400/40 p-8 font-inter text-[17px] leading-relaxed text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-8 mb-10 shadow-lg text-white">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">🎓</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome Mr. Principal {user.name || ""}
            </h1>
            <p className="text-blue-200 text-lg mt-1">School Administration Dashboard</p>
          </div>
        </div>
      </div>

      {/* Institution Overview */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggleSection("overview")}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
        >
          <span>🏫 Institution Overview</span>
          <span>{openSections.overview ? "▲" : "▼"}</span>
        </button>
        {openSections.overview && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white">
            {[
              { label: "Total Students", value: stats.totalStudents, icon: "👥" },
              { label: "Teaching Staff", value: stats.totalTeachers, icon: "👨‍🏫" },
              { label: "Active Classes", value: stats.classesComplete, icon: "🏫" },
              { label: "Pending Tasks", value: stats.pendingScores, icon: "⏳" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow transition-all flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{s.value}</div>
                <div className="text-[17px] font-medium text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Management Tools */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggleSection("tools")}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
        >
          <span>⚙️ Management Tools</span>
          <span>{openSections.tools ? "▲" : "▼"}</span>
        </button>
        {openSections.tools && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
            {[
              { title: "Academic Results", description: "View and manage exam results and analytics.", icon: "📊", link: "/dashboard/exambank" },
              { title: "Faculty Directory", description: "Manage staff records and assignments.", icon: "👨‍🏫" },
              { title: "Class Supervisors", description: "Oversee form masters and class organization.", icon: "🎯" },
              { title: "Digital Library", description: "Access e-books and learning resources.", icon: "📚" },
              { title: "Staff Analytics", description: "Track teacher performance and reports.", icon: "📈" },
              { title: "Institutional Reports", description: "Generate performance and attendance reports.", icon: "📋" },
            ].map((t) => (
              <Link
                key={t.title}
                to={t.link || "#"}
                className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 p-6 hover:bg-blue-50/40 transition-all flex flex-col justify-between"
              >
                <div className="text-4xl mb-4">{t.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
                <p className="text-[16px] text-slate-600">{t.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Performance */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggleSection("performance")}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
        >
          <span>🧾 Teachers’ Weekly Performance</span>
          <span>{openSections.performance ? "▲" : "▼"}</span>
        </button>
        {openSections.performance && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center bg-white">
            {weeklyPerformance.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-slate-600 mt-1">{item.label}</div>
                <div className="text-sm text-slate-500 mt-2">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggleSection("activities")}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
        >
          <span>🕓 Recent Activities</span>
          <span>{openSections.activities ? "▲" : "▼"}</span>
        </button>
        {openSections.activities && (
          <div className="p-6 space-y-4 bg-white">
            {recentActivities.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.tag === "lesson"
                      ? "bg-blue-600"
                      : item.tag === "report"
                      ? "bg-emerald-600"
                      : item.tag === "meeting"
                      ? "bg-purple-600"
                      : "bg-amber-600"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-slate-800 font-medium">{item.activity}</div>
                  <div className="text-slate-500 text-sm">{item.time}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${activityTagClass(item.tag)}`}>
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
