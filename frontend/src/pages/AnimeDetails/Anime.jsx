import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import './Anime.css';

function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const { genre } = useParams(); 
  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search); 
  const title = queryParams.get('title'); 
  const { isAdmin } = useUser(); 

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        let url = 'https://anime-app-bkmg.onrender.com/api/anime';
        const params = [];

        if (genre) params.push(`genre=${genre}`);
        if (title) params.push(`title=${title}`);

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setAnimeList(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [genre, title]);

  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete anime with ID: ${id}`);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        setAlertMessage('You must be logged in to delete an anime');
        setAlertType('error');
        return;
      }

      const response = await fetch(`https://anime-app-bkmg.onrender.com/api/anime/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Eroare la ștergerea anime-ului');
      }

      setAnimeList((prevList) => prevList.filter((anime) => anime._id !== id));
      setAlertMessage('Anime deleted successfully!');
      setAlertType('success');
    } catch (err) {
      console.error('Error deleting anime:', err);
      setAlertMessage('Error deleting anime');
      setAlertType('error');
    }
  };

  return (
    <div className="app-container">
      <h3 className="title">
        {genre
          ? `Anime - ${genre}`
          : title
          ? `Search Results for: ${title}`
          : 'Anime'}
      </h3>

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

<ul className="anime-list">
  {loading ? (
    <li>Loading...</li>
  ) : error ? (
    <li>Error: {error}</li>
  ) : animeList.length === 0 ? (
    <li>No anime found.</li>
  ) : (
    animeList.map((anime) => (
      <li key={anime._id} className="anime-item">
        <Link
          to={`/anime/${anime._id}/${anime.url}`}
          className="anime-link"
        >
          <div className="anime-images">
            {anime.image && (
              <img
                src={`https://anime-fox.netlify.app${anime.image}`} 
                alt={anime.title || 'Unknown Title'}
                className="anime-image new-image"
              />
            )}
            
            {anime.imageUrl && !anime.image && (
              <img
                src={`https://anime-fox.netlify.app${anime.imageUrl}`} 
                alt={anime.title || 'Unknown Title'}
                className="anime-image old-image"
              />
            )}
            
            {!anime.image && !anime.imageUrl && (
              <img
                src="fallback-image-url.jpg"
                alt={anime.title || 'Unknown Title'}
                className="anime-image fallback-image"
              />
            )}
          </div>

          <h4 className="anime-title">{anime.title || 'Untitled'}</h4>
          <p className="anime-genre">
            Genre: {anime.genre || 'Uncategorized'}
          </p>
          <p className="anime-description">
            {anime.description || 'Descriere indisponibilă.'}
          </p>
        </Link>
        {isAdmin ? (
          <button
            onClick={() => handleDelete(anime._id)}
            className="delete-button"
          >
            Delete
          </button>
        ) : null}
      </li>
    ))
  )}
</ul>

    </div>
  );
}

export default Anime;
