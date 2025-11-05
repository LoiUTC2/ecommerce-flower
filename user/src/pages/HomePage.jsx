import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";
import FeaturedCategories from "../components/sections/FeaturedCategories";
import BestSellers from "../components/sections/BestSellers";
import PromoBanner from "../components/sections/PromoBanner";
import StorytellingSection from "../components/sections/StorytellingSection";
import TestimonialCarousel from "../components/sections/TestimonialCarousel";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" data-testid="homepage">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <BestSellers />
        <PromoBanner />
        <StorytellingSection />
        <TestimonialCarousel />
      </main>

      <Footer />
    </div>
  );
}