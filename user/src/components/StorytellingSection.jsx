import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const StorytellingSection = () => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-white" data-testid="storytelling-section">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <div className="relative" data-aos="fade-right">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1595549269082-bdf7ac28b345?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxmbG9yaXN0JTIwYXJyYW5naW5nJTIwZmxvd2Vyc3xlbnwwfHx8fDE3NjE4ODg0NTB8MA&ixlib=rb-4.1.0&q=85"
                                alt="Florist arranging flowers"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-amber-600 mb-1">15+</div>
                                <div className="text-sm text-gray-600 font-medium">Năm kinh nghiệm</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-6" data-aos="fade-left">
                        <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                            🌺 Câu Chuyện Của Chúng Tôi
                        </div>

                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                            Tận Tâm Với
                            <br />
                            <span className="text-amber-600">Từng Bông Hoa</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Tại <span className="font-bold text-amber-600">Kỳ Lân Fresh Flower</span>, mỗi bó hoa không chỉ là một sản phẩm mà còn là một tác phẩm nghệ thuật. Với đội ngũ nghệ nhân có nhiều năm kinh nghiệm, chúng tôi tuyển chọn những bông hoa tươi nhất, đẹp nhất từ các vườn hoa uy tín.
                        </p>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Chúng tôi tin rằng mỗi dịp quan trọng trong cuộc đời đều xứng đáng được chào đón bằng những bông hoa đẹp nhất. Từ sinh nhật, đám cưới, khai trường cho đến những dịp kỷ niệm, chúng tôi luôn sẵn sàng tạo nên những bó hoa hoàn hảo cho bạn.
                        </p>

                        {/* Features List */}
                        <div className="space-y-3">
                            {[
                                'Hoa tươi 100% nhập khẩu và trong nước',
                                'Thiết kế độc đáo bởi nghệ nhân chuyên nghiệp',
                                'Giao hàng nhanh chóng, đúng hẹn',
                                'Chăm sóc khách hàng tận tâm 24/7',
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full px-8"
                                data-testid="about-us-cta"
                            >
                                Tìm hiểu thêm về chúng tôi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StorytellingSection;