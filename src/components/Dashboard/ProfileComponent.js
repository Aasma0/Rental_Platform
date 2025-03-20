import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

const ProfileComponent = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profilePicture: null, // For file upload
  });

  const [preview, setPreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🔄 Toggle Password Visibility

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUser(response.data.user);

        // If user has a profile picture, show preview
        if (response.data.user.profilePicture) {
          setPreview(`http://localhost:8000/${response.data.user.profilePicture}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profilePicture: file });
    setPreview(URL.createObjectURL(file)); // Show image preview
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("location", user.location);
    formData.append("bio", user.bio);

    if (user.profilePicture) {
      formData.append("profilePicture", user.profilePicture);
    }

    try {
      const response = await axiosInstance.patch("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.msg);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.msg || "Something went wrong");
    }

    setLoading(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavbarSection toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex justify-center items-center mt-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Edit Profile</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <ToastContainer />

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              {preview && <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full mb-2" />}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label htmlFor="location" className="mb-1 text-gray-600">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                value={user.location}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col">
              <label htmlFor="bio" className="mb-1 text-gray-600">Bio</label>
              <textarea
                name="bio"
                id="bio"
                value={user.bio}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition duration-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
