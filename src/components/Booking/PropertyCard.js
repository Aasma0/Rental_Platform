import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import BookingDatePicker from "./BookingDatePicker";

const PropertyCard = ({ property }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null);

  const handleViewClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setZoomedImageIndex(null);
  };

  const handleBookClick = () => {
    setIsBooking(true);
  };

  // Handle image click to zoom in
  const handleImageClick = (index) => {
    setZoomedImageIndex(index);
  };

  // Handle image download
  const handleImageDownload = () => {
    const image = property.images[zoomedImageIndex];
    const link = document.createElement("a");
    link.href = image;
    link.download = image.split("/").pop();
    link.click();
  };

  // Handle back to modal from zoomed image
  const handleBackToModal = () => {
    setZoomedImageIndex(null);
  };

  // Handle next and previous image navigation
  const handleNextImage = () => {
    setZoomedImageIndex(
      (prevIndex) => (prevIndex + 1) % property.images.length
    );
  };

  const handlePrevImage = () => {
    setZoomedImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + property.images.length) % property.images.length
    );
  };

  return (
    <div className="max-w-xs border border-gray-300 m-4">
      {/* Property Card Header with Image */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover cursor-pointer"
          src={property.images[0]}
          alt={property.title}
          onClick={() => handleImageClick(0)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <h3 className="font-bold text-xl">{property.title}</h3>
          <p className="text-lg">
  {property.type === "Renting"
    ? `Rs. ${property.price} ${property.pricingUnit.toLowerCase()}`
    : `Rs. ${property.totalPrice}`}
</p>




        </div>
      </div>

      {/* Property Card Body */}
      <div className="px-6 py-4">
        <p className="text-gray-700 text-base">{property.description}</p>
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

      {/* Property Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 w-4/5 max-w-lg relative overflow-y-auto max-h-[90vh]">
            <span
              className="absolute top-2 right-2 cursor-pointer text-gray-500 text-lg font-bold"
              onClick={handleClose}
            >
              &times;
            </span>

            {/* All Property Details */}
            <h2 className="text-xl font-bold mb-2">{property.title}</h2>
            <p className="text-gray-700 mb-1">
              <strong>Type:</strong> {property.type}
            </p>
            {property.type === "Renting" ? (
              <p className="text-gray-700 mb-1">
  <strong>Price:</strong> Rs. {property.price} {property.pricingUnit.toLowerCase()}
</p>

            ) : (
              <p className="text-gray-700 mb-1">
  <strong>Total Price:</strong> Rs. {property.totalPrice}
</p>

            )}
            <p className="text-gray-700 mb-1">
              <strong>Location:</strong> {property.location}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Category:</strong> {property.category?.name || "N/A"}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Description:</strong> {property.description}
            </p>

            {/* Owner Details */}
            <div className="mt-3">
              <p className="text-gray-700 mb-1">
                <strong>Owner Name:</strong> {property.owner?.name || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Owner Email:</strong> {property.owner?.email || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Owner Number:</strong> {property.owner?.number || "N/A"}
              </p>
            </div>

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
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 w-fit max-w-4xl relative">
            <span
              className="absolute top-2 right-2 cursor-pointer text-gray-500 text-lg font-bold"
              onClick={() => setIsBooking(false)}
            >
              &times;
            </span>

            <h2 className="text-xl font-bold mb-4">Book: {property.title}</h2>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-3">Select Dates</h3>
              <BookingDatePicker property={property} />
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
