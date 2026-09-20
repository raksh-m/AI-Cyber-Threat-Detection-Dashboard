package com.netrix.backend.controller;

import com.netrix.backend.dto.ThreatAnalysisResponse;
import com.netrix.backend.service.ThreatAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ThreatController {

    private final ThreatAnalysisService threatAnalysisService;

    public ThreatController(ThreatAnalysisService threatAnalysisService) {
        this.threatAnalysisService = threatAnalysisService;
    }

    @GetMapping("/analysis")
    public ThreatAnalysisResponse getAnalysis() {
        return threatAnalysisService.getAnalysis();
    }

    @PostMapping(
            value = "/analysis/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ThreatAnalysisResponse analyzeUploadedFile(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        return threatAnalysisService.analyzeUploadedFile(file);
    }

    @GetMapping("/test")
    public String test() {
        return "Backend is running";
    }
}