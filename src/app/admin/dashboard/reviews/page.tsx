'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/app/lib/apiClient';
import Image from 'next/image';
import styles from '@/app/admin/styles/admin.module.css';

interface Review {
    id: number;
    name: string;
    rating: number;
    review: string;
    image_url: string | null;
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [review, setReviewText] = useState('');
    const [rating, setRating] = useState('5');
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const data = await apiClient<Review[]>('/reviews');
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('review', review);
        formData.append('rating', rating);
        if (image) formData.append('image', image);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setName('');
                setReviewText('');
                setRating('5');
                setImage(null);
                fetchReviews();
                alert('Review added successfully');
            } else {
                alert('Failed to add review');
            }
        } catch (error) {
            alert('Error adding review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const res = await fetch(`/api/reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchReviews();
            } else {
                alert('Failed to delete review');
            }
        } catch (error) {
            alert('Error deleting review');
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Customer Reviews</h1>
            </div>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Add New Review</div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Customer Name</label>
                                    <input type="text" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Rating</label>
                                    <select className={styles.input} value={rating} onChange={(e) => setRating(e.target.value)}>
                                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                        <option value="4">⭐⭐⭐⭐ (4)</option>
                                        <option value="3">⭐⭐⭐ (3)</option>
                                        <option value="2">⭐⭐ (2)</option>
                                        <option value="1">⭐ (1)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Review Text</label>
                                    <textarea className={styles.input} rows={4} value={review} onChange={(e) => setReviewText(e.target.value)} required></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small">Photo (Optional)</label>
                                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                                </div>
                                <button type="submit" className={styles.button} disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="row g-4">
                        {isLoading ? <p className="p-4">Loading...</p> : reviews.map((rev) => (
                            <div key={rev.id} className="col-md-6">
                                <div className={styles.card} style={{ height: '100%' }}>
                                    <div className={styles.cardBody}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                {rev.image_url ? (
                                                    <Image src={rev.image_url} alt={rev.name} width={48} height={48} className="rounded-circle me-3" style={{ objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="rounded-circle bg-light me-3 d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: 48, height: 48 }}>{rev.name[0]}</div>
                                                )}
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{rev.name}</h6>
                                                    <div className="text-warning small">{'⭐'.repeat(rev.rating)}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(rev.id)} className="btn btn-sm text-danger" title="Delete">✕</button>
                                        </div>
                                        <p className="text-muted small mb-0">{rev.review}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
