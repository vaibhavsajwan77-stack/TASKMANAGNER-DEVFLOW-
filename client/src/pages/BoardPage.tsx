import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import type { Project, Task, TaskStatus } from '../types';
import KanbanColumn from '../components/board/KanbanColumn';
import AddTaskModal from '../components/board/AddTaskModal';
import Navbar from '../components/ui/Navbar';
import { Spinner, Alert } from '../components/ui';

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in-progress' },
  { title: 'Done', status: 'done' },
];

const BoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const [proj, taskList] = await Promise.all([
          projectApi.getById(projectId),
          taskApi.getByProject(projectId),
        ]);
        setProject(proj);
        setTasks(taskList);
      } catch {
        setError('Failed to load board. Project may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Update a task's status locally (optimistic UI)
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Remove deleted task from state
  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  // Add newly created task to state
  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Filter tasks by column status
  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {project?.name || 'Board'}
              </h1>
              {project?.description && (
                <p className="text-gray-400 text-sm">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Task count badges */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span>{tasks.length} total tasks</span>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="btn-primary"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <Alert message={error} />}

        {/* Kanban columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map(({ title, status }) => (
            <KanbanColumn
              key={status}
              title={title}
              status={status}
              tasks={getColumnTasks(status)}
              onStatusChange={handleStatusChange}
              onDelete={handleTaskDelete}
              onAddTask={() => setShowAddTask(true)}
            />
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-6 flex gap-4 text-xs text-gray-500">
          <span>✅ Done: {getColumnTasks('done').length}</span>
          <span>⚙️ In Progress: {getColumnTasks('in-progress').length}</span>
          <span>📝 To Do: {getColumnTasks('todo').length}</span>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddTask && projectId && (
        <AddTaskModal
          projectId={projectId}
          onClose={() => setShowAddTask(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default BoardPage;
