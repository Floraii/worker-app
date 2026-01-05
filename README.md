**Task system (Spring Boot + React)**

This is a small full stack demo with a Spring Boot REST API and a React (Vite) frontend.

Project structure
- backend/   Spring Boot API (Maven)
- frontend/  React app (Vite)

Run locally

Backend
1) Open a terminal in the backend/ folder
2) Run:
   ./mvnw spring-boot:run
API: http://localhost:8080


Frontend
1) Open a terminal in the frontend/ folder
2) Run:
   npm install
   npm run dev
Frontend: http://localhost:5173

The frontend uses /api/* endpoints.
In development Vite proxies /api to http://localhost:8080.

API endpoints

Tasks
- GET    /api/tasks
- POST   /api/tasks
- PATCH  /api/tasks/{id}/status
- DELETE /api/tasks/{id}

Workers
- GET    /api/workers
- POST   /api/workers
- DELETE /api/workers/{id}

Notes
- Demo project intended for local use.
- Sample data is inserted on startup if the database is empty.
