import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StripeContainer from "./StripeContainer";
import { differenceInDays, addDays, isWithinInterval, format } from "date-fns";

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
  const [pricingBreakdown, setPricingBreakdown] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [excludedDateIntervals, setExcludedDateIntervals] = useState([]);

  // Fetch booked dates when component mounts
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/booking/booked-dates/${property._id}`
        );
        const data = await response.json();
        setBookedDates(data.bookedDates);
        
        const intervals = data.bookedDates.map(({ startDate, endDate }) => ({
          start: new Date(startDate),
          end: new Date(endDate),
        }));
        setExcludedDateIntervals(intervals);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    if (property?._id) {
      fetchBookedDates();
    }
  }, [property]);

  // Calculate total price based on selected dates and pricing unit
  useEffect(() => {
    if (startDate && endDate && property?.price) {
      const days = differenceInDays(endDate, startDate) + 1;
      const { totalPrice, breakdown } = calculateFairPrice(
        days,
        property.price,
        property.pricingUnit
      );
      setTotalPrice(totalPrice);
      setPricingBreakdown(breakdown);
    }
  }, [startDate, endDate, property]);

  // Style booked dates
  const getDayClassName = (date) => {
    const isBooked = bookedDates.some(({ startDate, endDate }) => 
      isWithinInterval(date, {
        start: new Date(startDate),
        end: new Date(endDate),
      })
    );
    return isBooked ? "booked-day" : "";
  };

  // Fair pricing calculation function
  const calculateFairPrice = (days, basePrice, pricingUnit = "Per Day") => {
    let totalPrice = 0;
    let breakdown = {
      fullPeriods: 0,
      partialDays: 0,
      fullPeriodsPrice: 0,
      partialDaysPrice: 0,
      discount: 0,
    };

    switch (pricingUnit) {
      case "Per Month":
        const fullMonths = Math.floor(days / 30);
        const partialDays = days % 30;
        breakdown.fullPeriods = fullMonths;
        breakdown.fullPeriodsPrice = fullMonths * basePrice;
        if (partialDays > 0) {
          const dailyRate = basePrice / 30;
          const partialPrice = dailyRate * partialDays;
          breakdown.partialDays = partialDays;
          const discount = partialPrice * 0.03;
          breakdown.discount = discount;
          breakdown.partialDaysPrice = partialPrice - discount;
        }
        totalPrice = breakdown.fullPeriodsPrice + breakdown.partialDaysPrice;
        break;

      case "Per Week":
        const fullWeeks = Math.floor(days / 7);
        const remainingDays = days % 7;
        breakdown.fullPeriods = fullWeeks;
        breakdown.fullPeriodsPrice = fullWeeks * basePrice;
        if (remainingDays > 0) {
          const dailyRate = basePrice / 7;
          const partialPrice = dailyRate * remainingDays;
          breakdown.partialDays = remainingDays;
          const discount = partialPrice * 0.03;
          breakdown.discount = discount;
          breakdown.partialDaysPrice = partialPrice - discount;
        }
        totalPrice = breakdown.fullPeriodsPrice + breakdown.partialDaysPrice;
        break;

      default: // Per Day
        totalPrice = days * basePrice;
        breakdown.fullPeriods = days;
        breakdown.fullPeriodsPrice = totalPrice;
        break;
    }

    return { totalPrice: parseFloat(totalPrice.toFixed(2)), breakdown };
  };

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
      pay_later: "pay_later",
    };

    const paidAmount =
      method === "pay_later"
        ? 0
        : method === "partial"
        ? totalPrice * 0.5
        : totalPrice;

    const remainingBalance = Math.max(0, totalPrice - paidAmount);

    try {
      const response = await fetch(
        `http://localhost:8000/api/booking/book/${property._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            paymentType: paymentTypeMap[method],
            paidAmount: paidAmount,
            depositAmount: method === "partial" ? totalPrice * 0.5 : 0,
            remainingBalance: remainingBalance,
          }),
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

      const { booking } = await createBookingRecord(method);
      setBookingDetails(booking);

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

      const status = paymentType === "partial" ? "partially_paid" : "paid";

      const response = await fetch(
        `http://localhost:8000/api/booking/confirm/${bookingDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment confirmation failed");
      }

      setBookingMessage("Payment successful! Booking confirmed.");
      setIsBookingConfirmed(true);
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Display pricing breakdown info
  const renderPricingInfo = () => {
    if (!pricingBreakdown || !property) return null;

    const days = differenceInDays(endDate, startDate) + 1;
    const pricingUnit = property.pricingUnit || "Per Day";

    return (
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm font-medium mb-1">
          {days} {days === 1 ? "night" : "nights"} · Rs {totalPrice.toFixed(2)}
        </p>

        {pricingUnit !== "Per Day" && (
          <div className="text-xs text-gray-600 mt-1">
            {pricingBreakdown.fullPeriods > 0 && (
              <p>
                {pricingBreakdown.fullPeriods}{" "}
                {pricingUnit === "Per Month"
                  ? pricingBreakdown.fullPeriods === 1
                    ? "month"
                    : "months"
                  : pricingBreakdown.fullPeriods === 1
                  ? "week"
                  : "weeks"}
                : Rs {pricingBreakdown.fullPeriodsPrice.toFixed(2)}
              </p>
            )}

            {pricingBreakdown.partialDays > 0 && (
              <p>
                {pricingBreakdown.partialDays}{" "}
                {pricingBreakdown.partialDays === 1 ? "day" : "days"}: Rs{" "}
                {pricingBreakdown.partialDaysPrice.toFixed(2)}
                {pricingBreakdown.discount > 0 && (
                  <span className="text-green-600"> (3% discount applied)</span>
                )}
              </p>
            )}
          </div>
        )}

        {paymentType === "partial" && (
          <p className="text-xs text-gray-600 mt-1">
            Deposit required: Rs{(totalPrice * 0.5).toFixed(2)}
          </p>
        )}
      </div>
    );
  };

  // Booked dates table
  const renderBookedDatesTable = () => (
    <div className="mt-6 bg-white w-96 p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">Already Booked Dates</h3>
      {bookedDates.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Start Date</th>
              <th className="pb-2">End Date</th>
              <th className="pb-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {bookedDates.map((booking, index) => {
              const start = new Date(booking.startDate);
              const end = new Date(booking.endDate);
              const duration = differenceInDays(end, start) + 1;
              
              return (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2">{format(start, "MMM dd, yyyy")}</td>
                  <td className="py-2">{format(end, "MMM dd, yyyy")}</td>
                  <td className="py-2">
                    {duration} {duration === 1 ? "day" : "days"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      {/* Date Selection */}
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Book Your Stay</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in
            </label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              minDate={new Date()}
              excludeDateIntervals={excludedDateIntervals}
              dayClassName={getDayClassName}
              className="w-full p-2 border rounded-md"
              placeholderText="Select start date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out
            </label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              minDate={startDate || new Date()}
              excludeDateIntervals={excludedDateIntervals}
              dayClassName={getDayClassName}
              className="w-full p-2 border rounded-md"
              placeholderText="Select end date"
            />
          </div>
        </div>

        {startDate && endDate && renderPricingInfo()}

        <button
          onClick={handleProceedToPayment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          disabled={!startDate || !endDate}
        >
          Continue to Payment
        </button>
      </div>

      {/* Booked Dates Table */}
      {renderBookedDatesTable()}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                {!paymentType && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Method
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => handlePaymentMethod(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      disabled={isLoading}
                    >
                      <option value="">Choose option</option>
                      <option value="card">Full Payment (Credit/Debit)</option>
                      <option value="partial">
                        Partial Payment (50% Deposit)
                      </option>
                      <option value="pay_later">Pay at Check-in</option>
                    </select>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {showCardDetails && bookingDetails && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {paymentType === "partial"
                        ? `Deposit Payment: $${(totalPrice * 0.5).toFixed(2)}`
                        : `Full Payment: $${totalPrice.toFixed(2)}`}
                    </h4>
                    <StripeContainer
                      amount={
                        paymentType === "partial"
                          ? totalPrice * 0.5
                          : totalPrice
                      }
                      booking={bookingDetails}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4 bg-green-50 rounded-md">
                <h4 className="text-green-600 font-semibold mb-2">
                  Booking Confirmed!
                </h4>
                <p className="text-sm text-gray-600">{bookingMessage}</p>
              </div>
            )}

            {bookingMessage && !isLoading && !isBookingConfirmed && (
              <div
                className={`mt-4 p-2 rounded-md text-sm ${
                  bookingMessage.includes("success") ||
                  bookingMessage.includes("confirmed")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
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