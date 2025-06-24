import SideBarButton from "./SideBarButton";

const SideBar = () => {
  return (
    <div className="sidebar">
      <div>
        <SideBarButton name="Home" iconName="tabler:home" />
        <SideBarButton name="Appointments" iconName="tabler:calendar-event" />
        <SideBarButton name="Reports" iconName="tabler:report-medical" />
        <SideBarButton
          name="Doctors"
          iconName="material-symbols:medical-services-outline"
        />
        <SideBarButton name="Patients" iconName="mdi:bed-outline" />
        <SideBarButton name="Blood Donation" iconName="mdi:water-outline" />
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
