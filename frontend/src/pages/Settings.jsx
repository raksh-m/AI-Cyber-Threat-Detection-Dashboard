import { useState } from "react";
import "./Settings.css";

function Settings() {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">

      <div className="settings-header">
        <h1>Settings</h1>
        <p>
          Configure Netrix dashboard preferences and monitoring options.
        </p>
      </div>

      <div className="settings-container">

        {/* Dashboard Settings */}
        <div className="settings-section">

          <div className="settings-title">
            <h2>Dashboard Settings</h2>
            <p>Control how the security dashboard behaves.</p>
          </div>

          <div className="setting-row">
            <div>
              <h3>Automatic Refresh</h3>
              <p>
                Automatically refresh dashboard analysis data.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) =>
                  setAutoRefresh(e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-row">
            <div>
              <h3>Security Notifications</h3>
              <p>
                Enable notifications for detected security activity.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) =>
                  setNotifications(e.target.checked)
                }
              />
              <span className="slider"></span>
            </label>
          </div>

        </div>


        {/* Analysis Settings */}
        <div className="settings-section">

          <div className="settings-title">
            <h2>Threat Analysis</h2>
            <p>Information about the current detection system.</p>
          </div>

          <div className="setting-info">
            <span>Detection Model</span>
            <strong>Random Forest</strong>
          </div>

          <div className="setting-info">
            <span>Dataset Format</span>
            <strong>CSV</strong>
          </div>

          <div className="setting-info">
            <span>Analysis Mode</span>
            <strong>Network Traffic Detection</strong>
          </div>

        </div>


        {/* System Information */}
        <div className="settings-section">

          <div className="settings-title">
            <h2>System Information</h2>
            <p>Current Netrix application configuration.</p>
          </div>

          <div className="setting-info">
            <span>Application</span>
            <strong>Netrix</strong>
          </div>

          <div className="setting-info">
            <span>Backend</span>
            <strong>Spring Boot</strong>
          </div>

          <div className="setting-info">
            <span>Frontend</span>
            <strong>React + Vite</strong>
          </div>

          <div className="setting-info">
            <span>Machine Learning</span>
            <strong>Smile Random Forest</strong>
          </div>

        </div>


        <button
          className="save-settings"
          onClick={handleSave}
        >
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;