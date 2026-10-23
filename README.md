# 🚀 WorkSphere

<div align="center">

![WorkSphere Banner](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**A Modern, Multi-Tenant Collaborative Project & Task Management Platform.**

*Architected as a TypeScript Modular Monolith with strict tenant data isolation, RFC-compliant security, and high-performance reactive UI.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3068b7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

[Features](#-key-features) • [Architecture](#-architectural-highlights) • [Tech Stack](#-tech-stack) • [Quick Start](#-getting-started) • [API & Security](#-security--rate-limiting) • [Author](#-author)

</div>

---

## 📖 Overview

**WorkSphere** is a production-grade collaborative workspace designed to streamline project tracking and task orchestration for multi-member teams. Built with a focus on clean engineering, end-to-end type safety, and domain-driven separation of concerns.

---

## 🏛️ Architectural Highlights

### 1. Modular Monolith Backend
Instead of a scattered MVC pattern or microservice premature complexity, the backend is organized into **domain-driven autonomous modules** (`auth`, `organizations`, `projects`, `tasks`, `dashboard`). Each module encapsulates its own:
- Routes & Controllers
- Service Layer (business logic)
- Strict Validation Schemas (via **Zod**)

```
backend/src/modules/
├── auth/           # Authentication, session issuance, password hashing
├── organizations/  # Multi-tenant workspace management & member access
├── projects/       # Project scoping, status lifecycles, and metadata
├── tasks/          # Kanban task workflows, assignment & priorities
└── dashboard/      # Aggregated tenant statistics and activity feeds
```

### 2. Multi-Tenancy & Strict Data Isolation
- Every database entity (`User`, `Project`, `Task`) is bound to an `organizationId`.
- Database queries executed through **Prisma ORM** strictly scope reads and writes within the active tenant's context, preventing cross-tenant data leaks by design.

### 3. Production Security & IETF Rate Limiting
- **Brute-Force & DoS Shield:** Configured with `express-rate-limit` using the standardized **IETF `draft-7` headers** (`RateLimit-Policy`, `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
- **HTTP-Only Cookies & JWT:** Authentication tokens stored securely in `HttpOnly`, `SameSite` cookies to defend against XSS attacks.
- **Strict Payload Validation:** Every incoming HTTP body, parameter, and query is validated at runtime using **Zod** before hitting controllers.

---

## ✨ Key Features

- 🏢 **Multi-Tenant Workspaces:** Create and manage distinct organizations with granular membership.
- 📋 **Interactive Kanban Board:** Drag-and-drop or status-driven task pipeline (`TODO`, `IN_PROGRESS`, `DONE`) with custom delete-confirmation modals.
- 🎯 **Advanced Task Filtering:** Filter tasks instantly by assignee, search term, and priority levels (`LOW`, `MEDIUM`, `HIGH`).
- ⚡ **Optimistic & Cached State:** Real-time UI updates powered by **TanStack Query (React Query)** with zero unnecessary refetches.
- 🎨 **Creative UI & GSAP Motion:** Modern Bento-grid layouts, floating badges, and smooth scroll animations built with **GSAP** and **Tailwind CSS v4**.
- ⚙️ **Workspace Settings:** Customizable workspace branding, member invitation workflows, and role visibility.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite (Fast HMR)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Class Variance Authority (`cva`)
- **Server State:** TanStack React Query v5
- **Global Client State:** Zustand
- **Animations:** GSAP 3 + `@gsap/react`
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express 5
- **Language:** TypeScript (executed with `tsx`)
- **Database & ORM:** PostgreSQL + Prisma ORM v6
- **Validation:** Zod
- **Security:** Helmet, CORS, Cookie-Parser, Bcrypt.js, JsonWebToken, Express Rate Limit (draft-7)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or hosted e.g. Neon, Supabase)
- [pnpm](https://pnpm.io/) or `npm`

### 1. Clone the repository
```bash
git clone https://github.com/Samir-ibourki/WorkSphere.git
cd WorkSphere
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/worksphere_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

Run Prisma migrations & generate the client:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:
```bash
npm run dev
# Backend running on http://localhost:5000
```

### 3. Configure Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🛡️ Security & Rate Limiting

The application applies targeted rate limiters to prevent API abuse:

| Endpoint | Window | Max Requests | RFC Standard | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/*` | 15 mins | 10 reqs | IETF Draft-7 | Brute-force & credential stuffing defense |
| `/api/*` | 15 mins | 100 reqs | IETF Draft-7 | API DoS & scraping mitigation |

---

## 📂 Project Structure

```
WorkSphere/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment variables & constants
│   │   ├── middleware/      # Auth, error handling, rate limiting (RFC draft-7)
│   │   ├── modules/         # Modular Monolith feature domains
│   │   │   ├── auth/
│   │   │   ├── organizations/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── dashboard/
│   │   ├── prisma/          # Prisma schema & DB client
│   │   └── server.ts        # Express app bootstrap
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components & modals
│   │   ├── context/         # Auth & global context providers
│   │   ├── hooks/           # Custom TanStack Query hooks
│   │   ├── pages/           # Landing, Dashboard, Board, Settings, Auth
│   │   ├── store/           # Zustand state slices
│   │   └── App.tsx          # Client routing
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 👨‍💻 Author

**Samir Ibourki**
- LinkedIn: [Samir Ibourki](https://www.linkedin.com/in/samir-ibourki)
- Portfolio: [samiribourki.dev](https://github.com/Samir-ibourki)
- Email: [samiribourki7@gmail.com](mailto:samiribourki7@gmail.com)

---

<div align="center">
⭐ If you find this project interesting, feel free to give it a star on GitHub!
</div>
