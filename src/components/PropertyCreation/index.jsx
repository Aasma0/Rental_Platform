import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [pricingUnit, setPricingUnit] = useState('');
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

  // Fetch categories from the API and update category state based on property type
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

        if (propertyType === "Selling" && sellCategory) {
          setCategory(sellCategory._id);
        }
        if (propertyType === "Sharing" && sharedCategory) {
          setCategory(sharedCategory._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [propertyType]);

  // Display the roommate survey modal if the selected category is Shared or type is Sharing and there are no survey responses yet.
  useEffect(() => {
    const selectedCategory = categories.find(cat => cat._id === category);
    if ((selectedCategory?.name === 'Shared' || propertyType === 'Sharing') && !surveyResponses) {
      setShowSurveyModal(true);
    }
  }, [category, categories, propertyType, surveyResponses]);

  // Fetch tags from the API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tags/view");
        setTags(Array.isArray(response.data.tags) ? response.data.tags : []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load property tags");
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  // Reverse geocoding helper
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
      toast.error("Failed to fetch address for selected location");
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
      toast.warning("Please enter an address to search");
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
        toast.success("Location found");
      } else {
        setError("Location not found in Nepal. Please try a different address.");
        toast.error("Location not found in Nepal");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Failed to search location. Please try again.");
      toast.error("Failed to search location");
    } finally {
      setIsGeocoding(false);
    }
  }, [location.address]);

  // Single definition to handle property type changes
  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    // Reset any previous survey responses when switching type
    if (type !== "Sharing") {
      setSurveyResponses(null);
    }
    if (type === "Selling") {
      setPricingUnit("");
      if (sellCategoryId) setCategory(sellCategoryId);
    } else if (type === "Sharing") {
      setPricingUnit("Per Month"); // Set default unit for sharing
      if (sharedCategoryId) setCategory(sharedCategoryId);
    } else {
      setPricingUnit("Per Day");
      setCategory("");
    }
    toast.info(`Property type set to ${type}`);
  };

  // Handle form submission by constructing the FormData and sending it via axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const errors = [];
    if (!propertyType) errors.push("Please select property type");
    if (propertyType === "Selling" && !sellCategoryId) errors.push("Sell category not found");
    if ((propertyType === "Sharing" || category === sharedCategoryId) && !surveyResponses) {
      errors.push("Please complete the roommate compatibility survey");
    }
    if (!location.lat || !location.lng) errors.push("Please select a valid location");
    if (!localStorage.getItem("token")) errors.push("Authentication required");

    if (errors.length > 0) {
      const errorMessage = errors.join(". ");
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
      return;
    }

    // Construct survey data if available for Sharing properties
    const surveyData = surveyResponses ? {
      sleepSchedule: surveyResponses.sleepSchedule,
      smoking: surveyResponses.smoking,
      noisePreference: parseInt(surveyResponses.noisePreference, 10),
      neatness: parseInt(surveyResponses.neatness, 10)
    } : null;

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

    if (surveyData) {
      formData.append("survey", JSON.stringify(surveyData));
    }

    // Append pricing or total price based on property type
    if (propertyType === "Selling") {
      formData.append("totalPrice", price);
    } else if (propertyType === "Sharing" || propertyType === "Renting") {
      formData.append("pricingUnit", pricingUnit || "Per Month");
    }

    images.forEach(image => formData.append("images", image));

    try {
      await axios.post("http://localhost:8000/api/property/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Display success toast
      toast.success("Property created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Navigate after a short delay to allow the toast to be seen
      setTimeout(() => {
        navigate("/dash");
      }, 1500);
      
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || "Failed to create property";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <ToastContainer />
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

                <PriceSection
                  propertyType={propertyType}
                  price={price}
                  onPriceChange={setPrice}
                  pricingUnit={pricingUnit}
                  onPricingUnitChange={setPricingUnit}
                />

                <ImageUpload
                  images={images}
                  onImageChange={setImages}
                  error={error}
                />

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      // Reset survey responses when category changes (unless it's sharing)
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

                <Amenities
                  tags={tags}
                  selectedTags={selectedTags}
                  onTagClick={(tagId) => setSelectedTags(prev => {
                    if (prev.includes(tagId)) return prev.filter(id => id !== tagId);
                    if (prev.length < 10) return [...prev, tagId];
                    toast.warning("Maximum 10 tags allowed");
                    setError("Maximum 10 tags allowed");
                    return prev;
                  })}
                />

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

      <RoommateSurveyModal
        show={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSave={(data) => {
          setSurveyResponses(data);
          setShowSurveyModal(false);
          toast.success("Roommate survey completed");
        }}
      />
    </div>
  );
};

export default PropertyCreation;