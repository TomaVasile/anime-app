import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImg from './logo.png';
import Modal from './Modal/Modal'; 
import BrowseButton from '../BrowseButton/BrowseButton';
import LoginIcon from './LoginIcon/LoginIcon'; 
import UserMenu from '../../pages/Profile/UserMenu';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLabelActive, setIsLabelActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [background, setBackground] = useState('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 

    const checkUserStatus = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/protected', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.isAdmin);
          }
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }
    };

    checkUserStatus();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); 

  const performSearch = useCallback((query) => {
    if (query) {
      navigate(`/anime?title=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSearchChange = useCallback(
    (query) => {
      const debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 300);

      return () => clearTimeout(debounceTimer);
    },
    [performSearch] 
  );

  const handleInputFocus = () => setIsLabelActive(true);
  const handleInputBlur = () => {
    if (!searchQuery) {
      setIsLabelActive(false);
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
    <nav className="navbar"
      style={{ background }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      
      <Link to="/"> 
        <img src={logoImg} alt="logo" className='logo' />
      </Link>

      <BrowseButton onClick={toggleMenu} />

      <div className='navbar-left'>
        <Link to="/anime" className="navbar-link">Anime</Link>
        <Link to="/manga" className="navbar-link">Manga</Link>
      </div>

      {isAdmin && <Link to="/add-anime"><button>Add Anime</button></Link>}

      <div className='div-input'>
        <input
          type="text"
          id="search-input"
          className='search-input'
          value={searchQuery} 
          placeholder=" "
          onFocus={handleInputFocus} 
          onBlur={handleInputBlur}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearchChange(e.target.value);
          }}
        />
        <label
          htmlFor="search-input"
          className={`text-search ${isLabelActive || searchQuery ? 'active' : ''}`}
        >
          Search...
        </label>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <UserMenu /> 
        ) : (
          <>
            <div className="login-icon" onClick={openModal}>
              <LoginIcon />
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
          </>
        )}
      </div>
      
    </nav>
  );
};

export default Navbar;
