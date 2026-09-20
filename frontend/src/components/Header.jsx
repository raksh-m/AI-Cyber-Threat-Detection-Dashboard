import { useState } from "react";

import {
  FaSearch,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import "./Header.css";


function Header({ analysis, setCurrentPage }) {

  // =====================================================
  // HEADER STATES
  // =====================================================

  const [search, setSearch] = useState("");

  const [threatLevel, setThreatLevel] =
    useState("All Threat Levels");

  const [showProfile, setShowProfile] =
    useState(false);


  // =====================================================
  // GET ACTUAL ANALYSIS DATA
  // =====================================================

  const threatTypes =
    analysis?.threatTypes || {};


  // =====================================================
  // THREAT DATA
  // COUNTS COME FROM BACKEND ANALYSIS
  // =====================================================

  const threats = [

    {
      name: "DDoS Attack",
      searchName: "ddos",
      count: Number(threatTypes.DDoS || 0),
      severity: "Critical",
      description:
        "Distributed Denial of Service attack",
    },

    {
      name: "DoS Attack",
      searchName: "dos",
      count: Number(threatTypes.DoS || 0),
      severity: "High",
      description:
        "Denial of Service attack",
    },

    {
      name: "Port Scan",
      searchName: "portscan",
      count: Number(threatTypes.PortScan || 0),
      severity: "Medium",
      description:
        "Port scanning activity detected",
    },

    {
      name: "Brute Force",
      searchName: "bruteforce",
      count: Number(threatTypes.BruteForce || 0),
      severity: "High",
      description:
        "Brute force attack activity",
    },

    {
      name: "Bot Activity",
      searchName: "bot",
      count: Number(threatTypes.Bot || 0),
      severity: "High",
      description:
        "Bot-related network activity",
    },

    {
      name: "Web Attack",
      searchName: "webattack",
      count: Number(threatTypes.WebAttack || 0),
      severity: "Critical",
      description:
        "Web-based attack activity",
    },

  ];


  // =====================================================
  // SEARCH
  // =====================================================

  const searchText =
    search.trim().toLowerCase();


  const filteredThreats =
    searchText === ""
      ? []
      : threats.filter((threat) => {

          const nameMatch =
            threat.name
              .toLowerCase()
              .includes(searchText);

          const keywordMatch =
            threat.searchName
              .toLowerCase()
              .includes(searchText);

          return (
            nameMatch ||
            keywordMatch
          );

        });


  // =====================================================
  // CURRENT DATE
  // =====================================================

  const today =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );


  // =====================================================
  // PROFILE
  // =====================================================

  const handleProfile = () => {

    setShowProfile(false);

    if (setCurrentPage) {
      setCurrentPage("profile");
    }

  };


  // =====================================================
  // ACCOUNT SETTINGS
  // =====================================================

  const handleAccountSettings = () => {

    setShowProfile(false);

    if (setCurrentPage) {
      setCurrentPage("settings");
    }

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to sign out?"
      );

    if (!confirmLogout) {
      return;
    }


    // Remove login information
    localStorage.removeItem(
      "netrixLoggedIn"
    );


    // Redirect to login page
    window.location.href = "/login";

  };


  // =====================================================
  // HEADER UI
  // =====================================================

  return (

    <header className="top-header">


      {/* =================================================
          SEARCH
          ================================================= */}

      <div className="header-search">

        <FaSearch
          className="search-icon"
        />


        <input
          type="text"
          placeholder="Search threats..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        {search.length > 0 && (

          <button
            className="clear-search"
            onClick={() =>
              setSearch("")
            }
          >
            ×
          </button>

        )}


        {/* =================================================
            SEARCH RESULTS
            ================================================= */}

        {searchText !== "" && (

          <div className="threat-search-results">

            {filteredThreats.length > 0 ? (

              <>

                <div className="search-result-title">
                  Threat Details
                </div>


                {filteredThreats.map(
                  (threat) => (

                    <div
                      className="threat-result"
                      key={threat.name}
                    >

                      <div className="threat-result-icon">

                        <FaShieldAlt />

                      </div>


                      <div className="threat-result-info">

                        <strong>
                          {threat.name}
                        </strong>


                        <span>
                          {threat.description}
                        </span>


                        <span className="detected-count">

                          Detected:

                          {" "}

                          <b>
                            {threat.count.toLocaleString()}
                          </b>

                        </span>

                      </div>


                      <span
                        className={
                          "search-severity " +
                          threat.severity.toLowerCase()
                        }
                      >

                        {threat.severity}

                      </span>

                    </div>

                  )
                )}

              </>

            ) : (

              <div className="no-threat-result">

                <FaExclamationTriangle />

                <div>

                  <strong>
                    No matching threat
                  </strong>

                  <span>
                    Try DDoS, DoS, Port Scan,
                    Brute Force, Bot or Web Attack
                  </span>

                </div>

              </div>

            )}

          </div>

        )}

      </div>


      {/* =================================================
          HEADER RIGHT SIDE
          ================================================= */}

      <div className="header-right">


        {/* =================================================
            THREAT LEVEL
            ================================================= */}

        <div className="threat-filter">

          <select
            value={threatLevel}
            onChange={(e) =>
              setThreatLevel(
                e.target.value
              )
            }
          >

            <option>
              All Threat Levels
            </option>

            <option>
              Critical
            </option>

            <option>
              High
            </option>

            <option>
              Medium
            </option>

            <option>
              Low
            </option>

          </select>


          <FaChevronDown
            className="select-icon"
          />

        </div>


        {/* =================================================
            DATE
            ================================================= */}

        <div className="header-date">

          <FaCalendarAlt />

          <span>
            {today}
          </span>

        </div>


        {/* =================================================
            NOTIFICATION
            ================================================= */}

        <button
          className="notification-button"
        >

          <FaBell />

          <span
            className="notification-dot"
          ></span>

        </button>


        {/* =================================================
            ADMIN PROFILE
            ================================================= */}

        <div className="admin-profile">


          <button
            className="profile-button"
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
          >

            <FaUserCircle
              className="profile-icon"
            />


            <div className="profile-details">

              <strong>
                Admin User
              </strong>

              <span>
                Security Analyst
              </span>

            </div>


            <FaChevronDown
              className="profile-arrow"
            />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
              ================================================= */}

          {showProfile && (

            <div className="profile-menu">


              {/* PROFILE HEADER */}

              <div
                className="profile-menu-header"
              >

                <FaUserCircle
                  size={42}
                />


                <div>

                  <strong>
                    Admin User
                  </strong>

                  <span>
                    Security Analyst
                  </span>

                </div>

              </div>


              <div
                className="profile-divider"
              ></div>


              {/* PROFILE */}

              <button
                onClick={handleProfile}
              >
                Profile
              </button>


              {/* ACCOUNT SETTINGS */}

              <button
                onClick={
                  handleAccountSettings
                }
              >
                Account Settings
              </button>


              {/* SIGN OUT */}

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Sign Out
              </button>


            </div>

          )}

        </div>

      </div>

    </header>

  );

}


export default Header;