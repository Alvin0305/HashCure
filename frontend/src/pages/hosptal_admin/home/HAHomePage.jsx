import SideBar from "./Sidebar/SideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import HAAppointments from "../appointments/HAAppointments";
import HAReports from "../reports/HAReports";
import HADoctors from "../doctors/HADoctors";
import HAPatients from "../patients/HAPatients";
import BloodDonation from "../../patient/blood_donation/BloodDonation";
import HAProfile from "../profile/HAProfile";
import { useEffect, useState } from "react";
import { useHospital } from "../../../contexts/hospitalContext";
import Profile from "../../patient/profile/Profile";
import Settings from "../../patient/settings/Settings";
import Doctor from "../../patient/doctor/Doctor";
import DoctorPage from "../doctors/DoctorPage";
import { Icon } from "@iconify/react/dist/iconify.js";

const HAHomePage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { hospital } = useHospital();
  useEffect(() => {
    console.log(hospital);
  }, []);
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
          <Route path="appointments" element={<HAAppointments />} />
          <Route path="doctors" element={<HADoctors />} />
          <Route path="patients" element={<HAPatients />} />
          <Route path="blood-donation" element={<BloodDonation />} />
          <Route path="profile/:id" element={<HAProfile />} />
          <Route path="patient/:id" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="doctor" element={<DoctorPage />} />
          <Route path="doctor/:id" element={<DoctorPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default HAHomePage;
