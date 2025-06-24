import pool from "../db.js";
import { getDoctorDetails } from "./doctor.js";
import { createUser } from "./user.js";

export const createDoctorFunction = async (
  firstname,
  lastname,
  email,
  password
) => {
  const { rows: existingDoctor } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  if (existingDoctor && existingDoctor.length !== 0) return existingDoctor[0];
  const doctor = await createUser(
    firstname,
    lastname,
    email,
    password,
    "doctor"
  );
  await pool.query(`INSERT INTO doctors (id) VALUES ($1) RETURNING *`, [
    doctor.id,
  ]);

  return doctor;
};

export const addDoctorToHospitalFunction = async (hospital_id, doctor_id) => {
  const { rows } = await pool.query(
    `INSERT INTO hospital_doctors (hospital_id, doctor_id)
        VALUES ($1, $2) RETURNING *`,
    [hospital_id, doctor_id]
  );
  return rows[0];
};

export const getHospitalByIdFunction = async (hospital_id) => {
  const { rows } = await pool.query(`SELECT * FROM hospitals WHERE id = $1`, [
    hospital_id,
  ]);
  rows[0].rating = await getHospitalRating(hospital_id);
  rows[0].specialities = await getHospitalSpecialitiesFunction(hospital_id);
  return rows[0];
};

export const getHospitalByAdminIdFunction = async (admin_id) => {
  const { rows } = await pool.query(
    `SELECT u.*, h.* FROM hospitals as h 
    JOIN users AS u ON h.admin_id = u.id
    WHERE u.id = $1`,
    [admin_id]
  );
  return rows[0];
};

export const addHospitalTimingsFunction = async (
  hospital_id,
  day,
  start_time,
  end_time
) => {
  const { rows } = await pool.query(
    `INSERT INTO 
        hospital_timings (hospital_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [hospital_id, day, start_time, end_time]
  );
  return rows[0];
};

export const getHospitalTimingsFunction = async (hospital_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM hospital_timings WHERE hospital_id = $1`,
    [hospital_id]
  );
  return rows;
};

export const getHospitalTimingFunction = async (hospital_id, day) => {
  const { rows } = await pool.query(
    `SELECT * FROM hospital_timings 
        WHERE hospital_id = $1 AND day = $2`,
    [hospital_id, day]
  );
  return rows[0];
};

export const updateHospitalTimingFunction = async (
  hospital_id,
  day,
  start_time,
  end_time
) => {
  const { rows } = await pool.query(
    `UPDATE hospital_timings 
    SET start_time = $3, end_time = $4
    WHERE hospital_id = $1 AND day = $2
    RETURNING *`,
    [hospital_id, day, start_time, end_time]
  );
  return rows[0];
};

export const deleteHospitalTimingFunction = async (hospital_id, day) => {
  const { rows } = await pool.query(
    `DELETE FROM hospital_timings 
        WHERE hospital_id = $1 AND day = $2
        RETURNING *`,
    [hospital_id, day]
  );
  return rows[0];
};

export const getDoctorsInHospitalFunction = async (hospital_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM hospital_doctors AS hd
    JOIN doctors AS d ON hd.doctor_id = d.id
    JOIN users AS u ON u.id = d.id
    WHERE hd.hospital_id = $1`,
    [hospital_id]
  );

  const output = [];
  for (const row of rows) {
    const result = { ...row };
    result.details = await getDoctorDetails(row.doctor_id);
    output.push(result);
  }
  return output;
};

export const removeDoctorFromHospitalFunction = async (
  hospital_id,
  doctor_id
) => {
  const { rows } = await pool.query(
    `DELETE FROM hospital_doctors
        WHERE hospital_id = $1 AND doctor_id = $2
        RETURNING *`,
    [hospital_id, doctor_id]
  );
  return rows[0];
};

export const addHospitalCommentFunction = async (
  hospital_id,
  user_id,
  comment
) => {
  const { rows } = await pool.query(
    `INSERT INTO 
    hospital_comments(hospital_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [hospital_id, user_id, comment]
  );
  const { rows: result } = await pool.query(
    `
    SELECT hs.*, u.image, u.firstname FROM hospital_comments AS hs
    JOIN users AS u ON u.id = hs.user_id
    WHERE hospital_id = $1 AND user_id = $2`,
    [hospital_id, user_id]
  );
  return result[0];
};

export const getHospitalCommentsFunction = async (hospital_id) => {
  const { rows } = await pool.query(
    `SELECT hs.*, u.image, u.firstname FROM hospital_comments AS hs
    JOIN users AS u ON u.id = hs.user_id
    WHERE hospital_id = $1`,
    [hospital_id]
  );
  return rows;
};

export const deleteHospitalCommentsFunction = async (hospital_id, user_id) => {
  const { rows } = await pool.query(
    `DELETE FROM hospital_comments
      WHERE hospital_id = $1 AND user_id = $2
      RETURNING *`,
    [hospital_id, user_id]
  );
  return rows;
};

export const editHospitalCommentsFunction = async (
  hospital_id,
  user_id,
  newComment
) => {
  const { rows } = await pool.query(
    `UPDATE hospital_comments
    SET comment = $3
    WHERE hospital_id = $1 AND user_id = $2
    RETURNING *`,
    [hospital_id, user_id, newComment]
  );
  return rows;
};

export const rateHospitalFunction = async (hospital_id, user_id, rating) => {
  const { rows: existingRating } = await pool.query(
    `UPDATE hospital_ratings
    SET rating = $3
    WHERE hospital_id = $1 AND user_id = $2
    RETURNING *`,
    [hospital_id, user_id, rating]
  );
  if (existingRating && existingRating.length) return existingRating[0];
  const { rows } = await pool.query(
    `INSERT INTO 
    hospital_ratings (hospital_id, user_id, rating)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [hospital_id, user_id, rating]
  );
  return rows[0];
};

export const getPatientsInHospitalFunction = async (
  hospital_id,
  searchValue,
  doctorId,
  ageStart,
  ageEnd
) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (searchValue) {
    fields.push(`u.firstname ILIKE '%' || $${i} || '%'`);
    values.push(searchValue);
    i++;
  }

  if (doctorId) {
    fields.push(`du.id = $${i}`);
    values.push(doctorId);
    i++;
  }

  if (ageStart != undefined && ageEnd != undefined) {
    fields.push(`$${i} <= EXTRACT(YEAR FROM age(u.dob)) 
      AND EXTRACT(YEAR FROM age(u.dob)) <= $${i + 1}`);
    values.push(ageStart);
    values.push(ageEnd);
    i += 2;
  }

  const query = `SELECT DISTINCT ON (u.id) u.*, 
    (u.weight * 10000)::float / (u.height * u.height)::float AS bmi,
    EXTRACT(YEAR FROM age(u.dob))::int AS age
    FROM users AS U
    JOIN appointments AS a ON a.patient_id = u.id AND a.hospital_id = ${hospital_id}
    JOIN doctors AS d ON a.doctor_id = d.id
    JOIN users AS du ON d.id = du.id
    ${fields.length ? " WHERE " + fields.join(" AND ") : ""}`;
  console.log(query);

  const { rows } = await pool.query(query, values);

  return rows;
};

export const getHospitalsFunction = async (
  searchValue,
  district,
  specialities,
  ownership
) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (searchValue) {
    fields.push(`h.name ILIKE '%' || $${i} || '%'`);
    values.push(searchValue);
    i++;
  }

  if (district) {
    fields.push(`h.district = $${i}`);
    values.push(district);
    i++;
  }

  if (specialities && specialities.length) {
    specialities.forEach((speciality) => {
      fields.push(`EXISTS (
          SELECT 1 FROM hospital_speciality AS hs
          JOIN specialities AS s ON hs.speciality_id = s.id
          WHERE s.name = '${speciality}' AND hs.hospital_id = h.id
        )`);
    });
  }

  if (ownership) {
    fields.push(`h.ownership = $${i}`);
    values.push(ownership);
    i++;
  }

  const query = `SELECT 
    h.*, 
    COALESCE (
      JSON_AGG(ROW_TO_JSON(speciality_data)) 
      FILTER (WHERE speciality_data.id IS NOT NULL), '[]'
    ) AS specialities,
    COALESCE (
      hr.average_rating, 0 
    ) AS rating
    FROM hospitals AS h
    LEFT JOIN hospital_speciality AS hs ON h.id = hs.hospital_id
    LEFT JOIN specialities AS s ON hs.speciality_id = s.id
    LEFT JOIN (
      SELECT s.id, s.name 
      FROM specialities s
    ) AS speciality_data ON s.id = speciality_data.id
    LEFT JOIN (
      SELECT hospital_id, ROUND(AVG(rating)::numeric, 1) AS average_rating
      FROM hospital_ratings
      GROUP BY hospital_id
    ) AS hr ON h.id = hr.hospital_id
    ${fields.length ? " WHERE " + fields.join(" AND ") : ""}
    GROUP BY h.id, hr.average_rating`;

  console.log(query);

  const { rows } = await pool.query(query, values);

  return rows;
};

export const updateHospitalFunction = async (
  hospital_id,
  district,
  address,
  phone,
  started_at,
  description,
  ownership
) => {
  const updates = [];
  const values = [];
  let i = 1;

  if (district) {
    updates.push(`district = $${i}`);
    values.push(district);
    i++;
  }

  if (address) {
    updates.push(`address = $${i}`);
    values.push(address);
    i++;
  }

  if (phone) {
    updates.push(`phone = $${i}`);
    values.push(phone);
    i++;
  }

  if (started_at) {
    updates.push(`started_at = $${i}`);
    values.push(started_at);
    i++;
  }

  if (description) {
    updates.push(`description = $${i}`);
    values.push(description);
    i++;
  }

  if (ownership) {
    updates.push(`ownership = $${i}`);
    values.push(ownership);
    i++;
  }

  if (updates.length === 0) return {};

  const query = `
    UPDATE hospitals 
    SET ${updates.join(", ")}
    WHERE id = ${hospital_id}
    RETURNING *
  `;
  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const updateHospitalImageFunction = async (hospital_id, image_url) => {
  const { rows } = await pool.query(
    `UPDATE hospitals
    SET image = $2 
    WHERE id = $1
    RETURNING *`,
    [hospital_id, image_url]
  );
  return rows[0];
};

export const getAllSpecialitiesFunction = async () => {
  const { rows } = await pool.query(`SELECT * FROM specialities`);
  return rows;
};

export const getHospitalSpecialitiesFunction = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM specialities AS s
    JOIN hospital_speciality AS hs ON s.id = hs.speciality_id
    WHERE hs.hospital_id = $1`,
    [id]
  );
  return rows;
};

export const getSpecialityByName = async (name) => {
  console.log(name);
  const { rows } = await pool.query(
    `SELECT * FROM specialities WHERE name = $1`,
    [name]
  );
  return rows[0];
};

export const addHospitalSpecialityFunction = async (id, name) => {
  const spec = await getSpecialityByName(name);
  console.log(spec);

  if (!spec) {
    const { rows: newSpec } = await pool.query(
      `INSERT INTO specialities (name)
      VALUES ($1) 
      RETURNING *`,
      [name]
    );

    const { rows } = await pool.query(
      `INSERT INTO 
      hospital_speciality (hospital_id, speciality_id)
      VALUES ($1, $2)
      RETURNING *`,
      [id, newSpec[0].id]
    );

    newSpec[0].name = name;
    newSpec[0].hospital_id = id;

    return newSpec[0];
  }

  const { rows } = await pool.query(
    `INSERT INTO 
    hospital_speciality (hospital_id, speciality_id)
    VALUES ($1, $2)
    RETURNING *`,
    [id, spec.id]
  );

  rows[0].name = name;
  rows[0].hospital_id = id;
  rows[0].id = rows[0].speciality_id;

  return rows[0];
};

export const removeHospitalSpecialityFunction = async (id, name) => {
  const spec = await getSpecialityByName(name);

  const { rows } = await pool.query(
    `DELETE FROM hospital_speciality
    WHERE hospital_id = $1 AND speciality_id = $2
    RETURNING *`,
    [id, spec.id]
  );

  return rows[0];
};

export const getHospitalRating = async (id) => {
  const { rows } = await pool.query(
    `SELECT AVG(rating) AS rating 
    FROM hospital_ratings WHERE hospital_id = $1
    GROUP BY hospital_id`,
    [id]
  );
  console.log(rows);
  return rows[0]?.rating || 0;
};

export const getHospitalDetails = async (id) => {
  const { rows } =
    await pool.query(`SELECT h.id, h.name, h.image, h.address FROM hospitals AS h
    `);
  const rating = await getHospitalRating(id);
  rows[0].rating = rating;
  rows[0].specialities = await getHospitalSpecialitiesFunction(id);
  return rows[0];
};

export const getAllDistrictsFunction = async () => {
  const { rows } = await pool.query(`SELECT DISTINCT district FROM hospitals`);
  const result = [];
  for (const row of rows) {
    result.push(row.district);
  }
  return result;
};

export const getUserRatingToHospitalFunction = async (hospital_id, user_id) => {
  const { rows } = await pool.query(
    `SELECT rating FROM hospital_ratings 
    WHERE hospital_id = $1
    AND user_id = $2`,
    [hospital_id, user_id]
  );

  if (!rows.length) return { rating: 0 };

  return rows[0];
};
