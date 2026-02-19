import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import axiosApiCall from "@/lib/axiosApiCall";

const Checkout = ({ packageId, paymentAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const cardOptions = useMemo(() => {
    const light = {
      base: {
        fontSize: "16px",
        color: "#000000",
        "::placeholder": { color: "#6B7280" },
        iconColor: "#000000",
      },
      invalid: { color: "#EF4444" },
    };

    const dark = {
      base: {
        fontSize: "16px",
        color: "#FFFFFF",
        "::placeholder": { color: "#A1A1AA" },
        iconColor: "#FFFFFF",
      },
      invalid: { color: "#FCA5A5" },
    };

    return {
      hidePostalCode: true,
      disableLink: true,
      style: isDark ? dark : light,
    };
  }, [isDark]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      setPaymentProcessing(true);

      const initiateRes = await axiosApiCall.post(
        "/api/v1/package/initiate-payment",
        {
          packageId,
          price: paymentAmount,
        }
      );

      const clientSecret = initiateRes.data?.clientSecret;

      if (!clientSecret || !clientSecret.includes("_secret_")) {
        toast({
          title: "Payment Failed",
          description: "Invalid client secret returned from server.",
          variant: "destructive",
        });
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: "Test User" },
        },
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        await axiosApiCall.post(`/api/v1/package/payment/${packageId}`, {
          paymentId: result.paymentIntent.id,
        });

        toast({
          title: "Payment Successful",
          description: "Your payment has been completed.",
        });

        navigate("/payment-complete");
      } else {
        toast({
          title: "Payment not completed",
          description: `Status: ${result.paymentIntent?.status || "unknown"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-md mx-auto p-6 rounded-2xl shadow-xl
        bg-white text-gray-900
        border-2 border-gray-900
        dark:bg-foreground dark:text-white
        dark:border-gray-100">
      <h2 className="text-xl font-semibold mb-2">Complete Payment</h2>

      <p className="mb-6 text-gray-900 dark:text-gray-100">
        Amount:{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          €{paymentAmount}
        </span>
      </p>

      <div
        className="
          mb-4 rounded-xl px-4 py-3
          border-2 border-gray-900 bg-gray-200
          dark:border-gray-100 dark:bg-zinc-700">
        <CardElement options={cardOptions}/>
      </div>

      <button
        type="submit"
        disabled={!stripe || paymentProcessing}
        className="
          w-full py-2.5 px-4 font-semibold rounded-xl transition
          border-2 border-gray-900 dark:border-gray-100
          bg-red-600 text-white hover:bg-red-700
          disabled:opacity-50 disabled:cursor-not-allowed">
        {paymentProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default Checkout;