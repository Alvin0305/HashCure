import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/userContext";
import Calendar from "../../../utils/Calendar/Calendar";
import { getDoctors } from "../../../services/doctorService";
import { useHospital } from "../../../contexts/hospitalContext";
import DoctorTile from "../doctors/DoctorTile";

const Home = () => {
  const { user } = useUser();
  const { hospital } = useHospital();

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const doctorResponse = await getDoctors({
          feeStart: 0,
          feeEnd: 10000,
          hospitalName: hospital.name,
        });

        setDoctors(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  const onDelete = async (e, doctor) => {
    e.stopPropagation();
    try {
      const response = await removeDoctorFromHospital(hospital.id, doctor.id);
      console.log(response.data);
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
    } catch (err) {
      console.error(err);
    }
  };

  const [newDoctorData, setNewDoctorData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  const addDoctor = async () => {
    if (
      !newDoctorData.firstname.trim() ||
      !newDoctorData.email.trim() ||
      !newDoctorData.password.trim()
    ) {
      toast.warn("Not enough data");
      return;
    }
    try {
      const response = await addDoctorToHospital(hospital.id, newDoctorData);
      console.log(response.data);
      setDoctors((prev) => [response.data, ...prev]);
      setNewDoctorData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="doctor-home-page">
      <div className="patient-home-top">
        <h2 className="patient-home-label">
          Welcome{" "}
          <span className="patient-home-name">
            {user.firstname + " " + user.lastname}
          </span>
        </h2>
        <Calendar disabled />
      </div>
      {showDialog && (
        <div className="add-doctor-dialog">
          <input
            type="text"
            value={newDoctorData.firstname}
            onChange={(e) =>
              setNewDoctorData((prev) => ({
                ...prev,
                firstname: e.target.value,
              }))
            }
            placeholder="Firstname..."
            className="field"
          />
          <input
            type="text"
            value={newDoctorData.lastname}
            onChange={(e) =>
              setNewDoctorData((prev) => ({
                ...prev,
                lastname: e.target.value,
              }))
            }
            placeholder="Lastname..."
            className="field"
          />
          <input
            type="text"
            value={newDoctorData.email}
            onChange={(e) =>
              setNewDoctorData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="Email..."
            className="field"
          />
          <input
            type="text"
            value={newDoctorData.password}
            onChange={(e) =>
              setNewDoctorData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="Password..."
            className="field"
          />
          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setNewDoctorData({
                  firstname: "",
                  lastname: "",
                  email: "",
                  password: "",
                });
                setShowDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={addDoctor}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <button
        className="profile-save-button end"
        onClick={() => setShowDialog(true)}
      >
        Add Doctor
      </button>
      <div className="doctor-tiles">
        {doctors.length === 0 && (
          <h5 className="m0">
            Sorry No Doctor satisfying the filter conditions
          </h5>
        )}
        {doctors.map((doctor, index) => (
          <DoctorTile
            doctor={doctor}
            key={index}
            onDelete={(e) => onDelete(e, doctor)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
