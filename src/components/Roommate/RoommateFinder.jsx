import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

const RoommateFinder = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchSharedProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view shared accommodations");
          setLoading(false);
          return;
        }

        // Frontend API call should be:
const response = await axios.get("http://localhost:8000/api/property/all", {
  params: {
    type: "Sharing",
    populate: "owner,survey"
  },
  headers: { Authorization: `Bearer ${token}` }
});

        // Double filter to ensure only Sharing properties
        const sharedProperties = response.data.filter(
          property => property.type === "Sharing"
        );
        setListings(sharedProperties);

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to load shared properties");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProperties();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(price).replace("NPR", "Rs");
  };

  const PropertyModal = ({ property, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const owner = property.owner || {};
    const survey = property.survey || {};

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{property.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg">
                  {property.images?.length > 0 ? (
                    <>
                      <img
                        src={property.images[selectedImage]}
                        alt="Property"
                        className="w-full h-64 object-contain mx-auto"
                      />
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {selectedImage + 1} of {property.images.length}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      <span className="text-gray-500">No images available</span>
                    </div>
                  )}
                </div>

                {property.images?.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`border-2 ${
                          index === selectedImage
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                {/* Pricing */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      / {property.pricingUnit}
                    </span>
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
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

                {/* Owner Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg">Owner Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {owner.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {owner.email}
                    </div>
                    {owner.phone && (
                      <div>
                        <span className="font-medium">Phone:</span> {owner.phone}
                      </div>
                    )}
                  </div>
                </div>

                // Inside PropertyModal component
{/* Survey Answers */}
{survey && (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-semibold mb-3 text-lg">Roommate Preferences</h3>
    <div className="space-y-2">
      <div>
        <span className="font-medium">Sleep Schedule:</span>{" "}
        <span className="capitalize">
          {survey.sleepSchedule || "Not specified"}
        </span>
      </div>
      <div>
        <span className="font-medium">Smoking:</span>{" "}
        <span className="capitalize">
          {survey.smoking || "Not specified"}
        </span>
      </div>
      <div>
        <span className="font-medium">Noise Preference:</span>{" "}
        {survey.noisePreference ? `${survey.noisePreference}/5` : "Not specified"}
      </div>
      <div>
        <span className="font-medium">Neatness:</span>{" "}
        {survey.neatness ? `${survey.neatness}/5` : "Not specified"}
      </div>
    </div>
  </div>
)}

                {/* Description */}
                {property.description && (
                  <div className="text-gray-600">
                    <p className="font-semibold">Description:</p>
                    <p className="mt-1 whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}
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
      />

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shared Accommodations
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div 
                  className="cursor-pointer" 
                  onClick={() => setSelectedProperty(property)}
                >
                  {property.images?.[0] ? (
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
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProperty(property)}
                  className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {!loading && listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No shared accommodations available currently
              </p>
            </div>
          )}

          {selectedProperty && (
            <PropertyModal
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateFinder;