import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { API } from "../utils/api";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      setMsg("");

      const { data } = await API.post("/create-payment-intent", {
        amount,
        email
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setMsg(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMsg("Payment Done 🎉 Receipt sent via email");
        setAmount("");
        setEmail("");
      }
    } catch (err) {
      console.log(err);
      setMsg("Payment Failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">
        Stripe Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Customer Email (receipt sent here)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Enter Amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border p-3 rounded-lg"
        />

        <div className="border p-4 rounded-lg bg-gray-50">
          <CardElement />
        </div>

        <button
          disabled={!stripe || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-center font-semibold p-3 rounded-lg ${
            msg.includes("Done")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
