'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/app/components/navbar/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/products/ProductCard';
import CartSidebar from '@/app/components/cart/CartSidebar';
import styles from './page.module.css';

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

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('search');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/products?search=${query || ''}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchProducts();
        } else {
            // Fetch all or nothing? Let's fetch all if no query, or maybe clear. 
            // Usually search page without query shows all or asks to search.
            // Let's fetch all for now to be safe.
            fetchProducts();
        }
    }, [query]);

    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>
                {query ? `Search Results for "${query}"` : 'All Products'}
            </h1>

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : products.length > 0 ? (
                <div className="row">
                    {products.map((product) => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.noResults}>
                    No products found matching your search.
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main>
            <Navbar />
            <CartSidebar />
            <Suspense fallback={<div className="container py-5 text-center">Loading search...</div>}>
                <SearchContent />
            </Suspense>
            <Footer />
        </main>
    );
}
