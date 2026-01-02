'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import styles from '@/app/admin/styles/admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [layoutLoading, setLayoutLoading] = useState(true);

    useEffect(() => {
        console.log('AdminLayout Effect Triggered:', { isLoading, isAuthenticated, user });
        if (!isLoading) {
            console.log('AdminLayout Check:', {
                role: user?.role,
                name: user?.name,
                matches: (user?.role === 'admin' || user?.name === 'admin')
            });

            if (!isAuthenticated || (user?.role !== 'admin' && user?.name !== 'admin')) {
                console.log('AdminLayout: Redirecting to home...');
                router.push('/');
            } else {
                console.log('AdminLayout: Access granted');
                setLayoutLoading(false);
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || layoutLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#F3F4F6' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}
