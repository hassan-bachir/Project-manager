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
- A Brevo account & API key
- Git CLI

---

## ⚙️ Setup & Run Locally

1. **Clone** and **install**

   ```bash
   git clone https://github.com/hassan-bachir/Project-manager
   cd project-manager
   npm install

   ```

2. **Environment Variables**

- Copy .env.example to .env and fill in:

  ```bash
  DATABASE_URL="postgresql://postgres:<PASSWORD>@localhost:5432/<DATABASE_NAME>"
  JWT_SECRET=<YOUR_KEY>
  SENDINBLUE_API_KEY=<BREVO_API_KEY>
  EMAIL_FROM='{"name":"<YOUR_NAME>","<YOUR_EMAIL>"}'
  PORT=<SERVER_PORT>
  ```

3. **Database Migration**

```bash
  npx prisma migrate dev --name init
```

4. **Start the server**

```bash
  npm run dev
```

5. **View interactive API docs**

- Open your browser at:

```bash
  http://localhost:3000/docs
```

## 🧪 Running Tests

- We use Mocha + Chai + Sinon for unit & integration tests.

```bash
  npm test
```

## 📁 Project Structure

```bash
  project-manager/
├─ prisma/                   # Prisma schema & migrations
├─ src/
│  ├─ controllers/           # Business logic
│  ├─ routes/                # Fastify route definitions
│  ├─ schemas/               # JSON‑Schemas for validation & docs
│  ├─ plugins/               # Fastify plugins (db, ws, scheduler, etc.)
│  ├─ services/              # Email service, etc.
│  ├─ utils/                 # Helpers (auth, error handler)
│  └─ index.js               # App entrypoint
├─ tests/                    # Unit & integration tests
├─ uploads/                  # File attachments storage
├─ .env.example              # Example environment variables
├─ README.md                 # This file
└─ package.json              # NPM scripts & dependencies

```

## 🔗 Useful Endpoints

- Auth

POST /auth/register

POST /auth/login

Projects

GET /projects?search=

POST /projects

GET /projects/:id

PUT /projects/:id

DELETE /projects/:id

Tasks

GET /projects/:projectId/tasks

POST /projects/:projectId/tasks

PUT /tasks/:id

DELETE /tasks/:id

Comments

GET /tasks/:taskId/comments

POST /tasks/:taskId/comments

Attachments

POST /tasks/:taskId/attachments

Analytics

GET /analytics/overview

GET /analytics/users/:id/stats

Docs

Swagger UI: GET /docs

Raw spec: GET /documentation/json
