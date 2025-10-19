import React, { useState, useEffect } from "react";

export default function SystemSettings() {
  const [allowedDomains, setAllowedDomains] = useState(["@school.edu", "@example.com"]);
  const [newDomain, setNewDomain] = useState("");
  const [storageUsed, setStorageUsed] = useState("Calculating...");

  useEffect(() => {
    try {
      const total = new Blob(Object.values(localStorage)).size / 1024;
      setStorageUsed(`${total.toFixed(2)} KB`);
    } catch {
      setStorageUsed("N/A");
    }
  }, []);

  const addDomain = () => {
    if (newDomain && !allowedDomains.includes(newDomain)) {
      setAllowedDomains([...allowedDomains, newDomain]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain) => {
    setAllowedDomains(allowedDomains.filter((d) => d !== domain));
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900/50 rounded-2xl border border-slate-700/40 shadow-lg text-slate-100">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-cyan-300 text-center sm:text-left">
        ⚙️ System Settings
      </h3>

      <div className="space-y-6">
        {/* Allowed Domains */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 sm:p-6 shadow-inner">
          <h4 className="font-semibold text-lg text-blue-300 mb-3">Allowed Email Domains</h4>
          <p className="text-sm text-slate-400 mb-4">
            Only emails from these domains can register on the platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Add domain (e.g. @school.edu)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              onClick={addDomain}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-200"
            >
              Add Domain
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {allowedDomains.map((domain) => (
              <div
                key={domain}
                className="flex justify-between items-center bg-slate-900/70 border border-slate-700 px-3 py-2 rounded-lg text-sm sm:text-base"
              >
                <span>{domain}</span>
                <button
                  onClick={() => removeDomain(domain)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 sm:p-6 shadow-inner">
          <h4 className="font-semibold text-lg text-blue-300 mb-4">System Information</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-200">
            <div className="space-y-2">
              <p>
                <span className="text-slate-400">Total Users:</span>{" "}
                {JSON.parse(localStorage.getItem("users") || "[]").length}
              </p>
              <p>
                <span className="text-slate-400">Version:</span> 1.0.0
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="text-slate-400">Last Backup:</span> Never
              </p>
              <p>
                <span className="text-slate-400">Storage Used:</span> {storageUsed}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
