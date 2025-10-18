import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { ScoringQuickAccess, useTeachingAssignments } from "../../../components/scoring";

export default function VPAcademicDashboard() {
  const { user } = useAuth();
  const teaching = useTeachingAssignments(user);
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    classesWithScores: 0,
    subjectsCovered: 0,
  });

  const [collapsed, setCollapsed] = useState({
    stats: true,
    tools: true,
    responsibilities: true,
    status: true,
  });

  const toggleCollapse = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const examData = JSON.parse(localStorage.getItem("examData")) || {};

    const teachers = users.filter((u) => u.role === "Subject Teacher");
    let classesWithScores = 0;

    Object.keys(classLists).forEach((className) => {
      const classStudents = classLists[className];
      const hasScores = classStudents.some((student) => {
        const studentId = `${className}_${student.fullName.replace(/\s+/g, "_")}`;
        return examData[studentId] && Object.keys(examData[studentId]).length > 0;
      });
      if (hasScores) classesWithScores++;
    });

    setStats({
      totalStudents: Object.values(classLists).reduce(
        (sum, students) => sum + students.length,
        0
      ),
      totalTeachers: teachers.length,
      classesWithScores,
      subjectsCovered: 0,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6 text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 rounded-2xl p-8 mb-8 shadow-xl text-white border border-violet-500/40">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🎓</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-wide">
              VP ACADEMIC DASHBOARD
            </h1>
            <p className="text-indigo-100 text-lg">
              Welcome,{" "}
              <span className="font-semibold text-yellow-300">{user.name}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-indigo-100/90">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Academic Oversight Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Performance Monitoring</span>
          </div>
        </div>
      </div>

      {/* 🆕 TEACHING ASSIGNMENTS - Conditionally shown */}
      {teaching.hasTeachingAssignments && (
        <div className="mb-8">
          <ScoringQuickAccess 
            teaching={teaching}
            onExpand={() => {/* Optional: could expand in-place */}}
          />
        </div>
      )}

      {/* Quick Stats */}
      <section className="mb-10">
        <button
          onClick={() => toggleCollapse("stats")}
          className="w-full text-left text-2xl font-semibold mb-4 text-yellow-300 tracking-wide flex items-center justify-between"
        >
          <span>Academic Metrics Overview</span>
          <span className="text-sm text-slate-300">
            {collapsed.stats ? "▶ Show" : "▼ Hide"}
          </span>
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            collapsed.stats ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Student Body", value: stats.totalStudents, color: "blue", icon: "👥" },
              { label: "Academic Staff", value: stats.totalTeachers, color: "emerald", icon: "👨‍🏫" },
              { label: "Active Classes", value: stats.classesWithScores, color: "violet", icon: "🏫" },
              { label: "Subjects Active", value: stats.subjectsCovered, color: "indigo", icon: "📚" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-gradient-to-br from-${stat.color}-900/40 to-${stat.color}-700/40 border border-${stat.color}-500/40 p-6 rounded-xl text-center shadow hover:scale-[1.03] hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-yellow-300">{stat.value}</div>
                <div className={`text-${stat.color}-200 text-sm font-medium`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Tools */}
      <section className="mb-10">
        <button
          onClick={() => toggleCollapse("tools")}
          className="w-full text-left text-2xl font-semibold mb-4 text-yellow-300 tracking-wide flex items-center justify-between"
        >
          <span>Academic Oversight Tools</span>
          <span className="text-sm text-slate-300">
            {collapsed.tools ? "▶ Show" : "▼ Hide"}
          </span>
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            collapsed.tools ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Results Overview",
                description: "Comprehensive exam and performance insights",
                icon: "📊",
                color: "violet",
                to: "/dashboard/exambank",
              },
              {
                title: "Faculty Assignments",
                description: "Track teacher subject allocations & updates",
                icon: "👨‍🏫",
                color: "indigo",
              },
              {
                title: "Subject Analytics",
                description: "Performance analysis across disciplines",
                icon: "📚",
                color: "blue",
              },
              {
                title: "Class Progress",
                description: "Detailed breakdown of class development",
                icon: "🎓",
                color: "emerald",
              },
              {
                title: "Performance Trends",
                description: "Identify academic patterns and growth rates",
                icon: "📈",
                color: "cyan",
              },
              {
                title: "Curriculum Tracking",
                description: "Monitor syllabus coverage & completion",
                icon: "📋",
                color: "fuchsia",
              },
            ].map((action) => {
              const base = `group relative rounded-xl p-6 border border-slate-600/50 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full text-left bg-slate-900/40 hover:shadow-lg hover:bg-slate-800/40`;
              const gradient = `from-${action.color}-600/20 to-${action.color}-400/10`;

              const content = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{action.icon}</span>
                    <div
                      className={`w-2 h-2 bg-${action.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-auto leading-relaxed">
                    {action.description}
                  </p>
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                  />
                </>
              );

              return action.to ? (
                <Link key={action.title} to={action.to} className={base}>
                  {content}
                </Link>
              ) : (
                <button key={action.title} className={base}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsibilities & Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="bg-slate-900/40 border border-violet-700/40 rounded-xl p-6">
          <button
            onClick={() => toggleCollapse("responsibilities")}
            className="w-full text-left text-lg font-semibold mb-4 text-yellow-300 flex items-center justify-between"
          >
            <span>Academic Mandate</span>
            <span className="text-sm text-slate-300">
              {collapsed.responsibilities ? "▶ Show" : "▼ Hide"}
            </span>
          </button>

          <div
            className={`transition-all duration-500 overflow-hidden ${
              collapsed.responsibilities
                ? "max-h-0 opacity-0"
                : "max-h-[600px] opacity-100"
            }`}
          >
            <ul className="space-y-3 text-slate-200">
              {[
                "Monitor academic performance across all classes and subjects",
                "Oversee teacher subject assignments and teaching loads",
                "Track curriculum coverage and completion",
                "Analyze class and subject performance trends",
                "Ensure academic standards and quality assurance",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Academic Status */}
        <div className="bg-slate-900/40 border border-blue-700/40 rounded-xl p-6">
          <button
            onClick={() => toggleCollapse("status")}
            className="w-full text-left text-lg font-semibold mb-4 text-yellow-300 flex items-center justify-between"
          >
            <span>Academic Health Overview</span>
            <span className="text-sm text-slate-300">
              {collapsed.status ? "▶ Show" : "▼ Hide"}
            </span>
          </button>

          <div
            className={`transition-all duration-500 overflow-hidden ${
              collapsed.status ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100"
            }`}
          >
            <div className="space-y-4">
              {[
                { label: "Assessment Coverage", value: "92%", color: "emerald" },
                { label: "Teacher Compliance", value: "96%", color: "teal" },
                { label: "Curriculum Progress", value: "88%", color: "violet" },
                { label: "Quality Standards", value: "94%", color: "indigo" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-slate-200"
                >
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold text-${item.color}-400`}
                    >
                      {item.value}
                    </span>
                    <div
                      className={`w-2 h-2 bg-${item.color}-400 rounded-full`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition">
                  Academic Report
                </button>
                <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                  Quality Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}