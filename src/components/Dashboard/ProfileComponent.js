import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";
import { FaLock, FaEdit } from "react-icons/fa"; // Import lock and edit icons
// import Modal from "react-modal";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUser(response.data.user);

        if (response.data.user.profilePicture) {
          setPreview(`http://localhost:8000/${response.data.user.profilePicture}`);
        }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profilePicture: file });
    setPreview(URL.createObjectURL(file));
  };

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
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.msg || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-col items-center mt-10">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          {preview && <img src={preview} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-3" />}
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.bio}</p>
          <div className="mt-4 text-left">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Location:</strong> {user.location}</p>
          </div>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center mx-auto"
            onClick={() => setModalIsOpen(true)}
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      <div 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <ToastContainer />

          <div className="flex flex-col items-center">
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mb-2" />}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <input type="text" name="name" value={user.name} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Name" required />
          <textarea name="bio" value={user.bio} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Bio" required />
          <input type="text" name="phone" value={user.phone} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Phone" required />
          <input type="text" name="location" value={user.location} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Location" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>{loading ? "Updating..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;
