'use client';

import Image from 'next/image';
import styles from '@/app/components/cart/CartSidebar.module.css';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    toggleCart,
    cartTotal,
    itemCount,
    clearCart,
  } = useCart();

  const { user, isAuthenticated, login, signup, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const profileDropdownRef = useRef(null);

  const getImageUrl = (url: string | null) => {
    if (!url) return '/salty.jpg';

    // Aggressively strip domain for known product paths
    if (url.includes('/products/')) {
      // Split by /products/ and take the last part
      const parts = url.split('/products/');
      if (parts.length > 1) {
        return `/products/${parts[1]}`;
      }
    }

    if (url.includes('adminpanel.shreebandhu.com')) {
      let clean = url.replace('https://adminpanel.shreebandhu.com', '');
      clean = clean.replace('http://adminpanel.shreebandhu.com', '');
      return clean.startsWith('/') ? clean : `/${clean}`;
    }

    if (url.startsWith('http')) return url;

    // Ensure local paths start with /
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${cleanPath}`;
  };

  const handleLogin = async () => {
    if (!phoneNumber) {
      setAuthError('Phone number is required');
      return;
    }

    setIsAuthLoading(true);
    setAuthError('');

    try {
      const result = await login(phoneNumber);

      if (result.success) {
        setIsAuthModalOpen(false);
        setPhoneNumber('');
      } else if (result.error?.includes('not found')) {
        setIsSignupMode(true);
        setAuthError('This number is not registered. Please sign up.');
      } else {
        setAuthError(result.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!phoneNumber || !fullName || !email) {
      setAuthError('All fields are required');
      return;
    }

    setIsAuthLoading(true);
    setAuthError('');

    try {
      const result = await signup(fullName, email, phoneNumber);

      if (result.success) {
        setIsAuthModalOpen(false);
        setPhoneNumber('');
        setFullName('');
        setEmail('');
      } else {
        setAuthError(result.error || 'Signup failed');
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignupMode) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Preparing checkout data...');
      const checkoutData = {
        cartItems: cartItems.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          // Include other necessary properties
        })),
        user: {
          id: user?.id,
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.mobile || '',
        },
        total: cartTotal,
      };

      console.log('Sending checkout request:', checkoutData);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout API error:', data);
        throw new Error(data.error || 'Checkout failed');
      }

      console.log('Checkout success, order ID:', data.orderId);
      clearCart();
      router.push(`/checkout/confirmation?order_id=${data.orderId}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      console.error('Checkout error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isCartOpen && (
        <div className={styles.overlay} onClick={toggleCart} />
      )}

      <div className={`${styles.sidebar} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>Your Cart ({itemCount})</h3>
          <button onClick={toggleCart} className={styles.closeButton}>
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button onClick={toggleCart} className={styles.startShoppingButton}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={styles.itemsContainer}>
              {cartItems.map(item => (
                <div key={`${item.type}-${item.id}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {/* Debug: {console.log('Cart Item Image:', item.name, item.image, getImageUrl(item.image))} */}
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      width={80}
                      height={80}
                      className={styles.productImage}
                      onError={(e) => {
                        console.log('Image Load Error for:', item.name, getImageUrl(item.image));
                        const target = e.target as HTMLImageElement;
                        target.src = '/salty.jpg';
                      }}
                      priority={false}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    {item.weight && <p className={styles.itemWeight}>{item.weight} grams</p>}
                    <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className={styles.removeButton}
                    aria-label="Remove item"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.subtotal}>
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <p className={styles.shippingText}>
                Shipping & taxes calculated at checkout
              </p>
              <button
                onClick={handleProceedToCheckout}
                className={styles.checkoutButton}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <button
                onClick={toggleCart}
                className={styles.continueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{isSignupMode ? 'Sign Up' : 'Log In'}</h2>

            {authError && <div className={styles.errorMessage}>{authError}</div>}

            <form onSubmit={handleAuthSubmit}>
              {isSignupMode && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </>
              )}

              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.inputField}
                required
              />

              <button
                type="submit"
                className={styles.authButton}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Processing...' : isSignupMode ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <p className={styles.authToggle}>
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setAuthError('');
                }}
                className={styles.toggleButton}
              >
                {isSignupMode ? 'Log In' : 'Sign Up'}
              </button>
            </p>

            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError('');
              }}
              className={styles.closeModalButton}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}