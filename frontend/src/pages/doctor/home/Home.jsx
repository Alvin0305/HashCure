import React, { useEffect, useState } from "react";
import { useUser } from "../../../contexts/userContext";
import Calendar from "../../../utils/Calendar/Calendar";
import { getAppointmentsByDoctor } from "../../../services/appointmentService";
import { getVideosByDoctor } from "../../../services/videoService";
import { convertToEmbedUrl } from "../../../utils/util";
import DoctorAppointmentTile from "../../../components/DoctorAppointmentTile/DoctorAppointmentTile";
import "./home.css";

const Home = () => {
  const { user } = useUser();

  const [appoinmentsToday, setAppointmentsToday] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [
          appointmentTodayResponse,
          pendingRequestsResponse,
          videoResponse,
        ] = await Promise.all([
          getAppointmentsByDoctor(user.id, { dayFilter: "Today" }),
          getAppointmentsByDoctor(user.id, { statusFilter: "Pending" }),
          getVideosByDoctor(user.id),
        ]);
        console.log(appointmentTodayResponse.data);
        console.log(videoResponse.data);
        console.log(pendingRequestsResponse.data);

        setAppointmentsToday(appointmentTodayResponse.data);
        setPendingRequests(pendingRequestsResponse.data);
        setVideos(videoResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  if (!appoinmentsToday || !pendingRequests || !videos)
    return <div>Loading...</div>;

  return (
    <div className="doctor-home-page">
      <div className="patient-home-top">
        <h2 className="patient-home-label">
          Welcome{" "}
          <span className="patient-home-name">
            {"Dr. " + user.firstname + " " + user.lastname}
          </span>
        </h2>
        <Calendar disabled />
      </div>
      <h2 className="m0">Appointments Today</h2>
      <div className="patient-home-page-flow">
        {appoinmentsToday.map((appt) => (
          <DoctorAppointmentTile key={appt.id} appointment={appt} />
        ))}
      </div>
      <h2 className="m0">Pending Requests</h2>
      <div className="patient-home-page-flow">
        {pendingRequests.map((appt) => (
          <DoctorAppointmentTile key={appt.id} appointment={appt} />
        ))}
      </div>
      <h2 className="m0">Your Videos</h2>
      <div className="patient-home-page-flow">
        {videos.map((video, index) => (
          <iframe
            key={index}
            width="300"
            height="200"
            src={convertToEmbedUrl(video.video_url)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ))}
      </div>
    </div>
  );
};

export default Home;
