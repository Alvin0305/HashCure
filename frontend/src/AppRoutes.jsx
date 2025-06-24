import React from "react";
import { useEffect } from "react";
import socket from "./sockets/socket";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/patient/home/HomePage";
import { useUser } from "./contexts/userContext";
import DoctorHome from "./pages/doctor/home/DoctorHome";
import HAHomePage from "./pages/hosptal_admin/home/HAHomePage";
import { getHospitalByAdminId } from "./services/hospitalService";
import { HospitalProvider, useHospital } from "./contexts/hospitalContext";
import AdminHomePage from "./pages/admin/AdminHomePage";

const AppRoutes = () => {
  const { user } = useUser();
  useEffect(() => {
    if (user && user.id) {
      console.log(
        "user change, reemitting socket signal for ",
        user?.id,
        user?.firstname
      );
      socket.emit("user_joined", user.id);
    }
  }, [user, socket.connected]);

  const { setHospital } = useHospital();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "hospital-admin") return;
    const fetchHospital = async () => {
      try {
        console.log(user);
        const response = await getHospitalByAdminId(user.id);
        console.log(response.data);
        setHospital(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospital();
  }, [user]);

  useEffect(() => {
    if (!socket.connected) {
      console.log("attempting to connect");
      socket.connect();
    }
    socket.on("connect", () => {
      console.log("Socket connected succesfully with id", socket.id);
      if (user && user.id) {
        socket.emit("user_joined", user.id);
      }
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    // <HospitalProvider>
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
        <Route path="/doctor/home/*" element={<DoctorHome />} />
        <Route path="/hospital-admin/home/*" element={<HAHomePage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
      </Routes>
    </Router>
    // </HospitalProvider>
  );
};

export default AppRoutes;
