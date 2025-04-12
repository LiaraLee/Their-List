// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after registration
import axios from 'axios';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Send registration request
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
      name,
      email,
      password,
    });

    if (response.ok) {
      // On successful registration, redirect to login page
      history.push('/login');
    } else {
      // Handle registration failure
      alert('Registration failed!');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
