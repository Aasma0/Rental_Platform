const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/BookingModel");

router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { amount, bookingId, currency = "usd" } = req.body;

    // Validate request data
    if (!amount || !bookingId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount format" });
    }

    // Verify booking exists and belongs to authenticated user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this booking" });
    }

    // Create payment intent with appropriate metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: currency,
      metadata: { 
        bookingId: bookingId, 
        userId: req.user.id.toString(),
        propertyId: booking.property.toString()
      },
    });

    // Return client secret for client-side confirmation
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("Payment Intent Error:", error);
    
    // Provide appropriate error response
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: "Payment processing failed", 
      details: error.message 
    });
  }
});

// Add webhook handler for Stripe events (optional but recommended)
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;
    
    try {
      // Update booking status based on payment
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          // Handle different payment types
          if (booking.paymentType === 'pay_deposit') {
            booking.paymentStatus = 'partially_paid';
          } else if (booking.paymentType === 'pay_full') {
            booking.paymentStatus = 'paid';
          }
          booking.paymentIntentId = paymentIntent.id;
          await booking.save();
        }
      }
    } catch (error) {
      console.error('Error updating booking after payment:', error);
    }
  }

  res.status(200).json({received: true});
});

module.exports = router;