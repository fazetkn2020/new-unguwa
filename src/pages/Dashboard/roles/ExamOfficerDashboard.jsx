import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ExamOfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    submissionsReceived: 0,
    pendingSubmissions: 0,
    examsProcessed: 0,
  });

  const [showMetrics, setShowMetrics] = useState(true);
  const [showReports, setShowReports] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const teachers = users.filter((u) => u.role === "Subject Teacher");
    const submissionsReceived = Math.floor(Math.random() * teachers.length);
    const pendingSubmissions = teachers.length - submissionsReceived;

    setStats({
      totalTeachers: teachers.length,
      submissionsReceived,
      pendingSubmissions,
      examsProcessed: 0,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-lg text-cyan-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Exam Control Center
            </h1>
          </div>
          <p className="text-lg text-slate-300 font-medium">
            System Operator: <span className="text-cyan-400">{user.name}</span>
          </p>
          <div className="flex gap-4 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Exam Management Active</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>

      {/* SYSTEM METRICS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <div className="w-1 h-6 bg-cyan-500 rounded animate-pulse"></div>
            SYSTEM METRICS
          </h2>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            {showMetrics ? "Hide ▲" : "Show ▼"}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden transition-all duration-500 ${
            showMetrics ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {[
            { label: "Active Instructors", value: stats.totalTeachers, color: "cyan", icon: "👨‍🏫" },
            { label: "Data Streams Received", value: stats.submissionsReceived, color: "emerald", icon: "📥" },
            { label: "Pending Processing", value: stats.pendingSubmissions, color: "amber", icon: "⏳" },
            { label: "Exams Compiled", value: stats.examsProcessed, color: "blue", icon: "📊" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-cyan-400/40 hover:shadow-cyan-500/10 shadow-sm transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-${stat.color}-500/30 bg-${stat.color}-500/10`}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div
                  className={`w-2 h-2 bg-${stat.color}-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>
              <div className="text-3xl font-bold text-white mb-1 font-mono">
                {stat.value}
              </div>
              <div className={`text-sm font-medium text-${stat.color}-400`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 tracking-tight flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded animate-pulse"></div>
          CONTROL PANEL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* INTERNAL EXAM + EXAM DATABASE */}
          {[
            { title: "INTERNAL EXAM SUBMISSIONS", description: "Access teacher test data streams", icon: "📋", color: "purple", type: "button" },
            { title: "EXAM DATABASE", description: "Query examination data repository", icon: "📊", color: "slate", type: "link", to: "/dashboard/exambank" },
          ].map((action) => {
            const base = `group relative bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full text-left`;
            const glow = {
              purple: "hover:border-purple-400/40",
              slate: "hover:border-slate-400/40",
            };
            const content = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{action.icon}</span>
                  <div
                    className={`w-2 h-2 bg-${action.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 tracking-wider font-mono">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mt-auto">
                  {action.description}
                </p>
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${action.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                />
              </>
            );
            return action.type === "link" ? (
              <Link key={action.title} to={action.to} className={`${base} ${glow[action.color]}`}>
                {content}
              </Link>
            ) : (
              <button key={action.title} className={`${base} ${glow[action.color]}`}>
                {content}
              </button>
            );
          })}

          {/* REPORT GENERATOR (COLLAPSIBLE GROUP) */}
          <div className="col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded animate-pulse"></div>
                REPORT GENERATOR
              </h3>
              <button
                onClick={() => setShowReports(!showReports)}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition"
              >
                {showReports ? "Hide ▲" : "Show ▼"}
              </button>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-500 ${
                showReports ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {[
                { title: "SINGLE REPORT GENERATOR", description: "Compile individual student reports", icon: "📄", color: "emerald", type: "link", to: "/dashboard/exam-officer/report-cards" },
                { title: "BULK REPORT PROCESSOR", description: "Batch compile class reports", icon: "🖨️", color: "cyan", type: "link", to: "/dashboard/bulk-reports" },
              ].map((action) => {
                const base = `group relative bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full text-left`;
                const glow = {
                  emerald: "hover:border-emerald-400/40",
                  cyan: "hover:border-cyan-400/40",
                };
                const content = (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-2xl">{action.icon}</span>
                      <div
                        className={`w-2 h-2 bg-${action.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 tracking-wider font-mono">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mt-auto">
                      {action.description}
                    </p>
                    <div
                      className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${action.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                    />
                  </>
                );
                return (
                  <Link key={action.title} to={action.to} className={`${base} ${glow[action.color]}`}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* OTHER ACTIONS */}
          {[
            { title: "INSTRUCTOR ACTIVITY MONITOR", description: "Monitor submission status feeds", icon: "👨‍🏫", color: "blue", type: "button" },
            { title: "PERFORMANCE ANALYTICS", description: "Analyze class/subject metrics", icon: "📈", color: "orange", type: "button" },
            { title: "EXTERNAL EXAM COORDINATION", description: "WAEC/NECO protocol handler", icon: "🎓", color: "rose", type: "button" },
          ].map((action) => {
            const base = `group relative bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full text-left`;
            const glow = {
              blue: "hover:border-blue-400/40",
              orange: "hover:border-orange-400/40",
              rose: "hover:border-rose-400/40",
            };
            const content = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{action.icon}</span>
                  <div
                    className={`w-2 h-2 bg-${action.color}-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 tracking-wider font-mono">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mt-auto">
                  {action.description}
                </p>
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${action.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                />
              </>
            );
            return (
              <button key={action.title} className={`${base} ${glow[action.color]}`}>
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* OPERATIONAL PROTOCOLS */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <div className="w-1 h-6 bg-green-500 rounded animate-pulse"></div>
          OPERATIONAL PROTOCOLS
        </h3>
        <ul className="space-y-3">
          {[
            "Collect and verify test question data streams",
            "Manage internal examination processing protocols",
            "Generate and distribute student report modules",
            "Monitor instructor submission activity feeds",
            "Coordinate external examination interfaces",
          ].map((item, i) => (
            <li key={i} className="flex items-center text-slate-300">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 font-mono">SYSTEM: OPERATIONAL</div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
