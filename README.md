# 🚀 Project Manager API

A real‑time SaaS backend for project collaboration, built with **Fastify**, **PostgreSQL**, and **Prisma**.

Teams can manage projects & tasks, collaborate via comments & attachments, see real‑time updates, and get email notifications.

---

## 🔑 Features

- **Authentication & RBAC**: JWT‑based login, Admin vs User roles
- **Projects & Tasks**: CRUD APIs, plus search & filtering
- **Real‑Time Updates**: WebSocket notifications for task events
- **Task History**: Audit trail of every change
- **Comments**: In‑app discussion threads on tasks
- **Attachments**: File upload & serve via multipart + static plugin
- **Notifications**:
  - On assignment: email via Brevo
  - “Due Soon”: daily reminder via cron
- **Analytics**: Overview & per‑user stats endpoints
- **Validation & Docs**: Fastify JSON‑Schemas + Swagger UI
- **Testing**: Mocha/Chai/Sinon unit tests, aiming for ≥ 80% coverage

---

## 🛠️ Tech Stack & Libraries

- **Node.js** & **Fastify**
- **PostgreSQL** (via Prisma ORM)
- **Real‑Time**: `@fastify/websocket`
- **Validation & Docs**: `@fastify/swagger`, `@fastify/swagger-ui`, JSON‑Schemas
- **File Upload**: `@fastify/multipart`, `@fastify/static`
- **Scheduling**: `node-cron`
- **Email**: Brevo (formerly Sendinblue)
- **Auth**: `jsonwebtoken`, `bcrypt`
- **Env**: `dotenv`
- **Testing**: `mocha`, `chai`, `sinon`
- **Code Quality**: Prettier + ESLint

---

## 📋 Prerequisites

- Node.js v16 or newer
- PostgreSQL v12+ running locally
- (Optional) Redis on `localhost:6379` for caching
- A Brevo account & API key
- Git CLI

---
