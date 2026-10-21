# TaskFlow – Task Management System (Full-Stack)

A modern full-stack task management system with a dark-theme responsive UI connected to a Java Spring Boot 3 REST API and MySQL database.

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3, ES6+ JavaScript (no build step needed)
- **Backend:** Java 21, Spring Boot 3.4.2 (Spring Data JPA, Hibernate, Spring Security, JWT)
- **Database:** MySQL 8.0 (`taskflow_db`)

## Features
1. **Full Task CRUD:** Create, view, edit, and delete tasks with real-time updates.
2. **Task Statuses:** To Do (`TODO`), In Progress (`IN_PROGRESS`), Completed (`COMPLETED`).
3. **Task Priorities:** Low (`LOW`), Medium (`MEDIUM`), High (`HIGH`).
4. **Due Dates & Overdue Tracking:** Highlights overdue tasks with warning badges and banner alerts.
5. **Real-Time Dashboard:** Overview showing Total, To Do, In Progress, Completed, and Overdue task counts with completion progress bars.
6. **Search & Filter:** Live keyword search and filtering by status and priority.
7. **Authentication:** User registration and login using BCrypt password hashing and JWT tokens stored in localStorage.
8. **Permanent MySQL Persistence:** All changes persist directly in MySQL `taskflow_db`.

## How to Run

### 1. Backend (Spring Boot)
Ensure MySQL is running, then navigate to `taskflow-backend`:
```powershell
cd taskflow-backend
.\mvnw.cmd spring-boot:run
```
Or run the packaged JAR:
```powershell
java -jar target/taskflow-backend-0.0.1-SNAPSHOT.jar
```
Backend runs on `http://localhost:8080`.

### 2. Frontend
Open `resq/index.html` in your favorite browser (e.g. Chrome, Edge, Firefox). No build step required!

### 3. Demo Credentials
- **Username:** `admin`
- **Password:** `admin123`
*(You can also register a new account anytime via the user button in the top right)*
