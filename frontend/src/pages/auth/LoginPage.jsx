import React, { useState } from "react";
import "./auth.css";
import { loginUser } from "../../services/authService";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(userData);
      console.log(response.data);
      setUser(response.data);
      if (response.data.role === "doctor") {
        navigate("doctor/home");
      } else if (response.data.role === "hospital-admin") {
        navigate("/hospital-admin/home");
      } else if (response.data.role === "admin") {
        navigate("admin/home");
      } else {
        navigate("/patient/home");
      }
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
      <form onSubmit={handleLogin} className="auth-container">
        <h1 className="m0">Welcome Back!!</h1>
        <input
          type="text"
          placeholder="Email..."
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="field"
        />
        <input
          type="password"
          placeholder="Password..."
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          className="field"
        />
        {/* <p className="m0 auth-link">Forget Password?</p> */}
        <button type="submit" className="button blue-button">
          Sign In
        </button>
        <p className="m0">
          Don't have an account?
          <a href="/register" className="auth-link">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
