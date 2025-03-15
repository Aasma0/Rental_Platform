import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import SliderSection from "../Dashboard/SliderSection";

const PropertyList = () => {
  const [properties, setProperties] = useState([]); // Default to empty array
  const [filteredProperties, setFilteredProperties] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/property/all");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data || []); // Ensure data is an array
      setFilteredProperties(data || []); // Ensure default is an array
    } catch (error) {
      setError(error.message);
      setProperties([]); // Ensure state is never undefined
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    if (!query) {
      setFilteredProperties(properties); // Reset to all properties if empty search
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/property/search?search=${query}`);
      const data = await response.json();
      setFilteredProperties(data.properties || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredProperties([]); // Default to empty array if error occurs
    }
  };

  // Handle booking function
  const handleBooking = (startDate, endDate) => {
    setBookedDates([...bookedDates, { start: startDate.toISOString(), end: endDate.toISOString() }]);
  };

  if (loading) return <p className="text-center">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <SliderSection onSearch={handleSearch} />
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>

      {Array.isArray(filteredProperties) && filteredProperties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} bookedDates={bookedDates} onBook={handleBooking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
