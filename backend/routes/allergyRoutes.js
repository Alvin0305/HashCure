import express from "express";
import { addUserAllergy, getUserAllergies, removeAllergy } from "../controllers/allergyController.js";

const router = express.Router();

router.post("/:id", addUserAllergy);
router.delete("/:id", removeAllergy);
router.get("/:id", getUserAllergies);

export default router;
