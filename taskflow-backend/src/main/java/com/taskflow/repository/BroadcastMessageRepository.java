package com.taskflow.repository;

import com.taskflow.model.BroadcastMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BroadcastMessageRepository extends JpaRepository<BroadcastMessage, Long> {
    List<BroadcastMessage> findAllByOrderBySentAtDesc();
}
