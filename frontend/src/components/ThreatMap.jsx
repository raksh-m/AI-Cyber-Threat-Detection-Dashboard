import { FaMapMarkerAlt } from "react-icons/fa";
import "./ThreatMap.css";

function ThreatMap({ threatTypes = {} }) {

  // Actual prediction values from the uploaded dataset
  const attacks = [
    {
      name: "DDoS Attack",
      count: threatTypes.DDoS ?? 0,
      color: "#ff3b30",
    },
    {
      name: "DoS Attack",
      count: threatTypes.DoS ?? 0,
      color: "#ff9500",
    },
    {
      name: "Port Scan",
      count: threatTypes.PortScan ?? 0,
      color: "#af52de",
    },
    {
      name: "Brute Force",
      count: threatTypes.BruteForce ?? 0,
      color: "#34c759",
    },
    {
      name: "Bot Activity",
      count: threatTypes.Bot ?? 0,
      color: "#00d4ff",
    },
    {
      name: "Web Attack",
      count: threatTypes.WebAttack ?? 0,
      color: "#0a84ff",
    },
  ];

  // Calculate total detected threats
  const totalThreats = attacks.reduce(
    (total, attack) => total + attack.count,
    0
  );

  return (
    <div className="threat-map">

      {/* Title */}
      <h2>Global Threat Distribution</h2>

      {/* =========================
          MAP + THREAT DISTRIBUTION
          ========================= */}
      <div className="map-content">

        {/* World Map */}
        <div className="map-box">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
            alt="World Map"
          />
        </div>

        {/* Threat Distribution */}
        <div className="attack-list">

          {attacks.map((item) => {

            // Calculate percentage
            const percentage =
              totalThreats > 0
                ? ((item.count / totalThreats) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                className="attack-item"
                key={item.name}
              >

                {/* Threat Icon */}
                <FaMapMarkerAlt
                  style={{
                    color: item.color,
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                />

                <div className="attack-info">

                  {/* Threat name + count */}
                  <div className="attack-header">

                    <h4>{item.name}</h4>

                    <span>
                      {item.count.toLocaleString()}
                    </span>

                  </div>

                  {/* Progress Bar */}
                  <div className="attack-bar">

                    <div
                      className="attack-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.color,
                      }}
                    />

                  </div>

                  {/* Percentage */}
                  <p>
                    {percentage}% of detected threats
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* =========================
          INFORMATION MESSAGE
          ========================= */}
      <div className="map-info">

        <FaMapMarkerAlt
          style={{
            color: "#00d4ff",
            fontSize: "20px",
            flexShrink: 0,
          }}
        />

        <div>

          <strong>
            Threat activity is visualized by attack type
          </strong>

          <p>
            Geographic location data is not available in
            the uploaded dataset.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ThreatMap;