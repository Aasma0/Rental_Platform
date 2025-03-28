import React, { useState, useEffect } from "react";
import Sidebar from "../LandingPage/Sidebar";
import NavbarSection from "../LandingPage/NavBar";
import SliderSection from "./SliderSection";
import CategoryList from "../Admin/category/CategoryList";
import CategorySection from "../Admin/category/CategorySection";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesWithProperties = async () => {
      try {
        const categoryRes = await axios.get("http://localhost:8000/api/category/all");
        const limitedCategories = categoryRes.data.categories.slice(0, 2); // First 4 categories
        setCategories(limitedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoriesWithProperties();
  }, []);

  return (
    <div>
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} pageType="dashboard" />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} pageType="dashboard" />
      <SliderSection />

      {/* Category Selection */}
      <div className="flex flex-col items-center my-4">
        <h2 className="text-lg font-semibold mb-2">Select a category to view properties</h2>
        <CategoryList onSelectCategory={setSelectedCategory} />
      </div>

      {/* Display selected category properties */}
      <div className="container mx-auto p-4">
        {selectedCategory && <CategorySection categoryId={selectedCategory} />}
      </div>

      {/* Auto-Displayed Categories (First 2) */}
      <div className="container mx-auto p-4">
        {categories.map((category) => (
          <CategorySection key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
