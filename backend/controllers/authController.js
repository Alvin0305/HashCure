import { generateToken } from "../utils/generateToken.js";
import { createUser, getUserByEmail } from "../models/user.js";
import bcrypt from "bcryptjs";
import { log } from "../models/loginLog.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      log(user.id, "Failed");
      return res.status(401).json({ error: "Invalid Password" });
    }

    log(user.id, "Success");

    res.json({
      id: user.id,
      email: email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.log("Login failed");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res
        .status(401)
        .json({ error: "Already have an account, try login" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser(firstname, lastname, email, password_hash);
    if (!user) {
      log(user.id, "Failed");
      return res.status(400).json({ error: "Failed to create user" });
    }

    log(user.id, "Success");
    return res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.log("Failed to register");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed checked ---------
