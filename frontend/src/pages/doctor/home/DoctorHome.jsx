import React, { useState } from "react";
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
import Reports from "../../patient/reports/Reports";
import { Icon } from "@iconify/react/dist/iconify.js";

const DoctorHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const isPhone = window.innerWidth < 728;
  let style = { zIndex: 9999 };
  if (!isPhone) {
    style["display"] = "none";
  }
  return (
    <div className="homepage">
      <Icon
        icon="lucide:menu"
        width={40}
        height={40}
        style={style}
        onClick={() => setShowSidebar(true)}
      />
      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
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
          <Route path="reports/:id" element={<Reports />} />
          <Route path="conduct-appointment" element={<ConductAppointment />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorHome;
