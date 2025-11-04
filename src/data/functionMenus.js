// src/data/functionMenus.js - Function-based menu system
import { FUNCTION_DEFINITIONS } from './functionDefinitions';

// Generate menu items based on user's functions
export const getUserMenuItems = (userFunctions = []) => {
  if (!userFunctions || !Array.isArray(userFunctions)) return [];
  
  const menuItems = [];
  
  // Always include exambank for everyone
  const allFunctions = [...userFunctions, 'exambank_access'];
  
  allFunctions.forEach(funcKey => {
    const func = FUNCTION_DEFINITIONS[funcKey];
    if (func && func.path) {
      menuItems.push({
        name: func.name,
        path: func.path,
        category: func.category,
        description: func.description
      });
    }
  });
  
  // Remove duplicates and sort by category
  const uniqueItems = menuItems.filter((item, index, self) =>
    index === self.findIndex(i => i.path === item.path)
  );
  
  // Group by category
  const groupedItems = {};
  uniqueItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });
  
  return groupedItems;
};

// Add exambank_access to FUNCTION_DEFINITIONS if not exists
if (!FUNCTION_DEFINITIONS.exambank_access) {
  FUNCTION_DEFINITIONS.exambank_access = {
    name: "📚 Exam Bank",
    category: "Resources", 
    description: "Access exam questions and materials",
    dependencies: [],
    path: "/dashboard/exambank"
  };
}
