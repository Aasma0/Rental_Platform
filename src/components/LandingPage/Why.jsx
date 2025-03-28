import React from "react";

const WhyChooseUsSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-12 bg-white">
      {/* Left Side: Text & Buttons */}
      <div className="max-w-lg text-center md:text-left">
        <h2 className="text-3xl font-bold mb-4">List Your Property Today!</h2>
        <p className="text-gray-600 mb-6">
          Unlock new opportunities by listing your property or exploring available 
          options in our marketplace.
        </p>
        <div className="flex justify-center md:justify-start space-x-4">
          <button 
            className="bg-black text-white px-6 py-2 rounded-md transition hover:bg-gray-800"
            aria-label="List Your Property"
          >
            List
          </button>
          <button 
            className="border border-black px-6 py-2 rounded-md transition hover:bg-gray-100"
            aria-label="Explore Properties"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
        <img 
          className="w-full max-w-sm md:max-w-full h-[250px] md:h-[350px] object-cover rounded-lg shadow-md" 
          src="image/vanilla.jpeg" 
          alt="Property Listing Illustration"
        />
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
