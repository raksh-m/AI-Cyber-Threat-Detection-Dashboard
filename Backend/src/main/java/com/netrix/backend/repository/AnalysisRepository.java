package com.netrix.backend.repository;

import com.netrix.backend.model.Analysis;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnalysisRepository extends MongoRepository<Analysis, String> {

    List<Analysis> findAllByOrderByUploadedAtDesc();
}