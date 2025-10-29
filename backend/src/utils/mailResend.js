
// Đẩy lên production mới dùng
import { Resend } from 'resend';
import { 
    buildVerifyEmailHtml, 
    buildVerifyEmailText, 
    buildResetPasswordHtml, 
    buildResetPasswordText 
} from './mailTemplates.js';

// Khởi tạo Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email gửi đi (đã verify domain hoặc dùng mặc định)
const FROM_EMAIL = process.env.MAIL_FROM_RESEND || 'Flower Shop <onboarding@resend.dev>';

/**
 * Gửi email xác thực đăng ký
 */
export async function sendVerifyEmail({ to, fullName, verifyUrl, logoUrl }) {
    try {
        const html = buildVerifyEmailHtml({ fullName, verifyUrl, logoUrl });
        const text = buildVerifyEmailText({ fullName, verifyUrl });

        console.log(`📧 [Resend] Sending verify email to: ${to}`);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: 'Xác thực email — Flower Shop',
            html: html,
            text: text,
        });

        console.log(`✅ [Resend] Email sent successfully:`, data);
        return data;
    } catch (error) {
        console.error(`❌ [Resend] Failed to send verify email to ${to}:`, error);
        throw error;
    }
}

/**
 * Gửi email đặt lại mật khẩu
 */
export async function sendResetPasswordEmail({ to, fullName, resetUrl, logoUrl }) {
    try {
        const html = buildResetPasswordHtml({ fullName, resetUrl, logoUrl });
        const text = buildResetPasswordText({ fullName, resetUrl });

        console.log(`📧 [Resend] Sending reset password email to: ${to}`);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: 'Đặt lại mật khẩu — Flower Shop',
            html: html,
            text: text,
        });

        console.log(`✅ [Resend] Password reset email sent:`, data);
        return data;
    } catch (error) {
        console.error(`❌ [Resend] Failed to send reset email to ${to}:`, error);
        throw error;
    }
}

/**
 * Gửi email tùy chỉnh
 */
export async function sendCustomEmail({ to, subject, html, text }) {
    try {
        console.log(`📧 [Resend] Sending custom email to: ${to}`);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
            text: text || '',
        });

        console.log(`✅ [Resend] Custom email sent:`, data);
        return data;
    } catch (error) {
        console.error(`❌ [Resend] Failed to send custom email:`, error);
        throw error;
    }
}