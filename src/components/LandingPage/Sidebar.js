import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out shadow-lg z-50`} // ✅ Ensure it is above other elements
    >
      <button
        className="absolute top-4 right-4 text-xl"
        onClick={toggleSidebar}
      >
        ✖
      </button>
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Account Settings</h2>
        <ul>
          <li className="mb-2">
            <Link to="/profile" className="block py-2 hover:bg-gray-700">
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "/";
              }}
              className="block w-full text-left py-2 hover:bg-gray-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
