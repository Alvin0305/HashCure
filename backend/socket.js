import {
  cancelAppointment,
  confirmAppointment,
  createAppointment,
} from "./socketControllers/appointmentController.js";

export const configureSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("create_appointment", (appointment) =>
      createAppointment({ appointment, io })
    );

    socket.on("cancel_appointment", (appointment) => {
      cancelAppointment({ appointment, io });
    });

    socket.on("confirm_appointment", (appointment) => {
      confirmAppointment({ appointment, io });
    });
  });
};
