import { Icon } from "@iconify/react/dist/iconify.js";
import SideBarButton from "./SidebarButton";

const SideBar = ({ hospitalRef, doctorRef, showSidebar, setShowSidebar }) => {
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

        <SideBarButton
          name="Hospitals"
          iconName="mdi:hospital-building"
          ref={hospitalRef}
        />
        <SideBarButton
          name="Doctors"
          iconName="material-symbols:medical-services-outline"
          ref={doctorRef}
        />
      </div>
      <div onClick={handleClick}>
        <SideBarButton name="Logout" iconName="tabler:logout" />
      </div>
    </div>
  );
};

export default SideBar;
