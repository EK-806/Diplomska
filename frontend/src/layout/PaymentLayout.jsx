import Checkout from "@/components/Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51SuEkGAV3qKQb4ceIaXSnsPm4B9QhASeLTwnGl1hibBqi7Xw5Mf98MWb0YH7k562LlXREyz8SQLvCvzy2TzkQpMR00HP0acT76"
);

const PaymentLayout = () => {
  const location = useLocation();
  const { packageId, paymentAmount } = location.state || {};

  if (!packageId || paymentAmount == null) {
    return (
      <div className="p-6 text-foreground dark:text-white">
        <p className="font-semibold">Missing payment details!</p>
        <p className="text-sm opacity-80">
          Go back to your packages and click Pay again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground dark:text-white">
        Payment
        </h2>

      <Elements stripe={stripePromise}>
        <Checkout packageId={packageId} paymentAmount={paymentAmount}/>
      </Elements>
    </div>
  );
};

export default PaymentLayout;