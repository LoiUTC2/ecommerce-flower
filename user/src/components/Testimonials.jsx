import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Thị Hương',
            role: 'Khách hàng thân thiết',
            image: 'https://images.unsplash.com/photo-1622537537123-8e423ed5e2f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxoYXBweSUyMGN1c3RvbWVyJTIwZmxvd2Vyc3xlbnwwfHx8fDE3NjE4ODg1NjN8MA&ixlib=rb-4.1.0&q=85',
            content: 'Hoa rất tươi và đẹp, giao hàng đúng giờ hẹn. Tôi đã đặt hoa cho sinh nhật vợ và cô ấy rất hài lòng! Sẽ tiếp tục ủng hộ shop.',
            rating: 5,
        },
        {
            id: 2,
            name: 'Trần Minh Tuấn',
            role: 'Khách hàng doanh nghiệp',
            image: 'https://images.pexels.com/photos/5414055/pexels-photo-5414055.jpeg',
            content: 'Chất lượng hoa cao cấp, thiết kế sang trọng. Đã đặt nhiều lẵng hoa khai trường cho công ty, khách hàng của tôi đều rất hài lòng.',
            rating: 5,
        },
        {
            id: 3,
            name: 'Phạm Thu Trang',
            role: 'Khách hàng mới',
            image: 'https://images.pexels.com/photos/5409702/pexels-photo-5409702.jpeg',
            content: 'Lần đầu đặt hoa online và rất hài lòng. Nhân viên tư vấn nhiệt tình, giúp tôi chọn được bó hoa ý nghĩa cho ngày kỷ niệm.',
            rating: 5,
        },
        {
            id: 4,
            name: 'Lê Văn Hùng',
            role: 'Khách hàng thân thiết',
            image: 'https://images.unsplash.com/photo-1622537537123-8e423ed5e2f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxoYXBweSUyMGN1c3RvbWVyJTIwZmxvd2Vyc3xlbnwwfHx8fDE3NjE4ODg1NjN8MA&ixlib=rb-4.1.0&q=85',
            content: 'Dịch vụ xuất sắc! Hoa luôn tươi và giữ được lâu. Giá cả hợp lý so với chất lượng. Highly recommended!',
            rating: 5,
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-amber-50" data-testid="testimonials-section">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        Khách Hàng Nói Gì Về Chúng Tôi
                    </h2>
                    <p className="text-lg text-gray-600">
                        Hàng ngàn khách hàng hài lòng và tin tưởng sử dụng dịch vụ của chúng tôi
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-6xl mx-auto">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            {/* Quote Icon */}
                                            <div className="mb-4">
                                                <Quote className="h-10 w-10 text-amber-300" />
                                            </div>

                                            {/* Rating */}
                                            <div className="flex space-x-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>

                                            {/* Content */}
                                            <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                                                "{testimonial.content}"
                                            </p>

                                            {/* Customer Info */}
                                            <div className="flex items-center space-x-4 pt-4 border-t">
                                                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-12 bg-white shadow-lg" />
                        <CarouselNext className="-right-12 bg-white shadow-lg" />
                    </Carousel>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                    {[
                        { number: '10,000+', label: 'Đơn hàng thành công' },
                        { number: '8,500+', label: 'Khách hàng hài lòng' },
                        { number: '4.9/5', label: 'Đánh giá trung bình' },
                        { number: '15+', label: 'Năm kinh nghiệm' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-md">
                            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;