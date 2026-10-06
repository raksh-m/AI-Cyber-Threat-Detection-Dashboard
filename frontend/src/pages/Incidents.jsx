import { useEffect, useState } from "react";
import "./Incidents.css";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIncidents();
  }, []);

  // ============================================================
  // LOAD INCIDENTS FOR LATEST ANALYSIS
  // ============================================================

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------------------------------
      // STEP 1: Get analysis history from MongoDB
      // --------------------------------------------------------

      const historyResponse = await fetch(
        "http://localhost:8080/api/analysis/history"
      );

      if (!historyResponse.ok) {
        throw new Error("Failed to fetch analysis history");
      }

      const history = await historyResponse.json();

      // No analysis available
      if (!history || history.length === 0) {
        setIncidents([]);
        return;
      }

      // Backend returns newest analysis first
      const latestAnalysis = history[0];

      // --------------------------------------------------------
      // STEP 2: Get incidents belonging ONLY to latest analysis
      // --------------------------------------------------------

      const incidentsResponse = await fetch(
        `http://localhost:8080/api/incidents/analysis/${latestAnalysis.id}`
      );

      if (!incidentsResponse.ok) {
        throw new Error("Failed to fetch incidents");
      }

      const data = await incidentsResponse.json();

      // Store MongoDB incidents
      setIncidents(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Incident loading error:", err);

      setError(
        "Unable to load incidents from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUMMARY COUNTS
  // ============================================================

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "Open"
  ).length;

  const criticalIncidents = incidents.filter(
    (incident) =>
      incident.severity === "Critical" &&
      incident.status === "Open"
  ).length;

  const highIncidents = incidents.filter(
    (incident) =>
      incident.severity === "High" &&
      incident.status === "Open"
  ).length;

  const mediumIncidents = incidents.filter(
    (incident) =>
      incident.severity === "Medium" &&
      incident.status === "Open"
  ).length;

  // ============================================================
  // DISPLAY
  // ============================================================

  return (
    <div className="incidents-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="incidents-header">
        <div>
          <h1>Security Incidents</h1>

          <p>
            Incidents identified from the latest network traffic
            analysis.
          </p>
        </div>
      </div>


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="incident-info">

          <div className="info-icon">
            ...
          </div>

          <div>
            <strong>Loading Incidents</strong>

            <p>
              Retrieving detected incidents from MongoDB.
            </p>
          </div>

        </div>
      )}


      {/* ======================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <div className="incident-info">

          <div className="info-icon">
            !
          </div>

          <div>
            <strong>Unable to Load Incidents</strong>

            <p>
              {error}
            </p>
          </div>

        </div>
      )}


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      {!loading && !error && (
        <>

          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

          <div className="incident-summary">

            <div className="incident-card">

              <span>
                Active Incidents
              </span>

              <strong>
                {activeIncidents}
              </strong>

            </div>


            <div className="incident-card critical-card">

              <span>
                Critical
              </span>

              <strong>
                {criticalIncidents}
              </strong>

            </div>


            <div className="incident-card high-card">

              <span>
                High
              </span>

              <strong>
                {highIncidents}
              </strong>

            </div>


            <div className="incident-card medium-card">

              <span>
                Medium
              </span>

              <strong>
                {mediumIncidents}
              </strong>

            </div>

          </div>


          {/* ==================================================
              INCIDENT TABLE
          ================================================== */}

          <div className="incidents-section">

            <div className="section-heading">

              <div>

                <h2>
                  Detected Incidents
                </h2>

                <p>
                  Persisted security incidents from the latest
                  analysis.
                </p>

              </div>

              <span className="incident-count">
                {activeIncidents} Active
              </span>

            </div>


            {/* NO INCIDENTS */}

            {incidents.length === 0 ? (

              <div className="incident-info">

                <div className="info-icon">
                  i
                </div>

                <div>

                  <strong>
                    No Incidents Available
                  </strong>

                  <p>
                    No persisted incident records were found
                    for the latest analysis.
                  </p>

                </div>

              </div>

            ) : (

              /* ==================================================
                 INCIDENT TABLE
                 ================================================== */

              <div className="incident-table">

                <div className="incident-table-header">

                  <span>
                    Incident ID
                  </span>

                  <span>
                    Attack Type
                  </span>

                  <span>
                    Severity
                  </span>

                  <span>
                    Detected
                  </span>

                  <span>
                    Status
                  </span>

                </div>


                {incidents.map((incident, index) => (

                  <div
                    className="incident-table-row"
                    key={incident.id}
                  >

                    {/* Incident ID */}

                    <span className="incident-id">
                      INC-
                      {String(index + 1).padStart(3, "0")}
                    </span>


                    {/* Attack Type */}

                    <span className="attack-type">
                      {incident.threatType}
                    </span>


                    {/* Severity */}

                    <span>

                      <span
                        className={`incident-severity ${
                          incident.severity
                            ? incident.severity.toLowerCase()
                            : ""
                        }`}
                      >
                        {incident.severity}
                      </span>

                    </span>


                    {/* Detected Count */}

                    <span className="detected-count">

                      {Number(
                        incident.detectedCount || 0
                      ).toLocaleString()}

                    </span>


                    {/* Status */}

                    <span>

                      <span
                        className={`incident-status ${
                          incident.status === "Open"
                            ? "open"
                            : "inactive"
                        }`}
                      >
                        {incident.status}
                      </span>

                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ==================================================
              INFORMATION
          ================================================== */}

          <div className="incident-info">

            <div className="info-icon">
              !
            </div>

            <div>

              <strong>
                Incident Detection
              </strong>

              <p>
                Incident records are persisted in MongoDB and
                are generated from the Random Forest prediction
                results for the latest uploaded dataset.
                No random detection counts are used.
              </p>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Incidents;