const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

router.post('/create-checkout-session', async (req, res) => {
    const { service, address, details, price } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: service,
                    },
                    unit_amount: price * 100, 
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/booking/cancel`,
            metadata: {
                taskId: task._id.toString()
            }
        });

        res.json({ id: session.id });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create Stripe checkout session' });
    }
});

module.exports = router;
