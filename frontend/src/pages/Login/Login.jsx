import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from '../../context/UserContext'; 
import foxLogin from './assets/fox-login.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [background, setBackground] = useState('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
  const { updateUserStatus } = useUser(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://anime-app-bkmg.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', data.userId); 
      localStorage.setItem('accountType', data.accountType); 
      localStorage.setItem('isAdmin', data.isAdmin); 

      if (data.avatar) {
            localStorage.setItem('avatarUrl', data.avatar);
          }

      updateUserStatus(data.isAdmin);

      navigate('/'); 

      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBackground(`radial-gradient(circle at ${x}px ${y}px, #1e1e2f, #1a1a1a)`);
  };

  const handleMouseLeave = () => {
    setBackground('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
  };

  return (
    <div className="login-container">
      <img src={foxLogin} alt="Fox Login" className="login-image" />
      <h2>Log in</h2>
      <div
        className="login-form-container"
        style={{ background }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
              required 
              placeholder=" "
            />
            <label htmlFor="newEmail" className="form-label">Email Address</label>
          </div>
          <div className="form-group">
            <input
             type="password" 
             id="Password" 
             value={password} 
             onChange={(e) => setPassword(e.target.value)} 
             className="form-input" 
             required 
             placeholder=" "
            />
            <label htmlFor="Password" className="form-label">Password</label>
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
      <div className="create-account-link">
        Don't have an account? <a href="/signup">Create Account</a>
      </div>
    </div>
  );
};

export default Login;
