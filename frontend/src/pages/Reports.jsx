import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./Reports.css";


function Reports({ analysis }) {

  // =====================================================
  // ACTUAL ANALYSIS DATA
  // =====================================================

  const totalTraffic =
    Number(analysis?.totalTraffic || 0);

  const benignTraffic =
    Number(analysis?.benign || 0);

  const totalThreats =
    Number(analysis?.threats || 0);

  const criticalAlerts =
    Number(analysis?.criticalAlerts || 0);

  const threatTypes =
    analysis?.threatTypes || {};


  // =====================================================
  // THREAT DATA
  // =====================================================

  const attacks = [

    {
      name: "DDoS Attack",
      key: "DDoS",
      severity: "Critical",
    },

    {
      name: "DoS Attack",
      key: "DoS",
      severity: "High",
    },

    {
      name: "Port Scan",
      key: "PortScan",
      severity: "Medium",
    },

    {
      name: "Brute Force",
      key: "BruteForce",
      severity: "High",
    },

    {
      name: "Bot Activity",
      key: "Bot",
      severity: "High",
    },

    {
      name: "Web Attack",
      key: "WebAttack",
      severity: "Critical",
    },

  ];


  // =====================================================
  // GET DETECTED COUNT
  // =====================================================

  const getCount = (key) => {

    return Number(
      threatTypes[key] || 0
    );

  };


  // =====================================================
  // THREAT PERCENTAGE
  // =====================================================

  const getThreatPercentage = (count) => {

    if (totalThreats === 0) {
      return "0.0";
    }

    return (
      (count / totalThreats) * 100
    ).toFixed(1);

  };


  // =====================================================
  // OVERALL TRAFFIC PERCENTAGE
  // =====================================================

  const getTrafficPercentage = (count) => {

    if (totalTraffic === 0) {
      return "0.0";
    }

    return (
      (count / totalTraffic) * 100
    ).toFixed(1);

  };


  // =====================================================
  // SEVERITY CALCULATION
  //
  // These are application-level severity categories.
  // Detection counts themselves come from the model.
  // =====================================================

  const criticalCount =
    getCount("DDoS") +
    getCount("WebAttack");

  const highCount =
    getCount("DoS") +
    getCount("BruteForce") +
    getCount("Bot");

  const mediumCount =
    getCount("PortScan");


  // =====================================================
  // GENERATE PDF
  // =====================================================

  const generateReport = () => {

    const doc =
      new jsPDF("p", "mm", "a4");


    // =================================================
    // PAGE SETTINGS
    // =================================================

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();


    // =================================================
    // COLORS
    // =================================================

    const darkBlue = [
      7,
      19,
      33,
    ];

    const cyan = [
      0,
      212,
      255,
    ];

    const lightBlue = [
      230,
      240,
      248,
    ];

    const grey = [
      100,
      116,
      132,
    ];


    // =================================================
    // HEADER
    // =================================================

    doc.setFillColor(
      darkBlue[0],
      darkBlue[1],
      darkBlue[2]
    );

    doc.rect(
      0,
      0,
      pageWidth,
      38,
      "F"
    );


    // NETRIX TITLE

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    doc.text(
      "NETRIX",
      15,
      16
    );


    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "CYBER DEFENSE CENTER",
      15,
      23
    );


    // REPORT TITLE

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "Security Threat Analysis Report",
      pageWidth - 15,
      16,
      {
        align: "right",
      }
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.text(
      "Generated from the latest analyzed network dataset",
      pageWidth - 15,
      23,
      {
        align: "right",
      }
    );


    // =================================================
    // REPORT DATE
    // =================================================

    const reportDate =
      new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );


    doc.setTextColor(
      60,
      75,
      90
    );

    doc.setFontSize(9);

    doc.text(
      `Report Generated: ${reportDate}`,
      15,
      48
    );


    // =================================================
    // EXECUTIVE SUMMARY
    // =================================================

    doc.setTextColor(
      darkBlue[0],
      darkBlue[1],
      darkBlue[2]
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "Executive Summary",
      15,
      62
    );


    // =================================================
    // SUMMARY CARDS
    // =================================================

    const cards = [

      {
        title: "Traffic Analyzed",
        value:
          totalTraffic.toLocaleString(),
      },

      {
        title: "Benign Traffic",
        value:
          benignTraffic.toLocaleString(),
      },

      {
        title: "Active Threats",
        value:
          totalThreats.toLocaleString(),
      },

      {
        title: "Critical Alerts",
        value:
          criticalAlerts.toLocaleString(),
      },

    ];


    const cardWidth = 42;
    const cardHeight = 24;
    const cardGap = 5;
    const startX = 15;
    const startY = 68;


    cards.forEach(
      (card, index) => {

        const x =
          startX +
          index *
            (cardWidth + cardGap);


        doc.setFillColor(
          240,
          246,
          250
        );

        doc.roundedRect(
          x,
          startY,
          cardWidth,
          cardHeight,
          2,
          2,
          "F"
        );


        doc.setTextColor(
          grey[0],
          grey[1],
          grey[2]
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7);

        doc.text(
          card.title,
          x + 4,
          startY + 7
        );


        doc.setTextColor(
          darkBlue[0],
          darkBlue[1],
          darkBlue[2]
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(13);

        doc.text(
          card.value,
          x + 4,
          startY + 18
        );

      }
    );


    // =================================================
    // TRAFFIC SUMMARY
    // =================================================

    const benignPercentage =
      getTrafficPercentage(
        benignTraffic
      );

    const threatPercentage =
      getTrafficPercentage(
        totalThreats
      );


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Traffic Analysis",
      15,
      106
    );


    autoTable(doc, {

      startY: 111,

      head: [
        [
          "Traffic Category",
          "Records",
          "Percentage",
        ],
      ],

      body: [

        [
          "Benign Traffic",
          benignTraffic.toLocaleString(),
          `${benignPercentage}%`,
        ],

        [
          "Threat Traffic",
          totalThreats.toLocaleString(),
          `${threatPercentage}%`,
        ],

        [
          "Total Traffic",
          totalTraffic.toLocaleString(),
          "100.0%",
        ],

      ],

      theme: "grid",

      headStyles: {
        fillColor: darkBlue,
        textColor: 255,
        fontStyle: "bold",
      },

      bodyStyles: {
        textColor: darkBlue,
      },

      alternateRowStyles: {
        fillColor: [
          248,
          251,
          253,
        ],
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

    });


    // =================================================
    // THREAT DISTRIBUTION
    // =================================================

    let threatTableY =
      doc.lastAutoTable.finalY + 12;


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Threat Distribution",
      15,
      threatTableY
    );


    const threatRows =
      attacks.map(
        (attack) => {

          const count =
            getCount(
              attack.key
            );

          return [

            attack.name,

            attack.severity,

            count.toLocaleString(),

            `${getThreatPercentage(
              count
            )}%`,

          ];

        }
      );


    autoTable(doc, {

      startY:
        threatTableY + 5,

      head: [
        [
          "Threat Type",
          "Severity",
          "Detected",
          "Percentage",
        ],
      ],

      body:
        threatRows,

      theme: "grid",

      headStyles: {
        fillColor: darkBlue,
        textColor: 255,
        fontStyle: "bold",
      },

      bodyStyles: {
        textColor: darkBlue,
      },

      alternateRowStyles: {
        fillColor: [
          248,
          251,
          253,
        ],
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

    });


    // =================================================
    // SEVERITY SUMMARY
    // =================================================

    let severityY =
      doc.lastAutoTable.finalY + 12;


    // If not enough room, create page

    if (
      severityY >
      pageHeight - 70
    ) {

      doc.addPage();

      severityY = 20;

    }


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Severity Summary",
      15,
      severityY
    );


    const severityRows = [

      [
        "Critical",
        "DDoS + Web Attack",
        criticalCount.toLocaleString(),
        `${getThreatPercentage(
          criticalCount
        )}%`,
      ],

      [
        "High",
        "DoS + Brute Force + Bot",
        highCount.toLocaleString(),
        `${getThreatPercentage(
          highCount
        )}%`,
      ],

      [
        "Medium",
        "Port Scan",
        mediumCount.toLocaleString(),
        `${getThreatPercentage(
          mediumCount
        )}%`,
      ],

    ];


    autoTable(doc, {

      startY:
        severityY + 5,

      head: [
        [
          "Severity",
          "Attack Types",
          "Detected",
          "Percentage",
        ],
      ],

      body:
        severityRows,

      theme: "grid",

      headStyles: {
        fillColor: darkBlue,
        textColor: 255,
        fontStyle: "bold",
      },

      bodyStyles: {
        textColor: darkBlue,
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

    });


    // =================================================
    // ANALYSIS INFORMATION
    // =================================================

    let infoY =
      doc.lastAutoTable.finalY + 12;


    if (
      infoY >
      pageHeight - 55
    ) {

      doc.addPage();

      infoY = 20;

    }


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Analysis Information",
      15,
      infoY
    );


    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
      60,
      75,
      90
    );


    const information = [

      "Detection Model: Random Forest",

      "Dataset Format: CSV",

      "Analysis Type: Network Traffic Threat Detection",

      "Threat counts are derived from the latest model analysis.",

      "Severity categories are application-level classifications.",

    ];


    information.forEach(
      (line, index) => {

        doc.text(
          `• ${line}`,
          18,
          infoY +
            8 +
            index * 6
        );

      }
    );


    // =================================================
    // FOOTER ON EVERY PAGE
    // =================================================

    const pageCount =
      doc.internal.getNumberOfPages();


    for (
      let i = 1;
      i <= pageCount;
      i++
    ) {

      doc.setPage(i);


      doc.setDrawColor(
        210,
        220,
        228
      );

      doc.line(
        15,
        pageHeight - 15,
        pageWidth - 15,
        pageHeight - 15
      );


      doc.setFontSize(7);

      doc.setTextColor(
        110,
        120,
        130
      );

      doc.text(
        "Netrix Cyber Defense Center",
        15,
        pageHeight - 9
      );


      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 15,
        pageHeight - 9,
        {
          align: "right",
        }
      );

    }


    // =================================================
    // DOWNLOAD PDF
    // =================================================

    const fileName =
      `Netrix_Security_Report_${reportDate
        .replace(/ /g, "_")
        .replace(/,/g, "")}.pdf`;


    doc.save(fileName);

  };


  // =====================================================
  // FRONTEND REPORT PAGE
  // =====================================================

  return (

    <div className="reports-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="reports-header">

        <div>

          <h1>
            Security Reports
          </h1>

          <p>
            Network threat analysis report
            generated from the uploaded dataset.
          </p>

        </div>


        <button
          className="generate-report-button"
          onClick={generateReport}
        >
          Generate Report
        </button>

      </div>


      {/* =================================================
          SUMMARY CARDS
          ================================================= */}

      <div className="reports-summary">

        <div className="report-card">

          <span>
            Traffic Analyzed
          </span>

          <strong>
            {totalTraffic.toLocaleString()}
          </strong>

        </div>


        <div className="report-card">

          <span>
            Benign Traffic
          </span>

          <strong>
            {benignTraffic.toLocaleString()}
          </strong>

        </div>


        <div className="report-card">

          <span>
            Active Threats
          </span>

          <strong>
            {totalThreats.toLocaleString()}
          </strong>

        </div>


        <div className="report-card">

          <span>
            Critical Alerts
          </span>

          <strong>
            {criticalAlerts.toLocaleString()}
          </strong>

        </div>

      </div>


      {/* =================================================
          THREAT DISTRIBUTION
          ================================================= */}

      <div className="reports-section">

        <div className="reports-section-header">

          <div>

            <h2>
              Threat Distribution
            </h2>

            <p>
              Threats detected by the
              Random Forest model.
            </p>

          </div>

        </div>


        <div className="report-table">

          <div className="report-table-header">

            <span>
              Threat Type
            </span>

            <span>
              Severity
            </span>

            <span>
              Detected
            </span>

            <span>
              Percentage
            </span>

          </div>


          {attacks.map(
            (attack) => {

              const count =
                getCount(
                  attack.key
                );

              return (

                <div
                  className="report-table-row"
                  key={attack.key}
                >

                  <span className="report-threat-name">
                    {attack.name}
                  </span>


                  <span>

                    <span
                      className={
                        `severity-badge ${attack.severity.toLowerCase()}`
                      }
                    >
                      {attack.severity}
                    </span>

                  </span>


                  <span>
                    {count.toLocaleString()}
                  </span>


                  <span>
                    {getThreatPercentage(
                      count
                    )}%
                  </span>

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* =================================================
          SEVERITY SUMMARY
          ================================================= */}

      <div className="reports-section">

        <div className="reports-section-header">

          <div>

            <h2>
              Severity Summary
            </h2>

            <p>
              Severity totals calculated
              from the actual detected
              attack types.
            </p>

          </div>

        </div>


        <div className="report-table">

          <div className="report-table-header">

            <span>
              Severity
            </span>

            <span>
              Attack Types
            </span>

            <span>
              Detected
            </span>

            <span>
              Percentage
            </span>

          </div>


          <div className="report-table-row">

            <span>

              <span className="severity-badge critical">
                Critical
              </span>

            </span>

            <span>
              DDoS + Web Attack
            </span>

            <span>
              {criticalCount.toLocaleString()}
            </span>

            <span>
              {getThreatPercentage(
                criticalCount
              )}%
            </span>

          </div>


          <div className="report-table-row">

            <span>

              <span className="severity-badge high">
                High
              </span>

            </span>

            <span>
              DoS + Brute Force + Bot
            </span>

            <span>
              {highCount.toLocaleString()}
            </span>

            <span>
              {getThreatPercentage(
                highCount
              )}%
            </span>

          </div>


          <div className="report-table-row">

            <span>

              <span className="severity-badge medium">
                Medium
              </span>

            </span>

            <span>
              Port Scan
            </span>

            <span>
              {mediumCount.toLocaleString()}
            </span>

            <span>
              {getThreatPercentage(
                mediumCount
              )}%
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          REPORT INFORMATION
          ================================================= */}

      <div className="report-information">

        <div className="report-information-icon">
          i
        </div>

        <div>

          <strong>
            Report Information
          </strong>

          <p>
            This report uses the latest
            Random Forest analysis results.
            Detection counts are taken directly
            from the analyzed dataset. Severity
            levels are application-level
            classifications used for dashboard
            reporting.
          </p>

        </div>

      </div>

    </div>

  );

}


export default Reports;