import {
  FaHome,
  FaShieldAlt,
  FaSearch,
  FaExclamationTriangle,
  FaFileAlt,
  FaDesktop,
  FaUsers,
  FaCog,
  FaUserCircle
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="sidebar">

      <div>

        <h2>Netrix</h2>
        <p className="title">Cyber Defense Center</p>

        <h1 className="soc">SOC</h1>
        <h2 className="dash">DASHBOARD</h2>

        <ul className="menu">

          {/* Overview */}
          <li
            className={currentPage === "overview" ? "active" : ""}
            onClick={() => setCurrentPage("overview")}
          >
            <FaHome />
            Overview
          </li>

          {/* Threats */}
          <li
            className={currentPage === "threats" ? "active" : ""}
            onClick={() => setCurrentPage("threats")}
          >
            <FaShieldAlt />
            Threats
          </li>

          {/* Monitoring */}
          <li
            className={currentPage === "monitoring" ? "active" : ""}
            onClick={() => setCurrentPage("monitoring")}
          >
            <FaSearch />
            Monitoring
          </li>

          {/* Incidents */}
          <li
            className={currentPage === "incidents" ? "active" : ""}
            onClick={() => setCurrentPage("incidents")}
          >
            <FaExclamationTriangle />
            Incidents
          </li>

          {/* Reports */}
          <li
            className={currentPage === "reports" ? "active" : ""}
            onClick={() => setCurrentPage("reports")}
          >
            <FaFileAlt />
            Reports
          </li>

          {/* Assets */}
          <li
            className={currentPage === "assets" ? "active" : ""}
            onClick={() => setCurrentPage("assets")}
          >
            <FaDesktop />
            Assets
          </li>

          {/* Users */}
          <li
            className={currentPage === "users" ? "active" : ""}
            onClick={() => setCurrentPage("users")}
          >
            <FaUsers />
            Users
          </li>

          {/* Settings */}
          <li
            className={currentPage === "settings" ? "active" : ""}
            onClick={() => setCurrentPage("settings")}
          >
            <FaCog />
            Settings
          </li>

        </ul>

      </div>

      <div className="profile">
        <FaUserCircle size={45} />

        <div>
          <h4>Admin User</h4>
          <p>Security Analyst</p>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;