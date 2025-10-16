export const hasTeachingAssignments = (user) => {
    if (!user) return false;
    
    const teachingRoles = ["Subject Teacher", "Form Master", "Principal", "Senior Master", "VP Academic"];
    const hasRole = teachingRoles.includes(user.role);
    const hasSubjects = user.subjects && user.subjects.length > 0;
    
    return hasRole && hasSubjects;
  };
  
  export const canEditScores = (user, subject) => {
    if (!user) return false;
    
    if (user.role === "Admin" || user.role === "Form Master") return true;
    
    if (user.role === "Subject Teacher" && user.subjects?.includes(subject)) return true;
    
    return false;
  };