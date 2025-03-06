const multer = require('multer');
const path = require('path');

const animeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'public', 'api-images'));  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

const uploadAnime = multer({ storage: animeStorage }).single('image'); 

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'public', 'user-avatar'));  
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId || 'default';  
    cb(null, `avatar_${userId}${path.extname(file.originalname)}`); 
  },
});

const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');  

module.exports = { uploadAnime, uploadAvatar };  
