import { Folder, Calendar, Trash2 } from 'lucide-react';
import type { Project } from '../lib/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onClick, onDelete }: ProjectCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      onDelete(project._id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-white rounded-xl p-6 hover:border-cyan-500/200 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Folder className="w-5 h-5 text-white" />
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-2 hover:bg-red-500/10 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition">
        {project.name}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      <div className="flex items-center text-gray-500 text-xs">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
