import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, pageType }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform shadow-lg z-50`}>
      <button className="absolute top-4 right-4 text-xl" onClick={toggleSidebar}>✖</button>
      
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul>
          {pageType === "dashboard" && (
            <>
              <li className="mb-2">
                <Link to="/profile" className="block py-2 hover:bg-gray-700">Profile</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-properties" className="block py-2 hover:bg-gray-700">My Property</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-bookings" className="block py-2 hover:bg-gray-700">My Bookings</Link>
              </li>
              <li>
                <button onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }} className="block w-full text-left py-2 hover:bg-gray-700">
                  Logout
                </button>
              </li>
            </>
          )}

          {pageType === "admin" && (
            <>
              <li className="mb-2">
                <Link to="/category" className="block py-2 hover:bg-gray-700">Categories</Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="block py-2 hover:bg-gray-700">Profile</Link>
              </li>
              <li className="mb-2">
                <Link to="/manage-bookings" className="block py-2 hover:bg-gray-700">Manage Bookings</Link>
              </li>
              <li>
                <button onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }} className="block w-full text-left py-2 hover:bg-gray-700">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;