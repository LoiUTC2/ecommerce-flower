import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail", // có thể thay bằng outlook, mailtrap, v.v.
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
    secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// export const transporter = nodemailer.createTransport({
//     service: "gmail", // có thể thay bằng outlook, mailtrap, v.v.
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });