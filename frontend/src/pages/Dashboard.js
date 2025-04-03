import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile");
      }
    };
    fetchProfile();
  }, []);

  return user ? (
    <div className="container">
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Dashboard;
