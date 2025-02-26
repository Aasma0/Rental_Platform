import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard"; // Import the PropertyCard component

const PropertyList = () => {
  const [properties, setProperties] = useState([]); // Default empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // Track booked dates

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/property/all");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleBooking = (startDate, endDate) => {
    setBookedDates([...bookedDates, { start: startDate.toISOString(), end: endDate.toISOString() }]);
  };

  if (loading) return <p className="text-center">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} bookedDates={bookedDates} onBook={handleBooking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;