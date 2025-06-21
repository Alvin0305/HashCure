import pool from "../db.js";

export const addANewDiseaseFunction = async (user_id, name) => {
  const { rows: existingDisease } = await pool.query(
    `SELECT * FROM diseases WHERE name = $1`,
    [name]
  );
  if (existingDisease.length !== 0) {
    const { rows } = await pool.query(
      `INSERT INTO 
        patient_diseases (user_id, disease_id)
        VALUES ($1, $2)
        RETURNING *`,
      [user_id, existingDisease[0].id]
    );
    rows[0].name = existingDisease[0].name;
    return rows[0];
  }

  const { rows: newDisease } = await pool.query(
    `INSERT INTO diseases (name) VALUES ($1) RETURNING *`,
    [name]
  );

  const { rows } = await pool.query(
    `INSERT INTO 
    patient_diseases (user_id, disease_id) 
    VALUES ($1, $2)
    RETURNING *`,
    [user_id, newDisease[0].id]
  );
  rows[0].name = newDisease[0].name;
  return rows[0];
};

export const deleteDiseaseFunction = async (user_id, disease_id) => {
  const { rows } = await pool.query(
    `DELETE FROM patient_diseases
    WHERE user_id = $1 AND disease_id = $2
    RETURNING *`,
    [user_id, disease_id]
  );

  return rows[0];
};

export const addANewDiseaseValueFunction = async (
  user_id,
  disease_id,
  record_date,
  value
) => {
  const { rows } = await pool.query(
    `INSERT INTO 
    disease_records (user_id, disease_id, record_date, value) 
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [user_id, disease_id, record_date, value]
  );
  return rows[0];
};

export const removeANewDiseaseValueFunction = async (
  user_id,
  disease_id,
  record_date
) => {
  const { rows } = await pool.query(
    `DELETE FROM disease_records
    WHERE user_id = $1 AND disease_id = $2 AND record_date = $3
    RETURNING *`,
    [user_id, disease_id, record_date]
  );
  return rows[0];
};

export const updateNormalValuesOfDiseaseFunction = async (
  user_id,
  disease_id,
  min_value,
  max_value
) => {
  const { rows: exisiting } = await pool.query(
    `
    SELECT * FROM patient_diseases 
    WHERE user_id = $1 
    AND disease_id = $2`,
    [user_id, disease_id]
  );

  if (!min_value) min_value = exisiting[0].min_value;
  if (!max_value) max_value = exisiting[0].max_value;
  const { rows } = await pool.query(
    `UPDATE patient_diseases
    SET min_value = $3,
    max_value = $4
    WHERE user_id = $1
    AND disease_id = $2
    RETURNING *`,
    [user_id, disease_id, min_value, max_value]
  );
  return rows[0];
};

export const getUserDiseasesFunction = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM patient_diseases AS pd
    JOIN diseases AS d ON pd.disease_id = d.id
    WHERE pd.user_id = $1`,
    [user_id]
  );
  return rows;
};

export const addANewDiseaseReportFunction = async (
  user_id,
  disease_id,
  file_url,
  public_id
) => {
  const { rows: disease } = await pool.query(
    `SELECT name from diseases WHERE id = $1`,
    [disease_id]
  );
  const time = new Date();
  const name = `${disease[0].name}-${time.toDateString()}-${time
    .toTimeString()
    ?.substring(0, 8)}`;
  const { rows } = await pool.query(
    `INSERT INTO 
    user_disease_files (user_id, disease_id, file_url, public_id, name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [user_id, disease_id, file_url, public_id, name]
  );
  return rows[0];
};

export const removeADiseaseReportFunction = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM user_disease_files WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

export const editADiseaseReportsFunction = async (id, newName) => {
  const { rows } = await pool.query(
    `UPDATE user_disease_files
    SET name = $1
    WHERE id = $2
    RETURNING *`,
    [newName, id]
  );
  return rows[0];
};

const getDiseaseHelper = async (user_id, disease_id) => {
  const { rows } = await pool.query(
    `SELECT min_value, max_value FROM patient_diseases 
    WHERE user_id = $1
    AND disease_id = $2`,
    [user_id, disease_id]
  );
  return rows[0];
};

const getDiseaseRecordsHelper = async (user_id, disease_id) => {
  const { rows } = await pool.query(
    `SELECT record_date, value FROM disease_records
    WHERE user_id = $1 AND disease_id = $2`,
    [user_id, disease_id]
  );
  return rows;
};

const getDiseaseFilesHelper = async (user_id, disease_id) => {
  const { rows } = await pool.query(
    `SELECT id as file_id, file_url, name, public_id FROM user_disease_files
    WHERE user_id = $1 AND disease_id = $2`,
    [user_id, disease_id]
  );
  return rows;
};

const getDiseaseMedicineHelper = async (user_id, disease_id) => {
  const { rows } = await pool.query(
    `SELECT udm.started_at, m.name FROM user_disease_medicines AS udm
    JOIN medicines AS m ON udm.medicine_id = m.id
    WHERE user_id = $1 AND disease_id = $2`,
    [user_id, disease_id]
  );
  return rows;
};

export const getDiseaseFunction = async (user_id, disease_id) => {
  const { min_value, max_value } = (await getDiseaseHelper(
    user_id,
    disease_id
  )) || { min_value: 0, max_value: 0 };
  const records = await getDiseaseRecordsHelper(user_id, disease_id);
  const files = await getDiseaseFilesHelper(user_id, disease_id);
  const medicines = await getDiseaseMedicineHelper(user_id, disease_id);

  const result = {
    min_value: min_value,
    max_value: max_value,
    records: records,
    files: files,
    medicines: medicines,
  };
  return result;
};
