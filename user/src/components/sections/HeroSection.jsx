import { Search, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden" data-testid="hero-section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1613777698699-f131d81a56f6?w=1920&q=80"
          alt="Beautiful flower arrangement"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white space-y-6">
          <div className="inline-block">
            <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Giảm 20% cho đơn hàng đầu tiên
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight" data-testid="hero-title">
            Gửi Trọn Yêu Thương
            <br />
            <span className="text-pink-300">Bằng Ngôn Ngữ Của Hoa</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-xl" data-testid="hero-description">
            Những bó hoa tươi thắm được thiết kế tỉ mỉ, giao tận nơi trong 2 giờ. 
            Biến mỗi khoảnh khắc thành kỷ niệm đáng nhớ.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm hoa sinh nhật, khai trương, tình yêu..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg"
                data-testid="hero-search-input"
              />
            </div>
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2" data-testid="hero-search-button">
              Tìm kiếm
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-300 text-sm">Xu hướng:</span>
            {['Hoa Hồng', 'Hoa Tulip', 'Hoa Sinh nhật', 'Hoa Khai trương'].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-sm border border-white/30 transition-all"
                data-testid={`hero-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}