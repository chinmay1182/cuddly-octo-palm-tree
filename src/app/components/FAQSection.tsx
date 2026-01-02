"use client"; // If using Next.js app directory

import { useState } from "react";
import styles from '@/app/components/FAQSection.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How can I join as a Shree Bandhu member?",
    answer:
      "You can become a Shree Bandhu member either by participating in the company's distribution or by purchasing any of its products.",
  },
  {
    question: "What types of products does Shree Bandhu offer?",
    answer:
      "Shree Bandhu offers a variety of products, including dehydrated fruits and vegetables powder and slices, spices, Namkeen, waffles, and more.",
  },
  {
    question: "What is Shree Bandhu?",
    answer:
      "Shree Bandhu is a company that promises to provide customers with pure and healthy food products.",
  },
  {
    question: "How can one purchase Shree Bandhu products?",
    answer:
      "You can buy Shree Bandhu's product through various channels, such as local supermarkets, Amazon, Flipkart, India Mart, Jio Mart, and others.",
  },
  {
    question: "How does Shree Bandhu ensure quality?",
    answer:
      "Adherence to food safety standards and regulations, implementation of appropriate dehydration and packaging techniques, and conducting regular testing and inspections.",
  },
  {
    question: "How can I support Shree Bandhu Mission?",
    answer:
      "You can support Shree Bandhu's mission by giving your valuable feedback about their product.",
  },
  {
    question: "Where does Shree Bandhu operate?",
    answer:
      "Shree Bandhu is currently operating in Uttar Pradesh.",
  },
];


export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button className={styles.question} onClick={() => toggleFAQ(index)}>
              {item.question}
              <span className={styles.arrow}>{activeIndex === index ? "−" : "+"}</span>
            </button>
            {activeIndex === index && <p className={styles.answer}>{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
