import React, { useEffect, useState } from "react";
import { useAsyncError, useParams } from "react-router-dom";
import {
  addDoctorWorkingHour,
  addSpecializationForDoctor,
  editDoctorWorkingHour,
  getAllSpecializations,
  getDoctorById,
  getDoctorWorkingHours,
  removeDoctorWorkingHour,
  removeSpecializationForDoctor,
  updateDoctor,
} from "../../../services/doctorService";
import Bubble from "../../../components/Bubble";
import { updateUserImage } from "../../../services/userService";
import { useUser } from "../../../contexts/userContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import "./doctorprofile.css";
import { convertToEmbedUrl } from "../../../utils/util";
import { addVideo, deleteVideo } from "../../../services/videoService";

const DoctorProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const bloogGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "AB-", "O-"];
  const [showHospitalAddDialog, setShowHospitalAddDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [showAddVideoDialog, setShowAddVideoDialog] = useState(false);
  const [url, setUrl] = useState("");
  const [schedule, setSchedule] = useState({});
  const [contextmenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    schedule: {
      day: null,
      start_time: null,
      end_time: null,
    },
  });
  const [videoContextMenu, setVideoContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    video_url: null,
  });

  const { user: userData } = useUser();

  useEffect(() => {
    const listener = () => {
      setContextMenu((prev) => ({
        visible: false,
        x: 0,
        y: 0,
        schedule: prev.schedule,
      }));
      setVideoContextMenu({ visible: false, x: 0, y: 0 });
    };
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [doctorResponse, specializationResponse, scheduleResponse] =
          await Promise.all([
            getDoctorById(id),
            getAllSpecializations(),
            getDoctorWorkingHours(userData.id),
          ]);
        console.log(doctorResponse.data);
        console.log(specializationResponse.data);
        console.log(scheduleResponse.data);
        setUser(doctorResponse.data);
        setSpecializations(specializationResponse.data);
        setSchedule(scheduleResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  const handleSave = async () => {
    try {
      const response = await updateDoctor(id, user);
      console.log(response.data);
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

  const handleAddSpec = async (spec) => {
    if (user.specialization?.length) {
      const response1 = await removeSpecializationForDoctor(
        user.id,
        user.specialization?.[0]?.name,
        userData.token
      );
      console.log(response1.data);
    }
    try {
      const response = await addSpecializationForDoctor(
        user.id,
        spec,
        userData.token
      );
      console.log(response.data);
      setUser((prev) => ({ ...prev, specialization: [response.data] }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSpec = async (spec) => {
    try {
      const response = await removeSpecializationForDoctor(
        user.id,
        spec,
        userData.token
      );
      console.log(response.data);
      setUser((prev) => ({ ...prev, specialization: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [newStartTime, setNewStartTime] = useState(null);
  const [newEndTime, setNewEndTime] = useState(null);
  const [day, setDay] = useState(null);
  const [index, setIndex] = useState(0);

  const handleAddSchedule = async () => {
    try {
      const data = {
        day,
        start_time: newStartTime,
        end_time: newEndTime,
      };
      const response = await addDoctorWorkingHour(
        user.id,
        data,
        userData.token
      );
      console.log(response.data);

      setSchedule((prev) => ({
        ...prev,
        [day]:
          index === 0
            ? [
                {
                  start_time: response.data.start_time,
                  end_time: response.data.end_time,
                },
                ...(prev[day] || []),
              ]
            : [
                ...(prev[day] || []),
                {
                  start_time: response.data.start_time,
                  end_time: response.data.end_time,
                },
              ],
      }));
      setNewEndTime(null);
      setNewStartTime(null);
      setShowAddScheduleDialog(false);
      setDay(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const { day, start_time, end_time } = contextmenu.schedule;

      const data = { day, start_time, end_time };

      const response = await removeDoctorWorkingHour(
        user.id,
        data,
        userData.token
      );
      console.log(response.data);

      setSchedule((prev) => ({
        ...prev,
        [day]: prev[day].filter(
          (s) => s.start_time !== start_time || s.end_time !== end_time
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSchedule = async () => {
    try {
      console.log(contextmenu);
      console.log(contextmenu.schedule);
      const { day, start_time, end_time } = contextmenu.schedule;

      const data = {
        day,
        start_time,
        end_time,
        new_start_time: newStartTime,
        new_end_time: newEndTime,
      };

      const response = await editDoctorWorkingHour(user.id, data);
      console.log(response.data);

      setSchedule((prev) => ({
        ...prev,
        [day]: prev[day].map((s) =>
          s.start_time === start_time &&
          s.end_time === end_time &&
          day === response.data.day
            ? response.data
            : s
        ),
      }));
      setShowEditScheduleDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVideo = async () => {
    try {
      const response = await addVideo(url, userData.token);
      console.log(response.data);
      setUser((prev) => ({ ...prev, videos: [response.data, ...prev.videos] }));
      setShowAddVideoDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      const response = await deleteVideo(
        videoContextMenu.video_url,
        userData.token
      );
      console.log(response.data);
      setUser((prev) => ({
        ...prev,
        videos: prev.videos.filter(
          (v) => v.video_url !== videoContextMenu.video_url
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const isPhone = window.innerWidth;

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
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Qualifications</h3>
          <input
            type="text"
            value={user.qualifications}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, qualifications: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Fees</h3>
          <input
            type="text"
            value={user.fees}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, fees: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Experience</h3>
          <input
            type="text"
            value={user.experience}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, experience: e.target.value }))
            }
          />
        </div>
        <div className="profile-page-detail-row">
          <h3 className="profile-label">Description</h3>
          <input
            type="text"
            value={user.description}
            className="profile-page-input"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex gap-10 wrap">
        {specializations.map((specialization, index) => (
          <Bubble
            name={specialization.name}
            key={index}
            selected={user.specialization?.some(
              (spec) => spec.name === specialization.name
            )}
            onClick={() =>
              user.specialization?.some(
                (spec) => spec.name === specialization.name
              )
                ? handleRemoveSpec(specialization.name)
                : handleAddSpec(specialization.name)
            }
          />
        ))}
      </div>
      <button className="profile-save-button" onClick={handleSave}>
        Save
      </button>
      <div className="schedules">
        {weekDays.map((day, index) => {
          const daySlot = schedule[day] || [];

          return (
            <div className="schedule-row" key={index}>
              <div className="schedule-day">
                <h3 className="m0">{isPhone ? day.substring(0, 3) : day}</h3>
              </div>
              {daySlot[0] ? (
                <div
                  className="schedule-slot"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      schedule: {
                        day: day,
                        start_time: daySlot[0].start_time,
                        end_time: daySlot[0].end_time,
                      },
                    });
                  }}
                >
                  <h4 className="m0">
                    {daySlot[0].start_time.substring(0, 5)} -{" "}
                    {daySlot[0].end_time.substring(0, 5)}
                  </h4>
                </div>
              ) : (
                <div
                  className="add-slot"
                  onClick={() => {
                    setDay(day);
                    setIndex(0);
                    setShowAddScheduleDialog(true);
                  }}
                >
                  <Icon icon="lucide:plus" width={24} height={24} />
                </div>
              )}
              {daySlot[1] ? (
                <div
                  className="schedule-slot"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      schedule: {
                        day: day,
                        start_time: daySlot[1].start_time,
                        end_time: daySlot[1].end_time,
                      },
                    });
                  }}
                >
                  <h4 className="m0">
                    {daySlot[1].start_time.substring(0, 5)} -{" "}
                    {daySlot[1].end_time.substring(0, 5)}
                  </h4>
                </div>
              ) : (
                <div
                  className="add-slot"
                  onClick={() => {
                    setDay(day);
                    setIndex(1);
                    setShowAddScheduleDialog(true);
                  }}
                >
                  <Icon icon="lucide:plus" width={24} height={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex width-100 space-between align-center">
        <h3 className="m0">Videos</h3>
        <button
          className="profile-save-button"
          onClick={() => setShowAddVideoDialog(true)}
        >
          Add Video
        </button>
      </div>
      <div className="patient-home-page-flow">
        {user.videos.map((video, index) => (
          <div
            className="pad-50"
            onContextMenu={(e) => {
              e.preventDefault();
              setVideoContextMenu({
                x: e.clientX,
                y: e.clientY,
                visible: true,
                video_url: video.video_url,
              });
            }}
          >
            <iframe
              key={index}
              width="300"
              height="200"
              src={convertToEmbedUrl(video.video_url)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
      <h3 className="m0">Comments</h3>
      <div className="hospital-comments">
        {user.comments.map((comment, index) => (
          <div key={index} className="comment">
            <img src={comment.image} alt="User" className="comment-avatar" />
            <div className="comment-div">
              <h4 className="comment-name">{comment.firstname}</h4>
              <h5 className="comment">{comment.comment}</h5>
            </div>
          </div>
        ))}
      </div>
      {showAddScheduleDialog && (
        <div className="add-doctor-dialog">
          <input
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            placeholder="Start Time..."
            className="field"
          />
          <input
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            placeholder="End TIme..."
            className="field"
          />
          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setNewEndTime(null);
                setNewStartTime(null);
                setShowAddScheduleDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={handleAddSchedule}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showEditScheduleDialog && (
        <div className="add-doctor-dialog">
          <input
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            placeholder="Start Time..."
            className="field"
          />
          <input
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            placeholder="End TIme..."
            className="field"
          />
          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setShowEditScheduleDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={handleEditSchedule}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      {showAddVideoDialog && (
        <div className="add-doctor-dialog">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Video url..."
            className="field"
          />
          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setShowAddVideoDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={handleAddVideo}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {contextmenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            left: contextmenu.x,
            top: contextmenu.y,
          }}
        >
          <h4
            className="context-menu-option"
            onClick={() => {
              console.log(contextmenu.schedule);
              setNewStartTime(contextmenu.schedule.start_time);
              setNewEndTime(contextmenu.schedule.end_time);
              console.log(contextmenu.schedule);
              setShowEditScheduleDialog(true);
              console.log(contextmenu.schedule);
            }}
          >
            Edit
          </h4>
          <h4 className="context-menu-option" onClick={handleDeleteSchedule}>
            Delete
          </h4>
        </div>
      )}
      {videoContextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            left: videoContextMenu.x,
            top: videoContextMenu.y,
          }}
        >
          <h4 className="context-menu-option" onClick={handleDeleteVideo}>
            Delete
          </h4>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
