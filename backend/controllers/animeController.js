const jwt = require('jsonwebtoken');
const Anime = require('../models/anime'); 
const mongoose = require('mongoose');

const getAnimeList = async (req, res) => {
  const { genre, title } = req.query;
  try {
    const query = {};
    if (genre) query.genre = { $regex: new RegExp(genre, "i") };
    if (title) query.title = { $regex: new RegExp(title, "i") };

    const animeList = await Anime.find(query);
    res.json(animeList);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea anime-urilor' });
  }
};

const getAnimeByIdAndUrl = async (req, res) => {
  try {
    const { id, url } = req.params;
    const anime = await Anime.findOne({ _id: id, url: url });

    if (!anime) return res.status(404).json({ message: 'Anime not found' });

    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea anime-ului' });
  }
};

const deleteAnime = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID-ul furnizat nu este valid' });
    }

    const deletedAnime = await Anime.findByIdAndDelete(id);

    if (!deletedAnime) {
      return res.status(404).json({ message: 'Anime-ul nu a fost găsit' });
    }

    res.json({ message: 'Anime-ul a fost șters cu succes', anime: deletedAnime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la ștergerea anime-ului' });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Anime.distinct('genre');
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea genurilor' });
  }
};

const uploadAnime = async (req, res) => {
  try {
    const image = req.file ? `/api-images/${req.file.filename}` : null;
    const { title, description, genre } = req.body;

    if (!title || !description || !genre || !image) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
    }

    const url = title ? title.toLowerCase().replace(/\s+/g, '-') : 'default-url';

    const newAnime = new Anime({
      title,
      description,
      genre,
      image,
      url,
    });

    await newAnime.save();
    return res.status(201).json({ message: 'Anime adăugat cu succes!', anime: newAnime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la adăugarea anime-ului' });
  }
};

module.exports = {
  getAnimeList,
  getAnimeByIdAndUrl,
  deleteAnime,
  getGenres,
  uploadAnime,
};
