import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./components/PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51Smp3sKC1Zki9bNjhjLF8hodqPQPFfq4Y2Nbm39jCpJa1kqEhBeAOFHgpdqfiORTPsi0dxntyEoF5inCA4DfHJrF00TI9Kqjfd"
);

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}
