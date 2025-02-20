import React from "react";
import { Link } from "react-router-dom";

const CardsSection = () => {
  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <div className="flex gap-8">
        {/* Rent Card */}
        <div className="w-[384px] h-[384px] bg-white rounded-2xl shadow-lg border border-neutral-300 flex flex-col justify-center items-center text-center">
          <img className="w-40 h-40 mb-4" src="image/construction.png" alt="Rent" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Rent</h2>
          <p className="text-base text-neutral-900 mb-6">
            Find your perfect rental home with detailed insights and flexible leasing options to suit your lifestyle.
          </p>
          <Link to="/login" className="text-base text-blue-700 font-bold border border-blue-700 rounded-xl px-6 py-2">
            Explore Rentals
          </Link>
        </div>

        {/* Sell Card */}
        <div className="w-[384px] h-[384px] bg-white rounded-2xl shadow-lg border border-neutral-300 flex flex-col justify-center items-center text-center">
          <img className="w-40 h-40 mb-4" src="image/sell.png" alt="Sell" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Sell</h2>
          <p className="text-base text-neutral-900 mb-6">
            List your property with confidence and reach a wide audience of potential buyers through our platform.
          </p>
          <Link to="/login" className="text-base text-blue-700 font-bold border border-blue-700 rounded-xl px-6 py-2">
            List Now
          </Link>
        </div>

        {/* Buy Card */}
        <div className="w-[384px] h-[384px] bg-white rounded-2xl shadow-lg border border-neutral-300 flex flex-col justify-center items-center text-center">
          <img className="w-40 h-40 mb-4" src="image/buy.png" alt="Buy" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Buy</h2>
          <p className="text-base text-neutral-900 mb-6">
            Discover your dream home with our extensive property listings and personalized recommendations.
          </p>
          <Link to="/login" className="text-base text-blue-700 font-bold border border-blue-700 rounded-xl px-6 py-2">
            Find Homes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardsSection;
