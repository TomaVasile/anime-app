import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BrowseButton.css';
import Genres from './Genres/Genres';

const BrowseButton = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [background, setBackground] = useState('linear-gradient(50deg, #1a1a1a, #1e1e2f)');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.browse-button')) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsMenuOpen((prev) => !prev);
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

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className='browse-overlay'>
      <button className="browse-button" onClick={handleButtonClick}>
        {isLargeScreen ? 'Browse' : '☰'}
      </button>
      {isMenuOpen && (
        <div className="menu-overlay">
          <div
            className="navbar-menu open"
            ref={menuRef}
            style={{ background }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="browse-menu-left">
              <Link to="/anime" className="anime" onClick={handleLinkClick}>
                Anime
              </Link>
              <Link to="/manga" className="manga" onClick={handleLinkClick}>
                Manga
              </Link>
            </div>
            <div className="browse-menu">
              <div className="menu-left">
                <Link to="/new" onClick={handleLinkClick}>
                  New
                </Link>
                <Link to="/popular" onClick={handleLinkClick}>
                  Popular
                </Link>
              </div>
              <div className="line"></div>
              <div className="menu-right">
                <Genres onGenreClick={handleLinkClick} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseButton;
