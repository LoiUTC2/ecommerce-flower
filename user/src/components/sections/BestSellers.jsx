import { Heart, ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Bó Hoa Tổng Hợp Pastel',
    price: 450000,
    originalPrice: 550000,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1657426103794-a5937b9d916c?w=600&q=80',
    tag: 'Bán chạy',
    discount: '-18%',
  },
  {
    id: 2,
    name: 'Hoa Hồng Ecuador Cao Cấp',
    price: 850000,
    originalPrice: 0,
    rating: 5.0,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1657426057129-c7ae91d15623?w=600&q=80',
    tag: 'Premium',
  },
  {
    id: 3,
    name: 'Bó Hoa Dại Thảo Nguyên',
    price: 380000,
    originalPrice: 0,
    rating: 4.8,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1531120364508-a6b656c3e78d?w=600&q=80',
    tag: 'Mới',
  },
  {
    id: 4,
    name: 'Hoa Hồng Hồng Trong Lọ Thủy Tinh',
    price: 520000,
    originalPrice: 0,
    rating: 4.9,
    reviews: 183,
    image: 'https://images.unsplash.com/photo-1605116870516-adb617e9b287?w=600&q=80',
    tag: 'Yêu thích',
  },
  {
    id: 5,
    name: 'Bó Hoa Hồng Hỗn Hợp',
    price: 680000,
    originalPrice: 780000,
    rating: 4.7,
    reviews: 147,
    image: 'https://images.unsplash.com/photo-1552174965-c6616f62fc4f?w=600&q=80',
    tag: 'Giảm giá',
    discount: '-13%',
  },
  {
    id: 6,
    name: 'Bó Hoa Gói Giấy Kraft Vintage',
    price: 420000,
    originalPrice: 0,
    rating: 4.8,
    reviews: 215,
    image: 'https://images.pexels.com/photos/931176/pexels-photo-931176.jpeg?w=600&q=80',
    tag: 'Xu hướng',
  },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function BestSellers() {
  return (
    <section className="py-16 md:py-24 bg-white" id="bestsellers" data-testid="best-sellers">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4" data-testid="bestsellers-title">
            Sản Phẩm <span className="text-pink-500">Bán Chạy</span>
          </h2>
          <p className="text-gray-600 text-lg" data-testid="bestsellers-description">
            Những bó hoa được yêu thích nhất bởi khách hàng của chúng tôi
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              data-testid={`product-card-${index}`}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {product.tag}
                  </span>
                  {product.discount && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-pink-50 transition-colors" data-testid={`wishlist-button-${index}`} aria-label="Add to wishlist">
                    <Heart className="w-5 h-5 text-gray-700 hover:text-pink-500 transition-colors" />
                  </button>
                </div>

                {/* Quick Add to Cart */}
                <button className="absolute bottom-4 left-4 right-4 bg-pink-500 text-white py-3 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-600 flex items-center justify-center gap-2" data-testid={`quick-add-button-${index}`}>
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600" data-testid={`product-rating-${index}`}>
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors" data-testid={`product-name-${index}`}>
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-pink-600" data-testid={`product-price-${index}`}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" data-testid="view-all-products-button">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
}