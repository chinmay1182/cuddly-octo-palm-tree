'use client';

import styles from '@/app/admin/styles/admin.module.css';

export default function AdminSupport() {
    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Help & Support</h1>
            </div>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <div className="text-center py-5">
                        <i className="bi bi-headset display-1 text-muted mb-3"></i>
                        <h3 className="text-muted">Coming Soon</h3>
                        <p className="text-muted">Help and support management features are under development.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
