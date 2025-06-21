import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import {
  getAllDistricts,
  getAllHospitals,
  getAllOwnershipTypes,
  getAllSpecialities,
} from "../../../services/hospitalService";
import Bubble from "../../../components/Bubble";
import "./hospitals.css";
import HospitalTile from "../../../components/HospitalTile/HospitalTile";

const Hospitals = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [ownerships, setOwnerships] = useState([]);
  const [selectedOwnership, setSelectedOwnership] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [
          districtResponse,
          specialityResponse,
          ownershipResponse,
          hospitalResponse,
        ] = await Promise.all([
          getAllDistricts(),
          getAllSpecialities(),
          getAllOwnershipTypes(),
          getAllHospitals({}),
        ]);
        setDistricts(districtResponse.data);
        const specs = specialityResponse.data;
        for (const spec of specs) {
          spec.selected = false;
        }
        setSpecialities(specs);
        setOwnerships(ownershipResponse.data);
        console.log(hospitalResponse.data);
        console.log(districtResponse.data);
        console.log(ownershipResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const specs = [];
        for (const spec of specialities) {
          if (spec.selected) {
            specs.push(spec.name);
          }
        }
        const filterData = {
          searchValue: searchValue,
          district: selectedDistrict,
          specialities: specs,
          ownership: selectedOwnership,
        };
        console.log(filterData);
        const response = await getAllHospitals(filterData);
        setHospitals(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitals();
  }, [searchValue, selectedDistrict, specialities, selectedOwnership]);

  return (
    <div className="hospitals">
      <form action="" className="hospitals-filters">
        <div className="search-field">
          <input
            type="text"
            value={searchValue}
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          <Icon icon="lucide:search" width={32} height={32} color="black" />
        </div>
        <div
          className="flex space-between width-100 pointer"
          onClick={() => setShowFilters(!showFilters)}
        >
          <h2 className="m0">Filters</h2>
          <Icon icon="tabler:chevron-down" width={32} height={32} />
        </div>
        {showFilters && (
          <div className="hospitals-filters">
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
            <div className="hospital-specialities">
              {specialities.map((speciality, index) => (
                <Bubble
                  name={speciality.name}
                  key={index}
                  onClick={() => {
                    setSpecialities((prev) =>
                      prev.map((spec) =>
                        spec.id === speciality.id
                          ? { ...spec, selected: !spec.selected }
                          : spec
                      )
                    );
                  }}
                  selected={speciality.selected}
                />
              ))}
            </div>
            <div className="hospital-ownerships">
              {ownerships.map((ownership, index) => (
                <Bubble
                  name={ownership}
                  onClick={() => {
                    if (selectedOwnership === ownership) {
                      setSelectedOwnership(null);
                    } else {
                      setSelectedOwnership(ownership);
                    }
                  }}
                  key={index}
                  selected={selectedOwnership === ownership}
                />
              ))}
            </div>
          </div>
        )}
      </form>
      <div className="hospital-tiles">
        {hospitals.length === 0 && (
          <h5 className="m0">
            Sorry No Doctor satisfying the filter conditions
          </h5>
        )}
        {hospitals.map((hospital, index) => (
          <HospitalTile hospital={hospital} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
