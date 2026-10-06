package com.netrix.backend.service;

import com.netrix.backend.dto.ThreatAnalysisResponse;
import com.netrix.backend.model.Analysis;
import com.netrix.backend.model.Incident;
import com.netrix.backend.repository.AnalysisRepository;
import com.netrix.backend.repository.IncidentRepository;
import com.netrix.ml.ThreatPredictor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ThreatAnalysisService {

    private final AnalysisRepository analysisRepository;
    private final IncidentRepository incidentRepository;

    public ThreatAnalysisService(
            AnalysisRepository analysisRepository,
            IncidentRepository incidentRepository) {

        this.analysisRepository = analysisRepository;
        this.incidentRepository = incidentRepository;
    }


    // ============================================================
    // GET LATEST ANALYSIS
    // ============================================================

    public ThreatAnalysisResponse getAnalysis() {

        List<Analysis> analyses =
                analysisRepository.findAllByOrderByUploadedAtDesc();

        // No analysis stored yet
        if (analyses.isEmpty()) {

            return new ThreatAnalysisResponse(
                    0,
                    0,
                    0,
                    0,
                    createEmptyThreatTypes()
            );
        }

        // Get latest analysis
        Analysis latest = analyses.get(0);

        return convertToResponse(latest);
    }


    // ============================================================
    // ANALYZE UPLOADED CSV
    // ============================================================

    public ThreatAnalysisResponse analyzeUploadedFile(
            MultipartFile file) throws Exception {

        Path tempFile =
                Files.createTempFile(
                        "netrix-upload-",
                        ".csv"
                );

        try {

            // Save uploaded CSV temporarily
            file.transferTo(tempFile.toFile());


            // ----------------------------------------------------
            // RUN MACHINE LEARNING MODEL
            // ----------------------------------------------------

            ThreatPredictor.PredictionResult result =
                    ThreatPredictor.analyzeFile(tempFile);

            long[] counts = result.counts();


            // ----------------------------------------------------
            // CREATE THREAT TYPE COUNTS
            // ----------------------------------------------------

            Map<String, Integer> threatTypes =
                    new LinkedHashMap<>();

            threatTypes.put(
                    "BENIGN",
                    (int) counts[0]
            );

            threatTypes.put(
                    "DDoS",
                    (int) counts[1]
            );

            threatTypes.put(
                    "DoS",
                    (int) counts[2]
            );

            threatTypes.put(
                    "PortScan",
                    (int) counts[3]
            );

            threatTypes.put(
                    "BruteForce",
                    (int) counts[4]
            );

            threatTypes.put(
                    "Bot",
                    (int) counts[5]
            );

            threatTypes.put(
                    "WebAttack",
                    (int) counts[6]
            );


            // ----------------------------------------------------
            // CALCULATE ANALYSIS VALUES
            // ----------------------------------------------------

            int totalTraffic =
                    (int) result.acceptedRows();

            int benignTraffic =
                    (int) counts[0];

            int totalThreats =
                    totalTraffic - benignTraffic;


            /*
             * Current application severity rules:
             *
             * DDoS      -> Critical
             * WebAttack -> Critical
             */

            int criticalAlerts =
                    (int) (
                            counts[1]
                                    + counts[6]
                    );


            // ----------------------------------------------------
            // CREATE MONGODB ANALYSIS DOCUMENT
            // ----------------------------------------------------

            Analysis analysis =
                    new Analysis();

            analysis.setDatasetName(
                    file.getOriginalFilename()
            );

            analysis.setUploadedAt(
                    LocalDateTime.now()
            );

            analysis.setTotalTraffic(
                    totalTraffic
            );

            analysis.setBenignTraffic(
                    benignTraffic
            );

            analysis.setTotalThreats(
                    totalThreats
            );

            analysis.setCriticalAlerts(
                    criticalAlerts
            );

            analysis.setThreatTypes(
                    threatTypes
            );

            analysis.setInvalidRows(
                    result.invalidRows()
            );


            // ----------------------------------------------------
            // SAVE ANALYSIS TO MONGODB
            // ----------------------------------------------------

            Analysis savedAnalysis =
                    analysisRepository.save(analysis);


            // ----------------------------------------------------
            // CREATE PERSISTENT INCIDENTS
            // ----------------------------------------------------

            createIncidents(
                    savedAnalysis,
                    threatTypes
            );


            // ----------------------------------------------------
            // RETURN RESULT TO FRONTEND
            // ----------------------------------------------------

            return new ThreatAnalysisResponse(
                    totalTraffic,
                    benignTraffic,
                    totalThreats,
                    criticalAlerts,
                    threatTypes
            );

        } finally {

            // Delete temporary uploaded CSV
            Files.deleteIfExists(tempFile);
        }
    }


    // ============================================================
    // CREATE INCIDENTS
    // ============================================================

    private void createIncidents(
            Analysis analysis,
            Map<String, Integer> threatTypes) {

        /*
         * Create one incident for each attack category
         * that has at least one actual detection.
         *
         * BENIGN traffic is never treated as an incident.
         */

        for (Map.Entry<String, Integer> entry
                : threatTypes.entrySet()) {

            String threatType =
                    entry.getKey();

            int detectedCount =
                    entry.getValue();


            // Ignore BENIGN traffic
            if ("BENIGN".equals(threatType)) {
                continue;
            }


            // Ignore attack categories with zero detections
            if (detectedCount <= 0) {
                continue;
            }


            // ----------------------------------------------------
            // CREATE INCIDENT
            // ----------------------------------------------------

            Incident incident =
                    new Incident();

            incident.setAnalysisId(
                    analysis.getId()
            );

            incident.setDatasetName(
                    analysis.getDatasetName()
            );

            incident.setThreatType(
                    getDisplayThreatType(threatType)
            );

            incident.setSeverity(
                    getSeverity(threatType)
            );

            incident.setDetectedCount(
                    detectedCount
            );

            incident.setStatus(
                    "Open"
            );

            incident.setCreatedAt(
                    LocalDateTime.now()
            );


            // Save incident to MongoDB
            incidentRepository.save(incident);
        }
    }


    // ============================================================
    // DISPLAY THREAT TYPE
    // ============================================================

    private String getDisplayThreatType(
            String threatType) {

        return switch (threatType) {

            case "DDoS" ->
                    "DDoS Attack";

            case "DoS" ->
                    "DoS Attack";

            case "PortScan" ->
                    "Port Scan";

            case "BruteForce" ->
                    "Brute Force";

            case "Bot" ->
                    "Bot Activity";

            case "WebAttack" ->
                    "Web Attack";

            default ->
                    threatType;
        };
    }


    // ============================================================
    // THREAT SEVERITY
    // ============================================================

    private String getSeverity(
            String threatType) {

        return switch (threatType) {

            case "DDoS",
                 "WebAttack" ->
                    "Critical";

            case "DoS",
                 "BruteForce",
                 "Bot" ->
                    "High";

            case "PortScan" ->
                    "Medium";

            default ->
                    "Low";
        };
    }


    // ============================================================
    // GET ANALYSIS HISTORY
    // ============================================================

    public List<Analysis> getAnalysisHistory() {

        return analysisRepository
                .findAllByOrderByUploadedAtDesc();
    }


    // ============================================================
    // GET ALL INCIDENTS
    // ============================================================

    public List<Incident> getIncidents() {

    List<Incident> incidents =
            incidentRepository
                    .findAllByOrderByCreatedAtDesc();

    // If incidents already exist, return them
    if (!incidents.isEmpty()) {
        return incidents;
    }

    // No incident records yet.
    // Create them from the latest existing analysis.
    List<Analysis> history =
            analysisRepository
                    .findAllByOrderByUploadedAtDesc();

    if (history.isEmpty()) {
        return incidents;
    }

    Analysis latestAnalysis = history.get(0);

    Map<String, Integer> threatTypes =
            latestAnalysis.getThreatTypes();

    if (threatTypes != null && !threatTypes.isEmpty()) {

        createIncidents(
                latestAnalysis,
                threatTypes
        );
    }

    return incidentRepository
            .findAllByOrderByCreatedAtDesc();
}


    // ============================================================
    // GET INCIDENTS FOR A PARTICULAR ANALYSIS
    // ============================================================

    public List<Incident> getIncidentsByAnalysis(
            String analysisId) {

        return incidentRepository
                .findByAnalysisIdOrderByCreatedAtDesc(
                        analysisId
                );
    }


    // ============================================================
    // CONVERT DATABASE MODEL → API RESPONSE
    // ============================================================

    private ThreatAnalysisResponse convertToResponse(
            Analysis analysis) {

        return new ThreatAnalysisResponse(
                analysis.getTotalTraffic(),
                analysis.getBenignTraffic(),
                analysis.getTotalThreats(),
                analysis.getCriticalAlerts(),
                analysis.getThreatTypes()
        );
    }


    // ============================================================
    // EMPTY THREAT COUNTS
    // ============================================================

    private Map<String, Integer> createEmptyThreatTypes() {

        Map<String, Integer> threatTypes =
                new LinkedHashMap<>();

        threatTypes.put("BENIGN", 0);
        threatTypes.put("DDoS", 0);
        threatTypes.put("DoS", 0);
        threatTypes.put("PortScan", 0);
        threatTypes.put("BruteForce", 0);
        threatTypes.put("Bot", 0);
        threatTypes.put("WebAttack", 0);

        return threatTypes;
    }
}