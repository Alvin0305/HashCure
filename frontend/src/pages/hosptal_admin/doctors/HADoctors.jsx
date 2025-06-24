import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  getAllSpecializations,
  getDoctors,
} from "../../../services/doctorService";
import Bubble from "../../../components/Bubble";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DoctorTile from "./DoctorTile";
import { useHospital } from "../../../contexts/hospitalContext";
import {
  addDoctorToHospital,
  removeDoctorFromHospital,
} from "../../../services/hospitalService";
import { toast } from "react-toastify";
import "./doctors.css";

const HADoctors = () => {
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

  const { hospital } = useHospital();

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [specializationResponse, doctorResponse] = await Promise.all([
          getAllSpecializations(),
          getDoctors({
            feeStart: feeRange[0],
            feeEnd: feeRange[1],
            hospitalName: hospital.name,
          }),
        ]);
        setSpecializations(specializationResponse.data);
        console.log(specializationResponse.data);
        setDoctors(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      const filterData = {
        searchValue: searchValue,
        hospitalName: hospital.name,
      };

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
      console.log("filters: ", filterData);
      const doctors = await getDoctors(filterData);

      console.log(doctors);
      setDoctors(doctors.data);
    };
    fetchDoctors();
  }, [searchValue, selectedSpec, selectedDays, selectedGender, feeRange]);

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
    <div className="doctors-page">
      <div className="doctors-filters">
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
                      setSelectedDays((prev) => prev.filter((d) => d !== day));
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
                    if (selectedGender && selectedGender.name === gender.name) {
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
      </div>
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

export default HADoctors;
