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
  editADiseaseReport,
  getDiseaseDetails,
  getUserDiseases,
  removeADisease,
  removeADiseaseReport,
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
  Label,
} from "recharts";
import { useParams } from "react-router-dom";

const Reports = () => {
  const user_id = useParams().id;

  const { user: userData } = useUser();

  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedDiseaseData, setSelectedDiseaseData] = useState(null);

  const [showAddDiseaseDialog, setShowAddDiseaseDialog] = useState(false);
  const [showRenameFileDialog, setShowRenamFileDialog] = useState(false);
  const [fileContextMenu, setFileContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  });
  const [newDiseaseName, setNewDiseaseName] = useState("");
  const [newReportValue, setNewReportValue] = useState({ date: "", value: "" });
  const [newFileName, setNewFileName] = useState("");
  const [newMedicineData, setNewMedicineData] = useState({
    date: "",
    value: "",
  });

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const response = await getUserDiseases(user_id, userData.token);
        console.log(response.data);
        setDiseases(response.data);
        if (response.data.length) {
          setSelectedDisease(response.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const listener = () => {
      setFileContextMenu((prev) => ({ ...prev, visible: false }));
    };
    window.addEventListener("click", listener);

    return () => window.removeEventListener("click", listener);
  }, []);

  useEffect(() => {
    if (!selectedDisease) return;
    const fetchDiseaseDetails = async () => {
      try {
        const response = await getDiseaseDetails(
          user_id,
          selectedDisease.id,
          userData.token
        );
        console.log(response.data);
        setSelectedDiseaseData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiseaseDetails();
  }, [selectedDisease]);

  const handleAddDisease = async () => {
    try {
      const response = await addANewDisease(
        user_id,
        newDiseaseName,
        userData.token
      );
      console.log(response.data);
      setDiseases((prev) => [...prev, response.data]);
      setNewDiseaseName("");
      setShowAddDiseaseDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddValue = async () => {
    if (!newReportValue.date || !newReportValue.value) return;
    try {
      const { date, value } = newReportValue;
      console.log(date);
      const data = {
        disease_id: selectedDisease.id,
        record_date: new Date(date),
        value,
      };
      const response = await addANewDiseaseValue(user_id, data, userData.token);
      console.log(response.data);
      setSelectedDiseaseData((prev) => {
        console.log(prev);
        console.log(prev.records);
        return {
          ...prev,
          records: [response.data, ...prev.records],
        };
      });
      setNewReportValue({ value: "", date: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNormals = async () => {
    try {
      const response = await updateNormalValuesOfDisease(
        user_id,
        selectedDisease.id,
        selectedDiseaseData.min_value,
        selectedDiseaseData.max_value,
        userData.token
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFile = async (newFile) => {
    if (!newFile) return;
    try {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("disease_id", selectedDisease.id);
      console.log("uploading file");
      const response = await addANewDiseaseReport(user_id, formData);
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        files: [response.data, ...prev.files],
      }));
      console.log("uploading finished");
    } catch (err) {
      console.error(err);
    }
  };

  const removeFile = async () => {
    try {
      console.log("deleting file");
      const response = await removeADiseaseReport(
        fileContextMenu.file.file_id,
        fileContextMenu.file
      );
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        files: prev.files.filter(
          (f) => f.public_id !== fileContextMenu.file.public_id
        ),
      }));
      setFileContextMenu((prev) => ({ ...prev, file: null }));
      console.log("file deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const renameFile = async () => {
    try {
      const response = await editADiseaseReport(
        fileContextMenu.file.file_id,
        newFileName
      );
      console.log(response.data);
      setSelectedDiseaseData((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.file_id === fileContextMenu.file.file_id
            ? { ...f, name: newFileName }
            : f
        ),
      }));
      setShowRenamFileDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMedicine = async () => {
    try {
      const data = {
        disease_id: selectedDisease.id,
        started_at: newMedicineData.date,
        name: newMedicineData.value,
      };
      const response = await addANewMedicine(user_id, data);
      console.log(response.data);

      setSelectedDiseaseData((prev) => ({
        ...prev,
        medicines: [
          { started_at: newMedicineData.date, name: newMedicineData.value },
          ...prev.medicines,
        ],
      }));
      setNewMedicineData({ date: "", value: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMedicine = async (name) => {
    try {
      const response = await removeAMedicine(user_id, selectedDisease.id, name);
      console.log(response.data);
      setSelectedDiseaseData((prev) => {
        console.log(prev);
        console.log(prev.medicines);
        return {
          ...prev,
          medicines: prev.medicines.filter((m) => m.name !== name),
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReport = async () => {
    try {
      const response = await removeADisease(user_id, selectedDisease.id);
      console.log(response.data);
      setDiseases((prev) => prev.filter((d) => d.id !== selectedDisease.id));
      if (diseases.length > 1) {
        setSelectedDisease(null);
        setSelectedDiseaseData(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reports">
      <div className="reports-top-div">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className={`disease-tab ${
              selectedDisease && selectedDisease.id === disease.id
                ? "selected-disease-tab"
                : ""
            }`}
            onClick={() => setSelectedDisease(disease)}
          >
            <h3 className="m0">{disease.name}</h3>
          </div>
        ))}
        <Icon
          icon="lucide:plus-square"
          width={40}
          height={40}
          onClick={() => setShowAddDiseaseDialog(true)}
        />
      </div>
      {selectedDiseaseData ? (
        <div className="reports-content">
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
              <YAxis>
                <Label
                  value="Value"
                  angle={-90}
                  position="insideLeft"
                  offset={10}
                />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                }}
                labelStyle={{ color: "#fff" }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                }}
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
          <div className="report-values-div">
            <div className="report-values-row">
              <input
                type="date"
                value={newReportValue.date}
                onChange={(e) =>
                  setNewReportValue((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="field flex-1"
              />
              <input
                type="text"
                value={newReportValue.value}
                onChange={(e) =>
                  setNewReportValue((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                className="field flex-1"
              />
              <Icon
                icon="lucide:plus-square"
                width={40}
                height={40}
                onClick={handleAddValue}
              />
            </div>
            {selectedDiseaseData?.records?.map((record, index) => (
              <div className="report-values-row" key={index}>
                <div className="field flex-1">
                  <h4 className="m0">
                    {new Date(record.record_date).toLocaleDateString(
                      "default",
                      { day: "2-digit", month: "short", year: "2-digit" }
                    )}
                  </h4>
                </div>
                <div className="field flex-1">
                  <h4 className="m0">{record.value}</h4>
                </div>
                <Icon
                  icon="lucide:x-square"
                  width={40}
                  height={40}
                  onClick={handleAddValue}
                  className="icon-red"
                />
              </div>
            ))}
          </div>
          <h3 className="m0">Set Normals</h3>
          <div className="flex col width-100 gap-10 p10 box">
            <div className="flex-width-100 gap-10">
              <label htmlFor="min-value">Minimum Value</label>
              <input
                id="min-value"
                type="text"
                value={selectedDiseaseData.min_value}
                onChange={(e) =>
                  setSelectedDiseaseData((prev) => ({
                    ...prev,
                    min_value: e.target.value,
                  }))
                }
                className="field"
              />
            </div>
            <div className="flex-width-100 gap-10">
              <label htmlFor="max-value">Maximum Value</label>
              <input
                id="max-value"
                type="text"
                value={selectedDiseaseData.max_value}
                onChange={(e) =>
                  setSelectedDiseaseData((prev) => ({
                    ...prev,
                    max_value: e.target.value,
                  }))
                }
                className="field"
              />
            </div>
          </div>
          <div className="flex end align-center gap-10">
            <button
              className="report-button save-report-button"
              onClick={handleSaveNormals}
            >
              Save Normals
            </button>
            <button
              className="report-button delete-report-button"
              onClick={handleDeleteReport}
            >
              Delete Report
            </button>
            <button className="report-button print-report-button">
              Print Report
            </button>
          </div>
          <h3 className="m0">Files</h3>
          <div className="flex col gap-10 p10 width-100 box">
            <label htmlFor="add-report-file" className="add-report-file-label">
              <Icon icon="lucide:plus" width={80} height={80} />
            </label>
            <input
              type="file"
              id="add-report-file"
              onChange={(e) => handleAddFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <div className="report-files">
              {selectedDiseaseData.files?.map((file, index) => (
                <div
                  className="file-tile"
                  key={index}
                  onClick={() => window.open(file.file_url, "_blank")}
                >
                  <Icon icon="lucide:file" width={32} height={32} />
                  <h3 className="m0">{file.name}</h3>
                  <Icon
                    icon="lucide:ellipsis-vertical"
                    width={32}
                    height={32}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        visible: true,
                        file,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <h3 className="m0">Currently Taking Medicines</h3>
          <div className="report-values-div">
            <div className="report-values-row">
              <input
                type="date"
                value={newMedicineData.date}
                onChange={(e) =>
                  setNewMedicineData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="field flex-1"
              />
              <input
                type="text"
                value={newMedicineData.value}
                onChange={(e) =>
                  setNewMedicineData((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                className="field flex-1"
              />
              <Icon
                icon="lucide:plus-square"
                width={40}
                height={40}
                onClick={handleAddMedicine}
              />
            </div>
            {selectedDiseaseData?.medicines?.map((medicine, index) => (
              <div className="report-values-row" key={index}>
                <div className="field flex-1">
                  <h4 className="m0">
                    {new Date(medicine.started_at).toLocaleDateString(
                      "default",
                      { day: "2-digit", month: "short", year: "2-digit" }
                    )}
                  </h4>
                </div>
                <div className="field flex-1">
                  <h4 className="m0">{medicine.name}</h4>
                </div>
                <Icon
                  icon="lucide:x-square"
                  width={40}
                  height={40}
                  onClick={() => handleRemoveMedicine(medicine.name)}
                  className="icon-red"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Select a report or add a new report to show details</p>
      )}
      {fileContextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "absolute",
            top: fileContextMenu.y,
            left: fileContextMenu.x,
          }}
        >
          <h4
            className="context-menu-option"
            onClick={() => setShowRenamFileDialog(true)}
          >
            Rename
          </h4>
          <h4 className="context-menu-option" onClick={removeFile}>
            Delete
          </h4>
          <h4
            className="context-menu-option"
            onClick={() => {
              const link = document.createElement("a");
              link.href = fileContextMenu.file.file_url;
              link.download = fileContextMenu.file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download
          </h4>
        </div>
      )}
      {showRenameFileDialog && (
        <div className="add-doctor-dialog">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="New File Name..."
            className="field"
          />
          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setShowRenamFileDialog(false);
                setNewFileName("");
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={renameFile}
            >
              Rename
            </button>
          </div>
        </div>
      )}
      {showAddDiseaseDialog && (
        <div className="add-doctor-dialog">
          <input
            type="text"
            value={newDiseaseName}
            onChange={(e) => setNewDiseaseName(e.target.value)}
            placeholder="Name..."
            className="field"
          />

          <div className="flex end gap-10">
            <button
              className="add-doctor-dialog-button cancel-dialog-button"
              onClick={() => {
                setShowAddDiseaseDialog(false);
                setNewDiseaseName("");
              }}
            >
              Cancel
            </button>
            <button
              className="add-doctor-dialog-button save-dialog-button"
              onClick={handleAddDisease}
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
