import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./ActivityChart.css";

const data = [
  { time: "00", threats: 12 },
  { time: "03", threats: 25 },
  { time: "06", threats: 18 },
  { time: "09", threats: 40 },
  { time: "12", threats: 65 },
  { time: "15", threats: 52 },
  { time: "18", threats: 80 },
  { time: "21", threats: 60 },
  { time: "24", threats: 45 },
];

function ActivityChart() {
  return (
    <div className="activity-chart">
      <h2>24-Hour Threat Activity</h2>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid stroke="#233d5b" />
          <XAxis dataKey="time" stroke="#9fb4ca" />
          <YAxis stroke="#9fb4ca" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="threats"
            stroke="#00d4ff"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityChart;