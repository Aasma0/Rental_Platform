import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Import Icons

const ProfileComponent = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🔄 Toggle Password Visibility

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.patch("/user/profile", user);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <ToastContainer />

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

            <div className="flex flex-col relative">
              <label htmlFor="password" className="mb-1 text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // 🔄 Toggle Password
                  name="password"
                  id="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-400 pr-10"
                  placeholder="Enter new password (optional)"
                />
                {/* 👁️ Toggle Button */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
