import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { projects as projectsAPI } from '../lib/api';
import type { Project } from '../lib/types';
import { ProjectCard } from './ProjectCard';
import { KanbanBoard } from './KanbanBoard';

export function Dashboard() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjectList(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const newProject = await projectsAPI.create(newProjectName, newProjectDesc);
      setProjectList([newProject, ...projectList]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowNewProject(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsAPI.delete(id);
      setProjectList(projectList.filter((p) => p._id !== id));
      if (selectedProject?._id === id) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };


  if (selectedProject) {
    return (
      <KanbanBoard
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              Ai Project Manager
            </h1>
            <p className="text-gray-400">Manage your projects with AI assistance</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading projects...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => setShowNewProject(true)}
                className="bg-gray-900/50 border-2 border-dashed border-white rounded-xl p-6 hover:border-cyan-500/150 transition-all cursor-pointer flex items-center justify-center min-h-[200px] group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500/20 transition">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition" />
                  </div>
                  <p className="text-gray-400 group-hover:text-cyan-400 transition font-medium">
                    New Project
                  </p>
                </div>
              </div>

              {projectList.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  onDelete={deleteProject}
                />
              ))}
            </div>

            {projectList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No projects yet. Create your first project!</p>
              </div>
            )}
          </>
        )}
      </div>

      {showNewProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white rounded-lg text-white"
                  placeholder="My Awesome Project"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName('');
                    setNewProjectDesc('');
                  }}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg transition font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
