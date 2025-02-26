import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const PropertyCard = ({ property, bookedDates, onBook }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');

    const handleViewClick = () => {
        setIsOpen(true);
    };
    
    const handleClose = () => {
        setIsOpen(false);
    };
    
    const handleBookClick = () => {
        setIsBooking(true);
    };
    
    const confirmBooking = async () => {
        if (startDate && endDate) {
            const response = await fetch(`http://localhost:8000/api/booking/book/${property._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setBookingMessage(data.message);
                onBook(startDate, endDate); // Notify parent of the booking
                setStartDate(null);
                setEndDate(null);
                setIsBooking(false);
            }
        }
    };
    
    const isBooked = (date) => {
        return bookedDates.some((bookedDate) => {
            const bookedStart = new Date(bookedDate.start);
            const bookedEnd = new Date(bookedDate.end);
            return date >= bookedStart && date <= bookedEnd;
        });
    };
    
    return (
        <div className="max-w-xs border border-gray-300 m-4">
            <div className="relative">
                <img 
                    className="w-full h-48 object-cover" 
                    src={property.images[0]} 
                    alt={property.title} 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                    <h3 className="font-bold text-xl">{property.title}</h3>
                    <p className="text-lg">${property.price}</p>
                </div>
            </div>
            <div className="px-6 py-4">
                <p className="text-gray-700 text-base">{property.description}</p>
                <p className="text-gray-700 text-base">{property.location}</p>
                {bookingMessage && <p className="text-green-500">{bookingMessage}</p>}
                <div className="flex justify-between mt-4">
                    <button 
                        onClick={handleViewClick} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                    >
                        View
                    </button>
                    <button 
                        onClick={handleBookClick} 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4"
                    >
                        Book
                    </button>
                </div>
            </div>
    
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 w-4/5 max-w-lg relative">
                        <span 
                            className="absolute top-2 right-2 cursor-pointer text-gray-500 text-lg font-bold" 
                            onClick={handleClose}
                        >
                            &times;
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                            {property.images.map((img, index) => (
                                <div key={index} className="p-1">
                                    <img className="w-full h-auto" src={img} alt={`Property ${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
    
            {isBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 w-4/5 max-w-lg">
                        <h3 className="text-lg font-bold mb-4">Select Booking Dates</h3>
                        <Calendar
                            selectRange={true}
                            onChange={(range) => {
                                setStartDate(range[0]);
                                setEndDate(range[1]);
                            }}
                            tileClassName={({ date }) => (isBooked(date) ? 'bg-red-500 text-white' : undefined)}
                        />
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={ confirmBooking} 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                            >
                                Confirm Booking
                            </button>
                            <button 
                                onClick={() => setIsBooking(false)} 
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyCard;