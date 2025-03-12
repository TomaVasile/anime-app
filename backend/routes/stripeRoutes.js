const express = require('express');
const { createCheckoutSession, webhookHandler } = require('../controllers/stripeController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

module.exports = router;
