import nodemailer from "nodemailer";

const sendMail = async ({ to, subject, html }) => {
  // ✅ Create a transporter for Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, // Your real Gmail address
      pass: process.env.EMAIL_PASS, // The 16-digit App Password from your phone
    },
  });

  // ✅ Send the mail
  await transporter.sendMail({
    from: `"Raag-Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendMail;