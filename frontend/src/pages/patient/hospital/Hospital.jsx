import React, { useEffect, useState } from "react";
import {
  addHospitalComment,
  getHospitalComments,
  getHospitalDetails,
  getUserRatingToHospital,
  rateHospital,
} from "../../../services/hospitalService";
import Rating from "../../../utils/Rating/Rating";
import Bubble from "../../../components/Bubble";
import "./hospital.css";
import { useUser } from "../../../contexts/userContext";
import { Icon } from "@iconify/react";
import {
  getAllSpecializations,
  getDoctors,
} from "../../../services/doctorService";
import DoctorTile from "../../../components/DoctorTile/DoctorTile";
import Slider from "rc-slider";
import { useLocation } from "react-router-dom";

const Hospital = () => {
  const location = useLocation();
  const selectedHospital = location.state.hospital;
  const { user } = useUser();

  const [hospital, setHospital] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [commentValue, setCommentValue] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [feeRange, setFeeRange] = useState([100, 500]);

  const dayFilterValues = [
    "Today",
    "Tomorrow",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // const Range = Slider.Range;
  const minFees = 0;
  const maxFees = 1000;

  const genders = [
    { name: "Male", value: "M" },
    { name: "Female", value: "F" },
  ];

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchHospitalInitials = async () => {
      try {
        console.log(selectedHospital);
        const [
          hospitalResponse,
          commentResponse,
          userRatingResponse,
          doctorResponse,
          specializationResponse,
        ] = await Promise.all([
          getHospitalDetails(selectedHospital.id),
          getHospitalComments(selectedHospital.id),
          getUserRatingToHospital(user.id, selectedHospital.id),
          getDoctors({
            feeStart: feeRange[0],
            feeEnd: feeRange[1],
            hospitalName: selectedHospital.name,
          }),
          getAllSpecializations(),
        ]);
        setDoctors(doctorResponse.data);
        setHospital(hospitalResponse.data);
        setComments(commentResponse.data);
        setRating(userRatingResponse.data);
        setSpecializations(specializationResponse.data);

        console.log(selectedHospital);
        console.log(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitalInitials();
  }, [selectedHospital, user?.id]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const filterData = {
        searchValue: searchValue,
      };

      filterData.hospitalName = selectedHospital.name;

      if (selectedSpec) {
        filterData.specialization = selectedSpec.name;
      }
      if (selectedDays.length) {
        filterData.dayFilter = selectedDays;
      }
      if (selectedGender) {
        filterData.gender = selectedGender.value;
      }
      if (feeRange) {
        if (feeRange[0]) {
          filterData.feeStart = feeRange[0];
        }
        if (feeRange[1]) {
          filterData.feeEnd = feeRange[1];
        }
      }

      console.log("selected hospital", selectedHospital);
      console.log("filters: ", filterData);
      const doctors = await getDoctors(filterData);

      console.log(doctors);
      setDoctors(doctors.data);
    };
    fetchDoctors();
  }, [
    searchValue,
    selectedSpec,
    selectedHospital,
    selectedDays,
    selectedGender,
    feeRange,
  ]);

  const sendComment = async () => {
    if (!commentValue.trim()) return;
    try {
      const response = await addHospitalComment(
        hospital.id,
        commentValue,
        user.token
      );
      console.log(response.data);
      setComments([response.data, ...comments]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await rateHospital(hospital.id, rating, user.token);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedHospital || !hospital) return <div>Loading...</div>;

  return (
    <div className="hospital-page">
      <div className="hospital-page-top">
        <img
          src={hospital?.image}
          alt="Hospital"
          className="hospital-page-image"
        />
        <div className="hospital-page-details">
          <div className="flex width-100 align-center space-between">
            <div className="flex col gap-10">
              <h1 className="hospital-page-name">{hospital?.name}</h1>
              <h5 className="hospital-started-at">
                {"Since " + new Date(hospital?.started_at).getFullYear()}
              </h5>
              <h3 className="hospital-page-address">{hospital?.address}</h3>
            </div>
            <Rating rating={hospital?.rating} />
          </div>
          <h6 className="hospital-description">{hospital?.description}</h6>
        </div>
      </div>
      <div className="hospital-page-specialities">
        {hospital.specialities.map((spec, index) => (
          <Bubble
            name={spec.name}
            onClick={() => {}}
            selected={false}
            key={index}
          />
        ))}
      </div>
      <h4 className="m0">We Have</h4>
      <div className="hospital-doctors">
        <form className="doctors-filters">
          <div className="search-field">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              className="search-input"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Icon icon="lucide:search" width={32} height={32} color="black" />
          </div>
          <div
            onClick={() => setShowFilters(!showFilters)}
            className="flex width-100 align-center pointer space-between"
          >
            <h2 className="m0 doctor-filter-text">Filters</h2>
            <Icon
              icon="tabler:chevron-down"
              width={32}
              height={32}
              color="black"
            />
          </div>
          {showFilters && (
            <div className="doctor-filters">
              <div className="doctor-specs">
                {specializations.map((spec, index) => (
                  <Bubble
                    key={index}
                    name={spec.name}
                    onClick={() => {
                      if (selectedSpec && selectedSpec.id === spec.id) {
                        setSelectedSpec(null);
                      } else {
                        setSelectedSpec(spec);
                      }
                    }}
                    selected={selectedSpec && selectedSpec.id === spec.id}
                  />
                ))}
              </div>
              <div className="doctor-days-div">
                {dayFilterValues.map((day, index) => (
                  <Bubble
                    key={index}
                    name={day}
                    onClick={() => {
                      if (selectedDays.includes(day)) {
                        setSelectedDays((prev) =>
                          prev.filter((d) => d !== day)
                        );
                      } else {
                        console.log("adding day: ", day);
                        setSelectedDays([...selectedDays, day]);
                      }
                    }}
                    selected={selectedDays.includes(day)}
                  />
                ))}
              </div>
              <div className="doctor-gender-div">
                {genders.map((gender, index) => (
                  <Bubble
                    key={index}
                    name={gender.name}
                    onClick={() => {
                      if (
                        selectedGender &&
                        selectedGender.name === gender.name
                      ) {
                        setSelectedGender(null);
                      } else {
                        setSelectedGender(gender);
                      }
                    }}
                    selected={
                      selectedGender && selectedGender.name === gender.name
                    }
                  />
                ))}
              </div>
              <div className="doctor-fee-slider">
                <h3 className="doctor-fee-slider-label">
                  {"₹ " + feeRange[0] + " - " + " ₹ " + feeRange[1]}
                </h3>
                <Slider
                  range
                  min={minFees}
                  max={maxFees}
                  value={feeRange}
                  onChange={(values) => {
                    setFeeRange(values);
                  }}
                  step={50}
                />
              </div>
            </div>
          )}
        </form>
        <div className="doctor-tiles">
          {doctors.length === 0 && (
            <h5 className="m0">
              Sorry No Doctor satisfying the filter conditions
            </h5>
          )}
          {doctors.map((doctor, index) => (
            <DoctorTile doctor={doctor} key={index} />
          ))}
        </div>
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

export default Hospital;
