const stripe = require('../config/stripe');
const User = require('../models/user');

const createSession = async (userId, priceId) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription', 
            customer_email: await getUserEmail(userId),
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `https://anime-fox.netlify.app/`,
            cancel_url: `https://anime-fox.netlify.app/cancel`,
            metadata: { userId }, 
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

const processWebhook = async (event) => {
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;

            if (userId) {
                await User.findByIdAndUpdate(userId, { accountType: 'premium' });
                console.log(`Utilizatorul ${userId} a fost promovat la premium.`);
            }
        }
    } catch (error) {
        console.error('Eroare la procesarea webhook-ului:', error.message);
    }
};

module.exports = { createSession, processWebhook };
