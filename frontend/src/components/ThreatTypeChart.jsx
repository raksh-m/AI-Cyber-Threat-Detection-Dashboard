import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./ThreatTypeChart.css";

function ThreatTypeChart({ threatTypes = {} }) {

  // Convert backend/model result into Recharts format
  const data = [
    { name: "DDoS", count: threatTypes.DDoS ?? 0 },
    { name: "DoS", count: threatTypes.DoS ?? 0 },
    { name: "Port Scan", count: threatTypes.PortScan ?? 0 },
    { name: "Brute Force", count: threatTypes.BruteForce ?? 0 },
    { name: "Bot", count: threatTypes.Bot ?? 0 },
    { name: "Web Attack", count: threatTypes.WebAttack ?? 0 },
  ];

  return (
    <div className="threat-chart">
      <h2>Detected Threat Types</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid
            stroke="#233d5b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
            stroke="#9fb4ca"
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />

          <YAxis
            stroke="#9fb4ca"
            allowDecimals={false}
          />

          <Tooltip
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Detected",
            ]}
          />

          <Bar
            dataKey="count"
            fill="#00d4ff"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThreatTypeChart;