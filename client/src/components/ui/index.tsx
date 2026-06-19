import { type ReactNode } from 'react';

// ── Spinner ───────────────────────────────────────────────
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-7 w-7', lg: 'h-10 w-10' };
  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizes[size]}`}
    />
  );
};

// ── Alert / Error Banner ──────────────────────────────────
export const Alert = ({
  message,
  type = 'error',
}: {
  message: string;
  type?: 'error' | 'success';
}) => {
  const styles = {
    error: 'bg-red-900/50 border-red-500 text-red-300',
    success: 'bg-green-900/50 border-green-500 text-green-300',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

// ── Modal Wrapper ─────────────────────────────────────────
export const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

// ── Empty State ───────────────────────────────────────────
export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-200 mb-1">{title}</h3>
    <p className="text-gray-400 text-sm mb-5">{description}</p>
    {action}
  </div>
);

// ── Badge (priority / status) ─────────────────────────────
export const Badge = ({
  label,
  variant,
}: {
  label: string;
  variant: 'low' | 'medium' | 'high' | 'todo' | 'in-progress' | 'done';
}) => {
  const styles: Record<string, string> = {
    low: 'bg-green-900/60 text-green-300 border-green-700',
    medium: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
    high: 'bg-red-900/60 text-red-300 border-red-700',
    todo: 'bg-gray-700 text-gray-300 border-gray-600',
    'in-progress': 'bg-blue-900/60 text-blue-300 border-blue-700',
    done: 'bg-green-900/60 text-green-300 border-green-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  );
};
