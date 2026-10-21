package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.model.BroadcastMessage;
import com.taskflow.repository.BroadcastMessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/broadcasts")
public class BroadcastController {

    private final BroadcastMessageRepository broadcastRepository;

    public BroadcastController(BroadcastMessageRepository broadcastRepository) {
        this.broadcastRepository = broadcastRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BroadcastMessage>>> getAllBroadcasts() {
        return ResponseEntity.ok(ApiResponse.ok(broadcastRepository.findAllByOrderBySentAtDesc()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BroadcastMessage>> sendBroadcast(@RequestBody BroadcastMessage broadcast) {
        if (broadcast.getMessage() == null || broadcast.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Message content is required"));
        }
        if (broadcast.getAudience() == null || broadcast.getAudience().trim().isEmpty()) {
            broadcast.setAudience("All citizens");
        }
        if (broadcast.getChannel() == null || broadcast.getChannel().trim().isEmpty()) {
            broadcast.setChannel("SMS");
        }
        BroadcastMessage saved = broadcastRepository.save(broadcast);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Broadcast transmitted successfully", saved));
    }
}
