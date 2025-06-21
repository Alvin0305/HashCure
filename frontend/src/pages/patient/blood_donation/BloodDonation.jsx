import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import { getDonors } from "../../../services/userService";
import "./blooddonation.css";

const BloodDonation = () => {
  const minAge = 18;
  const maxAge = 60;
  const minBMI = 10;
  const maxBMI = 30;
  const [ageRange, setAgeRange] = useState([20, 40]);
  const [bmiRange, setbmiRange] = useState([17, 21]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await getDonors({
          age_start: ageRange[0],
          age_end: ageRange[1],
          bmi_start: bmiRange[0],
          bmi_end: bmiRange[1],
        });
        console.log(response.data);
        setDonors(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await getDonors({
          blood_group: selectedGroup,
          age_start: ageRange[0],
          age_end: ageRange[1],
          bmi_start: bmiRange[0],
          bmi_end: bmiRange[1],
        });
        console.log(response.data);
        setDonors(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonors();
  }, [selectedGroup, ageRange, bmiRange]);

  return (
    <div className="blood-donation-page">
      <div className="blood-donation-filters">
        <div className="doctor-fee-slider">
          <h3 className="blood-donation-label">Age</h3>
          <h3 className="doctor-fee-slider-label">
            {ageRange[0] + " - " + ageRange[1]}
          </h3>
          <Slider
            range
            min={minAge}
            max={maxAge}
            value={ageRange}
            onChange={(values) => {
              setAgeRange(values);
            }}
            step={1}
          />
        </div>
        <div className="doctor-fee-slider">
          <h3 className="blood-donation-label">BMI</h3>
          <h3 className="doctor-fee-slider-label">
            {bmiRange[0] + " - " + bmiRange[1]}
          </h3>
          <Slider
            range
            min={minBMI}
            max={maxBMI}
            value={bmiRange}
            onChange={(values) => {
              setbmiRange(values);
            }}
            step={0.1}
          />
        </div>
      </div>
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="drop-down margin-l20"
      >
        <option value="" selected={true}>
          Group...
        </option>
        {bloodGroups.map((group, index) => (
          <option value={group} key={index}>
            {group}
          </option>
        ))}
      </select>
      <div className="donor-table-wrapper">
        {donors.length === 0 ? (
          <p>Sorry No donors satisfying the given filters</p>
        ) : (
          <table className="table">
            <thead className="table-head">
              <tr className="table-head-row">
                <th className="table-head-content">#</th>
                <th className="table-head-content">First Name</th>
                <th className="table-head-content">Last Name</th>
                <th className="table-head-content">Phone</th>
                <th className="table-head-content">Blood Group</th>
                <th className="table-head-content">BMI</th>
                <th className="table-head-content">Age</th>
                <th className="table-head-content">Sex</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {donors.map((donor, index) => (
                <tr className="table-body-row">
                  <td className="table-body-content">{index + 1}</td>
                  <td className="table-body-content">{donor.firstname}</td>
                  <td className="table-body-content">{donor.lastname}</td>
                  <td className="table-body-content">{donor.phone}</td>
                  <td className="table-body-content">{donor.blood_group}</td>
                  <td className="table-body-content">
                    {donor.bmi?.toFixed(2)}
                  </td>
                  <td className="table-body-content">{donor.age}</td>
                  <td className="table-body-content">{donor.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BloodDonation;
