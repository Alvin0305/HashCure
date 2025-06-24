import {
  cancelAppointmentsOfUserFunction,
  createAppointmentFunction,
  deleteAppointmentsOfUserFunction,
  getAllAppointmentsOfUserFunction,
  getAppointmentByIdFunction,
  getAppointmentsByDoctorFunction,
  getAppointmentsByUserFunction,
  getFixedAppointmentsFunction,
  updateAppointmentFunction,
} from "../models/appointment.js";

export const getAppointmentsByUser = async (req, res) => {
  const { id } = req.params;
  const {
    dayFilter,
    statusFilter,
    hospital,
    doctor_firstname,
    doctor_lastname,
  } = req.body;
  console.log(
    dayFilter,
    statusFilter,
    hospital,
    doctor_firstname,
    doctor_lastname
  );

  console.log("id:", id);
  try {
    const appointments = await getAppointmentsByUserFunction(
      id,
      dayFilter,
      statusFilter,
      hospital,
      doctor_firstname,
      doctor_lastname
    );
    res.json(appointments);
  } catch (err) {
    console.log("Failed to get appointments");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  const { id } = req.params;
  const { dayFilter, statusFilter } = req.body;
  try {
    const appointments = await getAppointmentsByDoctorFunction(
      id,
      dayFilter,
      statusFilter
    );
    res.json(appointments);
  } catch (err) {
    console.log("Failed to get appointments");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const createAppointment = async (req, res) => {
  const patient_id = req.user?.id;
  const { doctor_id, purpose, time } = req.body;
  console.log(time);
  const correctedTime = new Date(time);
  console.log(correctedTime);
  try {
    const appointment = await createAppointmentFunction(
      patient_id,
      doctor_id,
      purpose,
      correctedTime
    );
    console.log(appointment);
    if (!appointment)
      return res.status(400).json({ error: "failed to create appointment" });
    res.json(appointment);
  } catch (err) {
    console.log("Failed to create appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { chief_complaint, diagnosis, treatment_plan } = req.body;
  try {
    const updatedAppointment = await updateAppointmentFunction(
      id,
      chief_complaint,
      diagnosis,
      treatment_plan
    );
    if (!updatedAppointment)
      return res.status(400).json({ error: "failed to update appointment" });
    res.json(updatedAppointment);
  } catch (err) {
    console.log("Failed to update appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getFixedAppointments = async (req, res) => {
  const doctor_id = req.params.id;
  const { week_start_date } = req.body;
  const correctedDate = new Date(week_start_date);
  try {
    const appointments = await getFixedAppointmentsFunction(
      correctedDate,
      doctor_id
    );
    res.json(appointments);
  } catch (err) {
    console.log("Failed to fetch appointments");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await getAppointmentByIdFunction(id);
    if (!appointment)
      return res.status(400).json({ error: "Failed to fetch appointment" });
    res.json(appointment);
  } catch (err) {
    console.log("Failed to fetch appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllAppointmentsOfUser = async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await getAllAppointmentsOfUserFunction(id);
    if (!appointments)
      return res.status(400).json({ error: "failed to fetch appointment" });
    res.json(appointments);
  } catch (err) {
    console.log("Failed to fetch appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const cancelAppointmentsOfUser = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await cancelAppointmentsOfUserFunction(id);
    if (!appointment)
      return res.status(400).json({ error: "failed to cancel appointment" });
    res.json(appointment);
  } catch (err) {
    console.log("Failed to cancel appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteAppointmentsOfUser = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await deleteAppointmentsOfUserFunction(id);
    if (!appointment)
      return res.status(400).json({ error: "failed to delete appointment" });
    res.json(appointment);
  } catch (err) {
    console.log("Failed to delete appointment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
