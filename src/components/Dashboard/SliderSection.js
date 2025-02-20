import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link import

const SliderSection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Assuming "admin" or "user"

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear role info as well
    navigate("/"); // Redirect to landing page
  };

  return (
    <div
      className="relative h-[650px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("image/landing.jpg")' }}
    >
      {/* Navigation */}
      <div className="absolute top-0 w-full">
        <div className="flex justify-between items-center p-5">
          {/* Common Navigation for Both Admin and User */}
          <nav className="flex gap-4">
            <a href="#" className="text-white">Buy</a>
            <Link to="/property" className="text-white">Rent</Link> {/* Updated "Rent" to link to property creation */}
            <a href="#" className="text-white">Sell</a>
            <Link to="/manage-rentals">Manage Rentals</Link>
            {userRole === "admin" && (
              <Link to="/category" className="text-white">Category</Link> /* Updated Category link */
            )}
          </nav>

          {/* Right-Side Navigation */}
          <nav className="flex gap-4">
            <a href="#" className="text-white">Help</a>
            {token ? (
              <button onClick={handleLogout} className="text-white">Logout</button>
            ) : (
              <a href="/login" className="text-white">Sign In</a>
            )}
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 flex items-center">
        <input
          type="text"
          placeholder="Enter an address, neighborhood, city, or ZIP code"
          className="border-none outline-none p-4 w-[400px] h-[56px] rounded-l-full"
        />
        <button className="bg-[#007bff] text-white border-none p-4 rounded-r-full">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SliderSection;
