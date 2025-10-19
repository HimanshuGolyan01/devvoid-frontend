# DevVoid Project Manager

A full-stack MERN Project & Task Management System with Google Gemini AI integration.

## Stack

- **Frontend:** React + TypeScript + TailwindCSS + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **AI:** Google Gemini API

## Features

- Create/manage projects and tasks
- Kanban board with drag-and-drop
- AI task summarization and Q&A
- No authentication - direct access
- Responsive dark UI

## Quick Start

### 1. Install Dependencies

Frontend:
```bash
npm install
```

Backend:
```bash
cd server
npm install
```

### 2. Configure Environment

```env
GEMINI_API_KEY=AIzaSyDY2PjRh0wsKffw5rVfNUlm3aW3ItRc9bc
MONGODB_URI = mongodb+srv://golyanhimanshu_db_user:124356890@cluster0.ab9ytyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
```


### 3. Run the App

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` and start creating projects!

## API Endpoints

**Projects:**
- GET `/api/projects` - List projects
- POST `/api/projects` - Create project
- DELETE `/api/projects/:id` - Delete project

**Tasks:**
- GET `/api/tasks/:projectId` - List tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

**AI:**
- POST `/api/ai/summarize` - Summarize tasks
- POST `/api/ai/ask` - Ask questions

