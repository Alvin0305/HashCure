import pool from "../db.js";

export const createAppointmentFunction = async (
  patient_id,
  doctor_id,
  purpose,
  time
) => {
  const { rows: doctorData } = await pool.query(
    `
        SELECT d.allow_direct_booking, hd.hospital_id FROM doctors AS d
        JOIN hospital_doctors AS hd ON d.id = hd.doctor_id
        WHERE doctor_id = $1`,
    [doctor_id]
  );
  const { rows } = await pool.query(
    `INSERT INTO 
        appointments (patient_id, doctor_id, hospital_id, purpose, status, time)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
    [
      patient_id,
      doctor_id,
      doctorData[0].hospital_id,
      purpose,
      doctorData[0].allow_direct_booking ? "Scheduled" : "Pending",
      time,
    ]
  );
  return rows[0];
};

export const updateAppointmentFunction = async (
  appointment_id,
  chief_complaint,
  diagnosis,
  treatment_plan
) => {
  const { rows } = await pool.query(
    `UPDATE appointments 
        SET chief_complaint = $1,
        diagnosis = $2,
        treatment_plan = $3,
        status = 'Past'
        WHERE id = $4
        RETURNING *`,
    [chief_complaint, diagnosis, treatment_plan, appointment_id]
  );
  return rows[0];
};

export const getAllAppointmentsOfUserFunction = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM appointments WHERE patient_id = $1`,
    [id]
  );
  return rows;
};

export const getAppointmentByIdFunction = async (id) => {
  const { rows } = await pool.query(
    `SELECT 
        a.*, 
        u.firstname AS doctorname, 
        d.fees,
        h.name as hospitalname
        FROM appointments AS a
        JOIN doctors AS d ON a.doctor_id = d.id
        JOIN users AS u ON d.id = u.id
        JOIN hospitals AS h on a.hospital_id = h.id
         WHERE a.id = $1`,
    [id]
  );
  return rows[0];
};

export const getAppointmentsByUserFunction = async (
  user_id,
  dayFilter,
  statusFilter,
  hospital,
  doctor_firstname,
  doctor_lastname
) => {
  const selectors = [];

  if (dayFilter) {
    if (dayFilter === "Today") {
      selectors.push(
        "time >= CURRENT_DATE AND time < CURRENT_DATE + INTERVAL '1 day'"
      );
    } else if (dayFilter === "Tomorrow") {
      selectors.push(
        "time >= CURRENT_DATE + INTERVAL '1 day' AND time < CURRENT_DATE + INTERVAL '2 day'"
      );
    } else if (dayFilter === "Previous") {
      selectors.push("time < NOW()");
    } else if (dayFilter === "Upcoming") {
      selectors.push("time > NOW()");
    }
  }

  if (statusFilter) {
    if (statusFilter === "Scheduled") {
      selectors.push("status = 'Scheduled'");
    } else if (statusFilter === "Cancelled") {
      selectors.push("status = 'Cancelled'");
    } else if (statusFilter === "Pending") {
      selectors.push("status = 'Pending'");
    } else if (statusFilter === "Past") {
      selectors.push("status = 'Past'");
    }
  }

  let i = 1;
  const values = [];

  if (doctor_firstname) {
    selectors.push(`du.firstname = $${i}`);
    values.push(doctor_firstname);
    i++;
  }

  if (doctor_lastname) {
    selectors.push(`du.lastname = $${i}`);
    values.push(doctor_lastname);
    i++;
  }

  if (hospital) {
    selectors.push(`h.name = $${i}`);
    values.push(hospital);
    i++;
  }

  const query = `
    SELECT a.*, 
    d.fees, 
    du.firstname as doctor_name,  
    h.name as hospital_name 
    FROM appointments AS a
    JOIN doctors AS d on a.doctor_id = d.id
    JOIN users AS du on d.id = du.id
    JOIN hospitals AS h on a.hospital_id = h.id
    WHERE a.patient_id = $${i}
    ${selectors.length ? " AND " + selectors.join(" AND ") : ""}
    ORDER BY a.time DESC
  `;
  // console.log(query);
  // console.log([...values, user_id]);
  const { rows } = await pool.query(query, [...values, user_id]);

  return rows;
};

export const getAppointmentsByDoctorFunction = async (
  doctor_id,
  dayFilter,
  statusFilter
) => {
  const selectors = [];

  if (dayFilter) {
    if (dayFilter === "Today") {
      selectors.push(
        "time >= CURRENT_DATE AND time < CURRENT_DATE + INTERVAL '1 day'"
      );
    } else if (dayFilter === "Tomorrow") {
      selectors.push(
        "time >= CURRENT_DATE + INTERVAL '1 day' AND time < CURRENT_DATE + INTERVAL '2 day'"
      );
    } else if (dayFilter === "Previous") {
      selectors.push("time < NOW()");
    } else if (dayFilter === "Upcoming") {
      selectors.push("time > NOW()");
    }
  }

  if (statusFilter) {
    if (statusFilter === "Scheduled") {
      selectors.push("status = 'Scheduled'");
    } else if (statusFilter === "Cancelled") {
      selectors.push("status = 'Cancelled'");
    } else if (statusFilter === "Pending") {
      selectors.push("status = 'Pending'");
    }
  }

  const query = `
    SELECT a.*, 
    d.fees, 
    du.firstname as doctor_name,  
    h.name as hospital_name 
    FROM appointments AS a
    JOIN doctors AS d on a.doctor_id = d.id
    JOIN users AS du on d.id = du.id
    JOIN hospitals AS h on a.hospital_id = h.id
    WHERE a.doctor_id = $1
    ${selectors.length ? " AND " + selectors.join(" AND ") : ""}
    ORDER BY a.time DESC
  `;
  console.log(query);
  console.log([doctor_id]);
  const { rows } = await pool.query(query, [doctor_id]);

  return rows;
};

export const getFixedAppointmentsFunction = async (
  week_start_date,
  doctor_id
) => {
  const client = await pool.connect();
  const result = {};
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(week_start_date);
    currentDate.setDate(currentDate.getDate() + i);
    const dayName = days[currentDate.getDay()];

    const dayDate = currentDate.toISOString().split("T")[0];

    const { rows: appointments } = await client.query(
      `SELECT * FROM appointments
       WHERE doctor_id = $1 AND time::date = $2::date`,
      [doctor_id, dayDate]
    );

    result[dayName] = appointments;
  }

  client.release();
  return result;
};

export const cancelAppointmentsOfUserFunction = async (id) => {
  const { rows } = await pool.query(
    `UPDATE appointments
    SET status = 'Cancelled' 
    WHERE id = $1
    RETURNING *`,
    [id]
  );
  return rows[0];
};

export const deleteAppointmentsOfUserFunction = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM appointments  
    WHERE id = $1
    RETURNING *`,
    [id]
  );
  return rows[0];
};
