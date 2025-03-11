import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './PopularAnime.css';

import PopularAnime1 from './assets/attack-on-titan.jpg';
import PopularAnime2 from './assets/my-hero-academia.jpg';
import PopularAnime3 from './assets/naruto-shippuden.jpg';
import PopularAnime4 from './assets/death-note.jpg';
import PopularAnime5 from './assets/tokyo-ghoul.jpg';

const animeList = [
  { title: 'Attack on Titan', imageURL: PopularAnime1, url: 'attack-on-titan' },
  { title: 'My Hero Academia', imageURL: PopularAnime2, url: 'my-hero-academia' },
  { title: 'Naruto Shippuden', imageURL: PopularAnime3, url: 'naruto-shippuden' },
  { title: 'Death Note', imageURL: PopularAnime4, url: 'death-note' },
  { title: 'Tokyo Ghoul', imageURL: PopularAnime5, url: 'tokyo-ghoul' },
];

const CustomArrow = ({ className, style, onClick, arrowType }) => (
  <div
    className={className}
    style={{
      ...style,
      backgroundColor: 'black',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    }}
    onClick={onClick}
  >
  </div>
);

const NewAnime = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('https://anime-app-bkmg.onrender.com/api/anime'); 
        if (!response.ok) {
          throw new Error('Failed to fetch anime list');
        }
        const data = await response.json();
        setAnimeData(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <CustomArrow arrowType="right" />,
    prevArrow: <CustomArrow arrowType="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div>Loading popular anime...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredAnimeData = animeData.filter((anime) =>
    animeList.some((localAnime) => localAnime.url === anime.url) 
  );

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <h2>New Anime</h2>
        <Slider {...settings}>
          {filteredAnimeData.map((anime) => {
            const localAnime = animeList.find((item) => item.url === anime.url); 

            if (!localAnime) return null; 

            return (
              <div key={anime._id}>
                <Link to={`/anime/${anime._id}/${localAnime.url}`}>
                  <img src={localAnime.imageURL} alt={localAnime.title} />
                </Link>
                <h3>{localAnime.title}</h3>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default NewAnime;
