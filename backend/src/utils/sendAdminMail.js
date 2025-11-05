import { transporter } from "../config/mail.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(s => s.trim()).filter(Boolean) : [];

export const sendMailToAdmins = async ({ subject, html }) => {
    // 1) Lấy danh sách email từ DB (nếu có admin trong DB)
    let adminEmailsFromDb = [];
    try {
        const admins = await User.find({ role: "admin", isActive: true }).select("email -_id");
        adminEmailsFromDb = admins.map(a => a.email).filter(Boolean);
    } catch (err) {
        console.error("Failed to fetch admins from DB:", err.message);
    }

    // 2) Kết hợp email từ env và DB, loại trùng
    const recipients = Array.from(new Set([...ADMIN_EMAILS, ...adminEmailsFromDb]));

    if (!recipients.length) {
        console.warn("No admin emails configured (ADMIN_EMAILS or admin users in DB). Skipping admin notification.");
        return;
    }

    // 3) Gửi email cho từng admin (non-blocking best-effort)
    const sendPromises = recipients.map((to) =>
        transporter.sendMail({
            from: `"${process.env.SHOP_NAME || "Shop"}" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        }).then(info => {
            console.log(`Admin notification sent to ${to}: ${info.messageId || "ok"}`);
        }).catch(err => {
            console.error(`Failed to send admin notification to ${to}:`, err.message);
        })
    );

    // Không bắt buộc await tất cả — nhưng bạn có thể await nếu muốn đảm bảo gửi trước trả về kết quả.
    // Ở đây ta `await` để log lỗi nếu muốn, nhưng vẫn xử lý an toàn:
    try {
        await Promise.all(sendPromises);
    } catch (err) {
        // các lỗi đã được bắt trong mỗi promise, ở đây chỉ phòng hờ
        console.error("One or more admin notification sends failed.");
    }
};
