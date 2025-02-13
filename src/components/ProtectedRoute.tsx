import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Assuming the user data is stored as JSON in localStorage
        const userData = JSON.parse(user);

        // Check if the user exists in the database
        const response = await axios.get(`https://server.agungbot.my.id/api/check-user/${userData.user_id}`); // Adjust URL as per your backend setup
        if (response.data.exists) {
          setIsAuthenticated(true);
        } else {
          // If user does not exist, clear local storage and set authentication to false
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    // You might want to show a loading spinner or message here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated or user doesn't exist in DB, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;