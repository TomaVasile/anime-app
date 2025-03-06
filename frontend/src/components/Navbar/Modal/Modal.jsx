import React from 'react';
import { Link } from 'react-router-dom';
import './Modal.css';

const Modal = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Welcome</h2>
        <p>Select an option below:</p>
        <div className="modal-links">
          <Link to="/login" onClick={onClose}>Login</Link>
          <Link to="/signup" onClick={onClose}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Modal;
