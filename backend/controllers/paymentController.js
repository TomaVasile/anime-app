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
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:${process.env.PORT}/cancel`,
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
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Webhook received:', event);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log(`User ID extracted from metadata: ${userId}`);

    User.findByIdAndUpdate(userId, {
      accountType: 'premium',
    }, { new: true }, (err, updatedUser) => {
      if (err) {
        console.error('Eroare la actualizarea utilizatorului:', err);
      } else {
        console.log(`Utilizatorul cu ID ${updatedUser._id} a fost actualizat la premium.`);
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
