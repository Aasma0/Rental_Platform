// PropertyCreation.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

// Nepal coordinates (Kathmandu)
const NEPAL_COORDINATES = {
  lat: 27.7172,
  lng: 85.3240,
  address: "Kathmandu, Nepal"
};

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent = ({ location, onMapClick }) => {
  const currentCenter = location.lat && location.lng 
    ? [location.lat, location.lng] 
    : [NEPAL_COORDINATES.lat, NEPAL_COORDINATES.lng];

  return (
    <div className="h-64 w-full z-0">
      <MapContainer
        center={currentCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={{ lat: location.lat, lng: location.lng }} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentCenter} />
        <MapEvents onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
};

const PropertyCreation = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ 
    address: NEPAL_COORDINATES.address,
    lat: NEPAL_COORDINATES.lat,
    lng: NEPAL_COORDINATES.lng
  });
  const [price, setPrice] = useState("");
  const [pricingUnit, setPricingUnit] = useState("Per Day");
  const [totalPrice, setTotalPrice] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [propertyType, setPropertyType] = useState("");
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category/all");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tags/view");
        setTags(Array.isArray(response.data.tags) ? response.data.tags : []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const reverseGeocode = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.address) {
        const address = data.display_name || 
          `${data.address.road || ""} ${data.address.house_number || ""}, 
          ${data.address.city || data.address.town || ""}, 
          ${data.address.country || ""}`.replace(/\s+/g, " ").trim();
        setLocation(prev => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setError("Failed to fetch address for selected location.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapClick = useCallback((lat, lng) => {
    setLocation(prev => ({ ...prev, lat, lng }));
    reverseGeocode(lat, lng);
  }, []);

  const handleAddressSearch = useCallback(async () => {
    if (!location.address.trim()) {
      setError("Please enter an address to search");
      return;
    }
  
    setIsGeocoding(true);
    try {
      const response = await fetch(
        // Add countrycodes=np to limit to Nepal
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=np&q=${encodeURIComponent(location.address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const firstResult = data[0];
        setLocation({
          address: firstResult.display_name,
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon),
        });
      } else {
        setError("Location not found in Nepal. Please try a different address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Failed to search location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  }, [location.address]);

  const handleAddressChange = (e) => {
    setLocation(prev => ({ 
      ...prev, 
      address: e.target.value 
    }));
    setError("");
  };

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) return prev.filter(id => id !== tagId);
      if (prev.length < 10) return [...prev, tagId];
      setError("Maximum 10 tags allowed");
      return prev;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    setImages(files);
    setError("");
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    if (type === "Selling") {
      setPricingUnit("");
      setTotalPrice("");
    } else {
      setPricingUnit("Per Day");
      setTotalPrice("");
    }
  };

  const handlePricingUnitChange = (unit) => {
    setPricingUnit(unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!propertyType) {
      setError("Please select property type");
      setIsSubmitting(false);
      return;
    }

    if (!location.lat || !location.lng) {
      setError("Please select a valid location");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location.address);
    formData.append("coordinates", JSON.stringify({ 
      lat: location.lat || NEPAL_COORDINATES.lat, 
      lng: location.lng || NEPAL_COORDINATES.lng 
    }));
    formData.append("price", price);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("type", propertyType);

    if (propertyType === "Renting") {
      formData.append("pricingUnit", pricingUnit);
    } else {
      formData.append("totalPrice", totalPrice);
    }

    images.forEach(image => formData.append("images", image));

    try {
      const response = await axios.post("http://localhost:8000/api/property/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dash");
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.response?.data?.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
      
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Create New Property</h1>
              <p className="text-blue-100 mt-1">Enter property details and location</p>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Property title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed description..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handlePropertyTypeChange("Renting")}
                      className={`p-3 rounded-lg border-2 ${
                        propertyType === "Renting"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePropertyTypeChange("Selling")}
                      className={`p-3 rounded-lg border-2 ${
                        propertyType === "Selling"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                    <input
  type="text"
  value={location.address}
  onChange={handleAddressChange}
  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
  placeholder="Search locations in Nepal..."
  required
  onKeyPress={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddressSearch();
    }
  }}
/>
                      <button
                        type="button"
                        onClick={handleAddressSearch}
                        disabled={isGeocoding}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isGeocoding ? "Searching..." : "Search"}
                      </button>
                    </div>
                    <div className="relative">
                      {isGeocoding && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      <MapComponent location={location} onMapClick={handleMapClick} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {propertyType === "Selling" ? "Total Price ($)" : "Price ($)"}
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Enter amount"
                      min="0"
                      required
                    />
                  </div>
                  {propertyType === "Renting" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Billing Period</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Per Day", "Per Week", "Per Month"].map((unit) => (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => handlePricingUnitChange(unit)}
                            className={`p-2 rounded-lg border ${
                              pricingUnit === unit
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 hover:border-blue-300"
                            }`}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Property Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600">
                        {images.length > 0
                          ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
                          : "Click to upload images (max 10)"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB each</p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Amenities (max 10)
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {selectedTags.length}/10 selected
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagClick(tag._id)}
                        className={`px-3 py-1 rounded-full border flex items-center ${
                          selectedTags.includes(tag._id)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        {selectedTags.includes(tag._id) && (
                          <svg
                            className="w-4 h-4 mr-1 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Creating Property...</span>
                    </div>
                  ) : (
                    "Create Property"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCreation;