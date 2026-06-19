import type { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

interface Props {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onAddTask: () => void;
}

const COLUMN_STYLES: Record<TaskStatus, { accent: string; badge: string; count: string }> = {
  'todo': {
    accent: 'border-t-gray-500',
    badge: 'bg-gray-700 text-gray-300',
    count: 'bg-gray-700 text-gray-300',
  },
  'in-progress': {
    accent: 'border-t-blue-500',
    badge: 'bg-blue-900/60 text-blue-300',
    count: 'bg-blue-900 text-blue-300',
  },
  'done': {
    accent: 'border-t-green-500',
    badge: 'bg-green-900/60 text-green-300',
    count: 'bg-green-900 text-green-300',
  },
};

const KanbanColumn = ({ title, status, tasks, onStatusChange, onDelete, onAddTask }: Props) => {
  const style = COLUMN_STYLES[status];

  return (
    <div className={`bg-gray-800/50 border border-gray-700 border-t-2 ${style.accent} rounded-xl flex flex-col min-h-[400px]`}>
      {/* Column header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-200 text-sm">{title}</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.count}`}>
            {tasks.length}
          </span>
        </div>
        {/* Only show add button on "To Do" column */}
        {status === 'todo' && (
          <button
            onClick={onAddTask}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Tasks list */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-sm">
            <span className="text-2xl mb-2">
              {status === 'todo' ? '📝' : status === 'in-progress' ? '⚙️' : '✅'}
            </span>
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
