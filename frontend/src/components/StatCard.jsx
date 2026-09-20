import "./StatCard.css";

function StatCard({ title, value, color }) {
  return (
    <div className="stat-card">
      <div className="card-top">
        <span>{title}</span>
        <div className="dot" style={{ background: color }}></div>
      </div>

      <h2>{value}</h2>

      <p>Updated just now</p>
    </div>
  );
}

export default StatCard;