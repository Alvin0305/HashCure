import {
  cancelAppointment,
  confirmAppointment,
  createAppointment,
} from "./socketControllers/appointmentController.js";
import { joinUser } from "./socketControllers/loginController.js";

export const configureSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("create_appointment", (appointment) =>
      createAppointment({ appointment, io })
    );

    socket.on("cancel_appointment", (appointment) => {
      cancelAppointment({ appt: appointment, io });
    });

    socket.on("confirm_appointment", (appointment) => {
      confirmAppointment({ appt: appointment, io });
    });

    socket.on("user_joined", (id) => {
      joinUser({ user_id: id, socket });
    });
  });
};
