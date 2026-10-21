package com.taskflow.service;

import com.taskflow.dto.DashboardStatsResponse;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final AuthService authService;

    public TaskService(TaskRepository taskRepository, AuthService authService) {
        this.taskRepository = taskRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(TaskStatus status, TaskPriority priority, String search) {
        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        List<Task> tasks = taskRepository.searchTasks(status, priority, trimmedSearch);
        return tasks.stream().map(TaskResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found with id: " + id));
        return TaskResponse.fromEntity(task);
    }

    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());

        Optional<User> currentUser = authService.getCurrentAuthenticatedUser();
        currentUser.ifPresent(task::setUser);

        Task saved = taskRepository.save(task);
        return TaskResponse.fromEntity(saved);
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription().trim());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        Task updated = taskRepository.save(task);
        return TaskResponse.fromEntity(updated);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long total = taskRepository.count();
        long todo = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completed = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long overdue = taskRepository.countOverdueTasks(LocalDate.now());

        return new DashboardStatsResponse(total, todo, inProgress, completed, overdue);
    }
}
