// Dashboard.js
import React, { useState } from "react";
import CategoryList from "./CategoryList"; // Import CategoryList
import PropertyList from "./PropertyListing"; // Import PropertyList
import SliderSection from "./SliderSection";
import NavbarSection from "../LandingPage/NavBar";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <NavbarSection/>
      <SliderSection />
      <div className="container mx-auto p-4">
        <div className="flex">
          <div className="w-1/4 pr-4">
            <CategoryList onSelectCategory={handleCategorySelect} />
          </div>
          <div className="w-3/4">
            {selectedCategory ? (
              <PropertyList categoryId={selectedCategory} />
            ) : (
              <p>Please select a category to see properties.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
