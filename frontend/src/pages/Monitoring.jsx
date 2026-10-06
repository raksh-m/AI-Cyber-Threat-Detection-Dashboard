import { useState } from "react";
import "./Monitoring.css";

function Monitoring({ setAnalysis, setCurrentPage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // ------------------------------------------------------------
  // FILE SELECTION
  // ------------------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setError("");
    setMessage("");
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);
      setError("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
  };

  // ------------------------------------------------------------
  // FORMAT FILE SIZE
  // ------------------------------------------------------------

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
      units[index]
    }`;
  };

  // ------------------------------------------------------------
  // ANALYZE DATASET
  // ------------------------------------------------------------

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a CSV dataset first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:8080/api/analysis/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      // --------------------------------------------------------
      // HANDLE BACKEND RESPONSE
      // --------------------------------------------------------

      const responseText = await response.text();

      let data = null;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }

      if (!response.ok) {
        let backendMessage =
          "The dataset could not be analyzed.";

        if (data?.message) {
          backendMessage = data.message;
        } else if (responseText) {
          backendMessage = responseText;
        }

        throw new Error(backendMessage);
      }

      if (!data) {
        throw new Error(
          "The backend returned an invalid analysis response."
        );
      }

      // --------------------------------------------------------
      // STORE ACTUAL RESULT
      // --------------------------------------------------------

      setResult(data);

      // --------------------------------------------------------
      // UPDATE CURRENT DASHBOARD ANALYSIS
      // --------------------------------------------------------

      setAnalysis({
        totalTraffic: data.totalTraffic ?? 0,
        benign: data.benignTraffic ?? 0,
        threats: data.totalThreats ?? 0,
        criticalAlerts: data.criticalAlerts ?? 0,
        threatTypes: data.threatTypes ?? {},
      });

      setMessage(
        "Dataset analyzed successfully. Dashboard updated with this dataset."
      );

      // --------------------------------------------------------
      // WAIT A LITTLE SO USER CAN SEE SUCCESS MESSAGE
      // THEN GO TO OVERVIEW
      // --------------------------------------------------------

      setTimeout(() => {
        setCurrentPage("overview");
      }, 1200);

    } catch (err) {
      console.error("Dataset analysis error:", err);

      setError(
        err.message ||
          "Failed to analyze the dataset. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // THREAT TYPES
  // ------------------------------------------------------------

  const threatTypes = result?.threatTypes || {};

  const attackTypes = [
    {
      name: "DDoS",
      count: threatTypes.DDoS ?? 0,
    },
    {
      name: "DoS",
      count: threatTypes.DoS ?? 0,
    },
    {
      name: "Port Scan",
      count: threatTypes.PortScan ?? 0,
    },
    {
      name: "Brute Force",
      count: threatTypes.BruteForce ?? 0,
    },
    {
      name: "Bot",
      count: threatTypes.Bot ?? 0,
    },
    {
      name: "Web Attack",
      count: threatTypes.WebAttack ?? 0,
    },
  ];

  const detectedAttackTypes = attackTypes.filter(
    (attack) => attack.count > 0
  );

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="monitoring-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="monitoring-header">

        <div>
          <h1>Network Threat Monitoring</h1>

          <p>
            Upload a network traffic dataset to perform
            Random Forest based threat analysis.
          </p>
        </div>

      </div>


      {/* ======================================================
          UPLOAD SECTION
      ====================================================== */}

      <div className="monitoring-card">

        <div className="monitoring-card-header">

          <div>
            <h2>Upload Network Dataset</h2>

            <p>
              Select a CSV file containing network traffic
              records for analysis.
            </p>
          </div>

        </div>


        {/* ====================================================
            FILE INPUT
        ==================================================== */}

        <div className="monitoring-upload-area">

          <div className="upload-icon">
            ↑
          </div>

          <h3>
            Select CSV Dataset
          </h3>

          <p>
            Choose a network traffic CSV file from your computer.
          </p>

          <label className="choose-file-button">

            Choose CSV File

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />

          </label>

        </div>


        {/* ====================================================
            SELECTED FILE
        ==================================================== */}

        {selectedFile && (

          <div className="selected-dataset">

            <div className="dataset-file-icon">
              CSV
            </div>

            <div className="dataset-file-info">

              <strong>
                {selectedFile.name}
              </strong>

              <span>
                {formatFileSize(selectedFile.size)}
              </span>

            </div>

            {!loading && (
              <button
                className="remove-file-button"
                onClick={() => {
                  setSelectedFile(null);
                  setError("");
                  setMessage("");
                  setResult(null);
                }}
              >
                Remove
              </button>
            )}

          </div>

        )}


        {/* ====================================================
            ANALYZE BUTTON
        ==================================================== */}

        <button
          className="analyze-dataset-button"
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
        >

          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing Dataset...
            </>
          ) : (
            <>
              Analyze Dataset
            </>
          )}

        </button>


        {/* ====================================================
            SUCCESS MESSAGE
        ==================================================== */}

        {message && (

          <div className="monitoring-success">

            <div className="message-icon">
              ✓
            </div>

            <div>
              <strong>
                Analysis Completed
              </strong>

              <p>
                {message}
              </p>
            </div>

          </div>

        )}


        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}

        {error && (

          <div className="monitoring-error">

            <div className="message-icon">
              !
            </div>

            <div>

              <strong>
                Dataset Analysis Failed
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}

      </div>


      {/* ======================================================
          ANALYSIS RESULT
      ====================================================== */}

      {result && (

        <div className="monitoring-card analysis-result-card">

          <div className="monitoring-card-header">

            <div>
              <h2>Analysis Result</h2>

              <p>
                Results returned from the uploaded dataset.
              </p>
            </div>

          </div>


          {/* ==================================================
              RESULT SUMMARY
          ================================================== */}

          <div className="monitoring-result-summary">

            <div className="result-card">

              <span>
                Traffic Analyzed
              </span>

              <strong>
                {(result.totalTraffic ?? 0).toLocaleString()}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Benign Traffic
              </span>

              <strong>
                {(result.benignTraffic ?? 0).toLocaleString()}
              </strong>

            </div>


            <div className="result-card threat-result">

              <span>
                Threats Detected
              </span>

              <strong>
                {(result.totalThreats ?? 0).toLocaleString()}
              </strong>

            </div>


            <div className="result-card critical-result">

              <span>
                Critical Alerts
              </span>

              <strong>
                {(result.criticalAlerts ?? 0).toLocaleString()}
              </strong>

            </div>

          </div>


          {/* ==================================================
              DETECTED ATTACK TYPES
          ================================================== */}

          <div className="detected-types-section">

            <h3>
              Detected Attack Types
            </h3>

            {detectedAttackTypes.length === 0 ? (

              <div className="no-threats">

                <strong>
                  No attack records detected
                </strong>

                <p>
                  The uploaded dataset contains no detected
                  attack categories in the returned analysis.
                </p>

              </div>

            ) : (

              <div className="detected-types-grid">

                {detectedAttackTypes.map((attack) => (

                  <div
                    className="detected-type-card"
                    key={attack.name}
                  >

                    <span>
                      {attack.name}
                    </span>

                    <strong>
                      {attack.count.toLocaleString()}
                    </strong>

                    <small>
                      detected records
                    </small>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ==================================================
              CURRENT DATASET NOTICE
          ================================================== */}

          <div className="current-analysis-notice">

            <div className="notice-icon">
              ✓
            </div>

            <div>

              <strong>
                Current Dashboard Analysis
              </strong>

              <p>
                This dataset is now the current analysis.
                Overview, Incidents, Reports and other dashboard
                modules will use its analysis results.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Monitoring;