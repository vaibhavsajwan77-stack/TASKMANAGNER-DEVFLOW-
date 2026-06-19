import type { Task, TaskStatus } from '../../types';
import { Badge } from '../ui';
import { taskApi } from '../../api/taskApi';

interface Props {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done'];

const TaskCard = ({ task, onStatusChange, onDelete }: Props) => {
  const currentIndex = STATUS_ORDER.indexOf(task.status);

  const handleMoveForward = async () => {
    if (currentIndex >= STATUS_ORDER.length - 1) return;
    const nextStatus = STATUS_ORDER[currentIndex + 1];
    try {
      await taskApi.updateStatus(task._id, nextStatus);
      onStatusChange(task._id, nextStatus);
    } catch {
      alert('Failed to update task status.');
    }
  };

  const handleMoveBack = async () => {
    if (currentIndex <= 0) return;
    const prevStatus = STATUS_ORDER[currentIndex - 1];
    try {
      await taskApi.updateStatus(task._id, prevStatus);
      onStatusChange(task._id, prevStatus);
    } catch {
      alert('Failed to update task status.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskApi.delete(task._id);
      onDelete(task._id);
    } catch {
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 hover:border-gray-500 transition-all duration-200 group">
      {/* Task title */}
      <h4 className="text-sm font-semibold text-white mb-1.5 leading-snug">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Priority badge */}
      <div className="mb-3">
        <Badge
          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          variant={task.priority}
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between">
        {/* Move buttons */}
        <div className="flex gap-1.5">
          {currentIndex > 0 && (
            <button
              onClick={handleMoveBack}
              title="Move back"
              className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded px-2 py-1 transition-colors"
            >
              ← Back
            </button>
          )}
          {currentIndex < STATUS_ORDER.length - 1 && (
            <button
              onClick={handleMoveForward}
              title="Move forward"
              className="text-xs bg-blue-700 hover:bg-blue-600 text-white rounded px-2 py-1 transition-colors"
            >
              Next →
            </button>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Delete
        </button>
      </div>

      {/* Created date */}
      <p className="text-xs text-gray-500 mt-2">
        {new Date(task.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskCard;
