import nodemailer from "nodemailer";

/**
 * Gợi ý: sử dụng dịch vụ gửi mail chuyên nghiệp (SendGrid/Resend/Mailgun) ở production.
 * Hồ sơ demo dùng SMTP (Gmail SMTP example). Nếu dùng Gmail, bạn cần App password (nếu bật 2FA).
 */

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
    secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

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
