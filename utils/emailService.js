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
      ${
        media
          ? `<p><strong>Media:</strong> <a href="${process.env.BASE_URL}/uploads/${media}" target="_blank">View File</a></p>`
          : "<p><strong>Media:</strong> None</p>"
      }
      <p><em>Submitted via EduGuard</em></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReportAlert;
