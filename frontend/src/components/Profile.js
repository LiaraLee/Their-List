import { useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save user data (API request logic)
    console.log("Profile Updated: ", user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Profile</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default Profile;
