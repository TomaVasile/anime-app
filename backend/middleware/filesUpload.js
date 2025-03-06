const { uploadAnime, uploadAvatar } = require('../config/multerConfig');

const uploadAvatarMiddleware = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });  
    }
    next();  
  });
};

const uploadAnimeMiddleware = (req, res, next) => {
  uploadAnime(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message }); 
    }
    next();  
  });
};

module.exports = { uploadAvatarMiddleware, uploadAnimeMiddleware };
