import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../../Property/PropertyCard";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CategorySection = ({ category }) => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/property/all?category=${category._id}`);
        setProperties(response.data.slice(0, 10)); // First 10 properties
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [category._id]);

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-2">{category.name}</h3>

      {/* Property Cards Slider */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView="auto"
        grabCursor={true}
        className="py-4"
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id} className="w-[300px]">
            <PropertyCard property={property} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Explore More Button (Centered Below) */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate(`/category/${category._id}`)}
          className="px-6 py-3 bg-black text-white font-semibold uppercase hover:bg-gray-900 transition-all"
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default CategorySection;
