const stripe = require('../config/stripe'); 
const User = require('../models/user');  

const createCheckoutSession = async (req, res) => {
  try {
    const { userId, priceId } = req.body;
    if (!userId || !priceId) {
      return res.status(400).json({ error: 'userId și priceId sunt necesare' });
    }

    const session = await createSession(userId, priceId);
    res.json({ sessionId: session.sessionId, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSession = async (userId, priceId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: await getUserEmail(userId),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://anime-fox.netlify.app/',
      cancel_url: 'https://anime-fox.netlify.app/cancel',
      metadata: { userId }
    });
    return { sessionId: session.id, url: session.url };
  } catch (error) {
    throw new Error(`Eroare la crearea sesiunii: ${error.message}`);
  }
};

const getUserEmail = async (userId) => {
  const user = await User.findById(userId);
  return user ? user.email : null;
};

const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
    await processWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Eroare la webhook:', error.message);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};

const processWebhook = async (event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { accountType: 'premium' });
      console.log(`Utilizatorul ${userId} a fost promovat la premium.`);
    }
  }
};

module.exports = { createCheckoutSession, webhookHandler };
