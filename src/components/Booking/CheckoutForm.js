// CheckoutForm.jsx
import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ clientSecret, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Remove the useEffect checking stripePromise
  // The stripe object from useStripe() will be null until ready
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system not ready");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Property Guest"
          }
        }
      });

      if (stripeError) throw stripeError;
      
      if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError(err.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#374151",
                "::placeholder": {
                  color: "#9CA3AF"
                }
              },
              invalid: {
                color: "#EF4444"
              }
            },
            hidePostalCode: true
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className={`w-full py-2.5 px-4 rounded-md font-medium transition-colors ${
          processing 
            ? "bg-gray-300 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-md">
          {error}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;