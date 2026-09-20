package com.netrix.backend.service;

import com.netrix.backend.dto.ThreatAnalysisResponse;
import com.netrix.ml.ThreatPredictor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ThreatAnalysisService {

    // Stores only the latest uploaded dataset result
    private ThreatAnalysisResponse latestAnalysis = null;

    // Called when dashboard is loaded/refreshed
    public ThreatAnalysisResponse getAnalysis() {

        // Return the latest uploaded dataset result
        if (latestAnalysis != null) {
            return latestAnalysis;
        }

        // No dataset has been analyzed yet
        Map<String, Integer> threatTypes = new LinkedHashMap<>();

        threatTypes.put("BENIGN", 0);
        threatTypes.put("DDoS", 0);
        threatTypes.put("DoS", 0);
        threatTypes.put("PortScan", 0);
        threatTypes.put("BruteForce", 0);
        threatTypes.put("Bot", 0);
        threatTypes.put("WebAttack", 0);

        return new ThreatAnalysisResponse(
                0,
                0,
                0,
                0,
                threatTypes
        );
    }

    // Analyze uploaded CSV
    public ThreatAnalysisResponse analyzeUploadedFile(
            MultipartFile file) throws Exception {

        Path tempFile = Files.createTempFile(
                "netrix-upload-",
                ".csv"
        );

        try {

            // Save uploaded file temporarily
            file.transferTo(tempFile.toFile());

            // Run Random Forest prediction
            ThreatPredictor.PredictionResult result =
                    ThreatPredictor.analyzeFile(tempFile);

            long[] counts = result.counts();

            // Store exact prediction counts
            Map<String, Integer> threatTypes =
                    new LinkedHashMap<>();

            threatTypes.put("BENIGN", (int) counts[0]);
            threatTypes.put("DDoS", (int) counts[1]);
            threatTypes.put("DoS", (int) counts[2]);
            threatTypes.put("PortScan", (int) counts[3]);
            threatTypes.put("BruteForce", (int) counts[4]);
            threatTypes.put("Bot", (int) counts[5]);
            threatTypes.put("WebAttack", (int) counts[6]);

            int totalTraffic =
                    (int) result.acceptedRows();

            int benignTraffic =
                    (int) counts[0];

            int totalThreats =
                    totalTraffic - benignTraffic;

            int criticalAlerts =
                    (int) counts[6];

            // Create result for THIS dataset only
            ThreatAnalysisResponse analysis =
                    new ThreatAnalysisResponse(
                            totalTraffic,
                            benignTraffic,
                            totalThreats,
                            criticalAlerts,
                            threatTypes
                    );

            // Replace previous dataset result
            latestAnalysis = analysis;

            return analysis;

        } finally {

            Files.deleteIfExists(tempFile);
        }
    }
}