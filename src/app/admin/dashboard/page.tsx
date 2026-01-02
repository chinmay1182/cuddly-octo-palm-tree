'use client';

import { useAuth } from '@/app/context/AuthContext';
import styles from '@/app/admin/styles/admin.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <div>
                    <button className={styles.button}>Export Report</button>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard}>
                        <div className={styles.statsValue}>150</div>
                        <div className={styles.statsLabel}>Total Orders</div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                        <div className={styles.statsValue}>₹ 5.2L</div>
                        <div className={styles.statsLabel}>Revenue This Month</div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard} style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                        <div className={styles.statsValue}>12</div>
                        <div className={styles.statsLabel}>Pending Orders</div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>Recent Activity</div>
                <div className={styles.cardBody}>
                    <p>Welcome back, <strong>{user?.name || 'Admin'}</strong>.</p>
                    <p className="text-muted">Here's what's happening with your store today.</p>
                </div>
            </div>
        </div>
    );
}
