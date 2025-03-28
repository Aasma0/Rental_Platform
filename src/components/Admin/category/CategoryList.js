import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category/all");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="w-[80%] mx-auto overflow-x-auto whitespace-nowrap py-4 flex space-x-4 px-4">
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category._id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
