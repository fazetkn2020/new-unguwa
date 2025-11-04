// src/utils/functionPermissions.js - Function-based permission system
import { FUNCTION_DEFINITIONS } from '../data/functionDefinitions';

// Check if user has a specific function
export const hasFunction = (user, functionKey) => {
  if (!user) return false;
  
  // 🔥 ADMIN HAS ALL FUNCTIONS AUTOMATICALLY
  if (user.role === 'Admin' || user.role === 'admin') {
    console.log('✅ Admin access granted to:', functionKey);
    return true;
  }
  
  // First check functions array (new system)
  if (user.functions && Array.isArray(user.functions)) {
    return user.functions.includes(functionKey);
  }
  
  return false;
};

// Check if user can access a specific path
export const canAccessPath = (user, path) => {
  if (!user) return false;
  
  // 🔥 ADMIN CAN ACCESS EVERYTHING
  if (user.role === 'Admin' || user.role === 'admin') {
    console.log('✅ Admin path access granted to:', path);
    return true;
  }
  
  // Find function that provides access to this path
  const functionForPath = Object.entries(FUNCTION_DEFINITIONS).find(
    ([, func]) => func.path === path
  );
  
  if (functionForPath) {
    return hasFunction(user, functionForPath[0]);
  }
  
  return true;
};

// Get user's accessible menu items based on functions
export const getUserMenuItems = (user) => {
  if (!user) return [];
  
  // 🔥 ADMIN GETS ALL FUNCTIONS IN MENU
  if (user.role === 'Admin' || user.role === 'admin') {
    const allFunctions = Object.keys(FUNCTION_DEFINITIONS);
    const menuItems = [];
    
    allFunctions.forEach(funcKey => {
      const func = FUNCTION_DEFINITIONS[funcKey];
      if (func && func.path) {
        menuItems.push({
          name: func.name,
          path: func.path,
          category: func.category
        });
      }
    });
    
    return menuItems;
  }
  
  // Normal users use their assigned functions
  if (!user.functions) return [];
  
  const menuItems = [];
  
  user.functions.forEach(funcKey => {
    const func = FUNCTION_DEFINITIONS[funcKey];
    if (func && func.path) {
      menuItems.push({
        name: func.name,
        path: func.path,
        category: func.category
      });
    }
  });
  
  // Remove duplicates and sort by category
  const uniqueItems = menuItems.filter((item, index, self) =>
    index === self.findIndex(i => i.path === item.path)
  );
  
  return uniqueItems.sort((a, b) => a.category.localeCompare(b.category));
};

// Check if user can access finance
export const canAccessFinance = (user) => {
  // 🔥 ADMIN CAN ACCESS FINANCE
  if (user?.role === 'Admin' || user?.role === 'admin') return true;
  
  return hasFunction(user, 'finance_view') || 
         hasFunction(user, 'fees_manage') || 
         hasFunction(user, 'budget_manage') || 
         hasFunction(user, 'audit_reports');
};
