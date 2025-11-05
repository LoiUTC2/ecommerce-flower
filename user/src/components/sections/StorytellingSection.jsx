import { Sparkles } from 'lucide-react';

export default function StorytellingSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/30" id="story" data-testid="storytelling-section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560453497-fdcb351a0c55?w=800&q=80"
                  alt="Florist arranging flowers"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-200 rounded-full -z-10 blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-rose-200 rounded-full -z-10 blur-2xl"></div>
              
              {/* Stats Card */}
              <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className="max-w-xl">
              <div className="inline-block mb-4">
                <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ Câu Chuyện Của Chúng Tôi
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6" data-testid="story-title">
                Tạo Nên <span className="text-pink-500">Kỷ Niệm</span>
                <br />
                Từ Những Bó Hoa
              </h2>
              
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed" data-testid="story-content">
                <p>
                  <strong className="text-pink-600">Kỳ Lân Fresh Flower</strong> ra đời với sứ mệnh mang đến những bó hoa tươi thắm nhất, được chăm sóc tỉ mỉ bởi đội ngũ nghệ nhân hoa giàu kinh nghiệm.
                </p>
                <p>
                  Chúng tôi hiểu rằng mỗi bó hoa không chỉ là món quà, mà còn là cách bạn thể hiện tình cảm, gửi gắm yêu thương đến người thân yêu. Vì vậy, chúng tôi luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng đầu.
                </p>
                <p>
                  Từ việc lựa chọn hoa tươi nhập khẩu, thiết kế bó hoa theo phong cách hiện đại đến dịch vụ giao hàng nhanh chóng - mọi chi tiết đều được chúng tôi chăm chút để mang lại trải nghiệm tốt nhất cho bạn.
                </p>
              </div>

              {/* Key Points */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { number: '15+', label: 'Năm kinh nghiệm' },
                  { number: '50K+', label: 'Đơn hàng thành công' },
                  { number: '100%', label: 'Hoa tươi nhập khẩu' },
                  { number: '24/7', label: 'Hỗ trợ khách hàng' },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md" data-testid={`stat-${index}`}>
                    <div className="text-3xl font-bold text-pink-500">{stat.number}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button className="mt-8 bg-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2" data-testid="story-cta-button">
                Tìm hiểu thêm về chúng tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}