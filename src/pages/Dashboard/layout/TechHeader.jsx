import React from "react";

const TechHeader = ({ config, user }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/30">
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {config.title}
              </h1>
              <p className="text-cyan-200 text-sm">
                {config.subtitle} • <span className="text-white">{user.name}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-xs text-cyan-300 font-mono">
              {user.role.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to the header component:

const HelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200"
        title="Get help"
      >
        ❓
      </button>
      
      {showHelp && (
        <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click any button to see what it does</li>
            <li>• Red text means action needed</li>
            <li>• Green means completed/approved</li>
            <li>• Yellow means waiting for approval</li>
          </ul>
          <button 
            onClick={() => setShowHelp(false)}
            className="mt-3 text-blue-600 text-sm hover:text-blue-800"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

// Add the HelpButton to your header layout
export default TechHeader;
