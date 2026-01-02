'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/app/components/products/ProductCard';
import styles from '@/app/components/products/CategoryProducts.module.css';

interface Product {
  id: number;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number | string;
  mrp: number | string;
  image_url: string;
  rating: number;
  reviews: number;
  weight: string;
  category: string;
}

export default function FruitPowders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=fruit-powder');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) return <div className={styles.loading}>Loading fruit powders...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (products.length === 0) return (
    <div className={styles.noProducts}>
      No fruit powders available. Please check back later or try a different category.
    </div>
  );

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.sectionTitle}>Fruit Powders</h2>
      
      <div className={styles.carouselContainer}>
        <div className={styles.productsCarousel} ref={carouselRef}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className={styles.carouselControls}>
          <button 
            className={styles.carouselButton} 
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            &lt;
          </button>
          <button 
            className={styles.carouselButton} 
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}