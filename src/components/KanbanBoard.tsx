import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Bot } from 'lucide-react';
import { tasks as tasksAPI } from '../lib/api';
import type { Project, Task } from '../lib/types';
import { TaskCard } from './TaskCard';
import { AIAssistant } from './AIAssistant';

interface KanbanBoardProps {
  project: Project;
  onBack: () => void;
}

type TaskStatus = 'todo' | 'in_progress' | 'done';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'from-slate-600 to-slate-700' },
  { id: 'in_progress', title: 'In Progress', color: 'from-amber-600 to-orange-600' },
  { id: 'done', title: 'Done', color: 'from-emerald-600 to-green-600' },
];

export function KanbanBoard({ project, onBack }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [project._id]);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getAll(project._id);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const createTask = async (status: TaskStatus) => {
    if (!newTaskTitle.trim()) return;

    try {
      const maxPosition = Math.max(
        ...tasks.filter((t) => t.status === status).map((t) => t.position),
        -1
      );

      const newTask = await tasksAPI.create(
        project._id,
        newTaskTitle,
        newTaskDesc,
        status,
        maxPosition + 1
      );

      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setShowNewTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async () => {
    if (!editingTask || !newTaskTitle.trim()) return;

    try {
      const updatedTask = await tasksAPI.update(editingTask._id, {
        title: newTaskTitle,
        description: newTaskDesc,
      });

      setTasks(
        tasks.map((t) =>
          t._id === editingTask._id
            ? { ...t, title: newTaskTitle, description: newTaskDesc }
            : t
        )
      );
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: TaskStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await tasksAPI.update(draggedTask._id, { status: newStatus });

      setTasks(
        tasks.map((t) =>
          t._id === draggedTask._id ? { ...t, status: newStatus } : t
        )
      );
      setDraggedTask(null);
    } catch (error) {
      console.error('Error updating task status:', error);
      setDraggedTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-gray-400 mt-1">{project.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAI(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg transition font-medium shadow-lg hover:bg-gray-500"
          >
            <Bot className="w-5 h-5" />
            AI Assistant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className="bg-gray-900/30 rounded-xl p-4 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
                  <h3 className="font-semibold text-white">{column.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
                <button
                  onClick={() => setShowNewTask(column.id)}
                  className="text-gray-400 hover:text-cyan-400 p-1 hover:bg-gray-800/50 rounded transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className="cursor-move"
                    >
                      <TaskCard
                        task={task}
                        onDelete={deleteTask}
                        onEdit={handleEditTask}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showNewTask || editingTask) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter task title..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Add details..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowNewTask(null);
                    setEditingTask(null);
                    setNewTaskTitle('');
                    setNewTaskDesc('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? updateTask : () => createTask(showNewTask!)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition font-medium"
                >
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAI && (
        <AIAssistant
          projectId={project._id}
          tasks={tasks}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}
