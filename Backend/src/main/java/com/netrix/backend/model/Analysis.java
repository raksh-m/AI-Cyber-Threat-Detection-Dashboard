package com.netrix.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "analyses")
public class Analysis {

    @Id
    private String id;

    private String datasetName;

    private LocalDateTime uploadedAt;

    private int totalTraffic;

    private int benignTraffic;

    private int totalThreats;

    private int criticalAlerts;

    private Map<String, Integer> threatTypes;

    private long invalidRows;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Analysis() {
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getDatasetName() {
        return datasetName;
    }

    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }


    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }


    public int getTotalTraffic() {
        return totalTraffic;
    }

    public void setTotalTraffic(int totalTraffic) {
        this.totalTraffic = totalTraffic;
    }


    public int getBenignTraffic() {
        return benignTraffic;
    }

    public void setBenignTraffic(int benignTraffic) {
        this.benignTraffic = benignTraffic;
    }


    public int getTotalThreats() {
        return totalThreats;
    }

    public void setTotalThreats(int totalThreats) {
        this.totalThreats = totalThreats;
    }


    public int getCriticalAlerts() {
        return criticalAlerts;
    }

    public void setCriticalAlerts(int criticalAlerts) {
        this.criticalAlerts = criticalAlerts;
    }


    public Map<String, Integer> getThreatTypes() {
        return threatTypes;
    }

    public void setThreatTypes(Map<String, Integer> threatTypes) {
        this.threatTypes = threatTypes;
    }


    public long getInvalidRows() {
        return invalidRows;
    }

    public void setInvalidRows(long invalidRows) {
        this.invalidRows = invalidRows;
    }
}