import Stripe from "stripe";
import { pool } from "../db.js";
import { encrypt } from "../utils/encryption.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------- CREATE PAYMENT ----------
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount,
      email
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Payment failed" });
  }
};


// ---------- SAVE PAYMENT ----------
export const savePayment = async (req, res) => {
  try {
    const { payment_intent_id, amount, currency, status, email } = req.body;
    if (!payment_intent_id || !email) {
      console.log("Missing Fields", req.body);
      return res.status(400).json({ message: "Missing payment data" });
    }

    const amountToSave = typeof amount !== "undefined" && amount !== null
      ? Number(amount) / 100
      : null;

    await pool.query(
      `INSERT INTO payments(payment_intent_id, amount, currency, status, email)
       VALUES($1,$2,$3,$4,$5)`,
      [
        encrypt(payment_intent_id),
        amountToSave,
        currency,
        status,
        encrypt(email)
      ]
    );

    console.log("Encrypted Payment Saved");
    res.json({ success: true });

  } catch (err) {
    console.log("DB Save Error:", err);
    res.status(500).json({ message: "DB Save Failed" });
  }
};
