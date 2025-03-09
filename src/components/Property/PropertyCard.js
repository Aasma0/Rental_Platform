import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const PropertyCard = ({ property, bookedDates, onBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null); // State to track zoomed image index

  const handleViewClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setZoomedImageIndex(null); // Reset zoomed image when closing
  };

  const handleBookClick = () => {
    setIsBooking(true);
  };

  const confirmBooking = async () => {
    if (startDate && endDate) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setBookingMessage("You must be logged in to book a property.");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/booking/book/${property._id}`,
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
          setBookingMessage("Booking successful!");
          onBook(startDate, endDate);
          setStartDate(null);
          setEndDate(null);
          setIsBooking(false);
        } else {
          setBookingMessage(data.message || "Booking failed.");
        }
      } catch (error) {
        console.error("Error booking property:", error);
        setBookingMessage("An error occurred. Please try again.");
      }
    } else {
      setBookingMessage("Please select a valid booking date range.");
    }
  };

  const isBooked = (date) => {
    return bookedDates.some((bookedDate) => {
      const bookedStart = new Date(bookedDate.start);
      const bookedEnd = new Date(bookedDate.end);
      return date >= bookedStart && date <= bookedEnd;
    });
  };

  // Handle image click to zoom in
  const handleImageClick = (index) => {
    setZoomedImageIndex(index); // Set the clicked image index
  };

  // Handle image download
  const handleImageDownload = () => {
    const image = property.images[zoomedImageIndex];
    const link = document.createElement("a");
    link.href = image;
    link.download = image.split("/").pop(); // Automatically set download name from the image URL
    link.click();
  };

  // Handle back to modal from zoomed image
  const handleBackToModal = () => {
    setZoomedImageIndex(null); // Reset zoomed image to go back to the modal
  };

  // Handle next and previous image navigation
  const handleNextImage = () => {
    setZoomedImageIndex(
      (prevIndex) => (prevIndex + 1) % property.images.length
    ); // Go to the next image, loop around
  };

  const handlePrevImage = () => {
    setZoomedImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + property.images.length) % property.images.length
    ); // Go to the previous image, loop around
  };

  return (
    <div className="max-w-xs border border-gray-300 m-4">
      <div className="relative">
        <img
          className="w-full h-48 object-cover cursor-pointer"
          src={property.images[0]}
          alt={property.title}
          onClick={() => handleImageClick(0)} // Enable image zoom on click
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 w-4/5 max-w-lg relative">
            <span
              className="absolute top-2 right-2 cursor-pointer text-gray-500 text-lg font-bold"
              onClick={handleClose}
            >
              &times;
            </span>

            {/* Property Details */}
            <h2 className="text-xl font-bold mb-2">{property.title}</h2>
            <p className="text-gray-700">
              <strong>Price:</strong> ${property.price}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {property.location}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {property.category?.name || "N/A"}
            </p>

            {/* Tags Section */}
            <p className="text-gray-700 font-semibold mt-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {property.tags.length > 0 ? (
                property.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No tags available</p>
              )}
            </div>

            {/* Property Images */}
            <h3 className="text-lg font-semibold mt-4">Images</h3>
            <div className="grid grid-cols-5 gap-2">
              {property.images.map((img, index) => (
                <div key={index} className="p-1">
                  <img
                    className="w-full h-auto cursor-pointer object-cover"
                    src={img}
                    alt={`Property ${index}`}
                    onClick={() => handleImageClick(index)} // Zoom in on image click
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Modal */}
      {zoomedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-5 relative">
            <span
              className="absolute top-2 right-2 cursor-pointer text-black text-lg font-bold"
              onClick={handleClose}
            >
              &times;
            </span>

            {/* Back Icon */}
            <span
              className="absolute top-2 left-2 cursor-pointer text-gray-500 text-lg font-bold"
              onClick={handleBackToModal}
            >
              &lt; Back
            </span>

            {/* Navigation Icons */}
            <span
              className="absolute top-1/2 left-0 cursor-pointer text-gray-500 text-3xl font-bold transform -translate-y-1/2"
              onClick={handlePrevImage}
            >
              &lt;
            </span>
            <span
              className="absolute top-1/2 right-0 cursor-pointer text-gray-500 text-3xl font-bold transform -translate-y-1/2"
              onClick={handleNextImage}
            >
              &gt;
            </span>

            <div className="w-[600px] h-[550px] flex justify-center items-center bg-white">
              <img
                className="max-w-full max-h-full object-contain"
                src={property.images[zoomedImageIndex]}
                alt="Zoomed Image"
              />
              <div className="absolute bottom-3">
                <button
                  onClick={handleImageDownload}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  View Full Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
