'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ComboCard from '@/app/components/combos/ComboCard';
import styles from '@/app/components/combos/CombosPage.module.css';

interface Combo {
  id: number;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number;
  mrp: number;
  discount: number;
  image_url: string | null;
  rating: number;
  reviews: number;
  weight: string;
  category: string;
  product1_name: string;
  product1_price: number;
  product1_image: string | null;
  product2_name: string;
  product2_price: number;
  product2_image: string | null;
}

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/combo-orders');
        setCombos(response.data);
      } catch (error) {
        console.error('Error fetching combos:', error);
        setError('Failed to load combo offers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCombos();
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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading combo offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Special Combo Offers</h1>
      
      {combos.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No combo offers available at the moment.</p>
          <p>Check back later for exciting deals!</p>
        </div>
      ) : (
        <div className={styles.carouselContainer}>
          <div className={styles.combosCarousel} ref={carouselRef}>
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
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
      )}
    </div>
  );
}