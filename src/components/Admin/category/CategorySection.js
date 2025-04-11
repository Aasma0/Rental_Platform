import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../../Booking/PropertyCard";
import { useNavigate } from "react-router-dom";

const CategorySection = ({ category, bookedDates, onBook }) => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/property/all?category=${category._id}`
        );

        // Transform properties to match PropertyCard's expectations
        const transformedProperties = response.data.map(property => {
          // Transform tags/amenities
          const tagNames = Array.isArray(property.tags) 
            ? property.tags.map(tag => 
                typeof tag === 'object' ? tag.name : tag
              )
            : [];
          
          // Include amenities if they exist
          const amenities = Array.isArray(property.amenities)
            ? property.amenities.map(amenity =>
                typeof amenity === 'object' ? amenity.name : amenity
              )
            : [];
          
          // Combine tags and amenities for the tagNames property
          const allTags = [...tagNames, ...amenities].filter(Boolean);

          // Transform owner data - ensure all owner information is included
          let owner = {};
          
          // Check all possible owner data locations
          if (property.ownerId) {
            // If ownerId is an object with owner details
            if (typeof property.ownerId === 'object') {
              owner = {
                name: property.ownerId.name || property.ownerId.username || "",
                email: property.ownerId.email || "",
                phone: property.ownerId.phone || property.ownerId.phoneNumber || ""
              };
            } else {
              // If ownerId is just an ID
              owner = {
                name: "Property Owner",
                email: "",
                phone: ""
              };
            }
          } else if (property.owner) {
            // If owner object is directly available
            owner = {
              name: property.owner.name || property.owner.username || "",
              email: property.owner.email || "",
              phone: property.owner.phone || property.owner.phoneNumber || ""
            };
          } else if (property.ownerDetails) {
            // Some APIs might have a separate ownerDetails field
            owner = {
              name: property.ownerDetails.name || property.ownerDetails.username || "",
              email: property.ownerDetails.email || "",
              phone: property.ownerDetails.phone || property.ownerDetails.phoneNumber || ""
            };
          } else {
            // Fallback
            owner = {
              name: "Property Owner",
              email: "",
              phone: ""
            };
          }

          // Fix image paths
          const images = Array.isArray(property.images)
            ? property.images.map(img => {
                if (img.startsWith('http')) return img;
                const formattedPath = img.replace(/\\/g, '/');
                return `http://localhost:8000/${formattedPath}`;
              })
            : [];

          return {
            ...property,
            tagNames: allTags,
            amenities: allTags, // Include as a separate property if needed
            owner,
            images
          };
        });

        setProperties(transformedProperties.slice(0, 10));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [category._id]);

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-2">{category.name}</h3>

      {/* Horizontal scrollable container for property cards */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex space-x-4 py-4">
          {properties.map((property) => (
            <div key={property._id} className="w-[300px] flex-shrink-0">
              <PropertyCard 
                property={property}
                bookedDates={bookedDates}
                onBook={onBook}
              />
            </div>
          ))}
        </div>
      </div>

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