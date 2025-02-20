import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ role, children }) => {
  const authState = useSelector((state) => state.auth); // Get auth state from Redux
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not authenticated (no token), redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the role is specified and doesn't match, redirect to home
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoutes;
