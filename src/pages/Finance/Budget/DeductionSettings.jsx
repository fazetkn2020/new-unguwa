import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';

const DeductionSettings = () => {
  const { deductionSettings, dispatch } = useFinance();
  const [settings, setSettings] = useState({
    lateComing: deductionSettings.lateComing.toString(),
    absence: deductionSettings.absence.toString(),
    lateComingEnabled: true,
    absenceEnabled: true
  });
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedSettings = {
      lateComing: settings.lateComingEnabled ? parseFloat(settings.lateComing) : 0,
      absence: settings.absenceEnabled ? parseFloat(settings.absence) : 0
    };

    dispatch({ type: 'UPDATE_DEDUCTION_SETTINGS', payload: updatedSettings });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Deduction settings saved successfully');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to default deduction amounts?')) {
      setSettings({
        lateComing: '500',
        absence: '2000',
        lateComingEnabled: true,
        absenceEnabled: true
      });
    }
  };

  const calculateMonthlyImpact = (staffCount = 10) => {
    const lateImpact = settings.lateComingEnabled ? 
      parseFloat(settings.lateComing) * staffCount * 4 : 0; // Assuming 4 late days per staff monthly
    const absenceImpact = settings.absenceEnabled ? 
      parseFloat(settings.absence) * staffCount * 2 : 0; // Assuming 2 absence days per staff monthly
    
    return lateImpact + absenceImpact;
  };

  return (
    <div className="deduction-settings">
      <div className="section-header">
        <h2>⚙️ Salary Deduction Settings</h2>
        <p>Configure automatic deductions for staff late coming and absence</p>
      </div>

      <div className="settings-container">
        <div className="settings-form-section">
          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="settings-grid">
              {/* Late Coming Deduction */}
              <div className="setting-card">
                <div className="setting-header">
                  <div className="setting-icon">⏰</div>
                  <div className="setting-info">
                    <h3>Late Coming Deduction</h3>
                    <p>Amount deducted per late coming incident</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.lateComingEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        lateComingEnabled: e.target.checked
                      }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {settings.lateComingEnabled && (
                  <div className="setting-controls">
                    <div className="amount-input-group">
                      <label>Deduction Amount (₦)</label>
                      <div className="input-with-symbol">
                        <span className="currency-symbol">₦</span>
                        <input
                          type="number"
                          value={settings.lateComing}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            lateComing: e.target.value
                          }))}
                          placeholder="500"
                          min="0"
                          step="100"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="setting-examples">
                      <h4>Example Scenarios:</h4>
                      <div className="examples-list">
                        <div className="example-item">
                          <span>1 staff late 5 times monthly:</span>
                          <span className="example-amount">
                            ₦{(parseFloat(settings.lateComing) * 5).toLocaleString()}
                          </span>
                        </div>
                        <div className="example-item">
                          <span>10 staff late 3 times monthly:</span>
                          <span className="example-amount">
                            ₦{(parseFloat(settings.lateComing) * 10 * 3).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Absence Deduction */}
              <div className="setting-card">
                <div className="setting-header">
                  <div className="setting-icon">🚫</div>
                  <div className="setting-info">
                    <h3>Absence Deduction</h3>
                    <p>Amount deducted per day of unauthorized absence</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.absenceEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        absenceEnabled: e.target.checked
                      }))}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {settings.absenceEnabled && (
                  <div className="setting-controls">
                    <div className="amount-input-group">
                      <label>Deduction Amount (₦)</label>
                      <div className="input-with-symbol">
                        <span className="currency-symbol">₦</span>
                        <input
                          type="number"
                          value={settings.absence}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            absence: e.target.value
                          }))}
                          placeholder="2000"
                          min="0"
                          step="500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="setting-examples">
                      <h4>Example Scenarios:</h4>
                      <div className="examples-list">
                        <div className="example-item">
                          <span>1 staff absent 2 days monthly:</span>
                          <span className="example-amount">
                            ₦{(parseFloat(settings.absence) * 2).toLocaleString()}
                          </span>
                        </div>
                        <div className="example-item">
                          <span>5 staff absent 1 day monthly:</span>
                          <span className="example-amount">
                            ₦{(parseFloat(settings.absence) * 5).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Summary */}
            <div className="impact-summary">
              <h3>Financial Impact Summary</h3>
              <div className="impact-cards">
                <div className="impact-card">
                  <span className="impact-label">Estimated Monthly Impact</span>
                  <span className="impact-value">
                    ₦{calculateMonthlyImpact().toLocaleString()}
                  </span>
                  <span className="impact-note">
                    Based on 10 staff with average late/absence patterns
                  </span>
                </div>
                <div className="impact-card">
                  <span className="impact-label">Annual Impact</span>
                  <span className="impact-value">
                    ₦{(calculateMonthlyImpact() * 12).toLocaleString()}
                  </span>
                  <span className="impact-note">
                    Projected yearly savings from deductions
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                type="submit"
                disabled={saving}
                className="save-btn"
              >
                {saving ? '💾 Saving...' : '💾 Save Settings'}
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="reset-btn"
              >
                🔄 Reset to Defaults
              </button>
            </div>
          </form>
        </div>

        {/* Current Settings Display */}
        <div className="current-settings">
          <h3>Current Active Settings</h3>
          <div className="settings-display">
            <div className="setting-display-item">
              <div className="display-icon">⏰</div>
              <div className="display-info">
                <span className="display-label">Late Coming Deduction</span>
                <span className="display-value">
                  {deductionSettings.lateComing > 0 ? 
                    `₦${deductionSettings.lateComing.toLocaleString()} per incident` : 
                    'Disabled'
                  }
                </span>
              </div>
            </div>

            <div className="setting-display-item">
              <div className="display-icon">🚫</div>
              <div className="display-info">
                <span className="display-label">Absence Deduction</span>
                <span className="display-value">
                  {deductionSettings.absence > 0 ? 
                    `₦${deductionSettings.absence.toLocaleString()} per day` : 
                    'Disabled'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .deduction-settings {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .section-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
          }
        }

        .settings-form-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          border: 1px solid #e9ecef;
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .setting-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          background: #f8f9fa;
        }

        .setting-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .setting-icon {
          font-size: 32px;
        }

        .setting-info {
          flex: 1;
        }

        .setting-info h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
        }

        .setting-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #27ae60;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .setting-controls {
          border-top: 1px solid #dee2e6;
          padding-top: 20px;
        }

        .amount-input-group {
          margin-bottom: 20px;
        }

        .amount-input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .input-with-symbol {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol {
          position: absolute;
          left: 12px;
          color: #7f8c8d;
          font-weight: 500;
          z-index: 1;
        }

        .input-with-symbol input {
          width: 200px;
          padding: 10px 10px 10px 30px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
        }

        .setting-examples {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e9ecef;
        }

        .setting-examples h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 14px;
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .example-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #555;
        }

        .example-amount {
          font-weight: bold;
          color: #e74c3c;
        }

        .impact-summary {
          background: #e8f4fd;
          border: 1px solid #b3d9ff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .impact-summary h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }

        .impact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .impact-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .impact-label {
          display: block;
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .impact-value {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #e74c3c;
          margin-bottom: 5px;
        }

        .impact-note {
          display: block;
          font-size: 11px;
          color: #95a5a6;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .save-btn {
          flex: 2;
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .reset-btn {
          flex: 1;
          background: #f39c12;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .current-settings {
          background: white;
          border-radius: 10px;
          padding: 25px;
          border: 1px solid #e9ecef;
          height: fit-content;
        }

        .current-settings h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .settings-display {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .setting-display-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .display-icon {
          font-size: 24px;
        }

        .display-info {
          flex: 1;
        }

        .display-label {
          display: block;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 4px;
        }

        .display-value {
          display: block;
          color: #27ae60;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default DeductionSettings;
