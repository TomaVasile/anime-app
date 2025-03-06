const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/user');
const router = express.Router();

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook received:', event);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log(`User ID extracted from metadata: ${userId}`);

    User.findByIdAndUpdate(userId, { accountType: 'premium' }, { new: true }, (err, updatedUser) => {
      if (err) {
        console.error('Eroare la actualizarea utilizatorului:', err);
      } else {
        console.log(`Utilizatorul cu ID ${updatedUser._id} a fost actualizat la premium.`);
      }
    });
  }

  res.json({ received: true });
});

module.exports = router;
