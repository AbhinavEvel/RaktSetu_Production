# 🩸 RaktSetu — Blood Bank Management System

RaktSetu is a full-stack Blood Bank Management System that connects donors, patients, and administrators on a single platform — enabling smart donor matching, real-time blood stock tracking, and emergency alert notifications.

---

## 🚀 Tech Stack

**Frontend:** React.js (Vite)
**Backend:** Spring Boot (Java)
**Database:** MySQL
**Auth:** JWT (JSON Web Tokens) + Spring Security

---

## 📁 Project Structure

```
RaktSetu/
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/raktsetu/backend/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── enums/
│       ├── security/
│       ├── exception/
│       └── config/
│
└── frontend/         # React.js client
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        ├── layouts/
        └── context/
```

---

## ✨ Key Features

- **Role-based access:** Admin, Donor, and Patient dashboards
- **Smart donor matching:** By blood group, city, availability, and 90-day donation cooldown
- **Blood inventory management:** Bag-wise tracking with component types and auto-expiry
- **Blood request handling:** Patients raise requests, admins fulfill from stock
- **Emergency alerts:** Notify eligible donors during critical shortages
- **Donation history & reports:** Track donations, generate stats
- **Secure authentication:** JWT-based login/register with Spring Security

---

## 🗄️ Database Schema (9 Tables)

`users` · `donors` · `patients` · `blood_requests` · `blood_stock` · `blood_inventory` · `donations` · `emergency_alerts` · `notifications`

---

## ⚙️ Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the example properties file and fill in your own values:
   ```bash
   cp src/main/resources/application-example.properties src/main/resources/application.properties
   ```
3. Update `application.properties` with your:
   - MySQL database URL, username, password
   - JWT secret key
   - Email (SMTP) credentials for notifications
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend runs on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

---

## 🔐 Environment Variables

Never commit `application.properties` with real credentials. Use `application-example.properties` as a template — it's tracked in the repo with placeholder values only.

---

## 👥 Team

| Member | Modules |
|---|---|
| **Utkarsh** | Auth, Donor, Donations |
| **Abhinav** | Blood Requests, Patients, Blood Stock |
| **Deepak** | Blood Inventory, Emergency Alerts, Notifications |

---

## 📌 Note

This project was developed as part of the **CDAC PGCP-AC** program.
