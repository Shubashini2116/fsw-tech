package com.taskflow.config;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(TaskRepository taskRepository,
                                     UserRepository userRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User demoUser = new User("admin", "admin@taskflow.dev", passwordEncoder.encode("admin123"));
                userRepository.save(demoUser);
            }

            if (taskRepository.count() == 0) {
                User user = userRepository.findByUsername("admin").orElse(null);

                Task t1 = new Task("Setup MySQL Database Schema", "Create relational tables for tasks and users with foreign keys.", TaskStatus.COMPLETED, TaskPriority.HIGH, LocalDate.now().minusDays(2));
                t1.setUser(user);

                Task t2 = new Task("Implement Spring Boot REST APIs", "Build controllers and services for task CRUD and auth endpoints.", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, LocalDate.now().plusDays(1));
                t2.setUser(user);

                Task t3 = new Task("Connect Frontend to Backend", "Replace mock client arrays with fetch() calls to REST API endpoints.", TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, LocalDate.now().plusDays(2));
                t3.setUser(user);

                Task t4 = new Task("Implement Overdue Task Alert Banner", "Highlight tasks past their due date and show warning metrics.", TaskStatus.TODO, TaskPriority.HIGH, LocalDate.now().minusDays(1));
                t4.setUser(user);

                Task t5 = new Task("User Authentication & JWT Storage", "Enable login, registration, and save token in localStorage.", TaskStatus.TODO, TaskPriority.MEDIUM, LocalDate.now().plusDays(4));
                t5.setUser(user);

                Task t6 = new Task("Prepare Project Documentation", "Document API endpoints, frontend setup, and database credentials.", TaskStatus.TODO, TaskPriority.LOW, LocalDate.now().plusDays(7));
                t6.setUser(user);

                taskRepository.save(t1);
                taskRepository.save(t2);
                taskRepository.save(t3);
                taskRepository.save(t4);
                taskRepository.save(t5);
                taskRepository.save(t6);
            }
        };
    }
}
