'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/app/components/products/ProductCard';
import styles from '@/app/components/products/CategoryProducts.module.css';

interface Product {
  id: number;
  // ... same as Product interface in ProductCard
}

export default function VegetablePowders() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=vegetable-powders');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className={styles.loading}>Loading vegetable powders...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (products.length === 0) return <div className={styles.noProducts}>No vegetable powders available</div>;

  return (
    <section className={styles.categorySection}>
      <h2 className={styles.sectionTitle}>Vegetable Powders</h2>
      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}