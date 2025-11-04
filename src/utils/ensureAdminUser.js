// Ensure admin user exists in localStorage
export const ensureAdminUser = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const adminExists = users.some(user => user.email === 'admin@school.edu');
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin-001',
      name: 'System Administrator',
      email: 'admin@school.edu',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    users.push(adminUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✅ Admin user created: admin@school.edu / admin123');
    return true;
  }
  return false;
};

// Import and run function migration
import { initializeFunctionMigration } from './migrateToFunctions';

// Enhanced initialization that includes function migration
export const initializeSystem = () => {
  ensureAdminUser();
  initializeFunctionMigration();
};

// Update the existing initializeUsers to use the enhanced version
export const initializeUsers = () => {
  initializeSystem();
};
