import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Custom hook for auth logic

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Assuming this hook gives authentication status

  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Allow access to protected content if authenticated
};

export default ProtectedRoute;
