package com.netrix.backend.controller;

import com.netrix.backend.dto.ThreatAnalysisResponse;
import com.netrix.backend.model.Analysis;
import com.netrix.backend.model.Incident;
import com.netrix.backend.service.ThreatAnalysisService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ThreatController {

    private final ThreatAnalysisService threatAnalysisService;

    public ThreatController(
            ThreatAnalysisService threatAnalysisService) {

        this.threatAnalysisService = threatAnalysisService;
    }


    // ============================================================
    // GET LATEST ANALYSIS
    // ============================================================

    @GetMapping("/analysis")
    public ThreatAnalysisResponse getAnalysis() {

        return threatAnalysisService.getAnalysis();
    }


    // ============================================================
    // UPLOAD AND ANALYZE DATASET
    // ============================================================

    @PostMapping(
            value = "/analysis/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ThreatAnalysisResponse analyzeUploadedFile(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        return threatAnalysisService.analyzeUploadedFile(file);
    }


    // ============================================================
    // GET ANALYSIS HISTORY
    // ============================================================

    @GetMapping("/analysis/history")
    public List<Analysis> getAnalysisHistory() {

        return threatAnalysisService.getAnalysisHistory();
    }


    // ============================================================
    // GET ALL INCIDENTS
    // ============================================================

    @GetMapping("/incidents")
    public List<Incident> getIncidents() {

        return threatAnalysisService.getIncidents();
    }


    // ============================================================
    // GET INCIDENTS FOR A PARTICULAR ANALYSIS
    // ============================================================

    @GetMapping("/incidents/analysis/{analysisId}")
    public List<Incident> getIncidentsByAnalysis(
            @PathVariable String analysisId) {

        return threatAnalysisService
                .getIncidentsByAnalysis(analysisId);
    }


    // ============================================================
    // TEST BACKEND
    // ============================================================

    @GetMapping("/test")
    public String test() {

        return "Backend is running";
    }
}