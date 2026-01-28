import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Facebook, Twitter } from 'lucide-react';
import { login } from '../../../api/authentication/auth';
import './LoginForm.css';

export default function LoginForm({  }) {
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ username, password });
      localStorage.setItem('token', res.token);
      
      // Nếu chọn Remember Me, lưu thêm thông tin
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', username);
      }
      
      window.location.href = '/';
    } catch (err) {
      setError('Username or Password is not correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    console.log(`${platform} login - Still developing`);
    // Thêm logic đăng nhập social ở đây
  };

  return (
    <div className="login-wrapper">
      {/* Background Image with Overlay */}
      <div className="login-background" />
      <div className="login-overlay" />

      {/* Login Form Container */}
      <div className="login-content">
        <div className="login-header">
          <h1>Login</h1>
        </div>

        <div className="login-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Username Input */}
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin} 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* OR Divider */}
          <div className="divider">
            <div className="divider-circle">or</div>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="social-button facebook"
              disabled={loading}
              type="button"
            >
              <Facebook className="social-icon" fill="currentColor" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('Twitter')}
              className="social-button twitter"
              disabled={loading}
              type="button"
            >
              <Twitter className="social-icon" fill="currentColor" />
              <span>Twitter</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
        <p>
          Do not have an account?{' '}
          <Link to="/register" style={{ color: '#1976d2' }}>
            Register
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}