import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";
import { FaEdit } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ProfileComponent = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Toggle function
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        const userData = response.data.user;

        setUser({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
          profilePicture: null,
        });

        if (userData.profilePicture) {
          setPreview(`http://localhost:8000/${userData.profilePicture}`);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("location", user.location);
      formData.append("bio", user.bio);

      if (user.profilePicture) {
        formData.append("profilePicture", user.profilePicture);
      }

      await axiosInstance.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await axiosInstance.post("/user/change-password", passwordData);
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-col lg:flex-row items-start justify-center mt-10 px-6 gap-6">
        {/* Profile Display */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl p-6 shadow-md">
          <div className="text-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.bio}</p>

            <div className="text-left mt-4 space-y-2 text-gray-700 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
              <p><strong>Location:</strong> {user.location || "Not provided"}</p>
            </div>

            <button
              onClick={() => setShowEditForm((prev) => !prev)}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
            >
              {showEditForm ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Edit Form with Transition */}
        <div className={`transition-all duration-500 w-full lg:w-2/3 ${showEditForm ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"} bg-white rounded-xl p-6 shadow-md`}>
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaEdit className="text-gray-500 text-xl" />
                  )}
                </div>
              </label>
            </div>

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={user.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full p-2 border rounded h-24"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>

          {/* Change Password */}
          <div className="mt-10 border-t pt-6">
  <h3 className="text-lg font-semibold flex items-center gap-2">
    <FaLock /> Change Password
  </h3>
  <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
    {/* Current Password */}
    <div className="relative">
      <input
        type={showPasswords.current ? "text" : "password"}
        name="currentPassword"
        value={passwordData.currentPassword}
        onChange={handlePasswordChange}
        placeholder="Current Password"
        className="w-full p-2 border rounded pr-10"
        required
      />
      <span
        onClick={() => toggleVisibility("current")}
        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
      >
        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* New Password */}
    <div className="relative">
      <input
        type={showPasswords.new ? "text" : "password"}
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        placeholder="New Password"
        className="w-full p-2 border rounded pr-10"
        required
      />
      <span
        onClick={() => toggleVisibility("new")}
        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
      >
        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* Confirm New Password */}
    <div className="relative">
      <input
        type={showPasswords.confirm ? "text" : "password"}
        name="confirmPassword"
        value={passwordData.confirmPassword}
        onChange={handlePasswordChange}
        placeholder="Confirm New Password"
        className="w-full p-2 border rounded pr-10"
        required
      />
      <span
        onClick={() => toggleVisibility("confirm")}
        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
      >
        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
    >
      Change Password
    </button>
  </form>
</div>

        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ProfileComponent;
