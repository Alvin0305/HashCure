import React, { useEffect, useState } from "react";
import "./profile.css";
import { useUser } from "../../../contexts/userContext";
import {
  getUserById,
  updateUser,
  updateUserImage,
} from "../../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { addAllergy, removeAllergy } from "../../../services/allergyService";
import Appointments from "../appointments/Appointments";

const Profile = () => {
  const user_id = useParams();
  const [user, setUser] = useState({});
  const [newAllergyName, setNewAllergyName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(user_id.id);
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [user_id]);

  const bloogGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "AB-", "O-"];

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await updateUser(user.id, user);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAllergy = async () => {
    try {
      const response = await addAllergy(user.id, newAllergyName);
      console.log(response.data);
      setUser((prev) => ({
        ...prev,
        allergies: [response.data, ...prev.allergies],
      }));
    } catch (err) {
      console.error(err);
    }
    setNewAllergyName("");
  };

  const handleRemoveAllergy = async (allergyName) => {
    try {
      const response = await removeAllergy(user.id, allergyName);
      console.log(response.data);
      setUser((prev) => ({
        ...prev,
        allergies: prev.allergies.filter((a) => a.name !== allergyName),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      console.log("uploading image");
      const response = await updateUserImage(user.id, formData);
      console.log(response.data);
      setUser((prev) => ({ ...prev, image: response?.data?.[0]?.image }));
      console.log("upload finished");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-page-top">
        <label htmlFor="update-patient-avatar">
          <img
            src={user?.image ?? "/avatar.webp"}
            alt="Avatar"
            className="profile-page-image"
          />
        </label>
        <input
          type="file"
          style={{ display: "none" }}
          id="update-patient-avatar"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        <div className="profile-page-top-subdiv">
          <h1 className="m0">{user.firstname + " " + user.lastname}</h1>
          <select
            name="gender"
            id=""
            className="drop-down"
            value={user.gender}
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <select
            name="blood-group"
            id=""
            className="drop-down"
            value={user.blood_group}
            onChange={(e) => setUser({ ...user, blood_group: e.target.value })}
          >
            {bloogGroups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="profile-page-buttons">
        <button
          className="profile-page-button"
          onClick={() => navigate("/patient/home/reports")}
        >
          View Reports
        </button>
        <button
          className="profile-page-button"
          onClick={() => navigate("/patient/home/view-appointments")}
        >
          View Appointments
        </button>
      </div>
      <div className="profile-page-content">
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Email</h3>
          <input
            type="text"
            value={user.email}
            disabled
            className="profile-page-input"
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Address</h3>
          <input
            type="text"
            value={user.address}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Phone</h3>
          <input
            type="text"
            value={user.phone}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Date of Birth</h3>
          <input
            type="date"
            value={user.dob ? user.dob.slice(0, 10) : ""}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, dob: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Height</h3>
          <input
            type="text"
            value={user.height}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, height: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Weight</h3>
          <input
            type="text"
            value={user.weight}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
      </div>
      <button className="profile-save-button" onClick={handleSave}>
        Save
      </button>
      <h3 className="m0">Allergies to Medicines</h3>
      <div className="profile-allergies p10 box">
        <div className="profile-allergy-row">
          <input
            type="text"
            value={newAllergyName}
            onChange={(e) => setNewAllergyName(e.target.value)}
            placeholder="Medicine Name..."
            className="profile-allergy-input"
          />
          <Icon
            icon="lucide:plus-square"
            width={40}
            height={40}
            className="profile-icon"
            onClick={handleAddAllergy}
          />
        </div>
        {user.allergies?.map((allergy, index) => (
          <div className="profile-allergy-row" key={index}>
            <div className="profile-allergy-name">
              <h4 className="m0">{allergy.name}</h4>
            </div>
            <Icon
              icon="lucide:x-square"
              width={40}
              height={40}
              onClick={() => handleRemoveAllergy(allergy.name)}
              className="profile-delete-icon"
            />
          </div>
        ))}
      </div>
      <h3 className="m0">Appointments</h3>
      <div className="width-100 p10 box">
        <Appointments />
      </div>
    </div>
  );
};

export default Profile;
