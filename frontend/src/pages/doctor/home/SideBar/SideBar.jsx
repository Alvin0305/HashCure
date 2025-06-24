import "./sidebar.css";
import SideBarButton from "./SideBarButton";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div>
        <SideBarButton name="Home" iconName="tabler:home" />
        <SideBarButton name="Appointments" iconName="tabler:calendar-event" />
        <SideBarButton name="Patients" iconName="mdi:bed-outline" />
        <SideBarButton
          name="Notifications"
          iconName="mdi:message-badge-outline"
        />
      </div>
      <div>
        <SideBarButton name="Settings" iconName="tabler:settings" />
        <SideBarButton name="Profile" iconName="tabler:user" />
        <SideBarButton name="Logout" iconName="tabler:logout" />
      </div>
    </div>
  );
};

export default SideBar;
