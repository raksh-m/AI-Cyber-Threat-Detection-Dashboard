import "./ThreatList.css";

function ThreatList({ threatTypes }) {

  const threatNames = {
    DDoS: "DDoS Attack",
    DoS: "DoS Attack",
    PortScan: "Port Scan",
    BruteForce: "Brute Force",
    Bot: "Bot Activity",
    WebAttack: "Web Attack",
  };

  const severity = {
    DDoS: "Critical",
    DoS: "High",
    PortScan: "Medium",
    BruteForce: "High",
    Bot: "High",
    WebAttack: "Critical",
  };

  // Get only actual threats.
  // BENIGN is intentionally excluded.
  const threats = Object.entries(threatTypes || {})
    .filter(([type, count]) => type !== "BENIGN" && count > 0);

  return (
    <div className="threat-container">

      <h2>Detected Threats</h2>

      {threats.length === 0 ? (

        <p>No threats detected.</p>

      ) : (

        threats.map(([type, count]) => (

          <div className="threat-card" key={type}>

            <div>
              <h3>
                {threatNames[type] || type}
              </h3>

              <p>
                Detected: {count.toLocaleString()}
              </p>
            </div>

            <div>

              <span
                className={
                  (severity[type] || "Medium").toLowerCase()
                }
              >
                {severity[type] || "Medium"}
              </span>

              <p>
                {count.toLocaleString()} occurrences
              </p>

              <small>
                From uploaded dataset
              </small>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default ThreatList;