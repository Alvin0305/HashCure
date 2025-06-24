import pool from "../db.js";

export const addUserAllergyFunction = async (user_id, name) => {
  const { rows: exisiting } = await pool.query(
    `SELECT * FROM medicines
        WHERE name = $1`,
    [name]
  );

  if (exisiting.length === 0) {
    const { rows: medicine } = await pool.query(
      `INSERT INTO medicines (name)
        VALUES ($1) 
        RETURNING *`,
      [name]
    );

    const { rows } = await pool.query(
      `INSERT INTO 
        user_allergies (user_id, medicine_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [user_id, medicine[0].id]
    );

    rows[0].name = name;
    return rows[0];
  }
  const { rows } = await pool.query(
    `INSERT INTO 
      user_allergies (user_id, medicine_id)
      VALUES ($1, $2)
      RETURNING *
      `,
    [user_id, exisiting[0].id]
  );
  rows[0].name = name;
  return rows[0];
};

export const removeAllergyFunction = async (user_id, name) => {
  const { rows: medicine } = await pool.query(
    `SELECT * FROM medicines
    WHERE name = $1`,
    [name]
  );
  const { rows } = await pool.query(
    `DELETE FROM user_allergies 
    WHERE user_id = $1 AND medicine_id = $2
    RETURNING *`,
    [user_id, medicine[0].id]
  );
  return rows[0];
};

export const getUserAllergiesFunction = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM user_allergies AS ua
        JOIN medicines AS m ON ua.medicine_id = m.id
        WHERE ua.user_id = $1`,
    [user_id]
  );
  return rows;
};
