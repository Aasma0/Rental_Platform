import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../LandingPage/NavBar";
import Sidebar from "../LandingPage/Sidebar";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const MyProperty = () => {
  const [properties, setProperties] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchMyProperties = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication required");
          return;
        }
        
        const res = await axios.get("http://localhost:8000/api/property/my-properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setProperties(res.data);
        
        if (res.data.length > 0) {
          toast.success(`${res.data.length} properties loaded successfully`);
        }
      } catch (error) {
        console.error("Error fetching properties", error);
        toast.error(error.response?.data?.message || "Failed to fetch your properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProperties();
  }, []);

  const handleDelete = async (propertyId, propertyTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyTitle}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      
      await toast.promise(
        axios.delete(`http://localhost:8000/api/property/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          pending: 'Deleting property...',
          success: 'Property deleted successfully',
          error: 'Failed to delete property'
        }
      );
      
      setProperties(properties.filter((property) => property._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property", error);
      toast.error(error.response?.data?.message || "Error deleting property");
    }
  };

  const navigateToEdit = (propertyId) => {
    toast.info("Redirecting to edit page...");
    window.location.href = `/edit-property/${propertyId}`;
  };

  const formatPriceDisplay = (property) => {
    const price = property.totalPrice || property.price;
    let priceUnit = '';
    
    if (property.type === "Selling") {
      return `$${price}`;
    } else {
      if (property.pricingUnit) {
        switch (property.pricingUnit) {
          case "Per Month":
            priceUnit = "/month";
            break;
          case "Per Day":
            priceUnit = "/day";
            break;
          case "Per Week":
            priceUnit = "/week";
            break;
          default:
            priceUnit = "";
        }
      } else {
        priceUnit = "/month"; // Default
      }
      return `$${price}${priceUnit}`;
    }
  };

  return (
    <div className="flex relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} pageType="dashboard" />

      <div className="flex-1 min-h-screen bg-gray-50">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} pageType="dashboard" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">My Properties</h2>
            <button 
              onClick={() => window.location.href = '/create-property'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add New Property
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden relative">
                      {property.images?.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {property.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                      <p className="text-gray-600 mb-2 flex items-center">
                        <HiOutlineLocationMarker className="w-5 h-5 mr-2 text-red-500" />
                        {property.location || "No location specified"}
                      </p>
                      <p className="text-lg font-bold text-green-600 mb-4">
                        {formatPriceDisplay(property)}
                      </p>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigateToEdit(property._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FiEdit className="w-4 h-4 mr-2 text-white" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property._id, property.title)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                        >
                          <FiTrash2 className="w-4 h-4 mr-2 text-white" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 col-span-full bg-white rounded-lg shadow-md">
                  <p className="text-gray-500 text-lg mb-4">You haven't listed any properties yet.</p>
                  <button
                    onClick={() => window.location.href = '/property'}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Property
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProperty;