import React from "react";
import SideBar from "./SideBar/SideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import DoctorAppointments from "../appointments/DoctorAppointments";
import DoctorSettings from "../settings/DoctorSettings";
import DoctorProfile from "../profile/DoctorProfile";
import Patients from "../patients/Patients";
import Profile from "../../patient/profile/Profile";
import Notifications from "../../patient/notifications/Notifications";
import ConductAppointment from "../conduct-appointment/ConductAppointment";

const DoctorHome = () => {
  return (
    <div className="homepage">
      <SideBar />
      <div className="homepage-content">
        <Routes>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="settings" element={<DoctorSettings />} />
          <Route path="profile/:id" element={<DoctorProfile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patient/:id" element={<Profile />} />
          <Route path="conduct-appointment" element={<ConductAppointment />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorHome;
