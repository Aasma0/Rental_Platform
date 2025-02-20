import React from "react";

const ChessboardSection = () => {
  return (
    <div className="grid grid-cols-2 gap-0">
      {/* Left Image */}
      <img className="w-full h-[350px] object-cover" src="image/garden.jpg" alt="Garden" />

      {/* Right Content */}
      <div className="flex flex-col justify-start p-6">
        <h2 className="text-2xl font-bold text-[#1a1816] mb-4">Turn Searching Into Finding</h2>
        <p className="text-lg text-[#1a1816] mb-4">
          Experience the smarter way to rent, buy, or sell.
        </p>
        <div className="bg-[#1a1816] rounded-[40px] border border-[#1a1816] w-[120px] h-[44.84px] flex justify-center items-center">
          <a href="/login" className="text-white text-base font-medium">
            Get now
          </a>
        </div>
      </div>


      {/* Left Content */}
      <div className="flex flex-col justify-center p-6">
        <h2 className="text-2xl font-bold text-[#1a1816] mb-4">Your Perfect Home Awaits</h2>
        <p className="text-xl text-[#1a1816] mb-4">
          Find rentals, buy or sell properties, and explore local insights—all in one place.
        </p>
      </div>

      {/* Right Image */}
      <img className="w-full h-[350px] object-cover" src="image/room.jpg" alt="Room" />

    </div>
  );
};

export default ChessboardSection;
