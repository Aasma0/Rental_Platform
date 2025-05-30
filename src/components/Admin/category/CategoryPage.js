// CategoryPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PropertyCard from "../../Booking/PropertyCard";
import NavbarSection from "../../LandingPage/NavBar"; // Import Navbar
import Sidebar from "../../LandingPage/Sidebar"; // Import Sidebar

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = localStorage.getItem("role");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/property/all?category=${categoryId}`);
        setProperties(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [categoryId]);

  const handleBooking = (startDate, endDate) => {
    setBookedDates([...bookedDates, { start: startDate.toISOString(), end: endDate.toISOString() }]);
  };

  if (loading) return <p className="text-center">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen">
      <NavbarSection 
        toggleSidebar={toggleSidebar} 
        pageType="dashboard" // Always show dashboard-style navbar
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        pageType={userRole === "admin" ? "admin" : "dashboard"} // Dynamic sidebar content
      />

      <div className="container mx-auto p-4 pt-20"> {/* Add padding-top for navbar */}
        <h2 className="text-2xl font-bold mb-4">Properties in Selected Category</h2>
        {properties.length === 0 ? (
          <p>No properties found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {properties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property} 
                bookedDates={bookedDates} 
                onBook={handleBooking} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;