import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, pageType }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform shadow-lg z-50 overflow-y-auto`}>
      <button className="absolute top-4 right-4 text-xl" onClick={toggleSidebar}>✖</button>
      
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        
        <ul>
          {pageType === "dashboard" && (
            <>
              <li className="mb-2">
                <Link to="/profile" className="block py-2 px-3 hover:bg-gray-700 rounded" onClick={toggleSidebar}>Profile</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-properties" className="block py-2 px-3 hover:bg-gray-700 rounded" onClick={toggleSidebar}>My Property</Link>
              </li>
              {/* Add Marketplace Link Here */}
              <li className="mb-2">
                <Link to="/marketplace" className="block py-2 px-3 hover:bg-gray-700 rounded" onClick={toggleSidebar}>Marketplace</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-bookings" className="block py-2 px-3 hover:bg-gray-700 rounded" onClick={toggleSidebar}>My Bookings</Link>
              </li>
              <li className="mb-2">
                <Link to="/transactions" className="block py-2 px-3 hover:bg-gray-700 rounded" onClick={toggleSidebar}>Transaction History</Link>
              </li>
              <li>
                <button onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }} className="block w-full text-left py-2 px-3 hover:bg-gray-700 rounded">
                  Logout
                </button>
              </li>
            </>
          )}

          {pageType === "admin" && (
            <>
              <li className="mb-2">
                <Link to="/category" className="block py-2 px-3 hover:bg-gray-700 rounded">Categories</Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="block py-2 px-3 hover:bg-gray-700 rounded">Profile</Link>
              </li>
              <li className="mb-2">
                <Link to="/manage-bookings" className="block py-2 px-3 hover:bg-gray-700 rounded">Manage Bookings</Link>
              </li>
              <li>
                <button onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  window.location.href = "/";
                }} className="block w-full text-left py-2 px-3 hover:bg-gray-700 rounded">
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