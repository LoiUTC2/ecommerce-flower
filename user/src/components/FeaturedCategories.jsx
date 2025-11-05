import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FeaturedCategories = () => {
    const categories = [
        {
            id: 1,
            name: 'Hoa Sinh nhật',
            description: 'Mang niềm vui và sắc màu rực rỡ',
            image: 'https://images.unsplash.com/photo-1610599929507-fac366fb4252?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGZsb3dlcnN8ZW58MHx8fHwxNzYxODg4NDc0fDA&ixlib=rb-4.1.0&q=85',
            color: 'from-pink-500 to-rose-500',
            icon: '🎂',
        },
        {
            id: 2,
            name: 'Hoa Tình yêu',
            description: 'Thể hiện tình cảm chân thành và lãng mạn',
            image: 'https://images.unsplash.com/photo-1708919167296-25eabf8e093d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHJvc2VzfGVufDB8fHx8MTc2MTg4ODQ3OXww&ixlib=rb-4.1.0&q=85',
            color: 'from-red-500 to-pink-500',
            icon: '💕',
        },
        {
            id: 3,
            name: 'Hoa Khai trương',
            description: 'Chúc mừng thành công và thịnh vượng',
            image: 'https://images.unsplash.com/photo-1667858133290-2384d3f19b53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxlbGVnYW50JTIwZmxvd2VyJTIwYXJyYW5nZW1lbnR8ZW58MHx8fHwxNzYxODg4NDkxfDA&ixlib=rb-4.1.0&q=85',
            color: 'from-amber-500 to-yellow-500',
            icon: '🎉',
        },
        {
            id: 4,
            name: 'Hoa Chia buồn',
            description: 'Gửi lời chia buồn và tưởng nhớ',
            image: 'https://images.unsplash.com/photo-1624244626020-17f522073a56?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHx3aGl0ZSUyMGZsb3dlcnMlMjBzeW1wYXRoeXxlbnwwfHx8fDE3NjE4ODg0OTZ8MA&ixlib=rb-4.1.0&q=85',
            color: 'from-slate-500 to-gray-500',
            icon: '🕊️',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-white" id="categories" data-testid="featured-categories">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        Hoa Theo Chủ Đề
                    </h2>
                    <p className="text-lg text-gray-600">
                        Khám phá bộ sưu tập hoa được phân loại theo từng dịp đặc biệt
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            data-testid={`category-${category.id}`}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-40 group-hover:opacity-50 transition-opacity`}></div>
                                <div className="absolute top-4 right-4 text-4xl group-hover:scale-125 transition-transform">
                                    {category.icon}
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                                <div className="flex items-center text-amber-600 font-medium group-hover:translate-x-2 transition-transform">
                                    <span>Xem thêm</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;