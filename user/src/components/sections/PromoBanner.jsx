import { Truck, Gift, Clock, Shield } from 'lucide-react';

export default function PromoBanner() {
  const features = [
    {
      icon: Truck,
      title: 'Miễn Phí Giao Hàng',
      description: 'Đơn hàng từ 500k',
    },
    {
      icon: Clock,
      title: 'Giao Hàng Nhanh 2H',
      description: 'Nội thành Hà Nội & TP.HCM',
    },
    {
      icon: Gift,
      title: 'Tặng Thiệp Miễn Phí',
      description: 'Viết lời nhắn theo yêu cầu',
    },
    {
      icon: Shield,
      title: 'Đảm Bảo Chất Lượng',
      description: 'Hoa tươi 100%, hoàn tiền nếu không hài lòng',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 relative overflow-hidden" data-testid="promo-banner">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Promo */}
        <div className="text-center mb-12 text-white">
          <div className="inline-block mb-4">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              🎉 ƯU ĐÃI ĐẶC BIỆT
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4" data-testid="promo-title">
            Giảm Đến 30% Cho Đơn Hàng Đầu Tiên
          </h2>
          <p className="text-xl text-white/90 mb-6" data-testid="promo-description">
            Sử dụng mã: <span className="font-bold bg-white/20 px-4 py-2 rounded-lg">KYLANHOA30</span>
          </p>
          <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105" data-testid="promo-cta-button">
            Mua Sắm Ngay
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white text-center hover:bg-white/20 transition-all duration-300 border border-white/20"
                data-testid={`feature-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/80" data-testid={`feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}