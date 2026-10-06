package com.netrix.backend.repository;

import com.netrix.backend.model.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IncidentRepository extends MongoRepository<Incident, String> {

    List<Incident> findAllByOrderByCreatedAtDesc();

    List<Incident> findByAnalysisIdOrderByCreatedAtDesc(String analysisId);
}