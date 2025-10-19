import { TaskList } from "./types";

const API_URL = 'https://devvoid-backend.onrender.com/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const projects = {
  getAll: () => fetchAPI('/projects'),

  create: (name: string, description: string) =>
    fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),

  delete: (id: string) =>
    fetchAPI(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

export const tasks = {
  getAll: (projectId: string) => fetchAPI(`/tasks/${projectId}`),

  create: (projectId: string, title: string, description: string, status: string, position: number) =>
    fetchAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify({ projectId, title, description, status, position }),
    }),

  update: (id: string, updates: { title?: string; description?: string; status?: string }) =>
    fetchAPI(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    fetchAPI(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export const ai = {
  summarize: (projectId: string, taskList: TaskList[]) =>
    fetchAPI('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ projectId, tasks: taskList }),
    }),

  ask: (projectId: string, taskList: TaskList[], question: string) =>
    fetchAPI('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ projectId, tasks: taskList, question }),
    }),
};
