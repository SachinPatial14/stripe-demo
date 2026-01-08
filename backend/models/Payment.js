import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paymentIntentId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, default: "processing" }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
