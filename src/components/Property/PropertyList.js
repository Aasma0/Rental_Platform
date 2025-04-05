import { useEffect, useState } from "react";
import PropertyCard from "../Booking/PropertyCard";
import SliderSection from "../Dashboard/SliderSection";
import NavbarSection from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";

const PropertyList = () => {
  const [properties, setProperties] = useState([]); 
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/property/all");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      const rentingProperties = (data || []).filter(p => p.type === "Renting");
      setProperties(rentingProperties);
      setFilteredProperties(rentingProperties);
    } catch (error) {
      setError(error.message);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredProperties(properties);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/property/search?search=${query}`);
      const data = await response.json();
      setFilteredProperties(data.properties || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredProperties([]);
    }
  };

  const handleBooking = (startDate, endDate) => {
    setBookedDates([...bookedDates, { start: startDate.toISOString(), end: endDate.toISOString() }]);
  };

  if (loading) return <p className="text-center">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with sidebar toggle */}
      <NavbarSection toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} pageType="dashboard" />

      <div className="flex flex-1">
        {/* Sidebar with visibility toggle */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} pageType="dashboard" />

        {/* Main Content */}
        <div className="flex-1 p-4">
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
      </div>
    </div>
  );
};

export default PropertyList;
