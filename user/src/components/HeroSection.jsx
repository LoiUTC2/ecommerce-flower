import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden" data-testid="hero-section">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1560113405-0c86fcd406ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmbG93ZXIlMjBib3VxdWV0fGVufDB8fHx8MTc2MTg4ODQ0NXww&ixlib=rb-4.1.0&q=85"
                    alt="Luxury Flower Bouquet"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span className="text-sm font-medium">Shop Hoa Cao Cấp #1 Việt Nam</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight" data-testid="hero-headline">
                        Gửi Trọn Yêu Thương
                        <br />
                        <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                            Bằng Ngôn Ngữ Của Hoa
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                        Mỗi bông hoa là một lời nhắn nhủ yêu thương. Khám phá bộ sưu tập hoa tươi cao cấp, được tuyển chọn và thiết kế bởi nghệ nhân tài hoa hàng đầu.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white rounded-full shadow-2xl p-2 flex items-center max-w-xl" data-testid="hero-search">
                        <Search className="h-5 w-5 text-gray-400 ml-4" />
                        <Input
                            type="search"
                            placeholder="Bạn muốn tìm loại hoa gì?"
                            className="border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
                        />
                        <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-full px-6">
                            Tìm kiếm
                        </Button>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                            data-testid="cta-explore"
                        >
                            Khám phá Bộ sưu tập
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-gray-900 rounded-full px-8 transition-all"
                            data-testid="cta-shop-now"
                        >
                            Mua Ngay
                        </Button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-8 pt-8 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <span>Hoa tươi 100%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <span>Giao hàng 2h</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <span>Đổi trả dễ dàng</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white/70 rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;