# 🌿 Freshopia — Premium Indian Grocery Quick-Commerce

Freshopia is a state-of-the-art, full-stack Quick-Commerce platform designed for the modern Indian consumer. Migrated from a Python/FastAPI backend to a robust **Java Spring Boot** architecture, Freshopia delivers an enterprise-grade shopping experience featuring bento-style layouts, glassmorphic UI elements, and persistent H2 database storage.

---

## ✨ Key Features

### 🛍️ Smart Shopping Experience
- **Bento-Grid Catalog**: A clean, modern product display optimized for visual discovery.
- **Dynamic Cart Drawer**: Real-time billing calculation with automatic free delivery thresholds.
- **AI-Powered Upselling**: Smart suggestions based on your cart contents (e.g., suggesting Rice when you buy Masalas).
- **Freshness Badges**: Real-time farm-to-table metadata for organic produce.

### 🔐 Secure Authentication & Orders
- **Persistent Auth Flow**: Secure Login and Registration system with session persistence.
- **Persistent Storage**: All user data, products, and orders are stored in a local **H2 Database**, ensuring data survives server restarts.
- **Order History**: Track your past fresh deliveries with the "My Orders" dashboard.
- **Premium Checkout**: A glassmorphic checkout flow with address validation and UPI/Card options.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Java Spring Boot 3.2.x
- **Data Access**: Spring Data JPA
- **Database**: H2 (File-based Persistence)
- **Security**: Base64 Token-based Authentication
- **Build Tool**: Maven

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** installed and configured in `PATH`.
- **Node.js 18+** & **npm** installed.

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using the provided Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server will start on `http://localhost:8080`.*

### 2. Setup Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173` (or the port shown in your terminal).*

---

## 📂 Project Structure

```text
Freshopia/
├── backend/                # Java Spring Boot Backend
│   ├── src/main/java/...  # Java Source Code
│   │   ├── controller/    # REST API Endpoints
│   │   ├── model/         # JPA Entities (Product, User, Order)
│   │   ├── repository/    # Spring Data JPA Repositories
│   │   └── service/       # Business Logic & Data Seeding
│   ├── src/main/resources/# Application Configuration
│   ├── data/              # H2 Database Storage Files
│   └── pom.xml            # Maven Dependencies
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/    # Reusable UI Components
    │   ├── context/       # Auth & State Management
    │   ├── types/         # TypeScript Definitions
    │   └── App.tsx        # Main Application Logic
    └── tailwind.config.js  # Styling Configuration
```

---

## 🛡️ Default Credentials
For testing purposes, the application is seeded with the following accounts:
- **Admin**: `admin` / `admin123`
- **User**: `user` / `pass123`

---

## 👨‍💻 Author
**Digvijay Patil**  
*Full-Stack Engineer*

---
*Built with ❤️ for the Indian Grocery Ecosystem.*
