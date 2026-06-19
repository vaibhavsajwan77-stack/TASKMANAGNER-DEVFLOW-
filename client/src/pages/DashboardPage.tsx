import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import type { Project } from '../types';
import { Spinner, EmptyState, Alert, Modal } from '../components/ui';
import Navbar from '../components/ui/Navbar';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setFormError('Project name is required.');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      const project = await projectApi.create(form.name.trim(), form.description.trim());
      setProjects((prev) => [project, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await projectApi.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Projects</h1>
            <p className="text-gray-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + New Project
          </button>
        </div>

        {/* Error */}
        {error && <Alert message={error} />}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No projects yet"
            description="Create your first project to get started"
            action={
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Create Project
              </button>
            }
          />
        ) : (
          /* Project grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="card cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 group"
              >
                {/* Colour accent bar */}
                <div className="w-8 h-1.5 bg-blue-500 rounded-full mb-4" />

                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                  {project.name}
                </h3>

                {project.description && (
                  <p className="text-gray-400 text-sm mt-1.5 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-5">
                  <span className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => handleDelete(project._id, e)}
                    className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <Modal title="Create New Project" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {formError && <Alert message={formError} />}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Project Name *
              </label>
              <input
                className="input-field"
                placeholder="e.g. E-Commerce App"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Brief description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleCreate}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Spinner size="sm" /> Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
