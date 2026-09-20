import "./Assets.css";

function Assets({ analysis }) {

  const threatTypes = analysis?.threatTypes || {};

  const totalTraffic = analysis?.totalTraffic || 0;
  const benignTraffic = analysis?.benign || 0;
  const totalThreats = analysis?.threats || 0;

  const attacks = [
    {
      name: "DDoS",
      count: threatTypes.DDoS ?? 0,
      severity: "Critical",
    },
    {
      name: "DoS",
      count: threatTypes.DoS ?? 0,
      severity: "High",
    },
    {
      name: "Port Scan",
      count: threatTypes.PortScan ?? 0,
      severity: "Medium",
    },
    {
      name: "Brute Force",
      count: threatTypes.BruteForce ?? 0,
      severity: "High",
    },
    {
      name: "Bot",
      count: threatTypes.Bot ?? 0,
      severity: "High",
    },
    {
      name: "Web Attack",
      count: threatTypes.WebAttack ?? 0,
      severity: "Critical",
    },
  ];

  const activeAttackTypes =
    attacks.filter((attack) => attack.count > 0).length;

  const threatPercentage =
    totalTraffic > 0
      ? ((totalThreats / totalTraffic) * 100).toFixed(1)
      : "0.0";

  const benignPercentage =
    totalTraffic > 0
      ? ((benignTraffic / totalTraffic) * 100).toFixed(1)
      : "0.0";


  return (
    <div className="assets-page">

      {/* HEADER */}

      <div className="assets-header">

        <div>
          <h1>Network Assets</h1>

          <p>
            Network traffic and asset-related information derived
            from the latest uploaded dataset.
          </p>
        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="assets-summary">

        <div className="asset-card">
          <span>Traffic Records</span>

          <strong>
            {totalTraffic.toLocaleString()}
          </strong>

          <small>
            Records analyzed
          </small>
        </div>


        <div className="asset-card">
          <span>Benign Traffic</span>

          <strong>
            {benignTraffic.toLocaleString()}
          </strong>

          <small>
            {benignPercentage}% of analyzed traffic
          </small>
        </div>


        <div className="asset-card threat-card">
          <span>Threat Traffic</span>

          <strong>
            {totalThreats.toLocaleString()}
          </strong>

          <small>
            {threatPercentage}% of analyzed traffic
          </small>
        </div>


        <div className="asset-card">
          <span>Attack Categories</span>

          <strong>
            {activeAttackTypes}
          </strong>

          <small>
            Categories with detected activity
          </small>
        </div>

      </div>


      {/* DATASET INFORMATION */}

      <div className="assets-section">

        <div className="assets-section-header">

          <div>
            <h2>Dataset Traffic Overview</h2>

            <p>
              Values below are calculated from the latest
              Random Forest analysis.
            </p>
          </div>

        </div>


        <div className="traffic-overview">

          <div className="traffic-row">

            <div className="traffic-label">
              <span className="dot benign-dot"></span>
              <span>Benign Traffic</span>
            </div>

            <strong>
              {benignTraffic.toLocaleString()}
            </strong>

          </div>


          <div className="traffic-bar">

            <div
              className="benign-fill"
              style={{
                width: `${benignPercentage}%`,
              }}
            ></div>

          </div>


          <div className="traffic-row threat-row">

            <div className="traffic-label">
              <span className="dot threat-dot"></span>
              <span>Threat Traffic</span>
            </div>

            <strong>
              {totalThreats.toLocaleString()}
            </strong>

          </div>


          <div className="traffic-bar">

            <div
              className="threat-fill"
              style={{
                width: `${threatPercentage}%`,
              }}
            ></div>

          </div>

        </div>

      </div>


      {/* ATTACK CATEGORIES */}

      <div className="assets-section">

        <div className="assets-section-header">

          <div>
            <h2>Detected Network Activity</h2>

            <p>
              Attack categories detected in the uploaded dataset.
            </p>
          </div>

        </div>


        <div className="asset-table">

          <div className="asset-table-header">

            <span>Attack Type</span>
            <span>Detected Records</span>
            <span>Severity</span>
            <span>Percentage</span>

          </div>


          {attacks.map((attack) => {

            const percentage =
              totalThreats > 0
                ? ((attack.count / totalThreats) * 100).toFixed(1)
                : "0.0";

            return (

              <div
                className="asset-table-row"
                key={attack.name}
              >

                <span className="asset-name">
                  {attack.name}
                </span>


                <span className="asset-count">
                  {attack.count.toLocaleString()}
                </span>


                <span>

                  <span
                    className={`asset-severity ${attack.severity.toLowerCase()}`}
                  >
                    {attack.severity}
                  </span>

                </span>


                <span>
                  {percentage}%
                </span>

              </div>

            );

          })}

        </div>

      </div>


      {/* DATA LIMITATION NOTICE */}

      <div className="asset-notice">

        <div className="notice-icon">
          i
        </div>

        <div>

          <strong>
            Dataset-based asset information
          </strong>

          <p>
            This view displays only information available from
            the uploaded network dataset and its analysis results.
            IP addresses, hostnames, operating systems and
            geographic locations are not displayed unless those
            fields are present in the uploaded dataset.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Assets;