import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOS,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `noreply@test.com`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const response = await transporter.sendMail(message);
  return response;
};

async function getJwtToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
}

export { sendEmail, getJwtToken };
