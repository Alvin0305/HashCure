import jwt from "jsonwebtoken";
import pool from "../db.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Auth Header is missing" });

  if (!authHeader.startsWith("Bearer"))
    return res
      .status(401)
      .json({ error: "Auth header not in the form 'Bearer <token>'" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      decoded.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    req.user = rows[0];
    next();
  } catch (err) {
    console.log("Token failed");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
