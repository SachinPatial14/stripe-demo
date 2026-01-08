import { stripe } from "../config/stripe.js";
import { Payment } from "../models/Payment.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email } = req.body;

    if (!amount || !email)
      return res.status(400).json({ message: "Amount & email required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true }
    });

    await Payment.create({
      paymentIntentId: paymentIntent.id,
      email,
      amount,
      status: "created"
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Stripe Webhook → Confirms Payment + Update DB
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    await Payment.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { status: "succeeded" }
    );

    console.log("Payment Success Saved");
  }

  res.json({ received: true });
};
