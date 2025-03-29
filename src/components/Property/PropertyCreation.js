// PropertyCreation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

const PropertyCreation = () => {
  const navigate = useNavigate();

  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [pricingUnit, setPricingUnit] = useState("Per Day"); // Default pricing unit for renting
  const [totalPrice, setTotalPrice] = useState(""); // Only used for selling
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // "Renting" or "Selling"
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (Array.isArray(response.data.tags)) {
          setTags(response.data.tags);
        } else {
          console.error("Tags not found or are not an array");
          setTags([]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tagId) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      } else if (prevTags.length < 10) {
        setError("");
        return [...prevTags, tagId];
      } else {
        setError("You can only select up to 10 tags.");
        return prevTags;
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("You can only upload up to 10 images.");
      return;
    }
    setImages(files);
    setError("");
  };

  // Handle property type selection
  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    // Reset pricing unit or total price depending on the selection
    if (type === "Selling") {
      setPricingUnit(""); // Not applicable
    } else {
      setTotalPrice(""); // Not applicable for renting
      setPricingUnit("Per Day"); // Default rental unit
    }
  };

  // Handle pricing unit selection (for renting)
  const handlePricingUnitChange = (unit) => {
    setPricingUnit(unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate property type
    if (!propertyType) {
      setError("Please select a property type (Renting or Selling).");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in first.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("type", propertyType);

    // If property is renting, send pricingUnit; if selling, send totalPrice
    if (propertyType === "Renting") {
      formData.append("pricingUnit", pricingUnit);
    } else {
      formData.append("totalPrice", totalPrice);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post("http://localhost:8000/api/property/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Property created successfully:", response.data);
      navigate("/dash");
    } catch (error) {
      console.error("Error creating property:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to create property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavbarSection toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Create a New Property</h1>
              <p className="text-blue-100">Fill in the details to list your property</p>
            </div>
            {/* Form Content */}
            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter property title"
                    required
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your property in detail"
                    required
                  />
                </div>
                {/* Property Type Selection */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Property Type*</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className={`flex-1 py-3 px-6 rounded-lg font-medium border-2 transition ${
                        propertyType === "Renting"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePropertyTypeChange("Renting")}
                    >
                      Renting
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-3 px-6 rounded-lg font-medium border-2 transition ${
                        propertyType === "Selling"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePropertyTypeChange("Selling")}
                    >
                      Selling
                    </button>
                  </div>
                </div>
                {/* Location and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter property location"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {propertyType === "Selling" ? "Total Price ($)" : "Price ($)"}
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      min="0"
                      required
                    />
                  </div>
                </div>
                {/* Pricing Unit Selection (only for renting) */}
                {propertyType === "Renting" && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Pricing Unit*</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-medium border-2 transition ${
                          pricingUnit === "Per Day"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePricingUnitChange("Per Day")}
                      >
                        Per Day
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-medium border-2 transition ${
                          pricingUnit === "Per Week"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePricingUnitChange("Per Week")}
                      >
                        Per Week
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-3 px-6 rounded-lg font-medium border-2 transition ${
                          pricingUnit === "Per Month"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePricingUnitChange("Per Month")}
                      >
                        Per Month
                      </button>
                    </div>
                  </div>
                )}
                {/* For Selling properties, show a Total Price field */}
                {propertyType === "Selling" && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Total Price ($)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      placeholder="Enter total selling price"
                      min="0"
                      required
                    />
                  </div>
                )}
                {/* Images */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Upload Images (Max 10)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                    <input
                      type="file"
                      className="hidden"
                      id="property-images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      required
                    />
                    <label htmlFor="property-images" className="cursor-pointer flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="text-gray-600 mb-1">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500">
                        {images.length > 0 ? `${images.length} file(s) selected` : "PNG, JPG, JPEG up to 10MB"}
                      </p>
                    </label>
                  </div>
                </div>
                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tags (Select up to 10){" "}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {selectedTags.length}/10 selected
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                      tags.map((tag) => {
                        const isSelected = selectedTags.includes(tag._id);
                        return (
                          <button
                            key={tag._id}
                            type="button"
                            className={`px-4 py-2 rounded-full border transition-all duration-200 flex items-center ${
                              isSelected
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                            onClick={() => handleTagClick(tag._id)}
                          >
                            {isSelected && (
                              <svg
                                className="w-4 h-4 mr-1 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                            {tag.name}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No tags available</p>
                    )}
                  </div>
                </div>
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-white transition ${
                      isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Property"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCreation;
