import {
  addANewDiseaseFunction,
  addANewDiseaseReportFunction,
  addANewDiseaseValueFunction,
  editADiseaseReportsFunction,
  getDiseaseFunction,
  getUserDiseasesFunction,
  removeADiseaseReportFunction,
  removeANewDiseaseValueFunction,
  updateNormalValuesOfDiseaseFunction,
} from "../models/disease.js";
import {
  addANewMedicineFunction,
  removeAMedicineFunction,
} from "../models/medicine.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/upload.js";

export const getUserDiseases = async (req, res) => {
  const user_id = req.params.id;
  try {
    const diseases = await getUserDiseasesFunction(user_id);
    res.json(diseases);
  } catch (err) {
    console.log("Failed to get disease");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDiseaseDetails = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id } = req.body;
  try {
    const details = await getDiseaseFunction(user_id, disease_id);
    res.json(details);
  } catch (err) {
    console.log("Failed to get disease details");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addANewDisease = async (req, res) => {
  const user_id = req.params.id;
  const { name } = req.body;
  try {
    const newDisease = await addANewDiseaseFunction(user_id, name);
    if (!newDisease)
      return res.status(400).json({ error: "Failed to add disease" });
    res.json(newDisease);
  } catch (err) {
    console.log("Failed to add disease");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addANewDiseaseValue = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id, record_date, value } = req.body;
  const correctedDate = new Date(record_date);
  try {
    const newDiseaseValue = await addANewDiseaseValueFunction(
      user_id,
      disease_id,
      correctedDate,
      value
    );
    if (!newDiseaseValue)
      return res.status(400).json({ error: "Failed to add disease value" });
    res.json(newDiseaseValue);
  } catch (err) {
    console.log("Failed to add disease value");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeADiseaseValue = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id, record_date } = req.query;
  const correctedDate = new Date(record_date);
  try {
    const removedDiseaseValue = await removeANewDiseaseValueFunction(
      user_id,
      disease_id,
      correctedDate
    );
    if (!removedDiseaseValue)
      return res.status(400).json({ error: "Failed to remove disease value" });
    res.json({ message: "Value deleted successfully" });
  } catch (err) {
    console.log("Failed to remove disease value");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateNormalValuesOfDisease = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id, min_value, max_value } = req.body;
  try {
    const updatedValue = await updateNormalValuesOfDiseaseFunction(
      user_id,
      disease_id,
      min_value,
      max_value
    );
    if (!updatedValue)
      return res.status(400).json({ error: "Failed to update normal value" });
    res.json(updatedValue);
  } catch (err) {
    console.log("Failed to update normal value");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addANewDiseaseReport = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id } = req.body;
  console.log("BODY", req.body);
  console.log("FILE", req.file);
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "patients/reports"
    );
    const result = await addANewDiseaseReportFunction(
      user_id,
      disease_id,
      uploadResult.secure_url,
      uploadResult.public_id
    );
    return res.json(result);
  } catch (err) {
    console.log("Failed to upload file");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeADiseaseReport = async (req, res) => {
  const { id } = req.params;
  const { public_id } = req.body;
  try {
    const result = await deleteFromCloudinary(public_id);
    if (result.result === "not found")
      return res.status(400).json({ error: "public id is invalid" });
    await removeADiseaseReportFunction(id);
    res.json({ message: "File succesfully deleted" });
  } catch (err) {
    console.log("Failed to delete file");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const editADiseaseReports = async (req, res) => {
  const report_id = req.params.id;
  const { name } = req.body;
  try {
    const updatedValue = await editADiseaseReportsFunction(report_id, name);
    if (!updatedValue)
      return res.status(400).json({ error: "Failed to update report name" });
    res.json(updatedValue);
  } catch (err) {
    console.log("Failed to update report name");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addANewMedicine = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id, started_at, name } = req.body;
  try {
    const newMedicine = await addANewMedicineFunction(
      user_id,
      disease_id,
      started_at,
      name
    );
    if (!newMedicine)
      return res.status(400).json({ error: "Failed to add a new medicine" });
    res.json(newMedicine);
  } catch (err) {
    console.log("Failed to add new medicine");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeAMedicine = async (req, res) => {
  const user_id = req.params.id;
  const { disease_id, name } = req.query;
  console.log(disease_id, name, user_id);
  try {
    const removedMedicine = await removeAMedicineFunction(
      user_id,
      disease_id,
      name
    );
    if (!removedMedicine)
      return res.status(400).json({ error: "Failed to remove medicine" });
    res.json({ message: "Medicine removed succesfully" });
  } catch (err) {
    console.log("Failed to remove medicine");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
