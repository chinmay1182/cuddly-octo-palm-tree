'use client';

import Image from 'next/image';
import styles from '@/app/components/othercategory/OtherCategory.module.css';

export default function ImageDisplay() {
  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageBox}>
        <Image src="/salty.jpg" alt="Image 1" fill className={styles.image} />
      </div>
      <div className={styles.imageBox}>
        <Image src="/spices.jpg" alt="Image 2" fill className={styles.image} />
      </div>
    </div>
  );
}
