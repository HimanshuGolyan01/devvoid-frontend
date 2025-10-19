export interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  position: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface TaskList {
  Tasks: Task[]
}
