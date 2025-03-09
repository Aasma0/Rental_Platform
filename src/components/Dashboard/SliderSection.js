import React from "react";

const SliderSection = () => {
  return (
    <div
      className="relative h-[650px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("image/landing.jpg")' }}
    >
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
