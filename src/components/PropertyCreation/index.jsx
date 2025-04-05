import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarSection from '../../components/LandingPage/NavBar';
import Sidebar from '../../components/LandingPage/Sidebar';
import MapComponent from './MapComponent';
import PriceSection from './PriceSection';
import ImageUpload from './ImageUpload';
import Amenities from './Amenities';
import RoommateSurveyModal from '../Roommate/RoommateSurveyModal';

const NEPAL_COORDINATES = {
  lat: 27.7172,
  lng: 85.3240,
  address: "Kathmandu, Nepal"
};

const PropertyCreation = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(NEPAL_COORDINATES);
  const [price, setPrice] = useState('');
  const [pricingUnit, setPricingUnit] = useState('Per Day');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sellCategoryId, setSellCategoryId] = useState('');
  const [sharedCategoryId, setSharedCategoryId] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [propertyType, setPropertyType] = useState('');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category/all");
        const categories = response.data.categories || [];
        setCategories(categories);
        
        const sellCategory = categories.find(cat => cat.name === "Sell");
        const sharedCategory = categories.find(cat => cat.name === "Shared");
        
        if (sellCategory) setSellCategoryId(sellCategory._id);
        if (sharedCategory) setSharedCategoryId(sharedCategory._id);
        
        // Auto-set category based on type
        if (propertyType === "Selling" && sellCategory) {
          setCategory(sellCategory._id);
        }
        if (propertyType === "Sharing" && sharedCategory) {
          setCategory(sharedCategory._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [propertyType]);

  // Handle survey requirements
  useEffect(() => {
    const selectedCategory = categories.find(cat => cat._id === category);
    if ((selectedCategory?.name === 'Shared' || propertyType === 'Sharing') && !surveyResponses) {
      setShowSurveyModal(true);
    }
  }, [category, categories, propertyType, surveyResponses]);

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

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    if (type === "Selling") {
      setPricingUnit("");
      if (sellCategoryId) setCategory(sellCategoryId);
    } else if (type === "Sharing") {
      setPricingUnit("Per Month");
      if (sharedCategoryId) setCategory(sharedCategoryId);
    } else {
      setPricingUnit("Per Day");
      setCategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
  
    // Validation checks
    const errors = [];
    if (!propertyType) errors.push("Please select property type");
    if (propertyType === "Selling" && !sellCategoryId) errors.push("Sell category not found");
    if ((propertyType === "Sharing" || category === sharedCategoryId) && !surveyResponses) {
      errors.push("Please complete the roommate compatibility survey");
    }
    if (!location.lat || !location.lng) errors.push("Please select a valid location");
    if (!localStorage.getItem("token")) errors.push("Authentication required");
  
    if (errors.length > 0) {
      setError(errors.join(". "));
      setIsSubmitting(false);
      return;
    }
  
    // Ensure survey data is properly structured
    const surveyData = surveyResponses ? {
      sleepSchedule: surveyResponses.sleepSchedule,
      smoking: surveyResponses.smoking,
      noisePreference: parseInt(surveyResponses.noisePreference),
      neatness: parseInt(surveyResponses.neatness)
    } : null;
  
    const formData = new FormData();
    // Common fields
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
  
    // Add survey data if exists
    if (surveyData) {
      formData.append("survey", JSON.stringify(surveyData));
    }
  
    // Type-specific fields
    if (propertyType === "Selling") {
      formData.append("totalPrice", price);
    } else {
      formData.append("pricingUnit", pricingUnit || "Per Day");
    }
  
    // Images
    images.forEach(image => formData.append("images", image));
  
    try {
      await axios.post("http://localhost:8000/api/property/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                {/* Basic Info */}
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

                {/* Transaction Type Selector */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Transaction Type</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Renting', 'Selling', 'Sharing'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePropertyTypeChange(type)}
                        className={`p-3 rounded-lg border-2 ${
                          propertyType === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Map Component */}
                <MapComponent
                  location={location}
                  onMapClick={handleMapClick}
                  isGeocoding={isGeocoding}
                  onAddressSearch={handleAddressSearch}
                  onAddressChange={(e) => setLocation(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                />

                {/* Price Section */}
                <PriceSection
                  propertyType={propertyType}
                  price={price}
                  onPriceChange={setPrice}
                  pricingUnit={pricingUnit}
                  onPricingUnitChange={setPricingUnit}
                />

                {/* Image Upload */}
                <ImageUpload
                  images={images}
                  onImageChange={setImages}
                  error={error}
                />

                {/* Category Selector */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value !== sharedCategoryId) setSurveyResponses(null);
                      if (!["Selling", "Sharing"].includes(propertyType)) {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    required
                    disabled={["Selling", "Sharing"].includes(propertyType)}
                  >
                    {propertyType === "Selling" ? (
                      <option value={sellCategoryId}>Sell</option>
                    ) : propertyType === "Sharing" ? (
                      <option value={sharedCategoryId}>Shared Accommodation</option>
                    ) : (
                      <>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {(propertyType === "Sharing" || category === sharedCategoryId) && !surveyResponses && (
                    <p className="text-red-500 text-sm mt-2">
                      ⚠️ Shared accommodations require completing the compatibility survey
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <Amenities
                  tags={tags}
                  selectedTags={selectedTags}
                  onTagClick={(tagId) => setSelectedTags(prev => {
                    if (prev.includes(tagId)) return prev.filter(id => id !== tagId);
                    if (prev.length < 10) return [...prev, tagId];
                    setError("Maximum 10 tags allowed");
                    return prev;
                  })}
                />

                {/* Submit Button */}
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

      {/* Survey Modal */}
      <RoommateSurveyModal
        show={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSave={(data) => {
          setSurveyResponses(data);
          setShowSurveyModal(false);
        }}
      />
    </div>
  );
};

export default PropertyCreation;