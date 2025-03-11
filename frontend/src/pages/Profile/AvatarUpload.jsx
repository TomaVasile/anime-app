import React, { useState, useRef } from 'react';
import Pica from 'pica';

function AvatarUpload({ currentAvatar, onAvatarChange }) {
  const [avatar, setAvatar] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 100;
          const maxHeight = 100;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const pica = Pica();
          pica.resize(img, canvas)
            .then(() => {
              canvas.toBlob((blob) => {
                const resizedAvatarUrl = URL.createObjectURL(blob);
                setAvatar(blob);
                onAvatarChange(resizedAvatarUrl); 
              }, 'image/jpeg');
            })
            .catch(() => {
              setAlertMessage('Error resizing image');
              setAlertType('error');
            });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('You must be logged in to change your avatar');
      return;
    }

    if (!avatar) {
      setAlertMessage('Please select an avatar');
      setAlertType('error');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('avatar', avatar, `avatar_${userId}.jpg`);

    try {
      const response = await fetch('https://anime-app-bkmg.onrender.com/api/user-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const data = await response.json();
      console.log(data);
      setAlertMessage(data.message);
      setAlertType('success');
      localStorage.setItem('avatarUrl', data.avatar);
      onAvatarChange(data.avatar); 
    } catch (err) {
      setAlertMessage('Error updating avatar');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {alertMessage && <div className={`alert ${alertType}`}>{alertMessage}</div>}
      {currentAvatar && (
        <div className="current-avatar-container">
          <img
            src={currentAvatar}
            alt="Current Avatar"
            className="current-avatar"
            onClick={handleAvatarClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}

      <input
        type="file"
        name="avatar"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="form-input"
        style={{ display: 'none' }}
      />

      <button onClick={handleSubmit} disabled={isLoading} className="form-button">
        {isLoading ? 'Uploading...' : 'Save'}
      </button>
    </div>
  );
}

export default AvatarUpload;
