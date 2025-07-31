"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("./errorHelpers/AppError"));
const transporter = nodemailer_1.default.createTransport({
    // port: envVars.EMAIL_SENDER.SMTP_PORT,
    secure: true,
    auth: {
        user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
        pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT),
    host: env_1.envVars.EMAIL_SENDER.SMTP_HOST,
});
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
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateData, attachments, }) {
    try {
        // Verify connection first
        yield new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.log("SMTP connection error:", error);
                    reject(error);
                }
                else {
                    console.log("✅ SMTP server is ready to take our messages");
                    resolve(success);
                }
            });
        });
        // Render template
        const templatePath = path_1.default.join(__dirname, `templates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        // Send email with promise
        const info = yield new Promise((resolve, reject) => {
            transporter.sendMail({
                from: env_1.envVars.EMAIL_SENDER.SMTP_FROM,
                to: to,
                subject: subject,
                html: html,
                attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment) => ({
                    filename: attachment.filename,
                    content: attachment.content,
                    contentType: attachment.contentType,
                })),
            }, (error, info) => {
                if (error) {
                    console.error("Email sending error:", error);
                    reject(error);
                }
                else {
                    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
                    resolve(info);
                }
            });
        });
        return info;
    }
    catch (error) {
        console.log("Email sending error:", error.message);
        throw new AppError_1.default(500, `Email sending failed: ${error.message}`);
    }
});
exports.sendEmail = sendEmail;
