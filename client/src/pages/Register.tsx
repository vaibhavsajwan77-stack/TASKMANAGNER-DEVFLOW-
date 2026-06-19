import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ✅ DEBUG (IMPORTANT)
    console.log("REGISTER SUBMIT:", { name, email, password });

    // ✅ SAFE VALIDATION (fix empty/space issue)
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    

    try {
      // 🔥 ENSURE CLEAN DATA IS SENT
      const data = await register(
        name.trim(),
        email.trim(),
        password
      );

      authLogin(data.token, data.user);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          Create account
        </h1>

        <p className="text-gray-400 mb-8">
          Start managing your projects with DevFlow
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;