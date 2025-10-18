// src/pages/Dashboard/roles/SeniorMasterDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

/**
 * SeniorMasterDashboard
 * - Principal-styled colors (dark slate + blue)
 * - All main sections collapsed by default
 * - Smooth collapse/expand using CSS (no framer-motion dependency)
 * - Weekly performance & recent activities are true placeholders (state-driven)
 * - Ready for API/localStorage integration
 */
export default function SeniorMasterDashboard() {
  const { user } = useAuth();

  // Main stats (keeps original fields)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingDuties: 0,
  });

  // Collapsible sections (all collapsed by default)
  const [open, setOpen] = useState({
    metrics: false,
    operations: false,
    performance: false,
    activities: false,
  });

  // True placeholders: weekly performance (ready for API)
  const [weeklyPerformance, setWeeklyPerformance] = useState([
    {
      id: "lessonPlans",
      label: "Lesson Plans Submitted",
      value: 0,
      description: "Teachers submitted lesson plans this week",
    },
    {
      id: "dutyMasters",
      label: "Duty Masters on Schedule",
      value: 0,
      description: "Duty masters who fulfilled duty this week",
    },
    {
      id: "reports",
      label: "Reports Written",
      value: 0,
      description: "Weekly reports composed by staff",
    },
    {
      id: "activities",
      label: "Activities Conducted",
      value: 0,
      description: "School activities & events recorded",
    },
  ]);

  // True placeholders: recent activities (ready for API)
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, activity: "Form Masters submitted weekly reports", time: "2 hours ago", tag: "report" },
    { id: 2, activity: "JSS3 Mathematics lesson plan reviewed", time: "5 hours ago", tag: "lesson" },
    { id: 3, activity: "Staff meeting held for mid-term evaluation", time: "1 day ago", tag: "meeting" },
    { id: 4, activity: "Science Week activities concluded", time: "2 days ago", tag: "activity" },
    { id: 5, activity: "New student orientation conducted", time: "3 days ago", tag: "event" },
  ]);

  // Refs for collapse containers to animate height smoothly
  const metricsRef = useRef();
  const operationsRef = useRef();
  const performanceRef = useRef();
  const activitiesRef = useRef();

  useEffect(() => {
    loadDashboardData();

    // try load placeholders from localStorage if present
    const wp = JSON.parse(localStorage.getItem("sm_weeklyPerformance"));
    if (Array.isArray(wp) && wp.length) setWeeklyPerformance(wp);

    const ra = JSON.parse(localStorage.getItem("sm_recentActivities"));
    if (Array.isArray(ra) && ra.length) setRecentActivities(ra);
  }, []);

  // Keep original logic for stats loader
  const loadDashboardData = () => {
    try {
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      let totalStudents = 0;
      Object.values(classLists).forEach((students) => {
        totalStudents += Array.isArray(students) ? students.length : 0;
      });

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const teachers = users.filter((u) =>
        ["Subject Teacher", "Form Master"].includes(u.role)
      );

      setStats({
        totalStudents,
        totalTeachers: teachers.length,
        totalClasses: Object.keys(classLists).length,
        pendingDuties: 0,
      });
    } catch (err) {
      // ignore malformed storage - keep placeholders
      // console.error(err);
    }

    // provide realistic placeholders (so UI shows sensible defaults)
    setWeeklyPerformance((prev) =>
      prev.map((p) => {
        if (p.id === "lessonPlans") return { ...p, value: 40 };
        if (p.id === "dutyMasters") return { ...p, value: 6 };
        if (p.id === "reports") return { ...p, value: 18 };
        if (p.id === "activities") return { ...p, value: 9 };
        return p;
      })
    );
  };

  const toggle = (key, ref) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    // animate: set maxHeight dynamically
    const el = ref && ref.current;
    if (!el) return;
    if (!open[key]) {
      // opening: measure scrollHeight then set maxHeight
      const sh = el.scrollHeight;
      el.style.maxHeight = `${sh}px`;
      el.style.opacity = "1";
    } else {
      // closing
      el.style.maxHeight = `0px`;
      el.style.opacity = "0";
    }
  };

  // Helper to choose small tag color classes
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

  // If user not present
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

  // PRINCIPAL COLORS: dark slate background, navy/blue accents
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-300/60 to-slate-400/40 p-8 font-inter text-[17px] leading-relaxed text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-8 mb-8 shadow-lg text-white">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome Mr. {user.name}
            </h1>
            <p className="text-blue-200 text-lg mt-1">Senior Master — Academic Operations</p>
          </div>
        </div>
      </div>

      {/* Institutional Metrics (collapsible) */}
      <div className="mb-6 bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggle("metrics", metricsRef)}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
          aria-expanded={open.metrics}
          aria-controls="metrics-section"
        >
          <span>📊 Institutional Metrics</span>
          <span className="text-slate-600">{open.metrics ? "▲" : "▼"}</span>
        </button>

        <div
          id="metrics-section"
          ref={metricsRef}
          style={{ maxHeight: 0, overflow: "hidden", transition: "max-height 300ms ease, opacity 300ms ease", opacity: 0 }}
          className="p-6 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Student Body", value: stats.totalStudents, icon: "👥" },
              { label: "Teaching Faculty", value: stats.totalTeachers, icon: "👨‍🏫" },
              { label: "Active Classes", value: stats.totalClasses, icon: "🏫" },
              { label: "Pending Duties", value: stats.pendingDuties, icon: "⏳" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-[17px] font-medium text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operation Center (collapsible) */}
      <div className="mb-6 bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggle("operations", operationsRef)}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
          aria-expanded={open.operations}
          aria-controls="operations-section"
        >
          <span>⚙️ Operations Center</span>
          <span className="text-slate-600">{open.operations ? "▲" : "▼"}</span>
        </button>

        <div
          id="operations-section"
          ref={operationsRef}
          style={{ maxHeight: 0, overflow: "hidden", transition: "max-height 300ms ease, opacity 300ms ease", opacity: 0 }}
          className="p-6 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Duty Roster", description: "Manage staff assignments and schedules", icon: "🕐", link: "/duty-roster" },
              { title: "Academic Timetable", description: "Oversee class schedules and periods", icon: "📅", link: "/timetable" },
              { title: "Examination Records", description: "View academic performance data", icon: "📊", link: "/dashboard/exambank" },
              { title: "Student Registry", description: "Access student information and lists", icon: "👨‍🎓" },
              { title: "Faculty Directory", description: "View teaching staff and assignments", icon: "👨‍🏫" },
              { title: "Digital Library", description: "Manage educational resources", icon: "📚", link: "/elibrary" },
            ].map((action) => (
              action.link ? (
                <Link key={action.title} to={action.link} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow transition-all flex flex-col justify-between">
                  <div className="text-3xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{action.title}</h3>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </Link>
              ) : (
                <div key={action.title} className="group bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow transition-all flex flex-col justify-between">
                  <div className="text-3xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{action.title}</h3>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary (collapsible) */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggle("performance", performanceRef)}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
          aria-expanded={open.performance}
          aria-controls="performance-section"
        >
          <span>🧾 Teachers’ Weekly Performance Summary</span>
          <span className="text-slate-600">{open.performance ? "▲" : "▼"}</span>
        </button>

        <div
          id="performance-section"
          ref={performanceRef}
          style={{ maxHeight: 0, overflow: "hidden", transition: "max-height 300ms ease, opacity 300ms ease", opacity: 0 }}
          className="p-6 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {weeklyPerformance.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-slate-600 mt-1">{item.label}</div>
                <div className="text-sm text-slate-500 mt-2">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities (collapsible) */}
      <div className="bg-white rounded-xl p-0 shadow-sm border border-slate-300 overflow-hidden">
        <button
          onClick={() => toggle("activities", activitiesRef)}
          className="w-full flex justify-between items-center px-6 py-4 bg-slate-200 hover:bg-slate-300 text-lg font-semibold"
          aria-expanded={open.activities}
          aria-controls="activities-section"
        >
          <span>🕓 Recent Activities</span>
          <span className="text-slate-600">{open.activities ? "▲" : "▼"}</span>
        </button>

        <div
          id="activities-section"
          ref={activitiesRef}
          style={{ maxHeight: 0, overflow: "hidden", transition: "max-height 300ms ease, opacity 300ms ease", opacity: 0 }}
          className="p-6 bg-white"
        >
          <div className="space-y-4">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <div className={`w-3 h-3 rounded-full ${item.tag === "lesson" ? "bg-blue-600" : item.tag === "report" ? "bg-emerald-600" : item.tag === "meeting" ? "bg-purple-600" : "bg-amber-600"}`}></div>
                <div className="flex-1">
                  <div className="text-slate-800 font-medium">{item.activity}</div>
                  <div className="text-slate-500 text-sm">{item.time}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${activityTagClass(item.tag)}`}>{item.tag}</div>
              </div>
            ))}
          </div>

          {/* Responsibilities & Quick Status shown below activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Responsibilities */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-slate-800 rounded-full"></div>
                <h3 className="text-lg font-semibold text-slate-800">Operational Mandate</h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                {[
                  "Create and manage staff duty roster assignments",
                  "Maintain and optimize academic timetable structure",
                  "Monitor examination records and academic performance",
                  "Oversee digital library and educational resources",
                  "Coordinate student and faculty administrative oversight",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Status */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-gradient-to-b from-slate-500 to-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-slate-800">System Status</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Timetable Compliance", value: "98%", color: "emerald" },
                  { label: "Duty Coverage", value: "100%", color: "teal" },
                  { label: "Resource Availability", value: "95%", color: "blue" },
                  { label: "Academic Records", value: "99%", color: "indigo" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold text-${item.color}-600`}>{item.value}</span>
                      <div className={`w-2 h-2 bg-${item.color}-500 rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">Generate Report</button>
                  <button className="flex-1 bg-blue-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors">Quick Sync</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end recent activities */}

    </div>
  );
}
