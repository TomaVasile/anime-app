import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import ImageSlider from './pages/Home/ImageSlider.jsx';
import PopularAnime from './components/Anime/PopularAnime.jsx';
import Footer from './components/Footer/Footer.jsx';
import NewAnime from './components/Anime/NewAnime.jsx';
import Anime from './pages/AnimeDetails/Anime.jsx';
import New from './components/New/New.jsx';
import Popular from './components/Popular/Popular.jsx';
import Manga from './components/Manga/Manga.jsx'
import Login from './pages/Login/Login.jsx'
import SignUp from './pages/Login/SignUp.jsx'
import UpgradeUser from './services/UpgradeUser.jsx'
import AnimeView from './pages/AnimeDetails/AnimeView.jsx'
import AddAnime from './pages/AnimeDetails/AddAnime.jsx'
import Banner from './pages/Home/Banner.jsx';
import UserSettings from './pages/Profile/UserSettings.jsx';
import "./index.css";

const App = () => {
  return (
    <Router>
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <ImageSlider />
            <PopularAnime />
            <Banner />
            <NewAnime />
            <Footer />
          </>
        } />
        <Route path="/anime" element={<Anime />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/new" element={<New />} />
        <Route path='/popular' element={<Popular />} />
        <Route path="/genre/:genre" element={<Anime />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/premium' element={<UpgradeUser />} />
        <Route path="/anime/:id/:url" element={<AnimeView />} />
        <Route path="/add-anime" element={<AddAnime />}/>
        <Route path="/settings" element={<UserSettings />}/>
      </Routes>
    </div>
  </Router>
  );
};

export default App;
