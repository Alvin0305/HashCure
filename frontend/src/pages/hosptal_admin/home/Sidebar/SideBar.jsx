import { Icon } from "@iconify/react/dist/iconify.js";
import SideBarButton from "./SideBarButton";

const SideBar = ({ showSidebar, setShowSidebar }) => {
  const isMobile = window.innerWidth < 768;

  const handleClick = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div className={`sidebar ${showSidebar ? "show" : ""}`}>
      <div onClick={handleClick}>
        {isMobile && (
          <div className="sidebar-close-icon">
            <Icon
              icon="lucide:x"
              width={30}
              height={30}
              onClick={() => setShowSidebar(false)}
            />
          </div>
        )}
        <SideBarButton name="Home" iconName="tabler:home" />
        <SideBarButton name="Appointments" iconName="tabler:calendar-event" />
        <SideBarButton
          name="Doctors"
          iconName="material-symbols:medical-services-outline"
        />
        <SideBarButton name="Patients" iconName="mdi:bed-outline" />
        <SideBarButton name="Blood Donation" iconName="mdi:water-outline" />
      </div>
      <div onClick={handleClick}>
        <SideBarButton name="Settings" iconName="tabler:settings" />
        <SideBarButton name="Profile" iconName="tabler:user" />
        <SideBarButton name="Logout" iconName="tabler:logout" />
      </div>
    </div>
  );
};

export default SideBar;
