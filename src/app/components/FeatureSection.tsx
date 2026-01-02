"use client";

import Image from "next/image";
import styles from "@/app/components/FeatureSection.module.css";

const features = [
    {
        title: "FREE Shipping for 15,000+ Pincodes",

        icon: "/free-shipping.png", // Add your icons to public/
    },
    {
        title: "2L+ Happy Customers",

        icon: "/customer-service.png",
    },
    {
        title: "Various Rewards and Offers",

        icon: "/gift-box.png",
    },
    {
        title: "COD Available",

        icon: "/cash-on-delivery.png",
    },
];

export default function Features() {
    return (
        <section className={styles.featuresSection}>
            <div className={styles.container}>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.iconWrapper}>
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    width={60}
                                    height={60}
                                    className={styles.icon}
                                />
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
