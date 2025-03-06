import React, { useState, useEffect } from 'react';
import './ImageSlider.css';
import animeImg1 from './assets/kakegurui.jpg';
import animeImg2 from './assets/naruto-shippuden.jpg';
import animeImg3 from './assets/jujutsu-kaisen.jpg';
import animeImg4 from './assets/demon-slayer.jpg';
import titleImg1 from './assets/kakegurui-logo.png'
import titleImg2 from './assets/naruto-shippuden-logo.png'
import titleImg3 from './assets/jujutsu-kaisen-logo.png'
import titleImg4 from './assets/demon-slayer-logo.png'

const titles = [
  titleImg1,
  titleImg2,
  titleImg3,
  titleImg4
]

const images = [
  animeImg1,
  animeImg2,
  animeImg3,
  animeImg4
];

const description = [
  "In a high-stakes gambling academy, a new transfer student shakes things up with her incredible gambling skills.",
  "The sequel to Naruto, following the adventures of Naruto Uzumaki as he continues his journey to become the Hokage and protect his friends.",
  "Hidden in plain sight, an age-old conflict rages on. Supernatural monsters known as 'Curses' terrorize humanity from the shadows, and formidable humans known as 'Jujutsu' sorcerers... ",
  "A young boy becomes a demon slayer to avenge his family and cure his demon-turned sister."
]

const ImageSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="image-slider"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), 
        url(${images[currentImage]})`, }}
    >
      <div className='title-image'>
       <img
        src={titles[currentImage]} 
        alt="Title"
        className={`title-img title-img-${currentImage}`}
      /> </div>
      <div className="description-slider">
      <p className='description-animes'>{description[currentImage]}</p>
      </div>
      </div>

  );
};

export default ImageSlider;