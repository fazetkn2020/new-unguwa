import React from "react";

const TechNavigation = ({ config, activeModule, onModuleChange }) => {
  if (!config.modules || config.modules.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {config.modules.map((module) => {
          // Extract module ID from path for admin, or use id for others
          const moduleId = module.id || module.path?.split('/').pop() || module.name?.toLowerCase().replace(/\s+/g, '-');
          const displayName = module.name || module.label || 'Module';
          const icon = module.icon || module.name?.split(' ')[0] || '📄';
          
          return (
            <button
              key={moduleId}
              onClick={() => onModuleChange(moduleId)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeModule === moduleId
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{displayName.replace(/^[^\s]+\s/, '')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TechNavigation;
