'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '@/app/lib/apiClient';
import styles from '@/app/components/ReviewsSection.module.css';

interface Review {
    id: number;
    name: string;
    review: string;
    image_url: string | null;
    rating: number;
    created_at: string;
}

export default function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await apiClient<Review[]>('/reviews');
                setReviews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load reviews');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (isLoading) {
        return <div className={styles.loading}>Loading reviews...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (reviews.length === 0) {
        return <div className={styles.noReviews}>No reviews available yet.</div>;
    }

    return (
        <section className={`py-5 ${styles.testimonialsSection}`}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className={`display-6 ${styles.testimonialHeading} mb-3`}>Customer Reviews</h2>
                    <p className="text-muted">What our valued customers say about us</p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="col">
                            <div className={`d-flex flex-column h-100 ${styles.testimonialCard}`}>
                                <div className="d-flex align-items-center mb-3">
                                    {review.image_url && (
                                        <div className={`${styles.imageWrapper} me-3`}>
                                            <Image
                                                src={review.image_url}
                                                alt={review.name}
                                                width={64}
                                                height={64}
                                                className={styles.testimonialImage}
                                                unoptimized
                                            />
                                        </div>
                                    )}

                                    <div>

                                        <h6 className="mb-1 fw-bold">{review.name}</h6>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <div className={styles.quoteIcon}>&ldquo;</div>
                                    <p className={styles.testimonialText}>{review.review}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
