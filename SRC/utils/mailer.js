import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  return await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@eventos.com",
    to,
    subject,
    text,
    html,
  });
};
