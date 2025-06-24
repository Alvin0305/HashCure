import React from "react";
import "./homecontent.css";
import { useUser } from "../../../../../contexts/userContext";
import Calendar from "../../../../../utils/Calendar/Calendar";
import { useEffect } from "react";
import { getNewVideos } from "../../../../../services/videoService";
import {
  getConsultedDoctors,
  getVisitedHospitals,
} from "../../../../../services/userService";
import { useState } from "react";
import {
  convertToEmbedUrl,
  getYoutubeEmbedLink,
} from "../../../../../utils/util";
import DoctorTile from "../../../../../components/DoctorTile/DoctorTile";
import HospitalTile from "../../../../../components/HospitalTile/HospitalTile";

const HomeContent = () => {
  const { user } = useUser();
  const [videos, setVideos] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchInitials = async () => {
      try {
        const [videoResponse, doctorResponse, hospitalResponse] =
          await Promise.all([
            getNewVideos(),
            getConsultedDoctors(user.id),
            getVisitedHospitals(user.id),
          ]);
        console.log(videoResponse.data);
        setVideos(videoResponse.data);
        setDoctors(doctorResponse.data);
        setHospitals(hospitalResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, [user]);

  return (
    <div className="patient-home-content">
      <div className="patient-home-top">
        <h2 className="patient-home-label">
          Welcome{" "}
          <span className="patient-home-name">
            {user.firstname + " " + user.lastname}
          </span>
        </h2>
        <Calendar disabled />
      </div>
      <h2 className="m0">New Videos</h2>
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
      <h2 className="m0">Consulted Doctors</h2>
      <div className="patient-home-page-flow">
        {doctors.map((doctor) => (
          <DoctorTile key={doctor.id} doctor={doctor} />
        ))}
      </div>
      <h2 className="m0">Visited Hospitals</h2>
      <div className="patient-home-page-flow">
        {hospitals.map((hospital) => (
          <HospitalTile key={hospital.id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
