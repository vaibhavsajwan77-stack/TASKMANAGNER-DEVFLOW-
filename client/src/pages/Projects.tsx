import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../services/projectService';

interface Project {
  _id: string;
  name: string;
  description?: string;
  status: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(name, description);
      setName('');
      setDescription('');
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">DevFlow</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm">
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Projects</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + New Project
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects yet. Create one!</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{project.status}</span>
                </div>
                {project.description && <p className="text-gray-400 text-sm mb-4">{project.description}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/tasks?projectId=${project._id}`)}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    View Tasks →
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;