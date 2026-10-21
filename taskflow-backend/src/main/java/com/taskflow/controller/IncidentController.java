package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.model.Incident;
import com.taskflow.repository.IncidentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentRepository incidentRepository;

    public IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents() {
        return ResponseEntity.ok(ApiResponse.ok(incidentRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Incident>> createIncident(@RequestBody Incident incident) {
        if (incident.getLabel() == null || incident.getLabel().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Label is required"));
        }
        if (incident.getKind() == null || incident.getKind().trim().isEmpty()) {
            incident.setKind("inc");
        }
        Incident saved = incidentRepository.save(incident);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Incident mapped successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncident(@PathVariable Long id) {
        if (!incidentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        incidentRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Incident removed", null));
    }
}
