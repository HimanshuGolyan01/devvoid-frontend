import { GripVertical, Trash2, Edit2 } from 'lucide-react';
import type { Task } from '../lib/types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className="bg-gray-900/80 border border-white rounded-lg p-4 mb-3 group hover:border-cyan-500/50 transition-all shadow-sm hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="text-gray-600 cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium mb-2">{task.title}</h4>
          {task.description && (
            <p className="text-gray-400 text-sm line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-cyan-400 p-1.5 hover:bg-cyan-500/10 rounded transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
