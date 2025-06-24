import { jsPDF } from "jspdf";

export const getYoutubeEmbedLink = (url) => {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  return `https://www.youtube.com/embed/${videoId}`;
};

export const convertToEmbedUrl = (url) => {
  try {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    const shortYoutubeRegex = /(?:https?:\/\/)?youtu\.be\/([\w-]+)/;
    const matchShort = url.match(shortYoutubeRegex);
    if (matchShort && matchShort[1]) {
      return `https://www.youtube.com/embed/${matchShort[1]}`;
    }

    return null; // or the original URL
  } catch {
    return null;
  }
};

export const generateAppointmentPDF = (appointment) => {
  const doc = new jsPDF();

  let xLeft = 20;
  let xRight = 130;
  let y = 20;
  const lineHeight = 10;

  doc.setFontSize(12);

  doc.text(appointment.doctor_name, xLeft, y);
  y += lineHeight;
  doc.text(new Date(appointment.time).toDateString(), xLeft, y);
  y += lineHeight;
  doc.text(appointment.hospital_name, xLeft, y);

  let yRight = 20;
  doc.text(`Rs. ${appointment.fees}`, xRight, yRight);
  yRight += lineHeight;
  doc.text(
    new Date(appointment.time).toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    xRight,
    yRight
  );

  y += lineHeight * 2;

  doc.setFontSize(14);
  doc.text("Chief Complaint", xLeft, y);
  y += lineHeight;
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(appointment.chief_complaint, 170), xLeft, y);
  y +=
    lineHeight * Math.ceil((appointment.chief_complaint?.length ?? 0) / 90) + 5;

  doc.setFontSize(14);
  doc.text("Diagnosis", xLeft, y);
  y += lineHeight;
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(appointment.diagnosis, 170), xLeft, y);
  y += lineHeight * Math.ceil((appointment.diagnosis?.length ?? 0) / 90) + 5;

  doc.setFontSize(14);
  doc.text("Treatment Plan", xLeft, y);
  y += lineHeight;
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(appointment.treatment_plan, 170), xLeft, y);

  doc.save(
    `Appointment-${new Date(appointment.time).toLocaleString("default", {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`
  );
};
