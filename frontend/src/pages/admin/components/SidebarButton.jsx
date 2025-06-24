import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUser } from "../../../contexts/userContext";

const SideBarButton = ({ name, iconName, ref }) => {
  const iconSize = 32;

  const navigate = useNavigate();

  const handleClick = () => {
    if (name === "Logout") {
      navigate("/");
    } else if (ref) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div onClick={handleClick} className={`sidebar-button`}>
      <Icon icon={iconName} width={iconSize} height={iconSize} />
      <h2 className="sidebar-button-name">{name}</h2>
    </div>
  );
};

export default SideBarButton;
