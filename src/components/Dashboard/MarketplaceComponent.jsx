// src/components/Marketplace/Marketplace.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

const Marketplace = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchSellingProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view properties");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/property/all",
          {
            params: {
              type: "Selling",
              populate: "owner"
            },
            headers: { 
              Authorization: `Bearer ${token}` 
            }
          }
        );
        
        setProperties(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to fetch properties. Please try again later.");
        }
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellingProperties();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      currencyDisplay: "symbol",
    })
      .format(price)
      .replace("NPR", "Rs");
  };

  const PropertyModal = ({ property, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const owner = property?.owner || {};

    if (!property) return null;

    const handleImageClick = (img, index) => {
      setSelectedImage(img);
      setCurrentImageIndex(index);
    };

    const navigateImage = (direction) => {
      if (!property.images?.length) return;

      let newIndex;
      if (direction === "prev") {
        newIndex =
          (currentImageIndex - 1 + property.images.length) %
          property.images.length;
      } else {
        newIndex = (currentImageIndex + 1) % property.images.length;
      }

      setSelectedImage(property.images[newIndex]);
      setCurrentImageIndex(newIndex);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {property.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Gallery Section */}
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg">
                  {property.images?.length > 0 ? (
                    <>
                      <img
                        src={selectedImage || property.images[0]}
                        alt="Property display"
                        className="w-full h-96 object-contain mx-auto"
                      />
                      {selectedImage && (
                        <>
                          <button
                            onClick={() => navigateImage("prev")}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigateImage("next")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 text-center">
                            <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              {currentImageIndex + 1} of{" "}
                              {property.images.length}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center">
                      <span className="text-gray-500">No images available</span>
                    </div>
                  )}
                </div>

                {property.images?.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                    {property.images.map((img, index) => (
                      <div
                        key={index}
                        className={`aspect-square cursor-pointer rounded border-2 transition-all ${
                          selectedImage === img ||
                          (!selectedImage && index === 0)
                            ? "border-blue-500 scale-105"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => handleImageClick(img, index)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(property.totalPrice || property.price)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{property.type}</p>
                </div>

                {/* Owner Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Owner Details</h3>
                  <div className="space-y-2">
                    {owner.name && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Name:</span>
                        <span>{owner.name}</span>
                      </div>
                    )}
                    {owner.email && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Email:</span>
                        <a
                          href={`mailto:${owner.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {owner.email}
                        </a>
                      </div>
                    )}
                    {owner.phone && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Phone:</span>
                        <a
                          href={`tel:${owner.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {owner.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{property.location}</span>
                </div>

                {property.description && (
                  <div className="text-gray-600">
                    <p className="font-semibold">Description:</p>
                    <p className="mt-1 whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {property.tags?.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavbarSection toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        pageType="dashboard"
      />

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Properties for Sale
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  {property.images?.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(property.totalPrice || property.price)}
                      </p>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {property.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{property.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {property.tags?.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="bg-blue-600 text-white py-2 px-6 mb-8 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedProperty && (
            <PropertyModal
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}

          {properties.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No properties currently available for sale
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;