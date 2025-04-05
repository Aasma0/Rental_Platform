import React, { useState, useEffect, useRef } from "react";
import {
  FiUsers,
  FiHome,
  FiPieChart,
  FiRefreshCw,
  FiDollarSign,
  FiCalendar,
  FiMenu,
  FiArrowUp,
  FiSettings,
  FiLogOut,
  FiUserPlus,
  FiGrid,
  FiTag,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import Graph from "./Graphs";
import PieChartComponent from "./PieChartComponent";
import ViewAll from "./ViewAll";
import TagManagement from "../Tag/TagManagement";


import CategoryComponent from "../category/CategoryComponent";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    name: "Loading...",
    email: "loading@example.com",
    profile: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [quickStatsData, setQuickStatsData] = useState({
    totalProperties: 0,
    activeBookings: 0,
    sellingProperties: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Refs for scrolling
  const userGrowthRef = useRef(null);
  const propertyCategoryRef = useRef(null);
  const manageUsersRef = useRef(null);
  const tagManagementRef = useRef(null);

  const categoriesRef = useRef(null);
  const topRef = useRef(null);

  // Quick stats configuration
  const quickStats = [
    {
      title: "Total Property",
      value: quickStatsData.totalProperties,
      icon: <FiHome className="text-xl" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Bookings",
      value: quickStatsData.activeBookings,
      icon: <FiCalendar className="text-xl" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Selling Property",
      value: quickStatsData.sellingProperties,
      icon: <FiDollarSign className="text-xl" />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await axiosInstance.get("/user/profile");
      const { name, email, profilePicture } = response.data.user;

      setAdminData({
        name: name || "Admin",
        profile: profilePicture
          ? `http://localhost:8000/${profilePicture}`
          : "",
        email: email || "admin@example.com",
      });
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/user/stats");
      const data = response.data;

      const now = new Date();
      const currentMonth = now.getMonth();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyData = [];
      for (let i = 0; i <= currentMonth; i++) {
        monthlyData.push({ name: months[i], users: 0 });
      }

      data.forEach((item) => {
        const isCurrentYear = item.year === new Date().getFullYear();
        const monthIndex = item.month - 1;
        if (isCurrentYear && monthIndex <= currentMonth) {
          monthlyData[monthIndex].users = item.count;
        }
      });

      setUserStats(monthlyData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load user statistics");
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchQuickStats function
  const fetchQuickStats = async () => {
    try {
      setStatsLoading(true);
      const [propertiesRes, bookingsRes, sellingRes] = await Promise.all([
        axiosInstance.get("/property/count"),
        axiosInstance.get("/booking/active-bookings-count"),
        axiosInstance.get("/property/selling-count"),
      ]);

      setQuickStatsData({
        totalProperties: propertiesRes.data.count,
        activeBookings: bookingsRes.data.count,
        sellingProperties: sellingRes.data.count,
      });
    } catch (error) {
      console.error("Error details:", {
        config: error.config,
        response: error.response?.data,
      });
      toast.error("Failed to load statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchUserStats();
    fetchQuickStats();
    const interval = setInterval(fetchUserStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll handler
  const scrollToRef = (ref) => {
    setIsSidebarOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="flex items-center justify-between p-4 px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>
          <div className="flex items-center gap-4">
            {!profileLoading && (
              <span className="text-sm text-gray-600 hidden lg:block">
                {adminData.name}
              </span>
            )}
            <img
              src={adminData.profile || "https://via.placeholder.com/32"}
              alt="Admin"
              className="h-8 w-8 rounded-full object-cover bg-gray-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/32";
              }}
            />
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-200 z-50`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8 border-b">
          {profileLoading ? (
            <div className="animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ) : (
            <>
              <img
                src={adminData.profile || "https://via.placeholder.com/80"}
                alt="Admin Profile"
                className="w-20 h-20 rounded-full mb-4 object-cover bg-gray-200"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80";
                }}
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {adminData.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{adminData.email}</p>
            </>
          )}
          <Link
            to="/profile"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <FiSettings className="text-sm" /> Account Settings
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-4 p-4 flex flex-col h-[calc(100%-260px)]">
          <button
            onClick={() => scrollToRef(topRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg"
          >
            <FiHome /> Dashboard
          </button>

          <button
            onClick={() => scrollToRef(userGrowthRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg mt-2"
          >
            <FiUsers /> User Growth
          </button>

          <button
            onClick={() => scrollToRef(propertyCategoryRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg mt-2"
          >
            <FiPieChart /> Property Categories
          </button>

          <button
            onClick={() => scrollToRef(manageUsersRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg mt-2"
          >
            <FiUserPlus /> Manage Users
          </button>

          <button
            onClick={() => scrollToRef(categoriesRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg mt-2"
          >
            <FiGrid /> Manage Categories
          </button>

          <button
            onClick={() => scrollToRef(tagManagementRef)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-lg mt-2"
          >
            <FiTag /> Manage Tags
          </button>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 hover:text-red-600 rounded-lg"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-20 p-6 transition-all duration-200 lg:ml-64`}>
        {/* Scroll to Top Button */}
        <button
          onClick={() => scrollToRef(topRef)}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <FiArrowUp className="text-xl" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          {!profileLoading && (
            <p className="text-gray-600 mt-2">
              Welcome back, {adminData.name.split(" ")[0]}!
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${stat.color} flex items-center justify-between`}
            >
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <div className="flex items-end gap-2 mt-2">
                  {statsLoading ? (
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                  ) : (
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  )}
                </div>
              </div>
              <span className="text-2xl p-3 rounded-full bg-white bg-opacity-50">
                {stat.icon}
              </span>
            </div>
          ))}
        </div>

        {/* User Growth Section */}
        <section
          className="mb-8 scroll-mt-20"
          ref={userGrowthRef}
          id="user-growth"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiUsers className="text-blue-600" /> User Growth
              </h2>
              <button
                onClick={fetchUserStats}
                className="text-sm flex items-center gap-1 text-gray-600 hover:text-blue-600"
              >
                <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
                <span className="text-gray-500">Loading chart...</span>
              </div>
            ) : (
              <Graph data={userStats} />
            )}
          </div>
        </section>

        {/* Property Categories Section */}
        <section
          className="mb-8 scroll-mt-20"
          ref={propertyCategoryRef}
          id="property-categories"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiPieChart className="text-purple-600" /> Property Categories
              </h2>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <PieChartComponent />
          </div>
        </section>

        {/* Manage Users Section */}
        <section
          className="mb-8 scroll-mt-20"
          ref={manageUsersRef}
          id="manage-users"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiUserPlus className="text-green-600" /> Manage Users
              </h2>
            </div>
            <ViewAll />
          </div>
        </section>

        {/* Manage Categories Section */}
        <section
          className="mb-8 scroll-mt-20"
          ref={categoriesRef}
          id="manage-categories"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiGrid className="text-orange-600" /> Manage Categories
              </h2>
            </div>
            <CategoryComponent />
          </div>
        </section>

        {/* Tag Management Section */}
        <section
          className="mb-8 scroll-mt-20"
          ref={tagManagementRef}
          id="manage-tags"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiTag className="text-purple-600" /> Tag Management
              </h2>
            </div>
            <TagManagement />
          </div>
        </section>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </main>
    </div>
  );
};

export default AdminDashboard;
