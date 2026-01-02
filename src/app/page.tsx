'use client'; // Add this since we're using hooks in child components

import { CartProvider } from '@/app/context/CartContext';
import { AuthProvider } from '@/app/context/AuthContext';
import BannerCarousel from '@/app/components/BannerCarousel';
import ReviewsSection from '@/app/components/ReviewsSection';
import FAQSection from '@/app/components/FAQSection';
import 'bootstrap/dist/css/bootstrap.min.css';

import OurStory from './components/OurStory';
import Features from './components/FeatureSection';
import FruitPowders from './components/products/FruitPowders';
import CombosPage from './components/combos/page';
import Footer from '@/app/components/Footer';
import Navbar from './components/navbar/Navbar';
import CartSidebar from './components/cart/CartSidebar';
import OtherCategory from './components/othercategory/OtherCategory';

export default function Home() {
  return (
    <CartProvider>
      <AuthProvider>
        <main>
          <Navbar />
          <CartSidebar />

          {/* Banner Carousel Section */}
          <section className="banner-section">
            <BannerCarousel />
          </section>

          {/* Products Sections */}
          <section className="products-section">
            <FruitPowders />
            <OtherCategory/>
            <CombosPage />
          </section>

          {/* Page Content */}
          <section className="page-content">
          </section>

          {/* Additional Sections */}
          <OurStory />
          <ReviewsSection />
          <FAQSection />
          <Features />

          <Footer />
        </main>
      </AuthProvider>
    </CartProvider>
  );
}