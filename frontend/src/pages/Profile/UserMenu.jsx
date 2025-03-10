import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(""); 
  const [username, setUsername] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 

    const fetchAvatar = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch avatar");

        const data = await response.json();
        console.log('Fetched Avatar Data:', data);

        if (data.avatar) {
          
          setUserAvatar(`https://anime-fox.netlify.app/user-avatar/${data.avatar}`);
          localStorage.setItem("avatarUrl", data.avatar);
        } else {
     
          setUserAvatar("https://anime-fox.netlify.app/user-avatar/avatar.jpg");
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);

        setUserAvatar("https://anime-fox.netlify.app/user-avatar/avatar.jpg");
      }
    };

    const avatar = localStorage.getItem("avatarUrl");
    if (avatar) {
      setUserAvatar(`https://anime-fox.netlify.app/${avatar}`);
    } else {
      fetchAvatar(); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu">
      {isLoggedIn && (
        <div className="user-dropdown" ref={menuRef}>
          <img
            src={userAvatar} 
            alt="Profil"
            className="user-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="dropdown-menu">
              <h2>{username}</h2>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
