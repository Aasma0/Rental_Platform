import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingComponent from "./components/LandingPage/LandingComponent";
import LoginComponent from "./components/login";
import Dashboard from "./components/Dashboard/Dashboard";
import RegistrationComponent from "./components/registration";
import CategoryComponent from "./components/category/CategoryComponent";
import ProtectedRoutes from "./protectedRoutes/protectedRoutes"; // Import ProtectedRoutes
import PropertyCreation from "./components/PropertyCreation";
import "./tailwind.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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

        {/* Protected Route: Only Admins can access Category */}
        <Route
          path="/category"
          element={
            <ProtectedRoutes role="admin">
              <CategoryComponent />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
