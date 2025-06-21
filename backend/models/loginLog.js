import pool from "../db.js";

export const log = async (id, status) => {
  await pool.query(
    `INSERT INTO login_logs (user_id, status)
        VALUES ($1, $2)
        `,
    [id, status]
  );
};
