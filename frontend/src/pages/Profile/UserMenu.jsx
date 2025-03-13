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
        const response = await fetch(`https://anime-app-bkmg.onrender.com/api/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch avatar");
  
        const data = await response.json();
        console.log("Avatar primit de la API:", data.avatar);
  
        let avatarPath = data.avatar;
  
        if (!avatarPath) {
          avatarPath = "https://anime-fox.netlify.app/user-avatar/avatar.jpg";
        } else if (!avatarPath.startsWith("http")) {
          avatarPath = `https://anime-fox.netlify.app${avatarPath}`;
        }
  
        console.log("Avatar final setat:", avatarPath);
        setUserAvatar(avatarPath);
        localStorage.setItem("avatarUrl", avatarPath);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setUserAvatar("https://anime-fox.netlify.app/user-avatar/avatar.jpg");
      }
    };
  
    const avatar = localStorage.getItem("avatarUrl");
  
    if (avatar) {

      if (!avatar.startsWith("http")) {
        setUserAvatar(`https://anime-fox.netlify.app${avatar}`);
      } else {
        setUserAvatar(avatar);
      }
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
