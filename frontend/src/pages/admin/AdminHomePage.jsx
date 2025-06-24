import React, { useEffect, useRef, useState } from "react";
import SideBar from "./components/SideBar";
import { addHospital, getAllHospitals } from "../../services/hospitalService";
import SortableTable from "../../components/SortableTable/SortableTable";
import { getDoctors } from "../../services/doctorService";
import "./home.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const AdminHomePage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState({
    name: "",
    admin_firstname: "",
    admin_email: "",
    admin_password: "",
    ownership: "Government",
  });
  const [showAddHospitalDialog, setShowAddHospitalDialog] = useState(false);

  const ownerships = [
    "Government",
    "Private",
    "NGO/Trust",
    "Public-Private Partnership",
  ];

  const hospitalLabels = [
    "ID",
    "Admin ID",
    "Name",
    "Address",
    "District",
    "Ownership",
    "Phone",
    "Rating",
    "Started At",
  ];

  const hospitalKeys = [
    "id",
    "admin_id",
    "name",
    "address",
    "district",
    "ownership",
    "phone",
    "rating",
    "started_at",
  ];

  const doctorKeys = [
    "id",
    "firstname",
    "lastname",
    "gender",
    "email",
    "fees",
    "hospital_name",
    "rating",
  ];
  const doctorLabels = [
    "ID",
    "First Name",
    "Last Name",
    "Gender",
    "Email",
    "Fees",
    "Hospital Name",
    "Rating",
  ];

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [hospitalResponse, doctorResponse] = await Promise.all([
          getAllHospitals({}),
          getDoctors({}),
        ]);
        setHospitals(hospitalResponse.data);
        setDoctors(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  const handleAddHospital = async () => {
    try {
      const response = await addHospital(data);
      console.log(response.data);
      setHospitals((prev) => [...prev, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const hospitalRef = useRef(null);
  const doctorRef = useRef(null);

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
      <SideBar
        hospitalRef={hospitalRef}
        doctorRef={doctorRef}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div className="homepage-content width-100 flex col gap-10 admin-home-content">
        <button
          className="profile-save-button end"
          onClick={() => setShowAddHospitalDialog(true)}
        >
          Add Hospital
        </button>
        <h3 className="m0">Hospitals</h3>
        <div ref={hospitalRef} />
        <SortableTable
          headingKeys={hospitalKeys}
          headingLabels={hospitalLabels}
          data={hospitals}
        />
        <div ref={doctorRef} />
        <h3 className="m0">Doctors</h3>
        <SortableTable
          headingKeys={doctorKeys}
          headingLabels={doctorLabels}
          data={doctors}
        />
      </div>

      {showAddHospitalDialog && (
        <div className="add-doctor-dialog">
          <input
            type="text"
            value={data.name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Hospital Name..."
            className="field"
          />
          <input
            type="text"
            value={data.admin_firstname}
            onChange={(e) =>
              setData((prev) => ({ ...prev, admin_firstname: e.target.value }))
            }
            placeholder="Admin Name..."
            className="field"
          />
          <input
            type="text"
            value={data.admin_email}
            onChange={(e) =>
              setData((prev) => ({ ...prev, admin_email: e.target.value }))
            }
            placeholder="Admin Email..."
            className="field"
          />
          <input
            type="text"
            value={data.admin_password}
            onChange={(e) =>
              setData((prev) => ({ ...prev, admin_password: e.target.value }))
            }
            placeholder="Admin Password..."
            className="field"
          />
          <select
            value={data.ownership}
            onChange={(e) =>
              setData((prev) => ({ ...prev, ownership: e.target.value }))
            }
            className="drop-down"
          >
            {ownerships.map((ownership) => (
              <option value={ownership}>{ownership}</option>
            ))}
          </select>

          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setShowAddHospitalDialog(false);
                setData({
                  name: "",
                  admin_email: "",
                  admin_firstname: "",
                  admin_password: "",
                  ownership: "Government",
                });
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={handleAddHospital}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
