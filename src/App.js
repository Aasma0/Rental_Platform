import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingComponent from "./components/LandingPage/LandingComponent";
import LoginComponent from "./components/login";
import Dashboard from "./components/Dashboard/Dashboard";
import RegistrationComponent from "./components/registration";
import CategoryComponent from "./components/Admin/category/CategoryComponent";
import ProtectedRoutes from "./protectedRoutes/protectedRoutes"; // Import ProtectedRoutes
import PropertyCreation from "./components/Property/PropertyCreation";
import CategoryPage from "./components/Dashboard/CategoryPage"; // Import CategoryPage
import PropertyList from "./components/Property/PropertyList";

import "./tailwind.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AdminDashboard from "./components/Admin/Dashboard/AdminDashboard";
import ProfileComponent from "./components/Dashboard/ProfileComponent";

const App = () => {
  const authState = useSelector((state) => state.auth); // Get auth state from Redux

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/registration" element={<RegistrationComponent />} />
        {/* Protected Route: Only logged-in users can access Dashboard */}
        <Route
          path="/dash"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/property"
          element={
            <ProtectedRoutes>
              <PropertyCreation />
            </ProtectedRoutes>
          }
        />
        <Route path="/category/:categoryId" element={<CategoryPage />} />{" "}
        {/* New route */}
        <Route
          path="/rentals"
          element={
            <ProtectedRoutes>
              <PropertyList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ProfileComponent />
            </ProtectedRoutes>
          }
        />
        {/* Protected Route: Only Admins can access Category */}
        <Route
          path="/category"
          element={
            <ProtectedRoutes role="admin">
              <CategoryComponent />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin-dash"
          element={
            <ProtectedRoutes role="admin">
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
