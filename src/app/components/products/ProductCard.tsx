'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '@/app/components/products/ProductCard.module.css';
import { useCart } from '@/app/context/CartContext';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number | string;
  mrp: number | string;
  image_url: string;
  rating: number;
  reviews: number;
  weight: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  allProducts?: Product[];
  isCarousel?: boolean;
}

export default function ProductCard({ product, allProducts = [], isCarousel = false }: ProductCardProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, syncCartWithServer } = useCart();
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const mrp = typeof product.mrp === 'string' ? parseFloat(product.mrp) : product.mrp;
  const [modalReady, setModalReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const rootElement = document.body;
          if (rootElement) {
            Modal.setAppElement(rootElement);
            setModalReady(true);
          }
        } catch (error) {
          console.error("Error setting up react-modal:", error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  const handleAddToCart = async () => {
    const user = getUser();
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: imageSrc,
        type: 'product',
        weight: product.weight,
      });

      if (user) {
        await syncCartWithServer(user.id);
      }

      toast.success(`${product.name} added to cart successfully!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const openProductModal = () => {
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const imageSrc = product.image_url
    ? product.image_url.startsWith('http')
      ? `/api/proxy?url=${encodeURIComponent(product.image_url)}`
      : product.image_url.startsWith('/')
        ? product.image_url
        : `/${product.image_url}`
    : '/salty.jpg';

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const getResolvedImage = (url: string | null) => {
    if (!url) return '/salty.jpg';
    if (url.startsWith('http')) return `/api/proxy?url=${encodeURIComponent(url)}`;
    return url.startsWith('/') ? url : `/${url}`;
  };

  const handleCarouselAddToCart = async (prod: Product) => {
    const prodPrice = typeof prod.price === 'string' ? parseFloat(prod.price) : prod.price;
    try {
      await addToCart({
        id: prod.id,
        name: prod.name,
        price: prodPrice,
        image: getResolvedImage(prod.image_url),
        type: 'product',
        weight: prod.weight,
      });

      const user = getUser();
      if (user) {
        await syncCartWithServer(user.id);
      }

      toast.success(`${prod.name} added to cart successfully!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  if (!isCarousel) {
    return (
      <div className={styles.productCard}>
        <div className={styles.productImage}>
          <Image
            src={imageSrc}
            alt={product.name}
            width={300}
            height={300}
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/salty.jpg';
            }}
          />
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h3 className={styles.productName}>{product.name}</h3>
          </div>
          <h4 className={styles.productTitle}>{product.mainTitle}</h4>
          <p className={styles.productSubtitle}>{product.subTitle}</p>

          <div className={styles.productMeta}>
            <span className={styles.weight}>Weight: {product.weight}</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>₹{price.toFixed(2)}</span>
            {mrp > price && (
              <span className={styles.originalPrice}>₹{mrp.toFixed(2)}</span>
            )}
          </div>

          <div className={styles.ratingContainer}>
            <div className={styles.stars}>
              {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className={styles.filledStar}>★</span>
              ))}
              {hasHalfStar && <span className={styles.halfStar}>★</span>}
              {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className={styles.emptyStar}>★</span>
              ))}
            </div>
            <span className={styles.ratingText}>
              {isNaN(Number(product.rating)) ? 'N/A' : Number(product.rating).toFixed(1)}/5
            </span>
            <span className={styles.reviewCount}>({product.reviews} reviews)</span>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.viewButton} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className={styles.infoButton}
              onClick={openProductModal}
              aria-label="View product details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M450-290h60v-230h-60v230Zm30-298.46q13.73 0 23.02-9.29t9.29-23.02q0-13.73-9.29-23.02-9.29-9.28-23.02-9.28t-23.02 9.28q-9.29 9.29-9.29 23.02t9.29 23.02q9.29 9.29 23.02 9.29Zm.07 488.46q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
            </button>
          </div>
        </div>

        {modalReady && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeProductModal}
            className={styles.productModal}
            overlayClassName={styles.modalOverlay}
          >
            <div className={styles.modalContent}>
              <button className={styles.closeButton} onClick={closeProductModal}>
                &times;
              </button>

              <div className={styles.modalGrid}>
                <div className={styles.modalImages}>
                  <div className={styles.mainImage}>
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      width={500}
                      height={500}
                      className={styles.image}
                    />
                  </div>
                </div>

                <div className={styles.modalDetails}>
                  <h2>{product.name}</h2>
                  <h3>{product.mainTitle}</h3>
                  <p className={styles.description}>{product.subTitle}</p>

                  <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>₹{price.toFixed(2)}</span>
                    {mrp > price && (
                      <span className={styles.originalPrice}>₹{mrp.toFixed(2)}</span>
                    )}
                  </div>

                  <div className={styles.ratingContainer}>
                    <div className={styles.stars}>
                      {[...Array(fullStars)].map((_, i) => (
                        <span key={`modal-full-${i}`} className={styles.filledStar}>★</span>
                      ))}
                      {hasHalfStar && <span className={styles.halfStar}>★</span>}
                      {[...Array(emptyStars)].map((_, i) => (
                        <span key={`modal-empty-${i}`} className={styles.emptyStar}>★</span>
                      ))}
                    </div>
                    <span>({product.reviews} reviews)</span>
                  </div>

                  <div className={styles.specs}>
                    <p><strong>Weight:</strong> {product.weight}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                  </div>

                  <button
                    className={styles.addToCartButton}
                    onClick={() => {
                      handleAddToCart();
                      closeProductModal();
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer}>
      <button className={styles.carouselButton} onClick={scrollLeft}>
        &lt;
      </button>

      <div className={styles.carousel} ref={carouselRef}>
        {allProducts.map((prod) => (
          <div key={prod.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <Image
                src={getResolvedImage(prod.image_url)}
                alt={prod.name}
                width={300}
                height={300}
                className={styles.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/salty.jpg';
                }}
              />
            </div>

            <div className={styles.productInfo}>
              <div className={styles.productHeader}>
                <h3 className={styles.productName}>{prod.name}</h3>
              </div>
              <h4 className={styles.productTitle}>{prod.mainTitle}</h4>
              <p className={styles.productSubtitle}>{prod.subTitle}</p>

              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>₹{parseFloat(typeof prod.price === 'string' ? prod.price : prod.price.toString()).toFixed(2)}</span>
                {parseFloat(typeof prod.mrp === 'string' ? prod.mrp : prod.mrp.toString()) > parseFloat(typeof prod.price === 'string' ? prod.price : prod.price.toString()) && (
                  <span className={styles.originalPrice}>₹{parseFloat(typeof prod.mrp === 'string' ? prod.mrp : prod.mrp.toString()).toFixed(2)}</span>
                )}
              </div>

              <div className={styles.ratingContainer}>
                <div className={styles.stars}>
                  {[...Array(Math.floor(prod.rating))].map((_, i) => (
                    <span key={`carousel-full-${i}-${prod.id}`} className={styles.filledStar}>★</span>
                  ))}
                  {prod.rating % 1 >= 0.5 && <span className={styles.halfStar}>★</span>}
                  {[...Array(5 - Math.floor(prod.rating) - (prod.rating % 1 >= 0.5 ? 1 : 0))].map((_, i) => (
                    <span key={`carousel-empty-${i}-${prod.id}`} className={styles.emptyStar}>★</span>
                  ))}
                </div>
                <span className={styles.reviewCount}>({prod.reviews} reviews)</span>
              </div>

              <div className={styles.productMeta}>
                <span className={styles.weight}>{prod.weight}</span>
                <span className={styles.category}>{prod.category}</span>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.viewButton} onClick={() => handleCarouselAddToCart(prod)}>
                  Add to Cart
                </button>
                <button
                  className={styles.infoButton}
                  onClick={openProductModal}
                  aria-label="View product details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M450-290h60v-230h-60v230Zm30-298.46q13.73 0 23.02-9.29t9.29-23.02q0-13.73-9.29-23.02-9.29-9.28-23.02-9.28t-23.02 9.28q-9.29 9.29-9.29 23.02t9.29 23.02q9.29 9.29 23.02 9.29Zm.07 488.46q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.carouselButton} onClick={scrollRight}>
        &gt;
      </button>

      {modalReady && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeProductModal}
          className={styles.productModal}
          overlayClassName={styles.modalOverlay}
        >
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeProductModal}>
              &times;
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalImages}>
                <div className={styles.mainImage}>
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    width={500}
                    height={500}
                    className={styles.image}
                  />
                </div>
              </div>

              <div className={styles.modalDetails}>
                <h2>{product.name}</h2>
                <h3>{product.mainTitle}</h3>
                <p className={styles.description}>{product.subTitle}</p>

                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>₹{price.toFixed(2)}</span>
                  {mrp > price && (
                    <span className={styles.originalPrice}>₹{mrp.toFixed(2)}</span>
                  )}
                </div>

                <div className={styles.ratingContainer}>
                  <div className={styles.stars}>
                    {[...Array(fullStars)].map((_, i) => (
                      <span key={`modal-full-${i}`} className={styles.filledStar}>★</span>
                    ))}
                    {hasHalfStar && <span className={styles.halfStar}>★</span>}
                    {[...Array(emptyStars)].map((_, i) => (
                      <span key={`modal-empty-${i}`} className={styles.emptyStar}>★</span>
                    ))}
                  </div>
                  <span>({product.reviews} reviews)</span>
                </div>

                <div className={styles.specs}>
                  <p><strong>Weight:</strong> {product.weight}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                </div>

                <button
                  className={styles.addToCartButton}
                  onClick={() => {
                    handleAddToCart();
                    closeProductModal();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}