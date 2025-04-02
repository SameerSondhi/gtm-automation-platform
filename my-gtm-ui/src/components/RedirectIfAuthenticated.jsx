import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (session) return <Navigate to="/crm" />;

  return children;
};

export default RedirectIfAuthenticated;