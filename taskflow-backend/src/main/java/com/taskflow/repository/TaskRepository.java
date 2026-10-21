package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY " +
           "CASE WHEN t.dueDate IS NULL THEN 1 ELSE 0 END, t.dueDate ASC, t.createdAt DESC")
    List<Task> searchTasks(@Param("status") TaskStatus status,
                           @Param("priority") TaskPriority priority,
                           @Param("search") String search);

    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :currentDate AND t.status <> com.taskflow.model.TaskStatus.COMPLETED")
    long countOverdueTasks(@Param("currentDate") LocalDate currentDate);
}
