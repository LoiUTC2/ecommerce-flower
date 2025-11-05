import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const BestSellingProducts = () => {
    const products = [
        {
            id: 1,
            name: 'Bó Hoa Hồng Pastel Mộng Mơ',
            price: '850.000',
            originalPrice: '1.200.000',
            image: 'https://images.unsplash.com/photo-1572454591674-2739f30d8c40',
            rating: 4.9,
            reviews: 128,
            badge: 'Bán chạy',
        },
        {
            id: 2,
            name: 'Hoa Hồng Đỏ Trắng Sang Trọng',
            price: '950.000',
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1599791095997-5cf38bb5ff69',
            rating: 5.0,
            reviews: 256,
            badge: 'Cao cấp',
        },
        {
            id: 3,
            name: 'Tulip Hồng Thanh Lịch',
            price: '680.000',
            originalPrice: '890.000',
            image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364',
            rating: 4.8,
            reviews: 89,
            badge: 'Giảm giá',
        },
        {
            id: 4,
            name: 'Hoa Hồng Phấn Nữ Tính',
            price: '720.000',
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1615182787503-08365d1e7fae',
            rating: 4.7,
            reviews: 145,
            badge: 'Mới',
        },
        {
            id: 5,
            name: 'Tulip Đỏ Tình Yêu',
            price: '590.000',
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1615385639736-362b69696227',
            rating: 4.9,
            reviews: 203,
            badge: 'Hot',
        },
        {
            id: 6,
            name: 'Hoa Tím Trắng Thanh Nhã',
            price: '780.000',
            originalPrice: '950.000',
            image: 'https://images.pexels.com/photos/1488310/pexels-photo-1488310.jpeg',
            rating: 4.8,
            reviews: 167,
            badge: 'Giảm giá',
        },
        {
            id: 7,
            name: 'Bó Hoa Mix Sắc Màu',
            price: '820.000',
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1572454591674-2739f30d8c40',
            rating: 4.9,
            reviews: 198,
            badge: 'Bán chạy',
        },
        {
            id: 8,
            name: 'Lily Trắng Tinh Khôi',
            price: '890.000',
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364',
            rating: 5.0,
            reviews: 312,
            badge: 'Cao cấp',
        },
    ];

    const badgeColors = {
        'Bán chạy': 'bg-red-500',
        'Cao cấp': 'bg-amber-500',
        'Giảm giá': 'bg-green-500',
        'Mới': 'bg-blue-500',
        'Hot': 'bg-orange-500',
    };

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-amber-50/50" data-testid="best-selling-products">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        Sản Phẩm Bán Chạy
                    </h2>
                    <p className="text-lg text-gray-600">
                        Những bó hoa được yêu thích nhất, được khách hàng tin tưởng lựa chọn
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300"
                            data-testid={`product-${product.id}`}
                        >
                            <div className="relative overflow-hidden">
                                {/* Badge */}
                                <div className={`absolute top-3 left-3 ${badgeColors[product.badge]} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}>
                                    {product.badge}
                                </div>

                                {/* Wishlist Button */}
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white hover:bg-red-50"
                                    data-testid={`wishlist-product-${product.id}`}
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>

                                {/* Product Image */}
                                <div className="h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            <CardContent className="p-4">
                                {/* Rating */}
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                                    <span className="text-sm text-gray-500">({product.reviews})</span>
                                </div>

                                {/* Product Name */}
                                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                    {product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-bold text-amber-600">{product.price}đ</span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">{product.originalPrice}đ</span>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full"
                                    data-testid={`add-to-cart-${product.id}`}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Thêm vào giỏ
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-full px-8"
                        data-testid="view-all-products"
                    >
                        Xem tất cả sản phẩm
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default BestSellingProducts;