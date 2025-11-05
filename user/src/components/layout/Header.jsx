import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Trang chủ', href: '#' },
    { name: 'Hoa theo Chủ đề', href: '#categories' },
    { name: 'Bộ sưu tập', href: '#bestsellers' },
    { name: 'Về chúng tôi', href: '#story' },
    { name: 'Liên hệ', href: '#footer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm" data-testid="header">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Hotline: 1900 xxxx - Giao hoa miễn phí nội thành</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-600">
              <a href="#" className="hover:text-pink-600 transition-colors">Chính sách giao hàng</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-pink-600 transition-colors">Hướng dẫn đặt hàng</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2" data-testid="logo">
            <div className="text-3xl font-serif font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              🦄 Kỳ Lân
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-semibold text-gray-800">Fresh Flower</span>
              <span className="text-xs text-gray-500 italic">Ngôn ngữ của hoa</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group"
                data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              data-testid="search-button"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className="p-2 hover:bg-pink-50 rounded-full transition-colors hidden sm:block"
              data-testid="user-button"
              aria-label="User account"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className="p-2 hover:bg-pink-50 rounded-full transition-colors relative"
              data-testid="cart-button"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                0
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-pink-50 rounded-full transition-colors"
              data-testid="mobile-menu-button"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4" data-testid="mobile-nav">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}