import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link import

const NavbarSection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Assuming "admin" or "user"

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear role info as well
    navigate("/"); // Redirect to landing page
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-12 bg-white">
        {/* Left Side Content */}
        <div className="flex items-center space-x-4">
          <p className="text-lg">Hearth & Co.</p>
        </div>

        {/* Center Content */}
        <div className="space-x-4">
          <a href="#" className="text-black">
            Buy
          </a>
          <Link to="/property" className="text-black">
            Rent
          </Link> 
          <a href="#" className="text-black">
            Sell
          </a>
          <Link to="/rentals" className="text-black">
            See Rentals
          </Link>
          {userRole === "admin" && (
            <Link to="/category" className="text-black">
              Category
            </Link> 
          )}
        </div>

        {/* Right Side Content */}
        <div className="space-x-4">
          {token ? (
            <>
              {/* Add Profile link next to Logout */}
              <Link to="/profile" className="text-lg font-medium">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-lg font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium">
                Login
              </Link>
              <Link to="/registration" className="text-lg font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <hr className="font-bold" />
    </>
  );
};

export default NavbarSection;
