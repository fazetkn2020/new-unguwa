// src/pages/Dashboard/roles/SystemSettings.jsx - NEW FILE
import React, { useState } from "react";

export default function SystemSettings() {
  const [allowedDomains, setAllowedDomains] = useState(["@school.edu", "@example.com"]);
  const [newDomain, setNewDomain] = useState("");

  const addDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain) => {
    setAllowedDomains(allowedDomains.filter(d => d !== domain));
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">System Settings</h3>
      
      <div className="space-y-6">
        {/* Email Domain Restrictions */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Allowed Email Domains</h4>
          <p className="text-sm text-gray-600 mb-3">
            Only emails from these domains can register on the platform
          </p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add domain (e.g., @school.edu)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={addDomain}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {allowedDomains.map(domain => (
              <div key={domain} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                <span>{domain}</span>
                <button
                  onClick={() => removeDomain(domain)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Total Users:</strong> {JSON.parse(localStorage.getItem("users") || "[]").length}</p>
              <p><strong>Version:</strong> 1.0.0</p>
            </div>
            <div>
              <p><strong>Last Backup:</strong> Never</p>
              <p><strong>Storage Used:</strong> Calculating...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}