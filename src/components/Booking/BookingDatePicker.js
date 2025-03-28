import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StripeContainer from "./StripeContainer";
import { differenceInDays } from 'date-fns';

const BookingDatePicker = ({ property }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Calculate total price based on selected dates
  useEffect(() => {
    if (startDate && endDate && property?.price) {
      const days = differenceInDays(endDate, startDate) + 1;
      setTotalPrice(days * property.price);
    }
  }, [startDate, endDate, property]);

  const handleProceedToPayment = () => {
    if (!startDate || !endDate) {
      setBookingMessage("Please select both start and end dates.");
      return;
    }
    setShowPaymentModal(true);
  };

  // Create booking record in database
  const createBookingRecord = async (method) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in to book.");
    
    const paymentTypeMap = {
      card: "pay_full",
      partial: "pay_deposit",
      pay_later: "pay_later"
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/booking/book/${property._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            paymentType: paymentTypeMap[method],
            totalPrice: totalPrice,
            paidAmount: method === "pay_later" ? 0 : (method === "partial" ? totalPrice * 0.5 : totalPrice)
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking creation failed");
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // Handle payment method selection
  const handlePaymentMethod = async (method) => {
    try {
      setPaymentType(method);
      setIsLoading(true);
      setBookingMessage("");

      // Create booking record first
      const { booking } = await createBookingRecord(method);
      setBookingDetails(booking);

      // Handle different payment methods
      if (method === "pay_later") {
        setIsBookingConfirmed(true);
        setBookingMessage("Booking confirmed! Pay at check-in.");
      } else {
        setShowCardDetails(true);
      }
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      // Update booking with payment details
      const response = await fetch(
        `http://localhost:8000/api/booking/confirm/${bookingDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId,
            status: paymentType === "partial" ? "partially_paid" : "paid"
          })
        }
      );

      if (!response.ok) throw new Error("Payment confirmation failed");
      
      setBookingMessage("Payment successful! Booking confirmed.");
      setIsBookingConfirmed(true);
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Date Selection */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Book Your Stay</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              minDate={new Date()}
              className="w-full p-2 border rounded-md"
              placeholderText="Select start date"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              minDate={startDate || new Date()}
              className="w-full p-2 border rounded-md"
              placeholderText="Select end date"
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium">
              {differenceInDays(endDate, startDate) + 1} nights · ${totalPrice}
              {paymentType === "partial" && ` · Deposit: $${totalPrice * 0.5}`}
            </p>
          </div>
        )}

        <button
          onClick={handleProceedToPayment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={!startDate || !endDate}
        >
          Continue to Payment
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Complete Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {!isBookingConfirmed ? (
              <>
                <select
                  value={paymentType}
                  onChange={(e) => handlePaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                  disabled={isLoading}
                >
                  <option value="">Select Payment Method</option>
                  <option value="card">Full Payment (Credit/Debit)</option>
                  <option value="partial">Partial Payment (20% Deposit)</option>
                  <option value="pay_later">Pay at Check-in</option>
                </select>

                {isLoading && (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {showCardDetails && bookingDetails && (
                  <StripeContainer
                    amount={paymentType === "partial" ? totalPrice * 0.5 : totalPrice}
                    booking={bookingDetails}
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </>
            ) : (
              <div className="text-center p-4 bg-green-50 rounded-md">
                <h4 className="text-green-600 font-semibold mb-2">Booking Confirmed!</h4>
                <p className="text-sm text-gray-600">{bookingMessage}</p>
              </div>
            )}

            {bookingMessage && !isLoading && (
              <div className={`mt-4 p-2 rounded-md text-sm ${
                bookingMessage.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {bookingMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDatePicker;