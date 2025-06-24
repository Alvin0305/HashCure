import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUser } from "../../../../contexts/userContext";

const SideBarButton = ({ name, iconName }) => {
  const iconSize = 32;

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUser();

  const routeMap = {
    Home: "home",
    Appointments: "appointments",
    Reports: "reports",
    Doctors: "doctors",
    Hospitals: "hospitals",
    Notifications: "notifications",
    Settings: "settings",
    Profile: `profile/${user.id}`,
    Logout: "logout",
    Patients: "patients",
  };

  const currentPath = location.pathname.split("/").pop();
  const isSelected = currentPath === routeMap[name];

  const handleClick = () => {
    if (name === "Logout") {
      navigate("/");
    } else {
      navigate(`/doctor/home/${routeMap[name]}`);
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
