import nodemailer from 'nodemailer';
import { config } from './config.js';

export function createTransporter() {
  return nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: { user: config.mail.user, pass: config.mail.pass }
  });
}

export async function sendMail({ to, subject, html }) {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: config.mail.from,
    to,
    subject,
    html
  });
}

