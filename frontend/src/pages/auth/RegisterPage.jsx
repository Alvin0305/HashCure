import React, { useState } from "react";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authService";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(userData);
      console.log(response.data);
      setUser(response.data);
      navigate("/patient/home");
    } catch (err) {
      console.error(err);
      if (!err.response) return toast.error("Unhandled exception");
      if (err.response.status === 404) return toast.error("User Not Found");
      if (err.response.status === 401) return toast.error("Invalid password");
      return toast.error("Unhandled exception");
    }
  };

  return (
    <div className="auth-page">
      <img
        src="/auth_background.jpg"
        alt="No internet"
        className="auth-background"
      />
      <form onSubmit={handleRegister} className="auth-container">
        <h1 className="m0">Welcome !!</h1>
        <input
          type="text"
          placeholder="First Name..."
          value={userData.firstname}
          onChange={(e) =>
            setUserData({ ...userData, firstname: e.target.value })
          }
          className="field"
        />
        <input
          type="text"
          placeholder="Last Name..."
          value={userData.lastname}
          onChange={(e) =>
            setUserData({ ...userData, lastname: e.target.value })
          }
          className="field"
        />
        <input
          type="text"
          placeholder="Email..."
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="field"
        />
        <input
          type="text"
          placeholder="Password..."
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          className="field"
        />
        {/* <p className="m0 auth-link">Forget Password?</p> */}
        <button type="submit" className="button blue-button">
          Sign Up
        </button>
        <p className="m0">
          Already have an account?
          <a href="/" className="auth-link">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
