import React from 'react';
import { Truck, Gift, Percent, Clock } from 'lucide-react';

const PromoSection = () => {
    const promos = [
        {
            icon: <Truck className="h-8 w-8" />,
            title: 'Miễn Phí Giao Hàng',
            description: 'Đơn hàng từ 500.000đ',
            bgColor: 'from-blue-500 to-blue-600',
        },
        {
            icon: <Gift className="h-8 w-8" />,
            title: 'Tặng Thiệp Miễn Phí',
            description: 'Cùng lời nhắn ý nghĩa',
            bgColor: 'from-pink-500 to-pink-600',
        },
        {
            icon: <Percent className="h-8 w-8" />,
            title: 'Giảm 15%',
            description: 'Đơn hàng đầu tiên',
            bgColor: 'from-green-500 to-green-600',
        },
        {
            icon: <Clock className="h-8 w-8" />,
            title: 'Giao Hàng 2 Giờ',
            description: 'Trong nội thành',
            bgColor: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <section className="py-12 bg-white" data-testid="promo-section">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promos.map((promo, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer"
                            data-testid={`promo-${index}`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${promo.bgColor} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

                            {/* Content */}
                            <div className="relative z-10 flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                                    {promo.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                                    <p className="text-sm text-white/90">{promo.description}</p>
                                </div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoSection;