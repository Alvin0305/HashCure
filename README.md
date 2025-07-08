# HashCure 🏥

**HashCure** is a comprehensive, full-stack medical web application built to streamline patient-doctor-hospital interaction and healthcare management. Designed for real-world scalability and role-based functionality, HashCure integrates patient record tracking, smart appointment scheduling, blood donation coordination, and YouTube-based doctor education—all in one powerful platform.

🌐 [Live Demo](https://hash-cure.vercel.app)

---

## 💡 Features

### 👥 User Roles

- **Patient** (default on signup)
- **Doctor** (account created by hospital admin)
- **Hospital Admin** (account created by super admin)
- **Super Admin** (you, the system owner)

---

### 🩺 Patient Features

- **Home Dashboard**: Recently visited doctors/hospitals and new videos from subscribed doctors.
- **Quick Access**: Fast navigation to consulted doctors and visited hospitals.
- **Appointments**: View and filter appointments by status (Pending, Scheduled, Cancelled, Past), doctor, or hospital.
- **Reports**:
  - Add reports like Thyroid, Diabetes, etc.
  - Graphical visualizations with custom normal ranges.
  - Upload/delete/rename/download files for reports.
  - Add medicines associated with each report.
- **Doctors Directory**:
  - Filter by name, district, hospital, specialization, gender, fee.
  - View doctor profiles, ratings, working hours, YouTube videos, and comments.
- **Hospitals Directory**:
  - Filter by name, district, ownership type, and specialties.
  - View hospital details, rating, doctors list, and comments.
- **Notifications**: Grouped as Today, Yesterday, Past.
- **Blood Donation**:
  - Filter donors by age, BMI, and blood group.
  - View contact details and donation preferences.
- **Settings**: Update blood donation willingness and preferences (next donation time, last donation date).
- **Profile**: View and update personal info, allergies, appointments, and access to reports or appointment details.

---

### 🧑‍⚕️ Doctor Features

- **Dashboard**: Today's appointments, pending requests, uploaded videos.
- **Appointments**:
  - Accept/reject pending requests.
  - Consult button to conduct and complete appointments.
  - View patient profile and reports during consultation.
- **Patients Directory**: Search/filter patients by name and age.
- **Profile**: Update qualifications, specializations, experience, fees, description, and working hours.
- **Videos**: Add/remove videos for patients to view.
- **Comments**: View feedback and ratings from patients.

---

### 🏥 Hospital Admin Features

- **Dashboard**: Manage doctors within the hospital.
- **Appointments**: Search appointments by patient and doctor.
- **Doctors Management**: Add/remove doctors, update details.
- **Patients Directory**: View patients associated with the hospital.
- **Blood Donation & Settings**: Same as patients.
- **Profile**: Update hospital details, description, image, contact info, and specialties.

---

### 🛡️ Super Admin Features

- **Admin Dashboard**: View all hospitals and doctors in tabular format.
- **Hospital Management**: Add new hospitals and monitor admin accounts.

---

## ⚙️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Real-time Communication**: Socket.IO
- **Deployment**: Vercel (frontend), Render(backend)

---

## 📦 Project Structure

hashcure/
├── frontend/ # React frontend
│ ├── pages/
│ ├── components/
│ ├── services/
│ └── ...
├── backend/ # Node + Express backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── ...
└── README.md

---

## 🛠️ Key Functionalities

- Role-based dashboards and access control.
- Dynamic calendar-based appointment booking with availability grid.
- Real-time notifications and video upload management for doctors.
- Medical reports with graphical insights and file management.
- Integrated blood donation registry with smart donor filters.
- YouTube integration for doctors to educate patients.
- Feedback system for both doctors and hospitals.

---

## 🚀 Getting Started

### Installation

```
git clone https://github.com/Alvin0305/hashcure.git
cd hashcure

# Setup backend
cd backend
npm install

# Setup frontend
cd ../frontend
npm install
Run Locally
bash
Copy
Edit
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start

🧪 Future Improvements
Theme switching and dark mode.

Email/OTP notifications.

Video calling using WebRTC.

Admin analytics dashboard.

🧑‍💻 Author
[Alvin A S] – Full-stack developer
🔗 LinkedIn
📫 Email: alvinanildas@gmail.com

---
