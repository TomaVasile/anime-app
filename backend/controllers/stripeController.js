const { createSession, processWebhook } = require('../services/stripeService');

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

module.exports = { createCheckoutSession, webhookHandler };
