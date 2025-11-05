import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300" id="footer" data-testid="footer">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4" data-testid="newsletter-title">
              Đăng Ký Nhận Khuyến Mãi
            </h3>
            <p className="text-gray-400 mb-6">
              Nhận ngay mã giảm giá 20% cho đơn hàng đầu tiên và cập nhật khuyến mãi mới nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-pink-500 text-white"
                data-testid="newsletter-input"
              />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2" data-testid="newsletter-submit">
                <Send className="w-5 h-5" />
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🦄</div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Kỳ Lân</h3>
                <p className="text-xs text-gray-400">Fresh Flower</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Mang đến những bó hoa tươi thắm, thiết kế tinh tế và ý nghĩa cho mọi khoảnh khắc đặc biệt của bạn.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'Youtube' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300"
                    data-testid={`social-${social.label.toLowerCase()}`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4" data-testid="footer-quicklinks-title">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2">
              {[
                'Về chúng tôi',
                'Sản phẩm',
                'Blog hoa',
                'Liên hệ',
                'Tuyển dụng',
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                    data-testid={`footer-link-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4" data-testid="footer-policies-title">
              Chính Sách
            </h4>
            <ul className="space-y-2">
              {[
                'Chính sách giao hàng',
                'Chính sách đổi trả',
                'Hướng dẫn bảo quản hoa',
                'Phương thức thanh toán',
                'Bảo mật thông tin',
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-pink-400 transition-colors"
                    data-testid={`footer-policy-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4" data-testid="footer-contact-title">
              Liên Hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Phố Hoa, Quận 1, TP.HCM
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <a href="tel:1900xxxx" className="text-gray-400 hover:text-pink-400 transition-colors block">
                    Hotline: 1900 xxxx
                  </a>
                  <a href="tel:0901234567" className="text-gray-400 hover:text-pink-400 transition-colors block">
                    Phone: 090 123 4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <a href="mailto:contact@kylanflower.com" className="text-gray-400 hover:text-pink-400 transition-colors">
                  contact@kylanflower.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  T2-CN: 8:00 - 22:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="text-white font-bold text-center mb-4" data-testid="footer-payment-title">
            Phương Thức Thanh Toán
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {['Visa', 'Mastercard', 'Momo', 'VNPay', 'ZaloPay', 'Tiền mặt'].map((method, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400 text-sm"
                data-testid={`payment-method-${index}`}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm" data-testid="footer-copyright">
            © {currentYear} Kỳ Lân Fresh Flower. All rights reserved. Made with ❤️ by Kỳ Lân Team
          </p>
        </div>
      </div>
    </footer>
  );
}