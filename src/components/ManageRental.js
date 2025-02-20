import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageRental = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProperties = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your properties.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/property/my-properties", {
          headers: { Authorization: token },
        });

        setProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch properties.");
      }
    };

    fetchUserProperties();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Your Rentals</h1>
      {error && <p className="text-red-500">{error}</p>}

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-bold">{property.title}</h2>
              <p>{property.description}</p>
              <p className="text-gray-600">{property.location}</p>
              <p className="font-semibold">Price: ${property.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageRental;
