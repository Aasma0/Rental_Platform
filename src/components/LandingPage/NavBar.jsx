import React from "react";
import { Link } from "react-router-dom";
import { FaCog } from "react-icons/fa"; // Import icon

const NavbarSection = ({ toggleSidebar }) => {
  const token = localStorage.getItem("token");

  return (
    <nav className="flex justify-between items-center py-4 px-12 bg-white shadow-md">
      {/* 🔄 Clickable Logo -> Redirects to Dashboard */}
      <div className="flex items-center space-x-4">
        <Link to="/dash" className="text-lg font-bold text-gray-800 hover:text-blue-500 transition">
          Hearth & Co.
        </Link>
      </div>

      <div className="space-x-4">
        <Link to="/property" className="text-black hover:text-blue-500 transition">
          Rent
        </Link>
        <Link to="/rentals" className="text-black hover:text-blue-500 transition">
          See Rentals
        </Link>
      </div>

      <div className="space-x-4">
        {token ? (
          <button onClick={toggleSidebar} className="text-lg focus:outline-none hover:text-blue-500 transition">
            <FaCog size={24} />
          </button>
        ) : (
          <>
            <Link to="/login" className="text-lg font-medium hover:text-blue-500 transition">
              Login
            </Link>
            <Link to="/registration" className="text-lg font-medium hover:text-blue-500 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarSection;
