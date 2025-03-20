import React, { useState } from "react";
import Sidebar from "../LandingPage/Sidebar";
import NavbarSection from "../LandingPage/NavBar";
import SliderSection from "./SliderSection";
import CategoryList from "./CategoryList";
import PropertyList from "./PropertyListing";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} pageType="dashboard" />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} pageType="dashboard" />
      <SliderSection />

      {/* Category Selection Message */}
      <div className="flex flex-col items-center my-4">
        <h2 className="text-lg font-semibold mb-2">Select a category to view properties</h2>
        <CategoryList onSelectCategory={setSelectedCategory} />
      </div>

      <div className="container mx-auto p-4">
        <div className="flex">
          <div className="w-1/4 pr-4"></div>
          <div className="w-3/4">
            {selectedCategory && <PropertyList categoryId={selectedCategory} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
