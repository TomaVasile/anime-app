import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

function AnimeView() {
  const { id, url } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(null); 
  const [userLoading, setUserLoading] = useState(true); 

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`https://anime-app-bkmg.onrender.com/api/${id}/${url}`);
        if (!response.ok) throw new Error('Anime not found or network error');
        const data = await response.json();
        setAnime(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('https://anime-app-bkmg.onrender.com/api/protected', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsPremium(userData.accountType === 'premium');
          } else {
            console.warn('Failed to verify premium status:', response.status);
            setIsPremium(false);
          }
        } catch (err) {
          console.error('Error checking premium status:', err);
          setIsPremium(false);
        } finally {
          setUserLoading(false); 
        }
      } else {
        setIsPremium(false);
        setUserLoading(false); 
      }
    };

    fetchAnime();
    checkUserStatus();
  }, [id, url]);

  if (loading || userLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (isPremium === false) {
    return <Navigate to="/premium" />;
  }

  return (
    <div>
      <h1>{anime.title}</h1>
      <p><strong>Gen:</strong> {anime.genre}</p>
      <p><strong>Descriere:</strong> {anime.description}</p>
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} />}
    </div>
  );
}

export default AnimeView;
