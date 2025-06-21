import React from "react";
import "./reports.css";
import { useUser } from "../../../contexts/userContext";
import { useEffect } from "react";
import { useState } from "react";
import {
  addANewDisease,
  addANewDiseaseReport,
  addANewDiseaseValue,
  addANewMedicine,
  getDiseaseDetails,
  getUserDiseases,
  removeADiseaseValue,
  removeAMedicine,
  updateNormalValuesOfDisease,
} from "../../../services/reportService";
import { Icon } from "@iconify/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

const Reports = () => {
  const { user } = useUser();
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedDiseaseData, setSelectedDiseaseData] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newValue, setNewValue] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [newMedicineDate, setNewMedicineDate] = useState("");
  const [newMedicineName, setNewMedicineName] = useState("");
  const [showAddDiseaseDialog, setShowAddDiseaseDialog] = useState(false);
  const [showFileOptionsDialog, setShowFileOptionsDialog] = useState(false);
  const [newDiseaseName, setNewDiseaseName] = useState("");

  useEffect(() => {
    const fetchUserDiseases = async () => {
      try {
        const response = await getUserDiseases(user?.id, user?.token);
        console.log(response.data);
        setDiseases(response.data);
        if (response?.data?.length) setSelectedDisease(response.data?.[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserDiseases();
  }, []);

  useEffect(() => {
    const fetchDiseaseDetails = async () => {
      try {
        const response = await getDiseaseDetails(
          user?.id,
          selectedDisease?.id,
          user?.token
        );
        console.log(response.data);
        setSelectedDiseaseData(response.data);
        setMinValue(response.data?.min_value);
        setMaxValue(response.data?.max_value);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiseaseDetails();
  }, [selectedDisease]);

  const handleAddNewValue = async (e) => {
    e.preventDefault();
    try {
      const data = {
        disease_id: selectedDisease.id,
        record_date: new Date(newDate),
        value: parseFloat(newValue),
      };
      console.log(data);
      const response = await addANewDiseaseValue(user.id, data, user.token);
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        records: [...prev.records, response.data],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveValue = async (date) => {
    try {
      const response = await removeADiseaseValue(
        user.id,
        selectedDisease.id,
        date,
        user.token
      );
      console.log(response);

      setSelectedDiseaseData((prev) => ({
        ...prev,
        records: prev.records.filter(
          (rec) =>
            new Date(rec.record_date).getTime() !== new Date(date).getTime()
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileAdd = async (file) => {
    try {
      const formData = new FormData();

      formData.append("disease_id", selectedDisease.disease_id);
      formData.append("file", file);
      const response = await addANewDiseaseReport(user.id, formData);
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        files: [...prev.files, response.data],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedicineAdd = async () => {
    try {
      const response = await addANewMedicine(user?.id, {
        disease_id: selectedDisease.id,
        started_at: new Date(newMedicineDate),
        name: newMedicineName,
      });
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        medicines: [
          ...prev.medicines,
          { ...response.data, name: newMedicineName },
        ],
      }));
      setNewMedicineDate("");
      setNewMedicineName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewDisease = async () => {
    try {
      console.log("here");
      const response = await addANewDisease(
        user.id,
        newDiseaseName,
        user.token
      );
      console.log(response.data);
      console.log(diseases);
      setDiseases((prev) => [...prev, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMinMaxSave = async () => {
    try {
      const response = await updateNormalValuesOfDisease(
        user.id,
        selectedDisease.id,
        minValue,
        maxValue,
        user.token
      );
      console.log(response.data);

      setSelectedDiseaseData((prev) => ({
        ...prev,
        min_value: response?.data?.min_value,
        max_value: response?.data?.max_value,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMedicine = async (name) => {
    try {
      const response = await removeAMedicine(user.id, selectedDisease.id, name);
      console.log(response.data);

      setSelectedDiseaseData((prev) => ({
        ...prev,
        medicines: prev.medicines.filter((med) => med.name !== name),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!diseases) return <div>Loading...</div>;

  return (
    <div className="reports-page">
      <div className="reports-diseases">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className={`reports-disease-name-div ${
              selectedDisease.id === disease.id && "selected-disease-name-div"
            }`}
            onClick={() => setSelectedDisease(disease)}
          >
            <h2 className={"reports-disease-name"}>{disease.name}</h2>
          </div>
        ))}
        <Icon
          onClick={() => setShowAddDiseaseDialog(true)}
          icon="lucide:plus-square"
          width={50}
          height={50}
          className="reports-page-icon"
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={selectedDiseaseData?.records}
          margin={{ top: 20, right: 0, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="record_date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
            }}
            labelStyle={{ color: "#fff" }}
          />
          {selectedDisease?.min_value !== 0 &&
            selectedDiseaseData?.max_value !== 0 && (
              <ReferenceArea
                y1={selectedDiseaseData?.min_value}
                y2={selectedDiseaseData?.max_value}
                strokeOpacity={1}
                fill="green"
                fillOpacity={0.4}
              />
            )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="reports-disease-values-div">
        <form className="reports-disease-value-div">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="reports-input"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="reports-input"
          />
          <Icon
            onClick={(e) => handleAddNewValue(e)}
            icon="lucide:plus-square"
            width={50}
            height={50}
            className="reports-page-icon"
          />
        </form>
        {selectedDiseaseData?.records?.map((record, index) => (
          <div className="reports-disease-value-pair-div" key={index}>
            <div className="reports-disease-key-div">
              <h3 className="reports-disease-key">
                {new Date(record.record_date).toDateString()}
              </h3>
            </div>
            <div className="reports-disease-value-value-div">
              <h3 className="reports-disease-value">{record.value}</h3>
            </div>

            <Icon
              className="reports-page-icon delete-icon"
              icon="lucide:x-square"
              width={50}
              height={50}
              onClick={() => handleRemoveValue(new Date(record.record_date))}
            />
          </div>
        ))}
      </div>
      <h3 className="m0">Set Normals</h3>
      <div className="reports-normal-div">
        <div className="reports-normal-label-div">
          <h3 className="reports-normal-label">Minimum</h3>
          <h3 className="reports-normal-label">Maximum</h3>
        </div>
        <div className="reports-normal-value-div">
          <input
            type="text"
            value={minValue}
            placeholder="Value..."
            onChange={(e) => setMinValue(e.target.value)}
            className="reports-normal-input"
          />
          <input
            type="text"
            value={maxValue}
            placeholder="Value..."
            onChange={(e) => setMaxValue(e.target.value)}
            className="reports-normal-input"
          />
        </div>
      </div>
      <div className="reports-buttons">
        <button
          className="reports-button save-report-button"
          onClick={handleMinMaxSave}
        >
          Save Normal Values
        </button>
        <button className="reports-button delete-report-button">
          Delete Report
        </button>
        <button className="reports-button print-report-button">
          Print Report
        </button>
      </div>
      <div className="report-files-div">
        <h3 className="m0">Files</h3>
        <label
          htmlFor="report-add-file-input"
          className="reports-add-file-label"
        >
          <Icon icon="lucide:plus" width={50} height={50} />
        </label>
        <input
          type="file"
          id="report-add-file-input"
          onChange={(e) => handleFileAdd(e.target.files[0])}
          style={{ display: "none" }}
        />
        <div className="reports-files">
          {selectedDiseaseData?.files.map((file, index) => (
            <div key={index} className="reports-file">
              <div className="reports-file-subdiv">
                <Icon icon="lucide:file" width={32} height={32} />
                <h3>{file.name}</h3>
              </div>

              <Icon icon="lucide:more-vertical" width={32} height={32} />
            </div>
          ))}
        </div>
      </div>
      <h3 className="m0">Currently Taking Medicines</h3>
      <div className="reports-current-medicines-div">
        <div className="reports-current-medicine">
          <input
            type="date"
            value={newMedicineDate}
            onChange={(e) => setNewMedicineDate(e.target.value)}
            placeholder="From..."
            className="reports-input"
          />
          <input
            type="text"
            value={newMedicineName}
            onChange={(e) => setNewMedicineName(e.target.value)}
            placeholder="Medicine Name..."
            className="reports-input"
          />
          <Icon
            onClick={handleMedicineAdd}
            icon="lucide:plus-square"
            width={50}
            height={50}
            className="reports-page-icon"
          />
        </div>
        {selectedDiseaseData?.medicines?.map((medicine, index) => (
          <div className="reports-current-medicine" key={index}>
            <div className="reports-current-medicine-date-div">
              <h3 className="m0">
                {new Date(medicine.started_at).toDateString()}
              </h3>
            </div>
            <div className="reports-current-medicine-name-div">
              <h3 className="m0">{medicine.name}</h3>
            </div>
            <Icon
              onClick={() => handleRemoveMedicine(medicine.name)}
              icon="lucide:x-square"
              width={50}
              height={50}
              className="reports-page-icon delete-icon"
            />
          </div>
        ))}
      </div>
      {showAddDiseaseDialog && (
        <div className="reports-add-disease-dialog">
          <input
            type="text"
            value={newDiseaseName}
            onChange={(e) => setNewDiseaseName(e.target.value)}
            className="reports-add-disease-input"
          />
          <div className="reports-add-disease-options">
            <button
              className="reports-add-disease-button cancel-button"
              onClick={() => {
                setNewDiseaseName("");
                setShowAddDiseaseDialog(false);
              }}
            >
              Cancel
            </button>
            <button
              className="reports-add-disease-button add-button"
              onClick={handleAddNewDisease}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
