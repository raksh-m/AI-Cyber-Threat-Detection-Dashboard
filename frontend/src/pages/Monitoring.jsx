import { useState } from "react";
import "./Monitoring.css";

function Monitoring({ setAnalysis, setCurrentPage }) {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAnalyze = async () => {

    if (!selectedFile) {
      alert("Please select a CSV dataset first.");
      return;
    }

    try {

      setLoading(true);

      // Create form data
      const formData = new FormData();

      // Add selected CSV file
      formData.append("file", selectedFile);

      // Send CSV to backend
      const response = await fetch(
        "http://localhost:8080/api/analysis/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze dataset");
      }

      // Get analysis result from backend
      const data = await response.json();

      console.log("Analysis result:", data);

      // Update dashboard with REAL ML results
      setAnalysis({
        totalTraffic: data.totalTraffic,
        benign: data.benignTraffic,
        threats: data.totalThreats,
        criticalAlerts: data.criticalAlerts,
        threatTypes: data.threatTypes,
      });

      alert("Dataset analyzed successfully!");

      // Go back to dashboard
      setCurrentPage("overview");

    } catch (error) {

      console.error("Analysis error:", error);

      alert(
        "Failed to analyze dataset. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="monitoring-page">

      <h1>Network Threat Analysis</h1>

      <p className="monitoring-subtitle">
        Upload network traffic data to detect potential cyber threats.
      </p>

      <div className="upload-container">

        <h2>Upload Network Dataset</h2>

        <p>
          Upload a CSV file containing network traffic records.
        </p>

        <div className="upload-area">

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="selected-file">
              Selected Dataset: {selectedFile.name}
            </div>
          )}

        </div>

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Dataset"}
        </button>

      </div>

    </div>
  );
}

export default Monitoring;