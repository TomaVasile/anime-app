import React, { useState } from 'react';
import './AddAnime.css';

function AddAnime() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); 
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5000000) {
      setImage(file); 
    } else {
      setAlertMessage('Fișierul este prea mare. Alege o imagine mai mică de 5MB.');
      setAlertType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; 

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add an anime');
      return;
    }

    if (!image) {
      setAlertMessage('Te rugăm să adaugi o imagine.');
      setAlertType('error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('description', description);
    formData.append('image', image); 

    setIsSubmitting(true); 

    try {
      const response = await fetch('http://localhost:5000/api/add-anime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, 
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add anime');
      }

      setAlertMessage('Anime added successfully!');
      setAlertType('success');
      setTitle('');
      setGenre('');
      setDescription('');
      setImage(null);
    } catch (err) {
      setAlertMessage(err.message);
      setAlertType('error');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="add-anime-container">
      <h1>Add Anime</h1>

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="add-anime-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange} 
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? <span className="spinner"></span> : 'Add Anime'}
        </button>
      </form>
    </div>
  );
}

export default AddAnime;
