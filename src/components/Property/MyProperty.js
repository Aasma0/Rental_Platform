import { useEffect, useState } from "react";
import axios from "axios";

const MyProperty = () => {
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT from storage
        const res = await axios.get("http://localhost:8000/api/property/my-properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    fetchMyProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((property) => property._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{property.title}</h3>
              <p>{property.location}</p>
              <p>${property.price} / month</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => window.location.href = `/edit-property/${property._id}`}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => handleDelete(property._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No properties listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyProperty;
