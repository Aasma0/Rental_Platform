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
    let isMounted = true;
    const controller = new AbortController();

    const createPaymentIntent = async () => {
        try {
          console.log("🔄 Requesting payment intent...");
      
          const response = await fetch("http://localhost:8000/api/payment/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              amount: Math.round(amount * 100),
              bookingId: booking?._id
            })
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${errorText}`);
          }
      
          const data = await response.json();
          console.log("✅ Payment Intent Received:", data);
      
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("🚨 Error fetching payment intent:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      

    createPaymentIntent();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [amount, booking]);

  if (loading) return <div className="text-gray-500 p-2 text-sm">Initializing payment...</div>;
  if (error) return <div className="text-red-500 p-2 text-sm">Error: {error}</div>;
  if (!clientSecret) return <div className="text-red-500 p-2 text-sm">Missing payment credentials</div>;

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ clientSecret }}
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