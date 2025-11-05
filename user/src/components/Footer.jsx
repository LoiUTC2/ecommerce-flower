import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white" data-testid="footer">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">
                            🌸 Đăng Ký Nhận Khuyến Mãi
                        </h3>
                        <p className="text-white/90 mb-6">
                            Nhận ngay mã giảm giá 15% cho đơn hàng đầu tiên và cập nhật ưu đãi mới nhất
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" data-testid="newsletter-form">
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                className="flex-1 bg-white text-gray-900 border-0 h-12 rounded-full"
                            />
                            <Button
                                size="lg"
                                className="bg-gray-900 hover:bg-black text-white rounded-full px-8"
                                data-testid="newsletter-submit"
                            >
                                Đăng ký ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-3xl">🦄</div>
                            <h3 className="text-xl font-bold">Kỳ Lân Fresh Flower</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Shop hoa cao cấp hàng đầu Việt Nam, mang đến những bó hoa tươi đẹp nhất cho mọi dịp đặc biệt trong cuộc sống.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <Button size="icon" variant="ghost" className="hover:bg-amber-600 rounded-full">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:bg-amber-600 rounded-full">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:bg-amber-600 rounded-full">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="hover:bg-amber-600 rounded-full">
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Liên Kết Nhanh</h4>
                        <ul className="space-y-3">
                            {[
                                'Về chúng tôi',
                                'Hoa theo chủ đề',
                                'Bộ sưu tập',
                                'Tự thiết kế',
                                'Blog hoa',
                                'Liên hệ',
                            ].map((link, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-3">
                            {[
                                'Hướng dẫn đặt hàng',
                                'Chính sách giao hàng',
                                'Chính sách đổi trả',
                                'Hướng dẫn bảo quản hoa',
                                'Câu hỏi thường gặp',
                                'Chính sách bảo mật',
                            ].map((link, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Liên Hệ</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                                <span className="text-gray-400">
                                    123 Đường Nguyễn Huệ, Quận 1, TP.HCM
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                <a href="tel:0123456789" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    0123 456 789
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                <a href="mailto:info@kylanflower.vn" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    info@kylanflower.vn
                                </a>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <h5 className="font-semibold mb-3">Phương thức thanh toán</h5>
                            <div className="flex flex-wrap gap-2">
                                {['VISA', 'MASTER', 'MOMO', 'VNPAY', 'COD'].map((method) => (
                                    <div
                                        key={method}
                                        className="bg-white/10 px-3 py-1 rounded text-xs font-semibold"
                                    >
                                        {method}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © 2025 Kỳ Lân Fresh Flower. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                Điều khoản sử dụng
                            </a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;