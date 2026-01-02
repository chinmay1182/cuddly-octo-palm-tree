'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import styles from '@/app/admin/styles/admin.module.css';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isContentMenuOpen, setIsContentMenuOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.sidebar}>
            <div className={styles.nav}>
                <div className={styles.navItem}>
                    <Link
                        href="/admin/dashboard"
                        className={`${styles.navLink} ${isActive('/admin/dashboard') ? styles.activeLink : ''}`}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        <span>Dashboard</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <div
                        className={styles.navLink}
                        onClick={() => setIsContentMenuOpen(!isContentMenuOpen)}
                        style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                    >
                        <div className="d-flex align-items-center">
                            <i className="bi bi-collection me-2"></i>
                            <span>Content Management</span>
                        </div>
                        <span style={{ fontSize: '0.8em' }}>
                            <i className={`bi ${isContentMenuOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                        </span>
                    </div>

                    {isContentMenuOpen && (
                        <div className={styles.subMenu}>
                            <Link
                                href="/admin/dashboard/banners"
                                className={styles.subMenuLink}
                                style={{ color: isActive('/admin/dashboard/banners') ? '#4F46E5' : '' }}
                            >
                                <i className="bi bi-images me-2"></i>
                                Banners
                            </Link>
                            <Link
                                href="/admin/dashboard/reviews"
                                className={styles.subMenuLink}
                                style={{ color: isActive('/admin/dashboard/reviews') ? '#4F46E5' : '' }}
                            >
                                <i className="bi bi-star me-2"></i>
                                Reviews
                            </Link>
                        </div>
                    )}
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/users" className={`${styles.navLink} ${isActive('/admin/dashboard/users') ? styles.activeLink : ''}`}>
                        <i className="bi bi-people me-2"></i>
                        <span>Users</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/orders" className={`${styles.navLink} ${isActive('/admin/dashboard/orders') ? styles.activeLink : ''}`}>
                        <i className="bi bi-box-seam me-2"></i>
                        <span>Order Management</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/products" className={`${styles.navLink} ${isActive('/admin/dashboard/products') ? styles.activeLink : ''}`}>
                        <i className="bi bi-tag me-2"></i>
                        <span>Products</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/combos" className={`${styles.navLink} ${isActive('/admin/dashboard/combos') ? styles.activeLink : ''}`}>
                        <i className="bi bi-boxes me-2"></i>
                        <span>Combo Orders</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/bulk-products" className={`${styles.navLink} ${isActive('/admin/dashboard/bulk-products') ? styles.activeLink : ''}`}>
                        <i className="bi bi-boxes me-2"></i>
                        <span>Bulk Products</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/transactions" className={`${styles.navLink} ${isActive('/admin/dashboard/transactions') ? styles.activeLink : ''}`}>
                        <i className="bi bi-wallet2 me-2"></i>
                        <span>Transactions</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/refunds" className={`${styles.navLink} ${isActive('/admin/dashboard/refunds') ? styles.activeLink : ''}`}>
                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                        <span>Refunds</span>
                    </Link>
                </div>

                <div className={styles.navItem}>
                    <Link href="/admin/dashboard/support" className={`${styles.navLink} ${isActive('/admin/dashboard/support') ? styles.activeLink : ''}`}>
                        <i className="bi bi-headset me-2"></i>
                        <span>Help & Support</span>
                    </Link>
                </div>
            </div>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className={styles.userInfo}>
                    <p className={styles.userName}>{user?.name || 'Admin'}</p>
                    <p className={styles.userRole}>Administrator</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </div>
        </nav>
    );
}
