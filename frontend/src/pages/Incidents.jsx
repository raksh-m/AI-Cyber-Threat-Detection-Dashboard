import "./Incidents.css";

function Incidents({ analysis }) {

  const threatTypes = analysis?.threatTypes || {};

  const incidents = [
    {
      id: "INC-001",
      type: "DDoS Attack",
      count: threatTypes.DDoS ?? 0,
      severity: "Critical",
      status: (threatTypes.DDoS ?? 0) > 0 ? "Open" : "No Activity",
    },
    {
      id: "INC-002",
      type: "DoS Attack",
      count: threatTypes.DoS ?? 0,
      severity: "High",
      status: (threatTypes.DoS ?? 0) > 0 ? "Open" : "No Activity",
    },
    {
      id: "INC-003",
      type: "Port Scan",
      count: threatTypes.PortScan ?? 0,
      severity: "Medium",
      status: (threatTypes.PortScan ?? 0) > 0 ? "Open" : "No Activity",
    },
    {
      id: "INC-004",
      type: "Brute Force",
      count: threatTypes.BruteForce ?? 0,
      severity: "High",
      status: (threatTypes.BruteForce ?? 0) > 0 ? "Open" : "No Activity",
    },
    {
      id: "INC-005",
      type: "Bot Activity",
      count: threatTypes.Bot ?? 0,
      severity: "High",
      status: (threatTypes.Bot ?? 0) > 0 ? "Open" : "No Activity",
    },
    {
      id: "INC-006",
      type: "Web Attack",
      count: threatTypes.WebAttack ?? 0,
      severity: "Critical",
      status: (threatTypes.WebAttack ?? 0) > 0 ? "Open" : "No Activity",
    },
  ];

  const activeIncidents =
    incidents.filter((incident) => incident.count > 0).length;

  const criticalIncidents =
    incidents.filter(
      (incident) =>
        incident.severity === "Critical" &&
        incident.count > 0
    ).length;

  const highIncidents =
    incidents.filter(
      (incident) =>
        incident.severity === "High" &&
        incident.count > 0
    ).length;

  const mediumIncidents =
    incidents.filter(
      (incident) =>
        incident.severity === "Medium" &&
        incident.count > 0
    ).length;


  return (
    <div className="incidents-page">

      {/* PAGE HEADER */}

      <div className="incidents-header">

        <div>
          <h1>Security Incidents</h1>

          <p>
            Incidents identified from the latest network traffic analysis.
          </p>
        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="incident-summary">

        <div className="incident-card">
          <span>Active Incidents</span>
          <strong>{activeIncidents}</strong>
        </div>

        <div className="incident-card critical-card">
          <span>Critical</span>
          <strong>{criticalIncidents}</strong>
        </div>

        <div className="incident-card high-card">
          <span>High</span>
          <strong>{highIncidents}</strong>
        </div>

        <div className="incident-card medium-card">
          <span>Medium</span>
          <strong>{mediumIncidents}</strong>
        </div>

      </div>


      {/* INCIDENT TABLE */}

      <div className="incidents-section">

        <div className="section-heading">

          <div>
            <h2>Detected Incidents</h2>

            <p>
              Based on actual Random Forest predictions.
            </p>
          </div>

          <span className="incident-count">
            {activeIncidents} Active
          </span>

        </div>


        <div className="incident-table">

          <div className="incident-table-header">

            <span>Incident ID</span>
            <span>Attack Type</span>
            <span>Severity</span>
            <span>Detected</span>
            <span>Status</span>

          </div>


          {incidents.map((incident) => (

            <div
              className="incident-table-row"
              key={incident.id}
            >

              <span className="incident-id">
                {incident.id}
              </span>

              <span className="attack-type">
                {incident.type}
              </span>

              <span>

                <span
                  className={`incident-severity ${incident.severity.toLowerCase()}`}
                >
                  {incident.severity}
                </span>

              </span>

              <span className="detected-count">
                {incident.count.toLocaleString()}
              </span>

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

      </div>


      {/* INFORMATION */}

      <div className="incident-info">

        <div className="info-icon">
          !
        </div>

        <div>
          <strong>Incident Detection</strong>

          <p>
            Incident counts are derived directly from the latest
            Random Forest prediction results. No random or
            hardcoded detection counts are used.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Incidents;