import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Thị Lan Anh',
    role: 'Khách hàng thường xuyên',
    content: 'Hoa rất tươi và đẹp, giao hàng đúng giờ. Tôi đã đặt hoa ở đây nhiều lần và luôn hài lòng. Thiết kế bó hoa rất tinh tế và sang trọng. Chắc chắn sẽ tiếp tục ủng hộ!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 2,
    name: 'Trần Minh Hoàng',
    role: 'Khách hàng doanh nghiệp',
    content: 'Dịch vụ chuyên nghiệp, nhân viên tư vấn nhiệt tình. Tôi thường xuyên đặt hoa khai trương cho khách hàng và luôn nhận được phản hồi tích cực. Giá cả hợp lý, chất lượng xuất sắc!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 3,
    name: 'Phạm Thúy Linh',
    role: 'Khách hàng mới',
    content: 'Lần đầu đặt hoa online, tôi hơi lo lắng nhưng kết quả thật bất ngờ. Bó hoa đẹp hơn ảnh rất nhiều. Người nhận rất thích và gửi lời cảm ơn. Tuyệt vời!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 4,
    name: 'Lê Văn Tuấn',
    role: 'Khách hàng VIP',
    content: 'Chất lượng hoa luôn đảm bảo, giao hàng nhanh chóng. Đặc biệt thích dịch vụ tặng thiệp miễn phí, giúp tôi gửi tặng bạn gái thật ý nghĩa. Kỳ Lân Fresh Flower là sự lựa chọn số 1 của tôi!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=14',
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className="py-16 md:py-24 relative overflow-hidden" 
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/34489247/pexels-photo-34489247.jpeg?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      data-testid="testimonial-carousel"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-rose-800/85 to-pink-900/90"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4" data-testid="testimonial-title">
            Khách Hàng <span className="text-pink-200">Nói Gì</span>
          </h2>
          <p className="text-white/90 text-lg" data-testid="testimonial-description">
            Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="text-center">
              {/* Avatar */}
              <div className="mb-6">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-pink-100 shadow-lg"
                  data-testid="testimonial-avatar"
                />
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 italic" data-testid="testimonial-content">
                "{currentTestimonial.content}"
              </p>

              {/* Author */}
              <div>
                <h4 className="text-xl font-bold text-gray-900" data-testid="testimonial-author">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-500" data-testid="testimonial-role">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 bg-pink-100 hover:bg-pink-200 rounded-full transition-colors"
                data-testid="testimonial-prev-button"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-pink-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 bg-pink-100 hover:bg-pink-200 rounded-full transition-colors"
                data-testid="testimonial-next-button"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-pink-600" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-pink-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  data-testid={`testimonial-dot-${index}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}