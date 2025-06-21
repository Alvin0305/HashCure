import express from "express";
import {
  addANewDisease,
  addANewDiseaseReport,
  addANewDiseaseValue,
  addANewMedicine,
  deleteDisease,
  editADiseaseReports,
  getDiseaseDetails,
  getUserDiseases,
  removeADiseaseReport,
  removeADiseaseValue,
  removeAMedicine,
  updateNormalValuesOfDisease,
} from "../controllers/diseaseController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "../middlewares/multer.js";

const router = express.Router();

router.get("/:id", protect, getUserDiseases);
router.post("/:id", protect, addANewDisease);
router.delete("/:id", deleteDisease);

router.post("/disease/:id", protect, getDiseaseDetails);

router.post("/value/:id", protect, addANewDiseaseValue);
router.delete("/value/:id", protect, removeADiseaseValue);
router.put("/normal/:id", protect, updateNormalValuesOfDisease);

router.post("/report/:id", multer.single("file"), addANewDiseaseReport);
router.delete("/report/:id", removeADiseaseReport);
router.put("/report/:id", editADiseaseReports);

router.post("/medicine/:id", addANewMedicine);
router.delete("/medicine/:id", removeAMedicine);

export default router;
