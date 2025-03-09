// CategoryList.js
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
    navigate(`/category/${categoryId}`); // Navigate to the new page
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category._id}
            className="cursor-pointer text-blue-500 mb-2"
            onClick={() => handleCategoryClick(category._id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
