const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ error: "Invalid amount format" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: "usd",
      metadata: { bookingId, userId: req.user.id.toString() },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment processing failed", details: error.message });
  }
});

module.exports = router;
    