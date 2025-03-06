import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Genres.css';

const Genres = ({ onGenreClick }) => {
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/genres');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGenresList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <div>Loading genres...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="genres-container">
      <p className="genres-paragraph">Genres</p>
      <div className="genres-list">
        {genresList.map((genre) => (
          <Link key={genre} to={`/genre/${genre}`} className="genre-item" onClick={onGenreClick}>
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
