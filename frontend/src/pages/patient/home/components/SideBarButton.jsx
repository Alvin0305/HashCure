import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const SideBarButton = ({ name, iconName }) => {
  const iconSize = 32;

  const navigate = useNavigate();
  const location = useLocation();

  const routeMap = {
    Home: "home",
    "Quick Access": "quick-access",
    Appointments: "appointments",
    Reports: "reports",
    Doctors: "doctors",
    Hospitals: "hospitals",
    Notifications: "notifications",
    "Blood Donation": "blood-donation",
    Settings: "settings",
    Profile: "profile",
    Hospital: "hospital",
    Doctor: "doctor",
    "Take Appointment": "take-appointment",
    Logout: "logout",
  };

  const currentPath = location.pathname.split("/").pop();
  const isSelected = currentPath === routeMap[name];

  const handleClick = () => {
    if (name === "Logout") {
      navigate("/");
    } else {
      navigate(`/patient/home/${routeMap[name]}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`sidebar-button ${isSelected && "sidebar-selected-button"}`}
    >
      <Icon icon={iconName} width={iconSize} height={iconSize} />
      <h2 className="sidebar-button-name">{name}</h2>
    </div>
  );
};

export default SideBarButton;
