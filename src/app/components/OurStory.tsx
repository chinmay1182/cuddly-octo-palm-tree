"use client";

import Image from "next/image";
import styles from "@/app/components/OurStory.module.css";

export default function OurStory() {
    return (
        <section className={styles.storySection}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.imageBlock}>
                        <Image
                            src="/work.jpeg" // 👈 Add your image in `public/images/`
                            alt="Our Story"
                            width={500}
                            height={350}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h2 className={styles.heading}>Our Story</h2>
                        <p className={styles.text}>
                            At Shree Bandhu, we are working with the vision of Healthy India
                            to enhance the quality of life for Indian families. Our goal is to
                            provide Healthy Natural products to each and every Indian at their
                            doorsteps. In today’s world, it is very difficult to ensure the
                            purity of Natural products. So to ensure that, we have a strong
                            Natural food chain in India with our beloved, committed, and trusted
                            farmers, producers, and visionary promoters making sure you get
                            authentic Natural products.
                        </p>
                        <p className={styles.text}>
                            We support Natural Farming agriculture as Natural farming is a
                            holistic approach to food production, making use of zero-budget
                            Natural farming, crop rotation, environmental management, and good
                            animal husbandry to control pests and diseases.
                        </p>
                        <button className={styles.readMore}>Read More</button>
                    </div>

                </div>
            </div>
        </section>
    );
}
