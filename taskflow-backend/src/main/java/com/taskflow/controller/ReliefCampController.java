package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.model.ReliefCamp;
import com.taskflow.repository.ReliefCampRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/camps")
public class ReliefCampController {

    private final ReliefCampRepository reliefCampRepository;

    public ReliefCampController(ReliefCampRepository reliefCampRepository) {
        this.reliefCampRepository = reliefCampRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReliefCamp>>> getAllCamps() {
        return ResponseEntity.ok(ApiResponse.ok(reliefCampRepository.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReliefCamp>> createCamp(@RequestBody ReliefCamp camp) {
        if (camp.getName() == null || camp.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Camp name is required"));
        }
        if (camp.getCapacity() <= 0) {
            camp.setCapacity(100);
        }
        ReliefCamp saved = reliefCampRepository.save(camp);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Relief camp registered successfully", saved));
    }

    @PutMapping("/{id}/occupancy")
    public ResponseEntity<ApiResponse<ReliefCamp>> updateOccupancy(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        ReliefCamp camp = reliefCampRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Camp not found with id: " + id));

        Integer occupied = payload.get("occupied");
        if (occupied != null) {
            camp.setOccupied(Math.max(0, occupied));
        }
        Integer capacity = payload.get("capacity");
        if (capacity != null && capacity > 0) {
            camp.setCapacity(capacity);
        }

        ReliefCamp updated = reliefCampRepository.save(camp);
        return ResponseEntity.ok(ApiResponse.ok("Camp occupancy updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCamp(@PathVariable Long id) {
        if (!reliefCampRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reliefCampRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Camp removed", null));
    }
}
