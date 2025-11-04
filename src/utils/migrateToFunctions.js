// Utility to migrate existing users to function-based system
import { loadRoleTemplates } from '../data/functionDefinitions';

export const migrateUsersToFunctions = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const roleTemplates = loadRoleTemplates();
  
  let migratedCount = 0;
  
  const migratedUsers = users.map(user => {
    // If user already has functions, keep them
    if (user.functions && Array.isArray(user.functions)) {
      return user;
    }
    
    // If user has a role but no functions, apply template
    if (user.role && roleTemplates[user.role]) {
      migratedCount++;
      return {
        ...user,
        functions: roleTemplates[user.role] || []
      };
    }
    
    // User with no role or no template, give empty functions
    return {
      ...user,
      functions: []
    };
  });
  
  localStorage.setItem('users', JSON.stringify(migratedUsers));
  
  console.log(`✅ Migrated ${migratedCount} users to function-based system`);
  return migratedCount;
};

// Run migration on app startup if needed
export const initializeFunctionMigration = () => {
  const migrationDone = localStorage.getItem('functionMigrationDone');
  
  if (!migrationDone) {
    const migratedCount = migrateUsersToFunctions();
    if (migratedCount > 0) {
      localStorage.setItem('functionMigrationDone', 'true');
    }
  }
};
