import {
  addUserAllergyFunction,
  getUserAllergiesFunction,
  removeAllergyFunction,
} from "../models/allergy.js";

export const getUserAllergies = async (req, res) => {
  const user_id = req.params.id;
  try {
    const allergies = await getUserAllergiesFunction(user_id);
    res.json(allergies);
  } catch (err) {
    console.log("Failed to fetch allergy");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addUserAllergy = async (req, res) => {
  const user_id = req.params.id;
  const { name } = req.body;
  try {
    const newAllergy = await addUserAllergyFunction(user_id, name);
    if (!newAllergy)
      return res.status(400).json({ error: "Failed to add allergy" });
    res.json(newAllergy);
  } catch (err) {
    console.log("Failed to add allergy");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeAllergy = async (req, res) => {
  const user_id = req.params.id;
  const { name } = req.body;
  try {
    const removedAllergy = await removeAllergyFunction(user_id, name);
    if (!removedAllergy)
      return res.status(400).json({ error: "Failed to remove allergy" });
    res.json({ message: "Allergy removed successfully" });
  } catch (err) {
    console.log("Failed to remove allergy");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
