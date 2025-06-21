import pool from "../db.js";

export const addANewMedicineFunction = async (
  user_id,
  disease_id,
  started_at,
  name
) => {
  const { rows: existing } = await pool.query(
    `SELECT * FROM medicines WHERE name = $1`,
    [name]
  );

  if (existing.length === 0) {
    const { rows: medicine } = await pool.query(
      `INSERT INTO medicines (name) 
      VALUES ($1) 
      RETURNING *`,
      [name]
    );

    const { rows } = await pool.query(
      `INSERT INTO 
        user_disease_medicines (user_id, disease_id, started_at,medicine_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [user_id, disease_id, started_at, medicine[0].id]
    );
    return rows[0];
  }
  const { rows } = await pool.query(
    `INSERT INTO 
      user_disease_medicines (user_id, disease_id, started_at,medicine_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
    [user_id, disease_id, started_at, existing[0].id]
  );
  return rows[0];
};

export const removeAMedicineFunction = async (user_id, disease_id, name) => {
  const { rows: medicine } = await pool.query(
    `SELECT id from medicines WHERE name = $1`,
    [name]
  );
  console.log(medicine);
  const { rows } = await pool.query(
    `DELETE FROM user_disease_medicines 
        WHERE user_id = $1 AND disease_id = $2 AND medicine_id = $3
        RETURNING *`,
    [user_id, disease_id, medicine[0].id]
  );
  return rows[0];
};
