/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "./errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  // port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST,
});

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

// export const sendEmail = async ({
//   to,
//   subject,
//   templateName,
//   templateData,
//   attachments,
// }: SendEmailOptions) => {
//   try {
//     const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
//     const html = await ejs.renderFile(templatePath, templateData);
//     const info = await transporter.sendMail({
//       from: envVars.EMAIL_SENDER.SMTP_FROM,
//       to: to,
//       subject: subject,
//       html: html,
//       attachments: attachments?.map((attachment) => ({
//         filename: attachment.filename,
//         content: attachment.content,
//         contentType: attachment.contentType,
//       })),
//     });
//     console.log(`\u2709\uFE0F  Email sent to ${to}: ${info.messageId}`);
//   } catch (error: any) {
//     console.log("email sending error", error.message);
//     throw new AppError(401, "Email error");
//   }
// };

// for vercel
export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    // Verify connection first
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP connection error:", error);
          reject(error);
        } else {
          console.log("✅ SMTP server is ready to take our messages");
          resolve(success);
        }
      });
    });

    // Render template
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    // Send email with promise
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: envVars.EMAIL_SENDER.SMTP_FROM,
          to: to,
          subject: subject,
          html: html,
          attachments: attachments?.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType,
          })),
        },
        (error, info) => {
          if (error) {
            console.error("Email sending error:", error);
            reject(error);
          } else {
            console.log(`📧 Email sent to ${to}: ${info.messageId}`);
            resolve(info);
          }
        }
      );
    });

    return info;
  } catch (error: any) {
    console.log("Email sending error:", error.message);
    throw new AppError(500, `Email sending failed: ${error.message}`);
  }
};
