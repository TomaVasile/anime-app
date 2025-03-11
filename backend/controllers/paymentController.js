const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const createCheckoutSession = async (req, res) => {
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
      metadata: { userId: userId },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Eroare la crearea sesiunii:', error);
    res.status(500).json({ error: error.message });
  }
};

const upgradeToPremium = async (req, res) => {
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
};

const somePremiumFeature = (req, res) => {
  if (req.user.accountType !== 'premium') {
    return res.status(403).json({ message: 'Acces interzis pentru conturile simple.' });
  }

  res.json({ message: 'Acces permis pentru utilizatorul premium!' });
};

const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
    console.log('Webhook received:', event);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log(`User ID extracted from metadata: ${userId}`);

    User.findById(userId, async (err, user) => {
      if (err || !user) {
        console.error('Utilizatorul nu a fost găsit în baza de date:', err);
        return res.status(404).send('User not found');
      }

      if (user.accountType === 'premium') {
        console.log('Contul este deja premium');
        return res.status(200).send('User is already premium');
      }

      try {
        user.accountType = 'premium';
        await user.save();
        console.log(`Contul utilizatorului ${user._id} a fost actualizat la premium.`);
      } catch (error) {
        console.error('Eroare la actualizarea contului utilizatorului:', error);
        return res.status(500).send('Error updating user account');
      }
    });
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  upgradeToPremium,
  somePremiumFeature,
  handleStripeWebhook
};
