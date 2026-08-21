# Mini Appointment App (Ooca Full Stack Developer Intern Assessment)

A single-page appointment management application built with **Next.js**, **NestJS**, **PostgreSQL**, **Prisma ORM**, and **Docker**.

---

## 1. Setup and Run Instructions

This application is fully containerized. You can launch the entire stack (PostgreSQL Database, NestJS Backend, and Next.js Frontend) using a single Docker Compose command.

### Option A: Running with Docker Compose (Recommended for Clean Clone Testing)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jakkayy/ooca-test-internship.git
   cd ooca-test-internship
   ```

2. **Start the entire application**:
   ```bash
   docker compose up --build
   ```

3. **Access the applications**:
   - **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
   - **Backend API (NestJS)**: [http://localhost:3001](http://localhost:3001)
   - **PostgreSQL Database**: Port `5433` (container mapped)

---

### Option B: Local Development Setup (Manual Run)

#### Prerequisites
- Node.js (v18 or later) / Bun
- Docker (for PostgreSQL database)

#### Step 1: Start PostgreSQL Container
```bash
docker compose up -d postgres
```

#### Step 2: Setup and Start Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*Backend will run on [http://localhost:3001](http://localhost:3001)*

#### Step 3: Setup and Start Frontend
```bash
cd frontend
npm install # or bun install
npm run dev # or bun dev
```
*Frontend will run on [http://localhost:3000](http://localhost:3000)*

---

## 2. Tech Stack Choices and Justification

| Technology | Role | Justification |
|---|---|---|
| **Next.js (React 19 / App Router)** | Frontend Framework | Provides fast rendering, clear component structure, TypeScript integration, and clean client-side state management for single-page applications. |
| **NestJS** | Backend Framework | Offers a scalable, modular architecture with Dependency Injection, built-in validation pipes (`class-validator`), and structured controller/service/repository separation. |
| **PostgreSQL** | Database | A robust, production-grade relational database ideal for handling transactional appointment data and constraint checks. |
| **Prisma ORM (v5 Stable)** | Database Client | Type-safe database queries, auto-generated TypeScript types, and easy schema migrations (`schema.prisma`). |
| **Tailwind CSS** | Styling | Allows rapid UI development with responsive utility classes and a clean medical/healthcare aesthetic. |
| **Docker & Docker Compose** | Containerization | Guarantees consistent runtime environments across different machines, enabling single-command execution (`docker compose up --build`). |

---

## 3. What Was Not Finished & Future Improvements

While all core requirements and business logic rules (30-minute slot overlap check, status transitions, validation errors, and single-page UI) are fully implemented, given more time I would add:

1. **Authentication & Role Authorization**:
   - Add JWT-based user authentication separating Patient views from Doctor/Admin management views.
2. **Real-time Status Updates**:
   - Integrate WebSockets (NestJS Gateways / Socket.io) to instantly reflect appointment updates across multiple client screens without refreshing.
3. **Advanced Time Slot Picker UI**:
   - Replace standard HTML `datetime-local` input with an interactive 30-minute slot grid calendar showing available vs booked time slots visually.
4. **Pagination & Date Range Filtering**:
   - Add server-side pagination (`page` and `limit` query parameters) and date range filters (`startDate`, `endDate`) for scaling large volumes of appointments.
5. **Comprehensive End-to-End Automated Testing**:
   - Expand Jest E2E tests for API endpoints and Playwright/Cypress UI integration testing.

---

## 4. AI Tools Usage Disclosure

AI tools (Antigravity AI Assistant) were utilized during the development of this assessment to assist with:
- Drafting project architecture recommendations and implementation checklists.
- Boilerplate generation for NestJS DTOs, Prisma schema configuration, and Tailwind CSS components.
- Diagnosing environment compatibility issues (e.g. Alpine Linux OpenSSL dependencies for Prisma binary engines in Docker).
