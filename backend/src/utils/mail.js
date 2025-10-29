import nodemailer from "nodemailer";

/**
 * Gợi ý: sử dụng dịch vụ gửi mail chuyên nghiệp (SendGrid/Resend/Mailgun) ở production.
 * Hồ sơ demo dùng SMTP (Gmail SMTP example). Nếu dùng Gmail, bạn cần App password (nếu bật 2FA).
 */

import { buildVerifyEmailHtml, buildVerifyEmailText, buildResetPasswordHtml, buildResetPasswordText } from "./mailTemplates.js";


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
    secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export async function sendVerifyEmail({ to, fullName, verifyUrl, logoUrl }) {
    try {
        const html = buildVerifyEmailHtml({ fullName, verifyUrl, logoUrl });
        const text = buildVerifyEmailText({ fullName, verifyUrl });

        console.log(`📧 Attempting to send verify email to: ${to}`);

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to,
            subject: "Xác thực email — Flower Shop",
            text,
            html,
        });

        console.log(`✅ Email sent successfully: ${info.messageId}`);
        console.log(`📬 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

        return info;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        throw error; // Re-throw để caller xử lý
    }
}

export async function sendResetPasswordEmail({ to, fullName, resetUrl, logoUrl }) {
    try {
        const html = buildResetPasswordHtml({ fullName, resetUrl, logoUrl });
        const text = buildResetPasswordText({ fullName, resetUrl });

        console.log(`📧 Attempting to send reset password email to: ${to}`);

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to,
            subject: "Đặt lại mật khẩu — Flower Shop",
            text,
            html,
        });

        console.log(`✅ Password reset email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send reset email to ${to}:`, error);
        throw error;
    }
}

// Generic fallback
export async function sendCustomEmail({ to, subject, html, text }) {
    return transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject,
        text,
        html,
    });
}

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to,
            subject,
            text: text || "",
            html: html || "",
        });
        return info;
    } catch (error) {
        // undo or mark
        console.error("Mail error:", err);
        // Option: await User.findByIdAndDelete(user._id);
        return errorResponse(res, "Failed to send verification email. Try again later.", 500);
    }

};