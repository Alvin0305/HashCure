import React, { useEffect, useState } from "react";
import {
  addDoctorComments,
  getDoctorById,
  getDoctorComments,
  getUserRatingToDoctor,
  rateDoctor,
} from "../../../services/doctorService";
import { getYoutubeEmbedLink } from "../../../utils/util";
import { Icon } from "@iconify/react";
import { useUser } from "../../../contexts/userContext";
import { useLocation, useNavigate } from "react-router-dom";
import Rating from "../../../utils/Rating/Rating";
import Bubble from "../../../components/Bubble";

const DoctorPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");

  const { user } = useUser();

  const location = useLocation();
  const selectedDoctor = location.state.doctor;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [doctorResponse, commentResponse, userRatingResponse] =
          await Promise.all([
            getDoctorById(selectedDoctor.id),
            getDoctorComments(selectedDoctor.id),
            getUserRatingToDoctor(user.id, selectedDoctor.id),
          ]);
        const obj = {};
        Object.assign(obj, selectedDoctor);
        Object.assign(obj, doctorResponse.data);
        console.log(obj);
        setDoctor(obj);
        setComments(commentResponse.data);
        setRating(userRatingResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sendComment = async () => {
    if (!commentValue.trim()) return;
    try {
      const response = await addDoctorComments(
        doctor.id,
        commentValue,
        user.token
      );
      console.log(response.data);
      setComments([response.data, ...comments]);
      setCommentValue("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await rateDoctor(doctor.id, rating, user.token);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div className="doctor-page">
      <div className="doctor-page-top">
        <img src={doctor?.image} alt="Doctor" className="doctor-page-image" />
        <div className="doctor-page-details">
          <div className="flex width-100 align-center space-between">
            <div className="flex col">
              <h1 className="doctor-page-name m0">
                {doctor?.firstname + " " + doctor?.lastname}
              </h1>
              <h5 className="doctor-qualifications m0">
                {doctor?.qualifications}
              </h5>
              <h3 className="doctor-page-gender m0">
                {doctor?.gender === "M" ? "Male" : "Female"}
              </h3>
              <h2 className="doctor-page-fees m0">{doctor?.fees}</h2>
            </div>
            <Rating rating={doctor?.rating} />
          </div>
          <h6 className="doctor-description m0">{doctor?.description}</h6>
        </div>
      </div>
      <div className="flex align-center space-between width-100">
        <div className="doctor-specs-experience">
          <div className="doctor-spces-div">
            {doctor?.specializations.map(
              (spec, index) =>
                spec && (
                  <Bubble
                    name={spec}
                    key={index}
                    onClick={() => {}}
                    selected={false}
                  />
                )
            )}
          </div>
          <h3 className="doctor-experience-label">
            Experience:{" "}
            <span className="doctor-experience-value">
              {doctor?.experience + " years"}
            </span>
          </h3>
        </div>
      </div>
      <div className="schedule-current-hospital-div">
        <div className="doctor-schedule-div">
          <h4 className="doctor-schedule-heading">Doctor Availability</h4>
          <table className="doctor-schedule">
            <tbody className="doctor-schedule-body">
              {days.map((day, index) => (
                <tr key={index} className="doctor-schedule-row">
                  <td className="doctor-schedule-day">{day}</td>
                  <td className="doctor-schedule-data">
                    {(doctor.working_hours?.[day]?.[0]?.start_time?.substring(
                      0,
                      5
                    ) || "") +
                      " - " +
                      (doctor.working_hours?.[day]?.[0]?.end_time?.substring(
                        0,
                        5
                      ) || "")}
                  </td>
                  <td className="doctor-schedule-data">
                    {(doctor.working_hours?.[day]?.[1]?.start_time?.substring(
                      0,
                      5
                    ) || "") +
                      " - " +
                      (doctor.working_hours?.[day]?.[1]?.end_time?.substring(
                        0,
                        5
                      ) || "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h3 className="m0">Videos</h3>
      <div className="doctor-videos">
        {doctor.videos.length === 0 && (
          <p className="m0">No videos uploaded by Dr. {doctor.firstname}</p>
        )}
        {doctor.videos.map((video, index) => (
          <iframe
            width={320}
            height={180}
            src={getYoutubeEmbedLink(video.video_url)}
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            key={index}
          />
        ))}
      </div>
      <div className="hospital-user-response-div">
        {
          <Rating
            rating={rating.rating}
            enabled={true}
            apiCall={handleRating}
          />
        }
        <form className="search-field">
          <input
            type="text"
            value={commentValue}
            placeholder="Comment..."
            onChange={(e) => setCommentValue(e.target.value)}
            className="comment-input"
          />
          <Icon
            icon="lucide:send"
            width={32}
            height={32}
            color="black"
            className="comment-send-button"
            onClick={sendComment}
          />
        </form>
      </div>
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

export default DoctorPage;
