// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Their List</h1>
      <p>
        Your go-to app for managing tasks, to-dos, and more. Start organizing your life today!
      </p>
      <div className="home-buttons">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
