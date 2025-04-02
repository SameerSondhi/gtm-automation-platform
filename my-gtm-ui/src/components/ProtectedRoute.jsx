import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!session) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;