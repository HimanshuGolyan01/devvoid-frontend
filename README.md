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

Copy `server/.env.example` to `server/.env` and set:

```env
MONGODB_URI=mongodb://localhost:27017/devvoid
GEMINI_API_KEY=your_gemini_key_here
PORT=3001
```

**MongoDB Options:**
- Local: `mongodb://localhost:27017/devvoid`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/devvoid`

### 3. Run the App

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
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

## Project Structure

```
├── src/               # Frontend React app
│   ├── components/    # UI components
│   ├── lib/          # API client & types
│   └── App.tsx
├── server/           # Backend Express API
│   ├── models/       # Mongoose models
│   ├── server.js     # Main server file
│   └── .env         # Environment config
└── README.md
```

## Database Models

**Project:** `_id`, `name`, `description`, `userId`, `createdAt`
**Task:** `_id`, `projectId`, `title`, `description`, `status`, `position`, `createdAt`

## Notes

- Demo AI responses work without Gemini API key
- No authentication required - everyone shares same data
- Drag tasks between columns to change status
- Perfect for personal use or small teams

## License

MIT
