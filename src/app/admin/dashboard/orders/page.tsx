'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/app/admin/styles/admin.module.css';

interface Order {
    id: number;
    user_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    items?: any[];
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch all orders - assuming a route exists or reusing with params? 
                // We actually need a route to fetch ALL orders. 
                // Since the user asked for orders to be visible, we need to create/use 'GET /api/orders'
                // But currently we only have '/api/orders/[orderId]'.
                // I will assume for now we will query a new route /api/admin/orders or /api/orders
                // Let's create a new API route /api/admin/orders to be clean.
                const response = await axios.get('/api/admin/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await axios.patch(`/api/admin/orders`, { orderId, status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading orders...</div>;

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Order Management</h1>
            </div>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_name}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>₹{order.total_amount}</td>
                                    <td>
                                        <span className={`badge bg-${order.status === 'completed' ? 'success' :
                                                order.status === 'pending' ? 'warning' : 'secondary'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
