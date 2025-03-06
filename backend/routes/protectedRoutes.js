const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.get('/some-premium-feature', authenticateToken, (req, res) => {
  if (req.user.accountType !== 'premium') {
    return res.status(403).json({ message: 'Acces interzis pentru conturile simple.' });
  }

  res.json({ message: 'Acces permis pentru utilizatorul premium!' });
});

router.get('/protected', authenticateToken, (req, res) => {
  console.log(req.user);
  res.json({ 
    message: 'Ai accesat o rută protejată!', 
    accountType: req.user.accountType, 
    isAdmin: req.user.isAdmin,
  });
});

router.get('/admin-route', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Acesta este dashboard-ul administratorului' });
});

module.exports = router;
