import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("propertyId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    setIsPaying(true);

    // Simulate a payment delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/api/booking/book/${propertyId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ startDate, endDate }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setMessage("Payment successful! Booking confirmed.");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setMessage(data.message || "Booking failed.");
          setIsPaying(false);
        }
      } catch (error) {
        console.error("Error booking property:", error);
        setMessage("An error occurred. Please try again.");
        setIsPaying(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Payment for Booking</h2>
        <p><strong>Check-in:</strong> {new Date(startDate).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> {new Date(endDate).toLocaleDateString()}</p>
        {message ? (
          <p className="mt-4 text-green-500">{message}</p>
        ) : (
          <button
            onClick={handlePayment}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            disabled={isPaying}
          >
            {isPaying ? "Processing..." : "Confirm Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
