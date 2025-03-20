import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingDatePicker = ({ bookedDates, onBook }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleBooking = () => {
    if (startDate && endDate && startDate < endDate) {
      onBook(startDate, endDate);  // Pass the dates to PropertyCard for validation and booking
    } else {
      setError("Please select a valid booking date range.");
    }
  };

  const isDateBooked = (date) => {
    return bookedDates.some((bookedDate) => {
      const bookedStart = new Date(bookedDate.start);
      const bookedEnd = new Date(bookedDate.end);
      return date >= bookedStart && date <= bookedEnd;
    });
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Select Dates</h3>
      <div className="flex justify-between items-center">
        <div>
          <h4>Start Date</h4>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            filterDate={(date) => !isDateBooked(date)}
            dateFormat="MM/dd/yyyy"
            className="border p-2 rounded"
          />
        </div>

        <div>
          <h4>End Date</h4>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            filterDate={(date) => !isDateBooked(date)}
            dateFormat="MM/dd/yyyy"
            className="border p-2 rounded"
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        <button
          onClick={handleBooking}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingDatePicker;
