// Basic inline CSS for email. Keep styles inline-friendly.
const baseStyles = `
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; }
  .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
  .hero { padding:28px 24px; text-align:center; background: linear-gradient(90deg,#ffecd2,#fcb69f); }
  .logo { width:80px; height:80px; object-fit:contain; margin:0 auto 8px; }
  .title { font-size:20px; margin:0; color:#111827; font-weight:700; }
  .subtitle { font-size:14px; color:#374151; margin-top:6px; }
  .content { padding:22px 24px; color:#374151; line-height:1.6; }
  .btn { display:inline-block; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; }
  .btn-primary { background:#ef4444; color:#fff; }
  .muted { color:#6b7280; font-size:13px; }
  .footer { padding:18px 24px; font-size:13px; color:#9ca3af; text-align:center; }
`;

/**
 * Build Verify Email HTML
 * @param {Object} params
 * @param {string} params.fullName
 * @param {string} params.verifyUrl
 * @param {string} params.logoUrl - optional
 */
export function buildVerifyEmailHtml({ fullName = "Bạn", verifyUrl, logoUrl }) {
    const safeName = fullName || "Bạn";
    const logo = logoUrl || "https://cdn-icons-png.flaticon.com/512/3542/3542406.png"; // placeholder

    const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>${baseStyles}</style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding:24px;">
            <div class="container" role="article" aria-roledescription="email">
              <div class="hero">
                <img class="logo" src="${logo}" alt="Flower Shop" />
                <h1 class="title">Xác thực email của bạn</h1>
                <p class="subtitle">Cảm ơn bạn đã đăng ký Flower Shop 🌸</p>
              </div>

              <div class="content">
                <p>Xin chào <strong>${escapeHtml(safeName)}</strong>,</p>

                <p>
                  Cảm ơn bạn đã tạo tài khoản tại <strong>Flower Shop</strong>. 
                  Vui lòng nhấn nút bên dưới để xác minh địa chỉ email và hoàn tất đăng ký.
                </p>

                <div style="text-align:center; margin:20px 0;">
                  <a href="${verifyUrl}" class="btn btn-primary" target="_blank" rel="noopener">Xác thực email</a>
                </div>

                <p class="muted">
                  Nếu nút trên không hoạt động, sao chép và dán đường dẫn dưới đây vào trình duyệt:
                </p>
                <p class="muted" style="word-break:break-all;"><a href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a></p>

                <hr style="border:none;border-top:1px solid #eef2f7; margin:18px 0;" />

                <p class="muted">Nếu bạn không đăng ký tài khoản này, bạn có thể bỏ qua email này.</p>
              </div>

              <div class="footer">
                © ${new Date().getFullYear()} Flower Shop — Gửi từ đội ngũ của chúng tôi.
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
    return html;
}

/**
 * Build Reset Password HTML
 * @param {Object} params
 * @param {string} params.fullName
 * @param {string} params.resetUrl
 * @param {string} params.logoUrl - optional
 */
export function buildResetPasswordHtml({ fullName = "Bạn", resetUrl, logoUrl }) {
    const safeName = fullName || "Bạn";
    const logo = logoUrl || "https://cdn-icons-png.flaticon.com/512/3542/3542406.png";

    const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>${baseStyles}</style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding:24px;">
            <div class="container" role="article" aria-roledescription="email">
              <div class="hero">
                <img class="logo" src="${logo}" alt="Flower Shop" />
                <h1 class="title">Khôi phục mật khẩu</h1>
                <p class="subtitle">Yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
              </div>

              <div class="content">
                <p>Xin chào <strong>${escapeHtml(safeName)}</strong>,</p>

                <p>
                  Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
                  Nhấn nút bên dưới để tạo mật khẩu mới. Link chỉ có hiệu lực trong 15 phút.
                </p>

                <div style="text-align:center; margin:20px 0;">
                  <a href="${resetUrl}" class="btn btn-primary" target="_blank" rel="noopener">Đặt mật khẩu mới</a>
                </div>

                <p class="muted">
                  Nếu bạn không yêu cầu việc này, hãy bỏ qua email này — tài khoản của bạn vẫn an toàn.
                </p>

                <p class="muted">Nếu nút trên không hoạt động, sao chép đường dẫn sau vào trình duyệt:</p>
                <p class="muted" style="word-break:break-all;"><a href="${resetUrl}" target="_blank" rel="noopener">${resetUrl}</a></p>
              </div>

              <div class="footer">
                © ${new Date().getFullYear()} Flower Shop — Bạn cần hỗ trợ? Trả lời email này.
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
    return html;
}

/**
 * Plain text fallbacks
 */
export function buildVerifyEmailText({ fullName = "Bạn", verifyUrl }) {
    return `Xin chào ${fullName},

Cảm ơn bạn đã đăng ký tại Flower Shop. Vui lòng xác thực email bằng cách truy cập đường dẫn:

${verifyUrl}

Nếu bạn không đăng ký tài khoản này, bỏ qua email này.
`;
}

export function buildResetPasswordText({ fullName = "Bạn", resetUrl }) {
    return `Xin chào ${fullName},

Chúng tôi nhận được yêu cầu đặt lại mật khẩu. Vui lòng truy cập:

${resetUrl}

Link chỉ có hiệu lực trong 15 phút.
Nếu bạn không yêu cầu, bỏ qua email này.
`;
}

/** Utility: small HTML escape to avoid injection if name contains chars */
function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
}
