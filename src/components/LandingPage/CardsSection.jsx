import React from "react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Rent",
    image: "image/construction.png",
    description: "Find your perfect rental home with detailed insights and flexible leasing options to suit your lifestyle.",
    linkText: "Explore Rentals",
    link: "/login",
  },
  {
    title: "Sell",
    image: "image/sell.png",
    description: "List your property with confidence and reach a wide audience of potential buyers through our platform.",
    linkText: "List Now",
    link: "/login",
  },
  {
    title: "Buy",
    image: "image/buy.png",
    description: "Discover your dream home with our extensive property listings and personalized recommendations.",
    linkText: "Find Homes",
    link: "/login",
  },
];

const CardsSection = () => {
  return (
    <div className="flex justify-center items-center mt-10 mb-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="max-w-sm bg-white rounded-2xl shadow-lg border border-neutral-300 flex flex-col justify-center items-center text-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img className="w-40 h-40 mb-4" src={card.image} alt={card.title} />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{card.title}</h2>
            <p className="text-base text-neutral-900 mb-6">{card.description}</p>
            <Link to={card.link} className="text-base text-blue-700 font-bold border border-blue-700 rounded-xl px-6 py-2">
              {card.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsSection;
