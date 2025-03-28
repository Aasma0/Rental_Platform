import React from "react";

const ChessboardSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Image */}
      <img className="w-full h-[350px] object-cover" src="image/garden.jpg" alt="Garden" />

      {/* Right Content */}
      <div className="flex flex-col justify-center p-6">
        <h2 className="text-2xl font-bold text-[#1a1816] mb-4">Turn Searching Into Finding</h2>
        <p className="text-lg text-[#1a1816] mb-4">
          Experience the smarter way to rent, buy, or sell.
        </p>
        <a 
          href="/login"
          className="bg-[#1a1816] w-fit text-white text-base font-medium py-2 px-6 rounded-full border border-[#1a1816] hover:bg-opacity-90 transition"
        >
          Get now
        </a>
      </div>

      {/* Left Content */}
      <div className="flex flex-col justify-center p-6">
        <h2 className="text-2xl font-bold text-[#1a1816] mb-4">Your Perfect Home Awaits</h2>
        <p className="text-lg text-[#1a1816] mb-4">
          Find rentals, buy or sell properties, and explore local insights—all in one place.
        </p>
      </div>

      {/* Right Image */}
      <img className="w-full h-[350px] object-cover" src="image/room.jpg" alt="Room" />
    </div>
  );
};

export default ChessboardSection;
