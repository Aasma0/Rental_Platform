import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative h-[650px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("image/landing.jpg")' }}
    >
      {/* Navigation */}
      <div className="absolute top-0 w-full">
        <div className="flex justify-between items-center p-5">
          <nav className="flex gap-4">
            <a href="#" className="text-white">Buy</a>
            <a href="#" className="text-white">Rent</a>
            <a href="#" className="text-white">Sell</a>
            <a href="#" className="text-white">Manage Rentals</a>
          </nav>
          <nav className="flex gap-4">
            <a href="#" className="text-white">Help</a>
            <a href="/login" className="text-white">Sign In</a>
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

export default HeroSection;
