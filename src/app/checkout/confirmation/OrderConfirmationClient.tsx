// app/checkout/confirmation/OrderConfirmationClient.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Confirmation.module.css';
import Link from 'next/link';
import { Order } from '@/app/types/order';

export default function OrderConfirmationClient() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <div className={styles.actionButtons}>
            <Link href="/cart" className={styles.continueShopping}>
              Back to Cart
            </Link>
            <Link href="/" className={styles.continueShopping}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Order Not Found</h2>
          <p>We couldnt find your order. Please check your order ID.</p>
          <div className={styles.actionButtons}>
            <Link href="/orders" className={styles.continueShopping}>
              View Your Orders
            </Link>
            <Link href="/" className={styles.continueShopping}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.confirmationCard}>
        <div className={styles.header}>
          <h1>Order Confirmed!</h1>
          <p className={styles.orderNumber}>Order #: {order.id}</p>
          <p className={styles.confirmationText}>
            Thank you for your purchase. A confirmation email has been sent to {order.user_email}.
          </p>
        </div>

        <div className={styles.statusBanner}>
          <p>Status: <span className={`${styles.statusText} ${order.status === 'pending' ? styles.pending : styles.completed}`}>
            {order.status}
          </span></p>
          <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className={styles.customerInfo}>
          <h3>Customer Information</h3>
          <div className={styles.infoGrid}>
            <div><strong>Name:</strong> {order.user_name}</div>
            <div><strong>Email:</strong> {order.user_email}</div>
            <div><strong>Phone:</strong> {order.user_mobile}</div>
          </div>
        </div>

        <div className={styles.orderItems}>
          <h3>Order Summary</h3>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{Number(item.price).toFixed(2)}</td>
                  <td>₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.orderTotal}>
          <div className={styles.totalRow}>
            <span>Subtotal:</span>
            <span>₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Grand Total:</span>
            <span>₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.continueShopping}>
            Continue Shopping
          </Link>
          <Link href={`/orders/${order.id}`} className={styles.viewOrder}>
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  );
}
