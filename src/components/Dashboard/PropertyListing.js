// PropertyList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const PropertyList = ({ categoryId }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/property/all?category=${categoryId}`);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    if (categoryId) {
      fetchProperties();
    }
  }, [categoryId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Properties</h2>
      <ul>
        {properties.length > 0 ? (
          properties.map((property) => (
            <li key={property._id} className="mb-4 p-4 border-b">
              <h3 className="text-lg">{property.title}</h3>
              <p>{property.description}</p>
              <p><strong>Price:</strong> ${property.price}</p>
              <p><strong>Location:</strong> {property.location}</p>
            </li>
          ))
        ) : (
          <p>No properties available in this category.</p>
        )}
      </ul>
    </div>
  );
};

export default PropertyList;
