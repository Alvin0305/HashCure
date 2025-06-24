import React, { useEffect, useState } from "react";
import { getUserById } from "../../../services/userService";
import { useUser } from "../../../contexts/userContext";
import {
  addHospitalSpeciality,
  getAllSpecialities,
  getHospitalById,
  getHospitalComments,
  removeHospitalSpeciality,
  updateHospital,
  uploadHospitalImage,
} from "../../../services/hospitalService";
import { useHospital } from "../../../contexts/hospitalContext";
import Bubble from "../../../components/Bubble";

const HAProfile = () => {
  const { user: userData } = useUser();
  const { hospital: hospitalData } = useHospital();
  const [hospital, setHospital] = useState(null);
  const [user, setUser] = useState({});
  const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Kottayam",
    "Alappuzha",
    "Idukki",
    "Ernakulam",
    "Trissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kazargod",
  ];
  const ownwerships = [
    "Government",
    "Private",
    "NGO/Trust",
    "Public-Private Partnership",
  ];
  const [specialities, setSpecialities] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [response, adminResponse, specialityResponse, commentResponse] =
          await Promise.all([
            getHospitalById(hospitalData.id),
            getUserById(userData.id),
            getAllSpecialities(),
            getHospitalComments(hospitalData.id),
          ]);
        console.log(response.data);
        setHospital(response.data);
        setUser(adminResponse.data);
        console.log(adminResponse.data);
        setSpecialities(specialityResponse.data);
        setComments(commentResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [hospitalData]);

  const handleSave = async () => {
    try {
      hospital.started_at = new Date(hospital.started_at);
      const response = await updateHospital(hospitalData.id, hospital);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      console.log("uploading image", image);
      const response = await uploadHospitalImage(hospitalData.id, formData);
      console.log(response.data);
      setHospital((prev) => ({ ...prev, image: response?.data?.image }));
      console.log("upload finished");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSpec = async (name) => {
    try {
      const response = await addHospitalSpeciality(hospital.id, name);
      console.log(response.data);
      setHospital((prev) => ({
        ...prev,
        specialities: [...prev.specialities, response.data],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSpec = async (name) => {
    try {
      const response = await removeHospitalSpeciality(hospital.id, name);
      console.log(response);
      setHospital((prev) => ({
        ...prev,
        specialities: prev.specialities.filter((s) => s.name !== name),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !hospital) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-page-top">
        <label htmlFor="update-patient-avatar">
          <img
            src={hospital?.image ?? "/avatar.webp"}
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
          <h1 className="m0">{hospital.name}</h1>
        </div>
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
            value={hospital.address}
            className="profile-page-input"
            onChange={(e) =>
              setHospital((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Phone</h3>
          <input
            type="text"
            value={hospital.phone}
            className="profile-page-input"
            onChange={(e) =>
              setHospital((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Started At</h3>
          <input
            type="date"
            value={
              hospital.started_at
                ? new Date(hospital.started_at).toISOString().slice(0, 10)
                : ""
            }
            className="profile-page-input"
            onChange={(e) =>
              setHospital((prev) => ({
                ...prev,
                started_at: e.target.value,
              }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Description</h3>
          <input
            type="text"
            value={hospital.description}
            className="profile-page-input"
            onChange={(e) =>
              setHospital((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="flex gap-10 align-center wrap">
        <select
          name="district"
          id=""
          value={hospital.district}
          className="drop-down"
          onChange={(e) =>
            setHospital((prev) => ({ ...prev, district: e.target.value }))
          }
        >
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
        <select
          name="ownership"
          id=""
          value={hospital.ownership}
          className="drop-down"
          onChange={(e) =>
            setHospital((prev) => ({ ...prev, ownership: e.target.value }))
          }
        >
          {ownwerships.map((ownership, index) => (
            <option key={index} value={ownership}>
              {ownership}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-10 wrap">
        {specialities.map((spec) => (
          <Bubble
            name={spec.name}
            key={spec.id}
            selected={hospital.specialities.some((s) => s.id === spec.id)}
            onClick={() =>
              hospital.specialities.some((s) => s.id === spec.id)
                ? handleRemoveSpec(spec.name)
                : handleAddSpec(spec.name)
            }
          />
        ))}
      </div>

      <button className="profile-save-button" onClick={handleSave}>
        Save
      </button>
      <h3 className="m0">Comments</h3>
      <div className="hospital-comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <img src={comment.image} alt="User" className="comment-avatar" />
            <div className="comment-div">
              <h4 className="comment-name">{comment.firstname}</h4>
              <h5 className="comment">{comment.comment}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HAProfile;
