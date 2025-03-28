import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
import Sidebar from "../LandingPage/Sidebar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  
      const response = await fetch("http://localhost:8000/api/booking/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
  
      const data = await response.json();
      setBookings(data.bookings); // Ensure 'bookings' is coming from the response
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle booking edit
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setStartDate(booking.startDate.slice(0, 10)); // Format for date input
    setEndDate(booking.endDate.slice(0, 10)); // Format for date input
  };

  // Handle booking update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateMessage("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:8000/api/booking/update/${editingBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ startDate, endDate }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage("Booking updated successfully!");
        setEditingBooking(null);
        fetchBookings(); // Refresh the list
      } else {
        setUpdateMessage(data.message || "Failed to update booking");
      }
    } catch (error) {
      setUpdateMessage("An error occurred. Please try again.");
    }
  };

  // Handle booking cancel/delete
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:8000/api/booking/cancel/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        setUpdateMessage("Booking canceled successfully!");
      } else {
        const data = await response.json();
        setUpdateMessage(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      setUpdateMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {/* <Header toggleSidebar={toggleSidebar} /> */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} pageType="dashboard" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        {updateMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {updateMessage}
          </div>
        )}

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p>You don't have any bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Property</th>
                  <th className="py-2 px-4 border-b">Start Date</th>
                  <th className="py-2 px-4 border-b">End Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{booking.property.title}</td>
                    <td className="py-2 px-4 border-b">{formatDate(booking.startDate)}</td>
                    <td className="py-2 px-4 border-b">{formatDate(booking.endDate)}</td>
                    <td className="py-2 px-4 border-b">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Active
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 w-full max-w-md relative rounded-lg">
              <span
                className="absolute top-2 right-2 cursor-pointer text-gray-500 text-lg font-bold"
                onClick={() => setEditingBooking(null)}
              >
                &times;
              </span>

              <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
              <p className="mb-4">Property: {editingBooking.property.title}</p>

              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;