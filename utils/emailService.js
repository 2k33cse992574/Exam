// backend/utils/emailService.js

const nodemailer = require("nodemailer");

const sendReportAlert = async ({ examName, centerName, description, media }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password only!
    },
  });

  const mailOptions = {
    from: `"EduGuard Reports" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🚨 New Report - ${examName}`,
    html: `
      <h2>New Report Submitted</h2>
      <p><strong>Exam:</strong> ${examName}</p>
      <p><strong>Center:</strong> ${centerName}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Media:</strong> <a href="http://localhost:5000/uploads/${media}" target="_blank">View File</a></p>
      <p><em>Submitted via EduGuard</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReportAlert;
