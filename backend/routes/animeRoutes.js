const express = require('express');
const { getAnimeList, getAnimeByIdAndUrl, deleteAnime, getGenres, uploadAnime } = require('../controllers/animeController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); 
const { uploadAnimeMiddleware } = require('../middleware/filesUpload');

const router = express.Router();

router.get('/anime', getAnimeList);
router.get('/:id/:url', getAnimeByIdAndUrl);
router.delete('/anime/:id', authenticateToken, isAdmin, deleteAnime);
router.get('/genres', getGenres);
router.post('/add-anime', uploadAnimeMiddleware, authenticateToken, isAdmin, uploadAnime);

module.exports = router;
