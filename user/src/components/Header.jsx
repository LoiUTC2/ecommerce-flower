import React, { useState } from 'react';
import { Menu, X, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const navItems = [
        { name: 'Trang chủ', href: '#' },
        { name: 'Hoa theo Chủ đề', href: '#categories' },
        { name: 'Bộ sưu tập', href: '#collection' },
        { name: 'Tự thiết kế', href: '#custom' },
        { name: 'Blog', href: '#blog' },
        { name: 'Liên hệ', href: '#contact' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-2">
                <div className="container mx-auto px-4 text-center text-sm">
                    <p data-testid="promo-banner">🌸 Miễn phí giao hàng cho đơn từ 500.000đ | Tặng thiệp miễn phí 🌸</p>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0" data-testid="logo">
                        <a href="#" className="flex items-center space-x-2 group">
                            <div className="text-3xl transition-transform group-hover:scale-110">🦄</div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                    Kỳ Lân Fresh Flower
                                </h1>
                                <p className="text-xs text-gray-600 italic">Gửi trọn yêu thương bằng ngôn ngữ của hoa</p>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8" data-testid="desktop-nav">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchOpen(!searchOpen)}
                            data-testid="search-toggle"
                            className="hidden md:flex"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Wishlist */}
                        <Button variant="ghost" size="icon" data-testid="wishlist-button">
                            <Heart className="h-5 w-5" />
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" data-testid="cart-button" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </Button>

                        {/* User Account */}
                        <Button variant="ghost" size="icon" data-testid="user-button" className="hidden md:flex">
                            <User className="h-5 w-5" />
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden"
                            data-testid="mobile-menu-toggle"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                {searchOpen && (
                    <div className="mt-4 animate-in slide-in-from-top" data-testid="search-bar">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm hoa hồng, sinh nhật, màu tím..."
                                className="pl-10 pr-4 py-6 text-base rounded-full border-2 border-amber-200 focus:border-amber-400"
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden mt-4 pb-4 animate-in slide-in-from-top" data-testid="mobile-nav">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-amber-600 transition-colors py-2 px-4 rounded-lg hover:bg-amber-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="pt-2 border-t">
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;