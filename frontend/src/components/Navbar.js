import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">FoodChain</Link>
        <div>
          {localStorage.getItem("token") ? (
            <>
              <Link className="btn btn-outline-light mx-2" to="/dashboard">Dashboard</Link>
              <Link className="btn btn-outline-light mx-2" to="/orders">Orders</Link>
              <Link className="btn btn-outline-light mx-2" to="/profile">Profile</Link>
              <Link className="btn btn-outline-light mx-2" to="/orderform">Create Order</Link>
              <Link className="btn btn-outline-light mx-2" to="/orderlist">View Orders</Link>
              <Link className="btn btn-outline-light mx-2" to="/payment">Payment</Link>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
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
