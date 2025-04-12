import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/home">FoodChain</Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link className="btn btn-outline-light mx-2" to="/dashboard">Dashboard</Link>
              <Link className="btn btn-outline-light mx-2" to="/orders">Place Order</Link>
              <Link className="btn btn-danger" onClick={handleLogout}>Logout</Link>
              {/* <Link to="/my-orders">My Orders</Link> */}
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light mx-2" to="/login">Login</Link>
              <Link className="btn btn-outline-light mx-2" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
