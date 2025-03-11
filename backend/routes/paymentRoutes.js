const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/authMiddleware'); 
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.userId;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `https://anime-fox.netlify.app/success`,
      cancel_url: `https://anime-fox.netlify.app/cancel`,
      metadata: { userId },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Eroare la crearea sesiunii:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/upgrade-to-premium', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Token invalid sau lipsă userId.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    if (user.accountType === 'premium') {
      return res.status(400).json({ message: 'Contul este deja premium' });
    }

    user.accountType = 'premium';
    await user.save();

    const token = jwt.sign({ userId: user._id, accountType: user.accountType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Upgrade reușit la cont premium!', token });
  } catch (error) {
    console.error('Eroare la actualizarea contului:', error);
    res.status(500).json({ message: 'Eroare la actualizarea contului.' });
  }
});

module.exports = router;
