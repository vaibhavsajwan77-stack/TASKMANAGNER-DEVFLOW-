import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { getProjects } from '../services/projectService';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project: string;
}

interface Project {
  _id: string;
  name: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const pid = searchParams.get('projectId') || undefined;
      const data = await getTasks(pid);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    getProjects().then(setProjects);
    const pid = searchParams.get('projectId');
    if (pid) setProjectId(pid);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({ title, description, project: projectId, priority });
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateTask(id, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const priorityColor: any = {
    low: 'text-green-400 bg-green-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    high: 'text-red-400 bg-red-500/10',
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
          <h2 className="text-3xl font-bold">Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + New Task
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              rows={2}
            />
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-400">No tasks yet. Create one!</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold mb-1">{task.title}</h3>
                  {task.description && <p className="text-gray-400 text-sm mb-2">{task.description}</p>}
                  <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="bg-gray-800 text-white text-sm border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-300 text-sm"
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

export default Tasks;