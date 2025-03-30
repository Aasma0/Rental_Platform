import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51R7XyVDIfAK6jlSaI7bshiDm4iy8m8KkcD3Br8i2hhzMkbTLsMqsOchY6YUadGJoTujRAHLO3nXRBF49H6aIuYFf00h7nHdzdW");

const StripeContainer = ({ amount, booking, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError("");
        
        if (!booking?._id) {
          throw new Error("Missing booking ID");
        }
        
        if (typeof amount !== "number" || amount <= 0) {
          throw new Error("Invalid payment amount");
        }

        // Ensure amount is properly formatted for Stripe (in cents)
        const amountInCents = Math.round(amount * 100);
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          "http://localhost:8000/api/payment/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: amountInCents,
              bookingId: booking._id,
              currency: "usd",
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Payment setup failed");
        }

        const data = await response.json();
        
        if (!data.clientSecret) {
          throw new Error("Invalid response from payment server");
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Payment Error:", error);
        setError(error.message || "An error occurred setting up payment");
      } finally {
        setLoading(false);
      }
    };

    if (booking?._id && amount > 0) {
      createPaymentIntent();
    } else {
      setLoading(false);
      setError("Invalid booking or amount");
    }

    return () => controller.abort();
  }, [amount, booking]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing secure payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <h3 className="text-red-600 font-medium">Payment Error</h3>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
        >
          Try Again →
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <p className="text-yellow-700 text-sm">
          Payment system is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#3b82f6",
            colorBackground: "#ffffff",
            colorText: "#374151",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripeContainer;