import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import BookingDatePicker from "./BookingDatePicker";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  FiMapPin,
  FiEye,
  FiFileText,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiHome,
  FiTag,
  FiUser,
  FiMail,
  FiPhone,
  FiInfo,
  FiStar,
} from "react-icons/fi";

const PropertyCard = ({ property, bookedDates, onBook }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null);

  const propertyImages = Array.isArray(property?.images) ? property.images : [];
  const hasImages = propertyImages.length > 0;
  const owner = property?.owner || {};
  const hasOwnerInfo = owner.name || owner.email || owner.phone;
  const amenities = Array.isArray(property?.tagNames) ? property.tagNames : [];

  const handleViewClick = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setZoomedImageIndex(null);
  };
  const handleBookClick = () => setIsBooking(true);
  const handleImageClick = (index) => setZoomedImageIndex(index);
  const handleImageDownload = () => {
    const image = propertyImages[zoomedImageIndex];
    const link = document.createElement("a");
    link.href = image;
    link.download = image.split("/").pop();
    link.click();
  };
  const handleBackToModal = () => setZoomedImageIndex(null);
  const handleNextImage = () =>
    setZoomedImageIndex((prev) => (prev + 1) % propertyImages.length);
  const handlePrevImage = () =>
    setZoomedImageIndex(
      (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
    );

  const renderPrice = () => {
    if (property.type === "Renting") {
      return `Rs. ${property.price}/${
        property.pricingUnit?.toLowerCase() || "month"
      }`;
    } else if (property.type === "Selling") {
      return `Rs. ${property.totalPrice || property.price}`;
    } else {
      return `Rs. ${property.price}/${
        property.pricingUnit?.toLowerCase() || "month"
      }`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {hasImages ? (
          <img
            className="w-full h-full object-cover cursor-pointer"
            src={propertyImages[0]}
            alt={property.title}
            onClick={() => handleImageClick(0)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{property.title}</h3>
          <div className="text-white/90 text-sm flex items-center mt-1">
            <FiMapPin className="w-4 h-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
          {renderPrice()}
        </div>

        <div className="absolute top-2 left-2 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
          {property.categoryName || property.type}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {property.description}
        </p>

        {amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-700 mb-1">
              <FiStar className="w-4 h-4 mr-1" />
              <span className="font-medium">Amenities</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {amenities.length > 4 && (
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                  +{amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 mt-auto">
          <button
            onClick={handleViewClick}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Details
          </button>
          <button
            onClick={handleBookClick}
            className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Book
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{property.title}</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {hasImages ? (
                <Swiper
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  className="h-64 mb-6 rounded-xl overflow-hidden"
                >
                  {propertyImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(index)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="h-64 mb-6 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Images Available</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-medium flex items-center">
                    <FiInfo className="w-4 h-4 mr-1" />
                    {property.type || "Property"}
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium flex items-center ml-2">
                    <FiHome className="w-4 h-4 mr-1" />
                    {property.categoryName || "Property"}
                  </div>
                </div>
                <div className="text-xl font-semibold text-green-600">
                  {renderPrice()}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Property Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiMapPin className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-gray-600">{property.location}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{property.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Amenities</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {amenities.length > 0 ? (
                      amenities.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200 flex items-center"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No amenities listed</span>
                    )}
                  </div>
                </div>
              </div>

              {hasOwnerInfo && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <FiUser className="w-4 h-4 mr-1" />
                    <span className="font-medium">Owner Information</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    {owner.name && (
                      <div className="flex items-center text-gray-600">
                        <FiUser className="w-4 h-4 mr-2 opacity-70" />
                        <span>{owner.name}</span>
                      </div>
                    )}
                    {owner.email && (
                      <div className="flex items-center text-gray-600">
                        <FiMail className="w-4 h-4 mr-2 opacity-70" />
                        <a
                          href={`mailto:${owner.email}`}
                          className="hover:text-blue-600"
                        >
                          {owner.email}
                        </a>
                      </div>
                    )}
                    {owner.phone && (
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="w-4 h-4 mr-2 opacity-70" />
                        <a
                          href={`tel:${owner.phone}`}
                          className="hover:text-blue-600"
                        >
                          {owner.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.type === "Sharing" && property.survey && (
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-2">
                    Roommate Preferences
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Sleep Schedule</span>
                        <span className="font-medium">{property.survey.sleepSchedule}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Smoking Preference</span>
                        <span className="font-medium">{property.survey.smoking}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Noise Preference</span>
                        <span className="font-medium">{property.survey.noisePreference} / 5</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Neatness Level</span>
                        <span className="font-medium">{property.survey.neatness} / 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                >
                  Close
                </button>
                <button
                  onClick={handleBookClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
                >
                  Proceed to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 w-fit max-w-4xl relative rounded-xl">
            <button
              onClick={() => setIsBooking(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Book: {property.title}</h2>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-3">Select Dates</h3>
              <BookingDatePicker
                property={property}
                bookedDates={bookedDates}
                onBook={onBook}
              />
            </div>
          </div>
        </div>
      )}

      {zoomedImageIndex !== null && hasImages && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
          <div className="bg-white p-5 relative rounded-xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>

            <button
              onClick={handleBackToModal}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <div className="w-[600px] h-[550px] flex justify-center items-center bg-white">
              <img
                className="max-w-full max-h-full object-contain"
                src={propertyImages[zoomedImageIndex]}
                alt="Zoomed Image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x550?text=Image+Not+Available";
                }}
              />
              <div className="absolute bottom-4 flex gap-2">
                <button
                  onClick={handlePrevImage}
                  className="p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleImageDownload}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
                >
                  <FiFileText className="w-4 h-4" />
                  Full View
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