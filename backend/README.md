# SmartTask — Backend (Phase 1)

Backend for the SmartTask task management application, built with **Node.js**, **Express.js**, and **MongoDB** (via Mongoose).

## Phase 1 scope

- ✅ Project structure with organized folders (config, models, controllers, routes, middleware)
- ✅ Required dependencies installed (Express, Mongoose, CORS, dotenv)
- ✅ MongoDB connection setup (local or Atlas via `MONGODB_URI`)
- ✅ Basic CRUD API endpoints for task management

## Project structure

```
backend/
├── server.js                 # Entry point: loads env, connects DB, starts server
├── .env                      # Local environment variables (not committed)
├── .env.example              # Template for environment variables
└── src/
    ├── app.js                # Express app + middleware + route mounting
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── models/
    │   └── Task.js           # Task Mongoose schema/model
    ├── controllers/
    │   └── taskController.js # CRUD logic
    ├── routes/
    │   └── taskRoutes.js     # /api/tasks routes
    └── middleware/
        └── errorHandler.js   # 404 + centralized error handling
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment. Copy the example and edit if needed:
   ```bash
   cp .env.example .env
   ```
   Set `MONGODB_URI` to either:
   - Local MongoDB: `mongodb://127.0.0.1:27017/smarttask`
   - MongoDB Atlas: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/smarttask`

3. Run the server:
   ```bash
   npm run dev    # development (auto-reload with nodemon)
   npm start      # production
   ```

The server runs on `http://localhost:5000`.

## API endpoints

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/api/tasks`     | Create a task       |
| GET    | `/api/tasks`     | Get all tasks       |
| GET    | `/api/tasks/:id` | Get a task by id    |
| PUT    | `/api/tasks/:id` | Update a task       |
| DELETE | `/api/tasks/:id` | Delete a task       |

### Task fields

| Field       | Type   | Notes                                        |
|-------------|--------|----------------------------------------------|
| title       | String | required                                     |
| description | String | optional                                     |
| status      | String | `pending` \| `in-progress` \| `completed`    |
| deadline    | Date   | optional                                     |

### Example: create a task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish Phase 1","description":"Set up backend","status":"in-progress","deadline":"2026-07-20"}'
```
