import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login to:', api.defaults.baseURL);
      const response = await api.post('/admin/login', { username, password });
      localStorage.setItem('admin_token', response.data.token);
      setIsAdmin(true);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Network error';
      setError(`Login failed (${status || 'Network Error'}): ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>ADMINISTRATION</h1>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Connecting...' : 'Login'}
        </button>
      </form>

      <style jsx="true">{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
        }

        .login-form {
          background: var(--secondary);
          padding: 3rem;
          border: 1px solid var(--border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 400px;
        }

        .login-form h1 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--muted);
        }

        .input-group input {
          width: 100%;
          padding: 0.8rem;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          outline: none;
        }

        .input-group input:focus {
          border-color: var(--accent);
        }

        button {
          width: 100%;
          padding: 1rem;
          background: var(--accent);
          color: black;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: var(--transition);
        }

        button:hover {
          background: white;
        }

        .error {
          color: #ff4d4d;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
