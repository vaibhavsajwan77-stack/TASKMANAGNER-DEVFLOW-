import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-white text-lg">DevFlow</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* User avatar */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="hidden sm:block">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
