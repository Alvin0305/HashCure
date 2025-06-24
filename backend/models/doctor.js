import pool from "../db.js";
import { getHospitalDetails } from "./hospital.js";
import { getVideosByDoctorFunction } from "./video.js";

export const addDoctorWorkingHourFunction = async (
  doctor_id,
  day,
  start_time,
  end_time
) => {
  const { rows } = await pool.query(
    `INSERT INTO 
        doctor_schedule (doctor_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [doctor_id, day, start_time, end_time]
  );
  return rows[0];
};

export const deleteDoctorWorkingHourFunction = async (
  doctor_id,
  day,
  start_time,
  end_time
) => {
  const { rows } = await pool.query(
    `DELETE FROM doctor_schedule
    WHERE doctor_id = $1 AND day = $2
    AND start_time = $3 AND end_time = $4          
    RETURNING *`,
    [doctor_id, day, start_time, end_time]
  );
  return rows[0];
};

const getDoctorWorkingHourFunction = async (
  doctor_id,
  day,
  start_time,
  end_time
) => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_schedule
    WHERE doctor_id = $1 AND day = $2
    AND start_time = $3 AND end_time = $4`,
    [doctor_id, day, start_time, end_time]
  );
  return rows[0];
};

export const updateDoctorWorkingHourFunction = async (
  doctor_id,
  day,
  start_time,
  end_time,
  new_start_time,
  new_end_time
) => {
  const existingSchedule = await getDoctorWorkingHourFunction(
    doctor_id,
    day,
    start_time,
    end_time
  );
  let newStart = new_start_time,
    newEnd = new_end_time;
  if (!new_start_time) newStart = existingSchedule.start_time;
  if (!new_end_time) newEnd = existingSchedule.end_time;

  const { rows } = await pool.query(
    `UPDATE doctor_schedule
      SET start_time = $5, end_time = $6
      WHERE doctor_id = $1 AND day = $2
      AND start_time = $3 AND end_time = $4
      RETURNING *`,
    [doctor_id, day, start_time, end_time, newStart, newEnd]
  );
  return rows[0];
};

export const getDoctorWorkingHoursFunction = async (doctor_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_schedule WHERE doctor_id = $1`,
    [doctor_id]
  );
  const schedule = {};

  rows.forEach((row) => {
    if (!schedule[row.day]) {
      schedule[row.day] = [
        {
          doctor_id: row.doctor_id,
          start_time: row.start_time,
          end_time: row.end_time,
        },
      ];
    } else {
      schedule[row.day].push({
        doctor_id: row.doctor_id,
        start_time: row.start_time,
        end_time: row.end_time,
      });
    }
  });
  console.log(schedule);

  return schedule;
};

export const addPreviouslyWorkedHospitalsFunction = async (
  doctor_id,
  hospital_id,
  years
) => {
  const { rows } = await pool.query(
    `INSERT INTO 
    doctor_experience (doctor_id, hospital_id, years)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [doctor_id, hospital_id, years]
  );
  rows[0].details = await getHospitalDetails(hospital_id);
  return rows[0];
};

export const removePreviouslyWorkedHospitalsFunction = async (
  doctor_id,
  hospital_id
) => {
  const { rows } = await pool.query(
    `DELETE FROM doctor_experience
    WHERE doctor_id = $1 AND hospital_id = $2
      RETURNING *`,
    [doctor_id, hospital_id]
  );
  return rows[0];
};

export const getDoctorPreviouslyWorkedHospitalsFunction = async (doctor_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_experience
    WHERE doctor_id = $1`,
    [doctor_id]
  );
  const output = [];
  for (const row of rows) {
    const result = { ...row };
    Object.assign(result, row);
    result.details = await getHospitalDetails(row.hospital_id);
    output.push(result);
  }

  return output;
};

export const addDoctorCommentFunction = async (user_id, doctor_id, comment) => {
  const { rows } = await pool.query(
    `INSERT INTO 
        doctor_comments (user_id, doctor_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [user_id, doctor_id, comment]
  );

  const { rows: result } = await pool.query(
    `
    SELECT ds.*, u.image, u.firstname FROM doctor_comments AS ds
    JOIN users AS u ON u.id = ds.user_id
    WHERE doctor_id = $1 AND user_id = $2`,
    [doctor_id, user_id]
  );
  return result[0];
};

export const getDoctorCommentFunction = async (doctor_id) => {
  const { rows } = await pool.query(
    `SELECT dc.*, u.firstname, u.image FROM doctor_comments AS dc
      JOIN users AS u ON dc.user_id = u.id
    WHERE dc.doctor_id = $1`,
    [doctor_id]
  );
  return rows;
};

export const deleteDoctorCommentFunction = async (user_id, doctor_id) => {
  const { rows } = await pool.query(
    `DELETE FROM doctor_comments
      WHERE user_id = $1 AND doctor_id = $2
      RETURNING *`,
    [user_id, doctor_id]
  );
  return rows[0];
};

export const updateDoctorCommentFunction = async (
  user_id,
  doctor_id,
  newComment
) => {
  const { rows } = await pool.query(
    `UPDATE doctor_comments
    SET comment = $3
    WHERE user_id = $1 AND doctor_id = $2
    RETURNING *`,
    [user_id, doctor_id, newComment]
  );
  return rows[0];
};

export const rateDoctorFunction = async (user_id, doctor_id, rating) => {
  const { rows: existingRating } = await pool.query(
    `SELECT * FROM doctor_ratings 
        WHERE user_id = $1 AND doctor_id = $2`,
    [user_id, doctor_id]
  );

  if (existingRating && existingRating.length !== 0) {
    const { rows: updatedRating } = await pool.query(
      `UPDATE doctor_ratings
        SET rating = $3 
        WHERE user_id = $1 AND doctor_id = $2
        RETURNING *`,
      [user_id, doctor_id, rating]
    );
    return updatedRating[0];
  }

  const { rows } = await pool.query(
    `INSERT INTO 
    doctor_ratings (user_id, doctor_id, rating)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [user_id, doctor_id, rating]
  );
  return rows[0];
};

export const approveAnAppointmentFunction = async (id) => {
  const { rows } = await pool.query(
    `UPDATE appointments 
    SET status = 'Scheduled'
    WHERE id = $1 
    RETURNING *`,
    [id]
  );
  return rows[0];
};

export const getAllPatientsFunction = async (id, name, age_start, age_end) => {
  const baseQuery = `
    SELECT DISTINCT ON (u.id)
      u.*,
      EXTRACT(YEAR FROM age(u.dob)) AS age,
      ROUND(CASE 
        WHEN u.height > 0 
        THEN u.weight / ((u.height / 100.0) * (u.height / 100.0)) 
        ELSE NULL 
      END, 2) AS bmi
    FROM appointments AS a
    JOIN users AS u ON a.patient_id = u.id
    WHERE a.doctor_id = $1
      AND EXTRACT(YEAR FROM age(u.dob)) >= $2
      AND EXTRACT(YEAR FROM age(u.dob)) <= $3
  `;

  const nameFilter = `
    AND (
      u.firstname ILIKE '%' || $4 || '%' 
      OR u.lastname ILIKE '%' || $4 || '%'
      OR u.firstname || ' ' || u.lastname ILIKE '%' || $4 || '%'
    )
  `;

  if (name) {
    const { rows } = await pool.query(baseQuery + nameFilter, [
      id,
      age_start,
      age_end,
      name,
    ]);
    return rows;
  } else {
    const { rows } = await pool.query(baseQuery, [id, age_start, age_end]);
    return rows;
  }
};

export const updateDoctorFunction = async (doctor_id, doctorData) => {
  const userFields = [
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

  const doctorFields = ["qualifications", "fees", "experience", "description"];

  const userUpdates = [];
  const userValues = [];
  const doctorUpdates = [];
  const doctorValues = [];
  let i = 1;
  let j = 1;

  for (const field of userFields) {
    if (doctorData[field] !== undefined) {
      userUpdates.push(`${field} = $${i}`);
      userValues.push(doctorData[field]);
      i++;
    }
  }

  for (const field of doctorFields) {
    if (doctorData[field] !== undefined) {
      doctorUpdates.push(`${field} = $${j}`);
      doctorValues.push(doctorData[field]);
      j++;
    }
  }

  const result = {};

  if (userUpdates.length) {
    const query = `
      UPDATE users 
      SET ${userUpdates.join(", ")}
      WHERE id = $${i}
      RETURNING *
    `;

    const { rows: updatedUser } = await pool.query(query, [
      ...userValues,
      doctor_id,
    ]);

    if (updatedUser.length) {
      Object.assign(result, updatedUser[0]);
    }
  }

  if (doctorUpdates.length) {
    const query = `
      UPDATE doctors 
      SET ${doctorUpdates.join(", ")}
      WHERE id = $${j}
      RETURNING *
    `;

    const { rows: updatedDoctor } = await pool.query(query, [
      ...doctorValues,
      doctor_id,
    ]);

    if (updatedDoctor.length) {
      Object.assign(result, updatedDoctor[0]);
    }
  }

  return result;
};

export const addSpecializationForDoctorFunction = async (doctor_id, spec) => {
  const { rows: specialization } = await pool.query(
    `SELECT * FROM specializations WHERE name = $1`,
    [spec]
  );

  if (!specialization || !specialization.length) {
    const { rows: newSpecialization } = await pool.query(
      `INSERT INTO specializations (name)
      VALUES ($1)
      RETURNING *`,
      [spec]
    );

    const { rows } = await pool.query(
      `INSERT INTO 
      doctor_specializations (doctor_id, specialization_id)
      VALUES ($1, $2)
      RETURNING *`,
      [doctor_id, newSpecialization[0].id]
    );

    rows[0].name = spec;

    return rows[0];
  }

  const { rows } = await pool.query(
    `INSERT INTO 
    doctor_specializations (doctor_id, specialization_id)
    VALUES ($1, $2)
    RETURNING *`,
    [doctor_id, specialization[0].id]
  );
  rows[0].name = spec;
  return rows[0];
};

export const getDoctorSpecializationsFunction = async (doctor_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_specializations AS ds
    JOIN specializations AS s ON ds.specialization_id = s.id
    WHERE ds.doctor_id = $1`,
    [doctor_id]
  );

  return rows;
};

export const getAllSpecializationsFunction = async () => {
  const { rows } = await pool.query(`SELECT * FROM specializations`);

  return rows;
};

export const removeSpecializationForDoctorFunction = async (
  doctor_id,
  spec
) => {
  const { rows: specialization } = await pool.query(
    `SELECT * FROM specializations WHERE name = $1`,
    [spec]
  );
  const { rows } = await pool.query(
    `DELETE FROM doctor_specializations
    WHERE doctor_id = $1 AND specialization_id = $2`,
    [doctor_id, specialization[0].id]
  );

  return rows;
};

export const getDoctorByIdFunction = async (id) => {
  const result = {};
  const { rows: doctorDetails } = await pool.query(
    `SELECT * FROM doctors AS d
    JOIN users AS u ON d.id = u.id
    WHERE d.id = $1
    `,
    [id]
  );

  const { rows: currently_working } = await pool.query(
    `SELECT * FROM hospital_doctors 
    WHERE doctor_id = $1`,
    [id]
  );

  Object.assign(result, doctorDetails[0]);

  result.working_hours = await getDoctorWorkingHoursFunction(id);
  result.specialization = await getDoctorSpecializationsFunction(id);
  result.videos = await getVideosByDoctorFunction(id);
  result.comments = await getDoctorCommentFunction(id);
  result.currently_working = await getHospitalDetails(
    currently_working[0]?.hospital_id
  );

  return result;
};

export const getDoctorFunction = async (
  searchValue,
  district,
  hospitalName,
  specialization,
  dayFilters,
  gender,
  feeStart,
  feeEnd
) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (searchValue) {
    fields.push(
      `(u.firstname ILIKE '%' || $${i} || '%' OR u.lastname ILIKE '%' || $${i} || '%' OR dss.name ILIKE '%' || $${i} || '%')`
    );
    values.push(searchValue);
    i++;
  }

  if (district) {
    fields.push(`h.district = $${i}`);
    values.push(district);
    i++;
  }

  if (hospitalName) {
    fields.push(`h.name = $${i}`);
    values.push(hospitalName);
    i++;
  }

  if (dayFilters && dayFilters.length) {
    const dayConditions = dayFilters.map((day) => {
      if (day === "Today") {
        return `TRIM(TO_CHAR(NOW(), 'FMDay'))::days`;
      } else if (day === "Tomorrow") {
        return `TRIM(TO_CHAR(NOW() + INTERVAL '1 day', 'FMDay'))::days`;
      } else {
        values.push(day);
        return `$${i++}::days`;
      }
    });
    fields.push(
      `EXISTS (SELECT 1 FROM doctor_schedule ds_check WHERE ds_check.doctor_id = d.id AND ds_check.day = ANY(ARRAY[${dayConditions.join(
        ", "
      )}]))`
    );
  }

  if (gender) {
    fields.push(`u.gender = $${i}`);
    values.push(gender);
    i++;
  }

  if (feeStart !== undefined && feeEnd !== undefined) {
    fields.push(`d.fees BETWEEN $${i} AND $${i + 1}`);
    values.push(feeStart);
    values.push(feeEnd);
    i += 2;
  }

  const havingClauses = [];
  if (specialization) {
    // Filter by specialization AFTER aggregation
    havingClauses.push(`$${i} = ANY(ARRAY_AGG(DISTINCT dss.name))`);
    values.push(specialization);
    i++;
  }

  // --- THE CORRECTED QUERY ---
  const query = `
    SELECT
      d.id,
      d.fees,
      u.firstname,
      u.lastname,
      u.email,
      u.gender,
      u.image,
      h.name AS hospital_name,
      h.district AS hospital_district,
      -- Aggregate all specialization names for a doctor into an array
      ARRAY_AGG(DISTINCT dss.name) AS specializations,
      -- --- ADD THIS LINE ---
      -- Calculate the average rating, default to 0 if no ratings exist, and format to 2 decimal places
      COALESCE(AVG(dr.rating), 0)::numeric(10,2) AS rating
    FROM
      doctors AS d
    JOIN users AS u ON d.id = u.id
    JOIN hospital_doctors AS hd ON d.id = hd.doctor_id
    JOIN hospitals AS h ON hd.hospital_id = h.id
    LEFT JOIN doctor_specializations AS ds ON d.id = ds.doctor_id
    LEFT JOIN specializations AS dss ON ds.specialization_id = dss.id
    -- --- AND ADD THIS JOIN ---
    LEFT JOIN doctor_ratings AS dr ON d.id = dr.doctor_id
    ${fields.length ? "WHERE " + fields.join(" AND ") : ""}
    GROUP BY
      d.id, u.id, h.id
    ${havingClauses.length ? "HAVING " + havingClauses.join(" AND ") : ""}
  `;

  console.log("QUERY:", query);
  console.log("VALUES:", values);

  const { rows } = await pool.query(query, values);
  return rows;
};

export const getDoctorRating = async (id) => {
  const { rows } = await pool.query(
    `SELECT AVG(rating) AS rating
    FROM doctor_ratings 
    WHERE doctor_id = $1
    GROUP BY doctor_id`,
    [id]
  );
  console.log(rows);
  return rows[0]?.rating || 0;
};

export const getDoctorDetails = async (id) => {
  const { rows } = await pool.query(
    `SELECT d.fees, dhh.name, du.firstname, du.lastname FROM doctors AS d
    JOIN hospital_doctors AS hd ON d.id = hd.doctor_id
    JOIN hospitals AS dhh ON hd.hospital_id = dhh.id
    JOIN users AS du ON d.id = du.id
    WHERE d.id = $1`,
    [id]
  );

  rows[0].specialization = await getDoctorSpecializationsFunction(id);
  rows[0].rating = await getDoctorRating(id);

  return rows[0];
};

export const getUserRatingToDoctorFunction = async (doctor_id, user_id) => {
  const { rows } = await pool.query(
    `SELECT rating FROM doctor_ratings 
    WHERE doctor_id = $1
    AND user_id = $2`,
    [doctor_id, user_id]
  );

  if (!rows.length) return { rating: 0 };

  return rows[0];
};
