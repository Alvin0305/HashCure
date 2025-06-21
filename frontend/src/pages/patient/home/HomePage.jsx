import React, { useEffect } from "react";
import SideBar from "./components/SideBar";
import "./homepage.css";
import HomeContent from "./components/HomeContent/HomeContent";
import QuickAccess from "../quick_access/QuickAccess";
import Appointments from "../appointments/Appointments";
import Reports from "../reports/Reports";
import Doctors from "../doctors/Doctors";
import Hospitals from "../hospitals/Hospitals";
import Notifications from "../notifications/Notifications";
import BloodDonation from "../blood_donation/BloodDonation";
import Settings from "../settings/Settings";
import Profile from "../profile/Profile";
import Hospital from "../hospital/Hospital";
import Doctor from "../doctor/Doctor";
import TakeAppointment from "../take_appointment/TakeAppointment";
import { Routes, Route, Navigate } from "react-router-dom";
import ViewAppointment from "../view_appointment/ViewAppointment";

const HomePage = () => {
  return (
    <div className="homepage">
      <SideBar />
      <div className="homepage-content">
        <Routes>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HomeContent />} />
          <Route path="quick-access" element={<QuickAccess />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="blood-donation" element={<BloodDonation />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="hospital" element={<Hospital />} />
          <Route path="doctor" element={<Doctor />} />
          <Route path="take-appointment" element={<TakeAppointment />} />
          <Route path="view-appointment" element={<ViewAppointment />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;
