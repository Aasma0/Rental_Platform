import React from "react";

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center py-12 px-6 md:px-12 bg-white">
        {/* Left Side Content */}
        <div className="max-w-lg text-center md:text-left">
          <p className="text-sm font-semibold uppercase">Welcome</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Explore available <br />
            <span className="font-extrabold">Properties.</span>
          </h1>
        </div>

        {/* Right Side Content */}
        <div className="text-center md:text-right mt-6 md:mt-0">
          <p className="text-sm text-gray-700 mb-4">
            Book smartly with Hearth & Co.
          </p>
          <button className="bg-black text-white px-6 py-2 rounded-md text-lg hover:bg-opacity-90 transition">
            View
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
        {/* Left Content */}
        <div className="flex flex-col justify-center p-6 text-center md:text-left">
          <h2 className="text-3xl font-bold leading-snug">
            Explore Powerful Features <br />
            Tailored for Your Property <br />
            Journey with us.
          </h2>
          <p className="text-gray-600 mt-4">
            Our platform empowers you to effortlessly list, rent, buy, and sell
            properties. Enjoy a seamless experience with user-friendly tools
            designed to meet all your real estate needs.
          </p>
        </div>

        {/* Right Image */}
        <img
          className="w-full h-[340px] object-cover mb-6 md:mb-0"
          src="image/logo.png"
          alt="Hearth & Co. logo"
        />
      </div>
    </>
  );
};

export default HeroSection;
