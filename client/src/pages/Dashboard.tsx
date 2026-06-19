import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">DevFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-400 mb-10">Welcome back, {user?.name}!</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Projects</p>
            <p className="text-4xl font-bold text-blue-400">0</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
            <p className="text-4xl font-bold text-green-400">0</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-4xl font-bold text-purple-400">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/projects')}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2">📁 Projects</h3>
            <p className="text-gray-400 text-sm">View and manage all your projects</p>
          </div>
          <div
            onClick={() => navigate('/tasks')}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-green-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2">✅ Tasks</h3>
            <p className="text-gray-400 text-sm">View and manage all your tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;