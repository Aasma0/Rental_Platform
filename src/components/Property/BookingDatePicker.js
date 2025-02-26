import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingDatePicker.css'; // Import custom styles

const BookingDatePicker = ({ bookedDates, onBook }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');

    const isBooked = (date) => {
        return bookedDates.some((bookedDate) => {
            const bookedStart = new Date(bookedDate.start);
            const bookedEnd = new Date(bookedDate.end);
            return date >= bookedStart && date <= bookedEnd;
        });
    };

    const handleBooking = () => {
        if (startDate && endDate) {
            if (isDateRangeAvailable(startDate, endDate)) {
                onBook(startDate, endDate);
                setStartDate(null);
                setEndDate(null);
                setError('');
            } else {
                setError('Selected dates are not available.');
            }
        }
    };

    const isDateRangeAvailable = (start, end) => {
        return !bookedDates.some((bookedDate) => {
            const bookedStart = new Date(bookedDate.start);
            const bookedEnd = new Date(bookedDate.end);
            return (start < bookedEnd && end > bookedStart);
        });
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Select Booking Dates</h2>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select start date"
                className="border rounded p-2 mb-2 w-full"
                filterDate={(date) => !isBooked(date)}
                dayClassName={(date) => (isBooked(date) ? 'booked-date' : undefined)}
            />
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select end date"
                className="border rounded p-2 mb-2 w-full"
                minDate={startDate}
                filterDate={(date) => !isBooked(date)}
                dayClassName={(date) => (isBooked(date) ? 'booked-date' : undefined)}
            />
            <button onClick={handleBooking} className="bg-blue-500 text-white py-2 px-4 rounded">
                Book Now
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default BookingDatePicker;