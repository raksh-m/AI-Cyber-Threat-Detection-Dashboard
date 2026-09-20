import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ThreatList from "../components/ThreatList";
import ActivityChart from "../components/ActivityChart";
import ThreatTypeChart from "../components/ThreatTypeChart";
import ThreatMap from "../components/ThreatMap";

import Monitoring from "./Monitoring";
import Reports from "./Reports";
import Incidents from "./Incidents";
import Assets from "./Assets";
import Users from "./Users";
import Settings from "./Settings";
import Profile from "./Profile";


function Dashboard() {


  // =====================================================
  // CURRENT PAGE
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState("overview");


  // =====================================================
  // ANALYSIS RESULTS
  // =====================================================

  const [analysis, setAnalysis] = useState({

    totalTraffic: 0,

    benign: 0,

    threats: 0,

    criticalAlerts: 0,

    threatTypes: {

      BENIGN: 0,

      DDoS: 0,

      DoS: 0,

      PortScan: 0,

      BruteForce: 0,

      Bot: 0,

      WebAttack: 0,

    },

  });


  // =====================================================
  // LOAD LATEST ANALYSIS
  // =====================================================

  useEffect(() => {

    fetch(
      "http://localhost:8080/api/analysis"
    )

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "Failed to fetch analysis"
          );

        }

        return response.json();

      })


      .then((data) => {

        setAnalysis({

          totalTraffic:
            data.totalTraffic,

          benign:
            data.benignTraffic,

          threats:
            data.totalThreats,

          criticalAlerts:
            data.criticalAlerts,

          threatTypes:
            data.threatTypes,

        });

      })


      .catch((error) => {

        console.error(
          "Error fetching analysis:",
          error
        );

      });

  }, []);


  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (

    <div
      style={{
        display: "flex",
        background: "#071321",
        minHeight: "100vh",
      }}
    >


      {/* =================================================
          SIDEBAR
          ================================================= */}

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >


        {/* =================================================
            OVERVIEW
            ================================================= */}

        {currentPage === "overview" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <div
              style={{
                padding: "20px",
              }}
            >


              {/* =========================================
                  STATISTICS
                  ========================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(4, 1fr)",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >

                <StatCard
                  title="Active Threats"
                  value={
                    analysis.threats
                  }
                  color="#ff3b30"
                />


                <StatCard
                  title="Traffic Analyzed"
                  value={
                    analysis.totalTraffic
                  }
                  color="#34c759"
                />


                <StatCard
                  title="Critical Alerts"
                  value={
                    analysis.criticalAlerts
                  }
                  color="#ff9500"
                />


                <StatCard
                  title="Benign Traffic"
                  value={
                    analysis.benign
                  }
                  color="#0a84ff"
                />

              </div>


              {/* =========================================
                  THREAT LIST + MAP
                  ========================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >

                <ThreatList
                  threatTypes={
                    analysis.threatTypes
                  }
                />


                <ThreatMap
                  threatTypes={
                    analysis.threatTypes
                  }
                />

              </div>


              {/* =========================================
                  CHARTS
                  ========================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1fr",
                  gap: "20px",
                }}
              >

                <ActivityChart />


                <ThreatTypeChart
                  threatTypes={
                    analysis.threatTypes
                  }
                />

              </div>

            </div>

          </>

        )}


        {/* =================================================
            MONITORING
            ================================================= */}

        {currentPage === "monitoring" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Monitoring
              setAnalysis={
                setAnalysis
              }
              setCurrentPage={
                setCurrentPage
              }
            />

          </>

        )}


        {/* =================================================
            REPORTS
            ================================================= */}

        {currentPage === "reports" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Reports
              analysis={analysis}
            />

          </>

        )}


        {/* =================================================
            INCIDENTS
            ================================================= */}

        {currentPage === "incidents" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Incidents
              analysis={analysis}
            />

          </>

        )}


        {/* =================================================
            ASSETS
            ================================================= */}

        {currentPage === "assets" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Assets
              analysis={analysis}
            />

          </>

        )}


        {/* =================================================
            USERS
            ================================================= */}

        {currentPage === "users" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Users
              analysis={analysis}
            />

          </>

        )}


        {/* =================================================
            SETTINGS
            ================================================= */}

        {currentPage === "settings" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Settings />

          </>

        )}


        {/* =================================================
            ADMIN PROFILE
            ================================================= */}

        {currentPage === "profile" && (

          <>

            <Header
              analysis={analysis}
              setCurrentPage={
                setCurrentPage
              }
            />


            <Profile
              setCurrentPage={
                setCurrentPage
              }
            />

          </>

        )}

      </div>

    </div>

  );

}


export default Dashboard;