import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
  throw new Error(
    'Missing SMTP configuration. Please set SMTP_HOST, SMTP_USER, SMTP_PASSWORD and SMTP_FROM in .env',
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT ? Number(SMTP_PORT) : 587,
  secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
  });
  return info;
};
