import pool from "../db.js";

export const createUser = async (
  firstname,
  lastname,
  email,
  password,
  role = "patient"
) => {
  const { rows } = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [firstname, lastname, email, password, role]
  );
  return rows[0];
};

export const createDoctor = async (firstname, lastname, email, password) => {
  console.log("here:", firstname, lastname, email, password);
  const { rows } = await pool.query(
    `INSERT INTO users (firstname, lastname, email, password_hash, role)
        VALUES ($1, $2, $3, $4, 'doctor')
        RETURNING *`,
    [firstname, lastname, email, password]
  );
  return rows[0];
};

export const getUserById = async (userId) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return rows[0];
};

export const getDonorsFunction = async (
  blood_group,
  age_start,
  age_end,
  bmi_start,
  bmi_end
) => {
  console.log(blood_group, age_start, age_end, bmi_start, bmi_end);
  if (blood_group) {
    const { rows } = await pool.query(
      `SELECT u.*, 
      EXTRACT (YEAR FROM age(dob)) AS age, 
      (weight * 10000)::float / (height * height)::float AS bmi
      FROM users AS u 
      WHERE blood_group = $1
      AND is_willing_to_donate_blood = True
      AND $2 <= EXTRACT (YEAR FROM age(dob))
      AND EXTRACT (YEAR FROM age(dob)) <= $3
      AND $4 <= (weight * 10000)::float / (height * height)::float
      AND (weight * 10000)::float / (height * height)::float <= $5
    `,
      [blood_group, age_start, age_end, bmi_start, bmi_end]
    );
    return rows;
  } else {
    const { rows } = await pool.query(
      `SELECT u.*, 
      EXTRACT (YEAR FROM age(dob)) AS age, 
      (weight * 10000)::float / (height * height)::float AS bmi
      FROM users AS u 
      WHERE is_willing_to_donate_blood = True
      AND $1 <= EXTRACT (YEAR FROM age(dob))
      AND EXTRACT (YEAR FROM age(dob)) <= $2
      AND $3 <= (weight * 10000)::float / (height * height)::float
      AND (weight * 10000)::float / (height * height)::float <= $4
    `,
      [age_start, age_end, bmi_start, bmi_end]
    );
    return rows;
  }
};

export const getNotificationsFunction = async (user_id) => {
  const { rows: notificationsToday } = await pool.query(
    `SELECT * FROM notifications
    WHERE user_id = $1 
    AND time >= CURRENT_DATE
    AND time < CURRENT_DATE + INTERVAL '1 day'
    ORDER BY time DESC`,
    [user_id]
  );

  const { rows: notificationsYesterday } = await pool.query(
    `SELECT * FROM notifications
    WHERE user_id = $1 
    AND time >= CURRENT_DATE - INTERVAL '1 day'
    AND time < CURRENT_DATE
    ORDER BY time DESC`,
    [user_id]
  );

  const { rows: previousNotifications } = await pool.query(
    `SELECT * FROM notifications
    WHERE user_id = $1 
    AND time < CURRENT_DATE - INTERVAL '1 day'
    ORDER BY time DESC`,
    [user_id]
  );
  const result = {
    today: notificationsToday,
    yesterday: notificationsYesterday,
    previous: previousNotifications,
  };
  return result;
};

export const getConsultedDoctorsFunction = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT 
      d.id AS doctor_id,
      du.firstname AS doctor_firstname,
      du.lastname AS doctor_lastname,
      d.fees,
      du.image AS doctor_image,
      h.name AS hospital_name,
      COALESCE(dr.average_rating, 0) AS doctor_rating,
      COALESCE(
        JSON_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
        '[]'
      ) AS specializations
    FROM appointments AS a
    JOIN doctors AS d ON a.doctor_id = d.id
    JOIN users AS du ON du.id = d.id
    JOIN hospitals AS h ON h.id = a.hospital_id

    -- Join for average rating
    LEFT JOIN (
      SELECT doctor_id, ROUND(AVG(rating)::numeric, 1) AS average_rating
      FROM doctor_ratings
      GROUP BY doctor_id
    ) AS dr ON dr.doctor_id = d.id

    -- Join for specializations
    LEFT JOIN doctor_specializations AS ds ON ds.doctor_id = d.id
    LEFT JOIN specializations AS s ON s.id = ds.specialization_id

    WHERE a.patient_id = $1

    GROUP BY 
      d.id, du.id, h.id, dr.average_rating;

    `,
    [id]
  );
  return rows;
};

export const getVisitedHospitalsFunction = async (id) => {
  const { rows } = await pool.query(
    `SELECT 
      h.id AS hospital_id,
      h.name AS hospital_name,
      h.district,
      h.address,
      COALESCE(hr.average_rating, 0) AS hospital_rating,
      COALESCE(
        JSON_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
        '[]'
      ) AS specialities
    FROM appointments AS a
    JOIN hospitals AS h ON h.id = a.hospital_id

    -- Join for hospital average rating
    LEFT JOIN (
      SELECT hospital_id, ROUND(AVG(rating)::numeric, 1) AS average_rating
      FROM hospital_ratings
      GROUP BY hospital_id
    ) AS hr ON hr.hospital_id = h.id

    -- Join for specialities
    LEFT JOIN hospital_speciality AS hs ON hs.hospital_id = h.id
    LEFT JOIN specialities AS s ON s.id = hs.speciality_id

    WHERE a.patient_id = $1

    GROUP BY h.id, hr.average_rating;`,
    [id]
  );

  return rows;
};

export const getUserPreferencesFunction = async (id) => {
  const user = await getUserById(id);

  if (user.role === "patient") {
    const { rows } = await pool.query(
      `
      SELECT is_willing_to_donate_blood,
      frequency_of_blood_donation,
      last_blood_donation_date 
      FROM users
      WHERE id = $1`,
      [id]
    );

    return rows[0];
  } else if (user.role === "doctor") {
    const { rows } = await pool.query(
      `
      SELECT u.is_willing_to_donate_blood,
      u.frequency_of_blood_donation,
      u.last_blood_donation_date,
      d.allow_direct_booking
      FROM users AS u
      JOIN doctors AS d ON u.id = d.id
      WHERE u.id = $1`,
      [id]
    );

    return rows[0];
  }
  return {};
};

export const updateUserPreferencesFunction = async (
  id,
  is_willing_to_donate_blood,
  frequency_of_blood_donation,
  last_blood_donated_date,
  allow_direct_booking
) => {
  const userUpdates = [];
  const userValues = [];
  let i = 1;

  if (is_willing_to_donate_blood !== undefined) {
    userUpdates.push(`is_willing_to_donate_blood = $${i}`);
    userValues.push(is_willing_to_donate_blood);
    i++;
  }

  if (frequency_of_blood_donation !== undefined) {
    userUpdates.push(`frequency_of_blood_donation = $${i}`);
    userValues.push(frequency_of_blood_donation);
    i++;
  }

  if (last_blood_donated_date !== undefined) {
    userUpdates.push(`last_blood_donation_date = $${i}`);
    userValues.push(last_blood_donated_date);
    i++;
  }

  const result = {};

  if (userUpdates.length) {
    const { rows } = await pool.query(
      `UPDATE users SET
      ${userUpdates.join(", ")}
      WHERE id = ${id}
      RETURNING *`,
      userValues
    );
    Object.assign(result, rows[0]);
  }

  if (allow_direct_booking !== undefined) {
    const { rows } = await pool.query(
      `
      UPDATE doctors SET allow_direct_booking = $1 WHERE id = $2 RETURNING *`,
      [allow_direct_booking, id]
    );

    result.allow_direct_booking = rows[0].allow_direct_booking;
  }

  return result;
};

export const getUserProfileFunction = async (id) => {
  return await getUserById(id);
};

export const updateUserProfileFunction = async (id, updateData) => {
  const fields = [
    "firstname",
    "lastname",
    "email",
    "gender",
    "address",
    "phone",
    "dob",
    "height",
    "weight",
    "blood_group",
  ];

  const updates = [];
  const values = [];

  let i = 1;

  for (const field of fields) {
    if (updateData[field] !== undefined) {
      updates.push(`${field} = $${i}`);
      values.push(updateData[field]);
      i++;
    }
  }

  if (updates.length) {
    const query = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${i}
      RETURNING *
    `;

    const { rows: updatedUser } = await pool.query(query, [...values, id]);

    return updatedUser[0];
  }

  return {};
};

export const updateUserImageFunction = async (id, file_url) => {
  const { rows } = await pool.query(
    `UPDATE users SET image = $1 WHERE id = $2 RETURNING *`,
    [file_url, id]
  );
  return rows;
};
