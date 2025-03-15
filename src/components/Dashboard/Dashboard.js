import React, { useState } from "react";
import CategoryList from "./CategoryList";
import PropertyList from "./PropertyListing";
import SliderSection from "./SliderSection";
import Sidebar from "../LandingPage/Sidebar";
import NavbarSection from "../LandingPage/NavBar"; // Ensure the correct import

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Fix: Using previous state to ensure proper toggle behavior
  };

  return (
    <div>
      <NavbarSection toggleSidebar={toggleSidebar} /> {/* ✅ Passing toggleSidebar */}
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* ✅ Ensure Sidebar gets isOpen */}
    </div>
  );
};

export default Dashboard;
