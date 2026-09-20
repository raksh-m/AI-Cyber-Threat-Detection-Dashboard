package com.netrix.backend.model;

import java.util.Map;

public class PredictionResult {

    private int totalTraffic;
    private int benignTraffic;
    private int totalThreats;
    private int criticalAlerts;
    private Map<String, Integer> threatTypes;

    public PredictionResult() {
    }

    public PredictionResult(int totalTraffic,
                            int benignTraffic,
                            int totalThreats,
                            int criticalAlerts,
                            Map<String, Integer> threatTypes) {

        this.totalTraffic = totalTraffic;
        this.benignTraffic = benignTraffic;
        this.totalThreats = totalThreats;
        this.criticalAlerts = criticalAlerts;
        this.threatTypes = threatTypes;
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
}