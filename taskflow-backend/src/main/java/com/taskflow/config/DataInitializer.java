package com.taskflow.config;

import com.taskflow.model.*;
import com.taskflow.repository.*;
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
                                      VolunteerRepository volunteerRepository,
                                      ReliefCampRepository reliefCampRepository,
                                      IncidentRepository incidentRepository,
                                      BroadcastMessageRepository broadcastRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User demoUser = new User("admin", "admin@taskflow.dev", passwordEncoder.encode("admin123"));
                userRepository.save(demoUser);
            }

            if (taskRepository.count() == 0) {
                User user = userRepository.findByUsername("admin").orElse(null);

                Task t1 = new Task("Setup MySQL Database Schema", "Create relational tables for tasks, volunteers, camps, and users with foreign keys.", TaskStatus.COMPLETED, TaskPriority.HIGH, LocalDate.now().minusDays(2));
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

            if (volunteerRepository.count() == 0) {
                volunteerRepository.save(new Volunteer("Arjun K", "Boat rescue", "Velachery", "available", "+91-9876543210"));
                volunteerRepository.save(new Volunteer("Meena R", "First aid", "Tambaram", "busy", "+91-9876543211"));
                volunteerRepository.save(new Volunteer("Karthik S", "Logistics", "Adyar", "available", "+91-9876543212"));
                volunteerRepository.save(new Volunteer("Divya P", "Counselling", "Mudichur", "available", "+91-9876543213"));
                volunteerRepository.save(new Volunteer("Ravi M", "Driver · truck", "Perungudi", "busy", "+91-9876543214"));
                volunteerRepository.save(new Volunteer("Fathima A", "Medical", "Pallikaranai", "available", "+91-9876543215"));
            }

            if (reliefCampRepository.count() == 0) {
                reliefCampRepository.save(new ReliefCamp("Govt. School Camp", "Velachery", 400, 352));
                reliefCampRepository.save(new ReliefCamp("Community Hall", "Tambaram", 250, 140));
                reliefCampRepository.save(new ReliefCamp("Church Shelter", "Mudichur", 180, 171));
                reliefCampRepository.save(new ReliefCamp("College Auditorium", "Adyar", 600, 210));
            }

            if (incidentRepository.count() == 0) {
                incidentRepository.save(new Incident(190, 250, "inc", "Flooding · Velachery", "Water level 1.4 m. Boats deployed."));
                incidentRepository.save(new Incident(340, 170, "inc", "Road cut-off · Tambaram", "Medical request pending. Teams en route."));
                incidentRepository.save(new Incident(110, 180, "cmp", "Community Hall", "140 / 250 occupied. Food packets available."));
                incidentRepository.save(new Incident(250, 320, "cmp", "Govt. School Camp", "352 / 400 occupied. Nearly full."));
                incidentRepository.save(new Incident(400, 300, "cmp", "College Auditorium", "210 / 600 occupied. Medical team stationed."));
                incidentRepository.save(new Incident(230, 215, "vol", "Team Alpha (4)", "En route to Velachery."));
                incidentRepository.save(new Incident(320, 240, "vol", "Team Bravo (3)", "Standing by, Adyar."));
            }

            if (broadcastRepository.count() == 0) {
                broadcastRepository.save(new BroadcastMessage("All citizens", "SMS", "Emergency advisory: Heavy rainfall warning in coastal zones. Please heed instructions from local rescue teams."));
            }
        };
    }
}
