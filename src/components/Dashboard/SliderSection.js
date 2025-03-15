import React, { useState } from "react";

const SliderSection = ({ onSearch }) => { // ✅ Accept onSearch as a prop
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery); // ✅ Ensure function exists before calling
    }
  };

  return (
    <div
      className="relative h-[650px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("image/landing.jpg")' }}
    >
      {/* Search Bar */}
      <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 flex items-center">
        <input
          type="text"
          placeholder="Search by location or tags..."
          className="border-none outline-none p-4 w-[400px] h-[56px] rounded-l-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-[#007bff] text-white border-none p-4 rounded-r-full"
          onClick={handleSearch} // ✅ Calls handleSearch
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default SliderSection;
