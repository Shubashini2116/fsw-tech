package com.taskflow.repository;

import com.taskflow.model.ReliefCamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReliefCampRepository extends JpaRepository<ReliefCamp, Long> {
    List<ReliefCamp> findByZone(String zone);
}
