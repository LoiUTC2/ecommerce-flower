import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Hoa Sinh Nhật',
    description: 'Tươi vui, rực rỡ',
    image: 'https://images.unsplash.com/photo-1610599929507-fac366fb4252?w=800&q=80',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 2,
    name: 'Hoa Tình Yêu',
    description: 'Lãng mạn, ngọt ngào',
    image: 'https://images.unsplash.com/photo-1708919167296-25eabf8e093d?w=800&q=80',
    color: 'from-red-400 to-pink-500',
  },
  {
    id: 3,
    name: 'Hoa Khai Trương',
    description: 'Sang trọng, thịnh vượng',
    image: 'https://images.pexels.com/photos/2504980/pexels-photo-2504980.jpeg?w=800&q=80',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: 4,
    name: 'Hoa Chia Buồn',
    description: 'Trang nhã, chân thành',
    image: 'https://images.unsplash.com/photo-1547098842-dcdd773e3390?w=800&q=80',
    color: 'from-blue-400 to-cyan-400',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/30" id="categories" data-testid="featured-categories">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4" data-testid="categories-title">
            Hoa Theo <span className="text-pink-500">Chủ Đề</span>
          </h2>
          <p className="text-gray-600 text-lg" data-testid="categories-description">
            Khám phá bộ sưu tập hoa phù hợp cho mọi dịp đặc biệt trong cuộc sống
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              data-testid={`category-card-${index}`}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${category.color} mb-3`}>
                  {category.description}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2" data-testid={`category-name-${index}`}>
                  {category.name}
                </h3>
                <button className="flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition-all" data-testid={`category-button-${index}`}>
                  Khám phá ngay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-pink-500 text-pink-500 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl" data-testid="view-all-categories-button">
            Xem tất cả danh mục
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}