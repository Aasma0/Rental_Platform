import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    category: "",
    tags: [],
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]); // To store available tags

  // Fetch available tags (from the correct route)
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tags/view");
        // Ensure the response data is an array
        if (Array.isArray(res.data)) {
          setAvailableTags(res.data);
        } else {
          console.error("Tags response is not an array", res.data);
          setAvailableTags([]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setAvailableTags([]);
      }
    };

    fetchTags();
  }, []);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/property/${id}`);
        if (!res.data || Object.keys(res.data).length === 0) {
          setLoading(false);
          return;
        }
        setProperty(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleTagsChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setProperty({ ...property, tags: selectedTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", property.title);
    formData.append("description", property.description);
    formData.append("location", property.location);
    formData.append("price", property.price);
    formData.append("category", property.category);
    property.tags.forEach((tag) => formData.append("tags", tag));

    if (newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        formData.append("images", newImages[i]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      const res = await axios.put(
        `http://localhost:8000/api/property/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      navigate("/my-properties");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update property.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!property || Object.keys(property).length === 0) {
    return <p>Property not found</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={property.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={property.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={property.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={property.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Tags Selection */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
          <select
            id="tags"
            name="tags"
            multiple
            value={property.tags}
            onChange={handleTagsChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {Array.isArray(availableTags) && availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))
            ) : (
              <option>No tags available</option>
            )}
          </select>
        </div>

        {/* Existing Images */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
          <div className="flex flex-wrap gap-4">
            {property.images.length > 0 ? (
              property.images.map((img, index) => (
                <img key={index} src={img} alt="Property" className="w-32 h-32 object-cover rounded-md" />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* New Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload New Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
