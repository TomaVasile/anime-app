import React, { useState, useEffect } from 'react';
import UpgradeUser from '../../services/UpgradeUser';
import AvatarUpload from './AvatarUpload';
import './UserSettings.css';

function UserSettings() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [background, setBackground] = useState('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
  const [activeSection, setActiveSection] = useState('Profile');
  const [email, setEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setAlertMessage('Email changed successfully!');
      setAlertType('success');
    } else {
      setAlertMessage('Please enter a valid email');
      setAlertType('error');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setAlertMessage('Password updated successfully');
    setAlertType('success');
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (newUsername.trim()) {
      setAlertMessage('Username changed successfully!');
      setAlertType('success');
    } else {
      setAlertMessage('Please enter a valid username');
      setAlertType('error');
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const userAvatar = localStorage.getItem('avatarUrl');
    if (userAvatar) {
      setCurrentAvatar(userAvatar);
    }
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    setCurrentAvatar(newAvatarUrl);
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
    <div className="container">
      <div className="sidebar">
        <h2 className="title">Settings</h2>
        <ul className="menu">
          {['Profile', 'Membership', 'Mail', 'Password'].map((item) => (
            <li key={item}>
              <button
                onClick={() => setActiveSection(item)}
                className={`menu-item ${activeSection === item ? 'focused' : ''}`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <main className="main-content">
        <div className="content-container">
          <div
            className="section"
            style={{ background }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {activeSection === 'Membership' && (
              <div className='form-membership'>
                <h3>Membership</h3>
                <UpgradeUser />
              </div>
            )}

            {activeSection === 'Profile' && (
              <div className='form-container'>
                <h2>{username}</h2>
                {alertMessage && <div className={`alert ${alertType}`}>{alertMessage}</div>}
                <AvatarUpload currentAvatar={currentAvatar} onAvatarChange={handleAvatarChange} />
                <form onSubmit={handleUsernameChange} className="profile-form">
                  <div className="form-group">
                    <input
                      type="text"
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="form-input"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="newUsername" className="form-label">Change Username</label>
                  </div>
                  <button type="submit" className="form-button">Update Username</button>
                </form>
              </div>
            )}

            {activeSection === 'Mail' && (
              <div className='form-container'>
                <h2>Change Email</h2>
                <form onSubmit={handleEmailChange} className="mail-form">
                  <div className="form-group">
                    <input
                      type="email"
                      id="currentEmail"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      className="form-input"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="currentEmail" className="form-label">Current Email</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      id="newEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="newEmail" className="form-label">New Email</label>
                  </div>

                  <button type="submit" className="form-button">Update Email</button>
                </form>
              </div>
            )}

            {activeSection === 'Password' && (
              <div className='form-container'>
                <h2>Change Password</h2>
                {alertMessage && <div className={`alert ${alertType}`}>{alertMessage}</div>}
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-input"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      id="newPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      required
                      placeholder=" "
                    />
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                  </div>

                  <button type="submit" className="form-button">Update Password</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserSettings;
