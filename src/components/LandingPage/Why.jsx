import React from "react";

const WhyChooseUsSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-12 bg-white">
      {/* Left Side: Text & Buttons */}
      <div className="max-w-lg">
        <h2 className="text-3xl font-bold mb-4">List Your Property Today!</h2>
        <p className="text-gray-600 mb-6">
          Unlock new opportunities by listing your property or exploring available 
          options in our marketplace.
        </p>
        <div className="flex space-x-4">
          <button className="bg-black text-white px-6 py-2 rounded-md">List</button>
          <button className="border border-black px-6 py-2 rounded-md">Explore</button>
        </div>
      </div>

      {/* Right Side: Abstract Background */}
      <div className="hidden md:block w-1/2">
        <img className="w-full h-[350px] object-cover" src="image/vanilla.jpeg" alt="Hearth&Co.logo" />
        </div>
    </section>
  );
};

export default WhyChooseUsSection;
