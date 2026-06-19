import { useState } from 'react';
import { taskApi } from '../../api/taskApi';
import type { Task, TaskPriority } from '../../types';
import { Modal, Alert, Spinner } from '../ui';

interface Props {
  projectId: string;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const AddTaskModal = ({ projectId, onClose, onTaskCreated }: Props) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!form.title.trim()) {
    setError('Task title is required.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const task = await taskApi.create({
      projectId,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
    });

    if (!task) {
      throw new Error("No task returned from server");
    }

    onTaskCreated(task);
    onClose();
  } catch (err: any) {
    console.error("TASK CREATE ERROR:", err);
    setError(err?.response?.data?.message || 'Failed to create task.');
  } finally {
    setLoading(false);
  }
};
  return (
    <Modal title="Add New Task" onClose={onClose}>
      <div className="space-y-4">
        {error && <Alert message={error} />}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Task Title *
          </label>
          <input
            className="input-field"
            placeholder="e.g. Design login page"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            placeholder="What needs to be done? (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Priority
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
              <button
                key={p}
                onClick={() => setForm({ ...form, priority: p })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                  form.priority === p
                    ? p === 'low'
                      ? 'bg-green-800 border-green-500 text-green-200'
                      : p === 'medium'
                      ? 'bg-yellow-800 border-yellow-500 text-yellow-200'
                      : 'bg-red-800 border-red-500 text-red-200'
                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" /> Creating...
              </>
            ) : (
              'Add Task'
            )}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
