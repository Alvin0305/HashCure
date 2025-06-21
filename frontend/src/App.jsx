import React from "react";
import LoginPage from "./pages/auth/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import { UserProvider } from "./contexts/userContext";
import HomePage from "./pages/patient/home/HomePage";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient/home/*" element={<HomePage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
