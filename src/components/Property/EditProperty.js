import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarSection from '../../components/LandingPage/NavBar';
import Sidebar from '../../components/LandingPage/Sidebar';
import MapComponent from '../PropertyCreation/MapComponent';
import PriceSection from '../PropertyCreation/PriceSection';
import ImageUpload from '../PropertyCreation/ImageUpload';
import Amenities from '../PropertyCreation/Amenities';
import RoommateSurveyModal from '../Roommate/RoommateSurveyModal';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  
  const [property, setProperty] = useState({
    title: '',
    description: '',
    location: { address: '', lat: 0, lng: 0 },
    price: '',
    pricingUnit: 'Per Day',
    images: [],
    category: '',
    tags: [],
    type: 'Renting',
    survey: null
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [sellCategoryId, setSellCategoryId] = useState('');
  const [sharedCategoryId, setSharedCategoryId] = useState('');

  // Fetch initial property data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [propertyRes, categoriesRes, tagsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/property/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/category/all"),
          axios.get("http://localhost:8000/api/tags/view")
        ]);

        const propData = propertyRes.data;
        const categories = categoriesRes.data.categories || [];
        
        // Find category IDs
        const sellCategory = categories.find(cat => cat.name === "Sell");
        const sharedCategory = categories.find(cat => cat.name === "Shared");
        
        // Initialize property state with proper coordinate handling
        setProperty({
          ...propData,
          location: {
            address: propData.location || '',
            lat: propData.coordinates?.lat || propData.lat || 0,
            lng: propData.coordinates?.lng || propData.lng || 0
          },
          tags: Array.isArray(propData.tags) 
            ? propData.tags.map(tag => typeof tag === 'object' ? tag._id : tag)
            : [],
          survey: propData.survey || null,
          type: propData.type || 'Renting',
          category: propData.category?._id || propData.category || '',
          pricingUnit: propData.pricingUnit || 'Per Day',
          images: Array.isArray(propData.images) ? propData.images : []
        });

        // Initialize supporting states
        setSelectedTags(Array.isArray(propData.tags) 
          ? propData.tags.map(tag => typeof tag === 'object' ? tag._id : tag)
          : []);
        setCategories(categories);
        setTags(tagsRes.data.tags || []);
        setSellCategoryId(sellCategory?._id || '');
        setSharedCategoryId(sharedCategory?._id || '');

        console.log("Loaded property data:", propData);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load property data");
      }
    };
    fetchData();
  }, [id]);

  // Handle transaction type changes
  const handlePropertyTypeChange = (type) => {
    setProperty(prev => {
      const newState = { ...prev, type };
      
      // Auto-set category based on type
      if (type === "Selling" && sellCategoryId) {
        newState.category = sellCategoryId;
        newState.pricingUnit = "";
      } else if (type === "Sharing" && sharedCategoryId) {
        newState.category = sharedCategoryId;
        newState.pricingUnit = "Per Month";
      } else {
        newState.pricingUnit = "Per Day";
      }
      
      return newState;
    });
  };

  // Handle survey requirements
  useEffect(() => {
    if (property.type === 'Sharing' && !property.survey) {
      setShowSurveyModal(true);
    }
  }, [property.type, property.survey]);

  // Reverse geocoding for map clicks
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
        setProperty(prev => ({
          ...prev,
          location: { ...prev.location, address }
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setError("Failed to fetch address for selected location.");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Map click handler with coordinate rounding
  const handleMapClick = useCallback((lat, lng) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    
    setProperty(prev => ({
      ...prev,
      location: { 
        ...prev.location, 
        lat: roundedLat,
        lng: roundedLng
      }
    }));
    
    console.log('Map coordinates:', { lat: roundedLat, lng: roundedLng });
    reverseGeocode(roundedLat, roundedLng);
  }, []);

  // Address search handler
  const handleAddressSearch = useCallback(async () => {
    if (!property.location.address.trim()) {
      setError("Please enter an address to search");
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=np&q=${encodeURIComponent(property.location.address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.lat);
        const lng = parseFloat(firstResult.lon);
        
        setProperty(prev => ({
          ...prev,
          location: {
            address: firstResult.display_name,
            lat: lat,
            lng: lng
          }
        }));
        console.log('Search coordinates:', { lat, lng });
      } else {
        setError("Location not found in Nepal. Please try a different address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Failed to search location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  }, [property.location.address]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validation checks
      const errors = [];
      if (!property.title.trim()) errors.push("Title is required");
      if (!property.description.trim()) errors.push("Description is required");
      if (!property.type) errors.push("Please select property type");
      
      // Improved coordinate validation
      if (
        isNaN(property.location.lat) || 
        isNaN(property.location.lng) ||
        Math.abs(property.location.lat) < 0.0001 ||
        Math.abs(property.location.lng) < 0.0001
      ) {
        errors.push("Please select a valid location on the map");
      }

      if (!property.price || isNaN(property.price)) {
        errors.push("Valid price required");
      }
      if (property.type === "Selling" && !sellCategoryId) {
        errors.push("Sell category not found");
      }
      if (property.type === "Sharing" && !property.survey) {
        errors.push("Please complete the roommate compatibility survey");
      }

      if (errors.length > 0) {
        setError(errors.join(". "));
        setIsSubmitting(false);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      
      // Core property data
      formData.append('title', property.title);
      formData.append('description', property.description);
      formData.append('price', Number(property.price));
      formData.append('type', property.type);
      formData.append('category', property.category);
      
      // Conditionally add pricing data based on property type
      if (property.type === "Renting" || property.type === "Sharing") {
        formData.append('pricingUnit', property.pricingUnit);
      } else if (property.type === "Selling") {
        formData.append('totalPrice', Number(property.price));
      }

      // Location data
      formData.append('location', property.location.address);
      
      // Handle coordinates
      const coordinates = {
        lat: property.location.lat,
        lng: property.location.lng
      };
      formData.append('coordinates', JSON.stringify(coordinates));

      // Tags handling
      formData.append('tags', JSON.stringify(selectedTags));
      
      // Survey data for shared properties
      if (property.type === "Sharing" && property.survey) {
        formData.append('survey', JSON.stringify(property.survey));
      }

      // Image handling - only upload new images if any
      if (newImages.length > 0) {
        newImages.forEach(file => formData.append('images', file));
      }

      // Debugging logs
      console.log('Final submission data:', {
        title: property.title,
        description: property.description,
        price: Number(property.price),
        type: property.type,
        category: property.category,
        pricingUnit: property.pricingUnit,
        location: property.location.address,
        coordinates,
        tags: selectedTags,
        newImages: newImages.length
      });

      // API request with token authorization
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/property/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Update response:", response.data);
      alert("Property updated successfully!");
      navigate("/my-properties");

    } catch (error) {
      console.error('Update Error:', {
        message: error.message,
        response: error.response?.data,
        request: error.config?.data
      });
      setError(error.response?.data?.message || 
             'Update failed. Please check your input data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavbarSection 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        pageType="dashboard" 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(false)} 
        pageType="dashboard" 
      />

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Edit Property</h1>
              <p className="text-blue-100 mt-1">Update property details and location</p>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                          property.type === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={property.title || ''}
                    onChange={(e) => setProperty(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={property.description || ''}
                    onChange={(e) => setProperty(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Map Component */}
                <MapComponent
                  location={property.location}
                  onMapClick={handleMapClick}
                  isGeocoding={isGeocoding}
                  onAddressSearch={handleAddressSearch}
                  onAddressChange={(e) => setProperty(prev => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
                />

                {/* Price Section */}
                <PriceSection
                  propertyType={property.type}
                  price={property.price}
                  onPriceChange={(val) => setProperty(prev => ({ ...prev, price: val }))}
                  pricingUnit={property.pricingUnit}
                  onPricingUnitChange={(unit) => setProperty(prev => ({ ...prev, pricingUnit: unit }))}
                />

                {/* Image Upload */}
                <ImageUpload
                  images={newImages}
                  existingImages={property.images}
                  onImageChange={setNewImages}
                  error={error}
                />

                {/* Category Selector */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={property.category}
                    onChange={(e) => setProperty(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    required
                    disabled={["Selling", "Sharing"].includes(property.type)}
                  >
                    {property.type === "Selling" ? (
                      <option value={sellCategoryId}>Sell</option>
                    ) : property.type === "Sharing" ? (
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
                </div>

                {/* Amenities Section */}
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

                {/* Survey Section */}
                {property.type === 'Sharing' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Roommate Preferences</h3>
                      <button
                        type="button"
                        onClick={() => setShowSurveyModal(true)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {property.survey ? 'Edit Preferences' : 'Add Preferences'}
                      </button>
                    </div>
                    {property.survey && (
                      <div className="mt-2 text-sm text-gray-600">
                        Preferences already set
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Updating Property...</span>
                    </div>
                  ) : (
                    "Update Property"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Roommate Survey Modal */}
      <RoommateSurveyModal
        show={showSurveyModal}
        initialData={property.survey}
        onClose={() => setShowSurveyModal(false)}
        onSave={(data) => {
          setProperty(prev => ({ ...prev, survey: data }));
          setShowSurveyModal(false);
        }}
      />
    </div>
  );
};

export default EditProperty;