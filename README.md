# ✓ SmartTask

A full-stack **MERN** task-management application. Users can sign up, log in, and
manage their own tasks — create, edit, complete, delete, and filter/sort them —
all backed by a secure JWT-authenticated REST API.

> **Monorepo:** the Express/MongoDB API lives in [`backend/`](./backend) and the
> React (Vite) client lives in [`frontend/`](./frontend).

---

## ✨ Features

- **Authentication** — register & log in with JSON Web Tokens (JWT); passwords
  hashed and salted with bcrypt.
- **Personal tasks** — every task is scoped to its owner; you only see your own.
- **Full CRUD** — create, read, update, and delete tasks.
- **Quick actions** — one-click "mark complete" toggle and inline editing.
- **Deadlines** — set due dates; overdue tasks are highlighted.
- **Filter & sort** — search by text, filter by status, sort by date/deadline/title.
- **Live stats** — running counts of pending / in-progress / completed tasks.
- **Polished UX** — responsive design, status badges, and toast notifications.
- **Hardened API** — Helmet security headers, rate-limited auth, and request validation.

## 🛠 Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | React, Vite                                       |
| Backend   | Node.js, Express                                  |
| Database  | MongoDB (Mongoose ODM)                            |
| Auth      | JWT, bcrypt                                        |
| Security  | Helmet, express-rate-limit, express-validator     |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000
```

`.env` values:
```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<a long random secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```
In development the Vite dev server proxies `/api` to the backend automatically.
For production, set `VITE_API_URL` to your deployed backend (see `.env.example`).

Open **http://localhost:5173**, create an account, and start adding tasks.

---

## 📡 API Reference

Base URL: `/api`

### Auth
| Method | Endpoint          | Access  | Description                     |
|--------|-------------------|---------|---------------------------------|
| POST   | `/auth/register`  | Public  | Register, returns a JWT         |
| POST   | `/auth/login`     | Public  | Log in, returns a JWT           |
| GET    | `/auth/me`        | Private | Get the current user's profile  |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint      | Description                                   |
|--------|---------------|-----------------------------------------------|
| GET    | `/tasks`      | List your tasks (`?status=`, `?search=`, `?sortBy=`, `?order=`) |
| POST   | `/tasks`      | Create a task                                 |
| GET    | `/tasks/:id`  | Get one of your tasks                         |
| PUT    | `/tasks/:id`  | Update a task                                 |
| DELETE | `/tasks/:id`  | Delete a task                                 |

**Task fields:** `title` (required), `description`, `status`
(`pending` | `in-progress` | `completed`), `deadline`.

---

## 📁 Project Structure

```
smarttask-mern/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # auth & task logic
│   │   ├── middleware/      # auth, validation, rate-limiter, errors
│   │   ├── models/          # User & Task schemas
│   │   ├── routes/          # auth & task routes
│   │   ├── utils/           # JWT helper
│   │   └── app.js           # Express app
│   └── server.js            # entry point
└── frontend/
    └── src/
        ├── components/      # AuthForm, TaskForm, TaskList, TaskItem, TaskControls, TaskStats
        ├── context/         # ToastContext
        ├── api.js           # API client
        └── App.jsx          # root component
```

---

## 🌐 Deployment

- **Backend** → Render / Railway / Fly.io. Set `NODE_ENV=production`, `MONGODB_URI`,
  and `JWT_SECRET` as environment variables, and allow the host's IP in Atlas Network Access.
- **Frontend** → Vercel / Netlify. Set `VITE_API_URL` to the deployed backend URL
  (including `/api`), then `npm run build`.

---

Built as a phased MERN project: setup → authentication → task creation/display →
update/delete → filtering/sorting → deployment.
