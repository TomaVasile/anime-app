import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foxSignup from './assets/fox-signup.png';
import './SignUp.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [background, setBackground] = useState('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await fetch('https://anime-app-bkmg.onrender.com/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            console.log('Response status:', response.status); 

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sign up');
            }

            navigate('/login'); 
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
        <div className="signup-container">
            <img src={foxSignup} alt="Fox Signup" className="signup-image" />
            <h2>Sign up</h2>
            <div
                className="signup-form-container"
                style={{ background }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {error && <p className="error-message">{error}</p>}
                <form className="signup-form" onSubmit={handleSignUp}>
                    <div className="form-group">
                        <input
                           type="text" 
                           id="username" 
                           value={username} 
                           onChange={(e) => setUsername(e.target.value)} 
                           className="form-input" 
                           required 
                           placeholder=" "
                        />
                        <label htmlFor="newUsername" className="form-label">Username</label>
                    </div>
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
                    <button className="button-signup" type="submit">Sign Up</button>
                </form>
            </div>
            <div className="login-link">
                Already have an account? <a href="/login">Log In</a>
            </div>
        </div>
    );
};

export default SignUp;
