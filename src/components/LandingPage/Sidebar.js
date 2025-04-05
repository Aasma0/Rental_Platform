import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiDollarSign,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiGrid,
  FiUsers
} from "react-icons/fi";
import axiosInstance from "../../config/axiosConfig";

const Sidebar = ({ isOpen, toggleSidebar, pageType }) => {
  const [user, setUser] = useState(null);

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

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white text-gray-800 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform shadow-lg z-50 overflow-y-auto`}
    >
      <button
        className="absolute top-4 right-4 text-xl text-gray-600"
        onClick={toggleSidebar}
      >
        ✖
      </button>

      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <img
              src={`http://localhost:8000/${user.profilePicture}`}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-600" />
            </div>
          )}
          <div>
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Navigation</h2>

        <ul className="space-y-2">
          {pageType === "dashboard" && (
            <>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiUser className="text-gray-600" />
                  Profile
                </Link>
              </li>

              {/* Roommate Finder Link */}
              <li>
                <Link
                  to="/roommate-finder"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiUsers className="text-gray-600" />
                  Roommate Finder
                </Link>
              </li>

              <li>
                <Link
                  to="/marketplace"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiShoppingBag className="text-gray-600" />
                  Marketplace
                </Link>
              </li>
              
              <li>
                <Link
                  to="/transactions"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiDollarSign className="text-gray-600" />
                  Transactions
                </Link>
              </li>
              
              <li>
                <Link
                  to="/my-properties"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiHome className="text-gray-600" />
                  My Properties
                </Link>
              </li>
              
              <li>
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={toggleSidebar}
                >
                  <FiCalendar className="text-gray-600" />
                  My Bookings
                </Link>
              </li>
              
              <li className="mt-4 border-t border-gray-200 pt-4">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                >
                  <FiLogOut className="text-red-600" />
                  Logout
                </button>
              </li>
            </>
          )}

          {pageType === "admin" && (
            <li>
              <Link
                to="/category"
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiGrid className="text-gray-600" />
                Categories
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;