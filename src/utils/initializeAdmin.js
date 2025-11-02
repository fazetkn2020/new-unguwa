// Utility to ensure admin user exists
export const initializeAdminUser = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminExists = users.some(user => user.role === "admin");

  if (!adminExists) {
    const adminUser = {
      id: "admin-001",
      role: "admin",
      fullName: "System Administrator",
      name: "System Administrator",
      email: "admin@school.edu",
      password: "admin123",
      createdAt: new Date().toISOString(),
      status: "active"
    };

    users.push(adminUser);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("✅ Default admin user created: admin@school.edu / admin123");
    return true;
  }
  
  console.log("✅ Admin user already exists");
  return false;
};
