import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., checking a token in localStorage or sessionStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true); // If the token exists, mark the user as authenticated
    } else {
      setIsAuthenticated(false); // Otherwise, mark as not authenticated
    }
  }, []);

  return { isAuthenticated };
};
