const fs = require('fs');

let content = fs.readFileSync('src/config/dashboardConfig.js', 'utf8');

// Fix VP Admin modules
content = content.replace(/
      "VP Admin":[^{]+\{[\s\S]*?modules: \[[\s\S]*?\]
    \},/g, `    "VP Admin": {
      title: "VP Admin Dashboard",
      subtitle: "School Operations & Communications",
      icon: "⚙️",
      layout: "sections",
      defaultModule: "attendance",
      modules: [
        { id: "enrollment", label: "Student Enrollment", icon: "🎓" },
        { id: "attendance", label: "Staff Attendance", icon: "📝" },
        { id: "communications", label: "School Communications", icon: "📢" },
        { id: "calendar", label: "School Calendar", icon: "📅" },
        { id: "exambank", label: "Exam Bank", icon: "📚" }
      ]
    },`);

fs.writeFileSync('src/config/dashboardConfig.js', content);
console.log('VP Admin modules fixed');
