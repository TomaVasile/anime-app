const { createSession, processWebhook } = require('../services/stripeService');

const createCheckoutSession = async (req, res) => {
    try {
        console.log('Body primit:', req.body);
        const { userId, priceId } = req.body;
        if (!userId || !priceId) {
            return res.status(400).json({ error: 'userId și priceId sunt necesare' });
        }

        const url = await createSession(userId, priceId);
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const webhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        await processWebhook(event);
        res.json({ received: true });
    } catch (error) {
        console.error('Eroare la webhook:', error.message);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
};

module.exports = { createCheckoutSession, webhookHandler };
