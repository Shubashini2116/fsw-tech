package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.model.Volunteer;
import com.taskflow.repository.VolunteerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;

    public VolunteerController(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Volunteer>>> getAllVolunteers() {
        return ResponseEntity.ok(ApiResponse.ok(volunteerRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Volunteer>> createVolunteer(@RequestBody Volunteer volunteer) {
        if (volunteer.getName() == null || volunteer.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Name is required"));
        }
        if (volunteer.getStatus() == null || volunteer.getStatus().trim().isEmpty()) {
            volunteer.setStatus("available");
        }
        Volunteer saved = volunteerRepository.save(volunteer);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Volunteer added successfully", saved));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<Volunteer>> toggleStatus(@PathVariable Long id) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Volunteer not found with id: " + id));
        String newStatus = "available".equalsIgnoreCase(volunteer.getStatus()) ? "busy" : "available";
        volunteer.setStatus(newStatus);
        Volunteer updated = volunteerRepository.save(volunteer);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Volunteer>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Volunteer not found with id: " + id));
        String status = body.get("status");
        if (status != null) {
            volunteer.setStatus(status.trim().toLowerCase());
        }
        Volunteer updated = volunteerRepository.save(volunteer);
        return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVolunteer(@PathVariable Long id) {
        if (!volunteerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        volunteerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Volunteer removed", null));
    }
}
