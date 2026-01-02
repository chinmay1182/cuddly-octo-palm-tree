'use client';

import styles from '@/app/admin/styles/admin.module.css';

export default function AdminTransactions() {
    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Transactions</h1>
            </div>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <div className="text-center py-5">
                        <i className="bi bi-wallet2 display-1 text-muted mb-3"></i>
                        <h3 className="text-muted">Coming Soon</h3>
                        <p className="text-muted">Transaction history and management features are under development.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
