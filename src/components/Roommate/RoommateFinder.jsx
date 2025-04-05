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
  const [propertySurveys, setPropertySurveys] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view roommate listings");
          setLoading(false);
          return;
        }

        // Fetch shared properties
        const propertiesRes = await axios.get(
          "http://localhost:8000/api/property/all",
          {
            params: { type: "Sharing" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch surveys for these properties
        const surveyRes = await axios.get("http://localhost:8000/api/surveys", {
          params: {
            propertyIds: propertiesRes.data.map(p => p._id).join(',')
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        // Create survey map
        const surveysMap = surveyRes.data.reduce((acc, survey) => {
          acc[survey.property] = survey;
          return acc;
        }, {});

        setPropertySurveys(surveysMap);
        setListings(propertiesRes.data.filter(p => p.type === "Sharing"));

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to load data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    const survey = propertySurveys[property._id];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Shared Accommodation
                  </p>
                </div>

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

                {survey && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">Roommate Preferences</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Sleep Schedule:</span>{" "}
                        <span className="capitalize">{survey.sleepSchedule}</span>
                      </div>
                      <div>
                        <span className="font-medium">Smoking:</span>{" "}
                        <span className="capitalize">{survey.smoking}</span>
                      </div>
                      <div>
                        <span className="font-medium">Noise Preference:</span>{" "}
                        {survey.noisePreference}/5
                      </div>
                      <div>
                        <span className="font-medium">Neatness:</span>{" "}
                        {survey.neatness}/5
                      </div>
                    </div>
                  </div>
                )}

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
        pageType="dashboard"
      />

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Room Sharing Listings
            </h1>
          </div>

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

          {selectedProperty && (
            <PropertyModal
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}

          {!loading && listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No shared accommodations available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateFinder;