import React, { useState, useEffect } from "react";
import "./doctors.css";
import { Icon } from "@iconify/react";
import {
  getAllDistricts,
  getAllHospitals,
} from "../../../services/hospitalService";
import {
  getAllSpecializations,
  getDoctors,
} from "../../../services/doctorService";
import Bubble from "../../../components/Bubble";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DoctorTile from "../../../components/DoctorTile/DoctorTile";
// const { Range } = Slider;

const Doctors = () => {
  const [searchValue, setSearchValue] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedHospital, setSelectedHospitals] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hospitals, setHospitals] = useState([]);
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
    const fetchInitials = async () => {
      try {
        const [
          districtResponse,
          specializationResponse,
          hospitalResponse,
          doctorResponse,
        ] = await Promise.all([
          getAllDistricts(),
          getAllSpecializations(),
          getAllHospitals({}),
          getDoctors({ feeStart: feeRange[0], feeEnd: feeRange[1] }),
        ]);
        setDistricts(districtResponse.data);
        setSpecializations(specializationResponse.data);
        console.log(specializationResponse.data);
        setHospitals(hospitalResponse.data);
        getDoctors(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await getAllHospitals({
          district: selectedDistrict || "",
        });
        setHospitals(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitals();
  }, [searchValue, selectedDistrict]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const filterData = {
        searchValue: searchValue,
      };
      if (selectedDistrict) {
        filterData.district = selectedDistrict;
      }
      if (selectedHospital) {
        filterData.hospitalName = selectedHospital;
      }
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
    selectedDistrict,
    selectedHospital,
    selectedSpec,
    selectedDays,
    selectedGender,
    feeRange,
  ]);

  return (
    <div className="doctors-page">
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
            <div className="doctor-first-filter">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="drop-down"
              >
                <option value="" selected={true}>
                  District...
                </option>
                {districts.map((district, index) => (
                  <option value={district} key={index}>
                    {district}
                  </option>
                ))}
              </select>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospitals(e.target.value)}
                className="drop-down"
              >
                <option value="" selected={true}>
                  Hospital...
                </option>
                {hospitals.map((hospital, index) => (
                  <option value={hospital.name} key={index}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
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
  );
};

export default Doctors;
