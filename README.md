# TaskFlow · ResQ Command (Full-Stack Emergency & Task Management System)

A production-ready, full-stack disaster response and task coordination platform built with a high-performance **Java 21 / Spring Boot 3.4.2** backend, **MySQL 8.0** relational persistence (with zero-config H2 standalone profile), and an ultra-responsive dark-theme frontend.

---

## 🌐 Live Public Deployment

- **Live Web Application:** [https://asupy-2401-4900-67c1-9fd0-5509-8101-1f27-2425.free.pinggy.net](https://asupy-2401-4900-67c1-9fd0-5509-8101-1f27-2425.free.pinggy.net)
- **Alternate Live Mirror:** [https://nrkfk-2401-4900-67c1-9fd0-5509-8101-1f27-2425.run.pinggy-free.link](https://nrkfk-2401-4900-67c1-9fd0-5509-8101-1f27-2425.run.pinggy-free.link)
- **Backend API Base:** `/api`
- **Render / Cloud Docker Deploy:** Included single-container multi-stage `Dockerfile` ready for Render, Railway, or Fly.io.

---

## 🔑 Demo Access Credentials

The database automatically seeds an administrator account upon initial startup:
- **Username:** `admin`
- **Password:** `admin123`
*(Self-registration is also supported anytime via the Account Access modal)*

---

## 🛠️ Technologies Used

### Frontend
- **HTML5 & Modern CSS3:** Custom responsive dark glassmorphism interface, CSS grid & flexbox, accessible SVG graphics.
- **ES6+ Vanilla JavaScript:** Asynchronous REST API integration (`fetch`), JWT bearer token session management in `localStorage`, dynamic modals and toast alert systems. Zero build step required.

### Backend
- **Language:** Java 21 LTS
- **Framework:** Spring Boot 3.4.2
- **Security:** Spring Security 6 with stateless JWT authentication (`jjwt 0.11.5`) and BCrypt password hashing.
- **ORM / Persistence:** Spring Data JPA & Hibernate 6.
- **Database:** MySQL 8.0 with automatic schema migration (`ddl-auto=update`), plus built-in H2 profile for zero-config local testing.
- **Packaging:** Multi-stage containerized `Dockerfile` and self-contained executable fat JAR.

---

## 🚀 Key Features

1. **Task Management & Workflow CRUD:**
   - Full lifecycle management (Create, Read, Update, Delete) for operational tasks.
   - Statuses: `TODO`, `IN_PROGRESS`, `COMPLETED`.
   - Priorities: `LOW`, `MEDIUM`, `HIGH`.
   - Live search by title/description and multi-criteria status/priority dropdown filtering.
   - One-click workflow transitions (*Start*, *Complete*, *Edit*, *Delete*).

2. **Real-Time Operational Dashboard:**
   - Live metrics summary: Total Tasks, To Do, In Progress, Completed, and Overdue counts.
   - Dynamic visual progress bars calculating completion percentages.
   - Intelligent **Overdue Task Alert Banner** detecting overdue deadlines.
   - Filtered view of urgent and high-priority pending assignments.

3. **GIS Incident Mapping:**
   - Interactive vector map visualizing active emergency zones, flooded sectors, relief shelters, and rescue personnel.
   - Interactive markers providing real-time situation reports upon click.
   - Persistent backend incident entity and REST endpoints (`/api/incidents`).

4. **Volunteer Personnel Roster:**
   - Live roster displaying emergency responders, skills (e.g. Paramedic, Boat Rescue, Logistics), assigned zones, and direct phone contact.
   - Real-time status toggling (*Available* vs. *Busy/Deployed*) with immediate database synchronization.
   - Modal for registering new volunteer personnel (`/api/volunteers`).

5. **Relief Shelters & Capacity Monitoring:**
   - Real-time occupancy tracking across relief camps with occupancy percentage meters and automatic color-coded strain warnings (>85% capacity alerts).
   - Quick adjustment controls for adding/releasing bed occupancy.
   - Modal for registering new relief shelters (`/api/camps`).

6. **Broadcast Communication Center:**
   - Multi-channel notification composer (SMS, Push Notification, Radio Bulletin).
   - Target audience selection (All Citizens, Volunteers, Camp Managers, Zone-specific).
   - Real-time transmission log with persistence across all browser sessions (`/api/broadcasts`).

7. **Authentication & Security:**
   - User registration and login protected with salted BCrypt password hashing.
   - Stateless JWT tokens validated via custom Spring Security filter.
   - CORS policy configured for cross-origin and same-origin deployments.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/tasks` | Get all tasks (supports `?status=&priority=&search=`) | Public |
| `GET` | `/api/tasks/{id}` | Get task by ID | Public |
| `POST` | `/api/tasks` | Create new task | Optional / User |
| `PUT` | `/api/tasks/{id}` | Update task details | Public / User |
| `DELETE` | `/api/tasks/{id}` | Delete task | Public / User |
| `GET` | `/api/tasks/dashboard` | Aggregated dashboard metrics | Public |
| `GET` | `/api/volunteers` | List all volunteer personnel | Public |
| `POST` | `/api/volunteers` | Register a new volunteer | Public |
| `PUT` | `/api/volunteers/{id}/toggle` | Toggle volunteer status (available/busy) | Public |
| `GET` | `/api/camps` | List all relief camps and capacities | Public |
| `POST` | `/api/camps` | Register a new relief shelter | Public |
| `PUT` | `/api/camps/{id}/occupancy` | Update shelter occupancy count | Public |
| `GET` | `/api/incidents` | List all GIS map incidents | Public |
| `GET` | `/api/broadcasts` | List sent broadcast alerts | Public |
| `POST` | `/api/broadcasts` | Transmit and log a new emergency alert | Public |

---

## 💻 How to Run Locally

### Prerequisites
- Java 21+ installed
- MySQL 8.0+ running (or use standalone H2 profile)

### Option A: Running with Maven Wrapper
```powershell
# 1. Clone the repository
git clone https://github.com/Shubashini2116/fsw-tech.git
cd fsw-tech/taskflow-backend

# 2. Run backend (uses MySQL by default, or append -Dspring-boot.run.profiles=h2 for zero-config H2)
.\mvnw.cmd spring-boot:run

# 3. Access the application in your browser
http://localhost:8080
```

### Option B: Running the Packaged JAR
```powershell
cd taskflow-backend
java -jar target/taskflow-backend-0.0.1-SNAPSHOT.jar
```

### Option C: Running with Docker
```bash
docker build -t taskflow-app taskflow-backend/
docker run -p 8080:8080 -e PORT=8080 taskflow-app
```

---

## ☁️ Deployment Guide (Render / Railway)

1. **Create a new Web Service on Render:**
   - Connect your GitHub repository: `https://github.com/Shubashini2116/fsw-tech`
   - Select **Docker** environment (or Maven build).
   - Root Directory: `taskflow-backend`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/taskflow-backend-0.0.1-SNAPSHOT.jar`
2. **Environment Variables:**
   - `PORT`: `8080`
   - `DB_URL`: JDBC connection string to your MySQL or PostgreSQL cloud database (e.g. Aiven, TiDB, Render PostgreSQL).
   - `DB_USERNAME`: Database username.
   - `DB_PASSWORD`: Database password.
   - `JWT_SECRET`: A secure 256-bit string.

---

## 📄 License
This project is open-source and available under the MIT License.
