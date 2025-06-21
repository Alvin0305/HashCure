import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// import the routes here
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import allergyRoutes from "./routes/allergyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { configureSockets } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// middlewares
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// configure socket here
configureSockets(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// add routes here
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/allergies", allergyRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// doctor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ5MDUxMDM4LCJleHAiOjE3NDk2NTU4Mzh9.LZzQUpTaCRpxFuukWPTd6Ce-8Cgd3EKiw0LZZOZBho4
