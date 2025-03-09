import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PropertyCreation = () => {
  const navigate = useNavigate();

  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // Store selected images
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Store categories
  const [tags, setTags] = useState([]); // Store fetched tags
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags for property
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category/all");
        setCategories(response.data.categories);
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
        const response = await axios.get("http://localhost:8000/api/tags");
        if (Array.isArray(response.data.tags)) {
          setTags(response.data.tags);
        } else {
          console.error("Tags not found or are not an array");
          setTags([]); // Make sure tags are always an array
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]); // Handle error gracefully
      }
    };
    fetchTags();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("You can only upload up to 10 images.");
      return;
    }
    setImages(files); // Store selected images
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (selectedTags.length < 10) {
        setSelectedTags((prevTags) => [...prevTags, value]);
      } else {
        setError("You can only select up to 10 tags.");
      }
    } else {
      setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(selectedTags)); // ✅ FIX: Convert array to JSON
  
    images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/property/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Property created successfully:", response.data);
      navigate("/dash");
    } catch (error) {
      console.error("Error creating property:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to create property.");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Create a New Property</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Upload Images (Max 10)</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Category</label>
          <select
            className="w-full p-2 border rounded"
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

        <div className="mb-4">
          <label className="block font-medium">Tags (Select up to 10)</label>
          <div className="space-y-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div key={tag._id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={tag._id}
                    onChange={handleTagChange}
                    disabled={selectedTags.length >= 10 && !selectedTags.includes(tag._id)}
                  />
                  <label className="ml-2">{tag.name}</label>
                </div>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </div>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
          Create Property
        </button>
      </form>
    </div>
  );
};

export default PropertyCreation;
