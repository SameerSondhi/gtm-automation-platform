// src/pages/Product.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import HeaderMarketing from '../components/HeaderMarketing';

const productFeatures = [
  {
    title: '📥 Lead Intake',
    description: 'Add leads via form or CSV — trackable and export-ready.',
    image: '/screenshots/lead-intake.png',
  },
  {
    title: '🧠 AI Enrichment',
    description: 'Instantly enhance leads with personas & role-based messaging.',
    image: '/screenshots/ai-enrichment.png',
  },
  {
    title: '📬 Smart Outreach',
    description: 'Send tailored AI-generated messages and monitor engagement.',
    image: '/screenshots/outreach.png',
  },
];

const Product = () => {
  return (
    <>
      <section className="p-10 max-w-6xl mx-auto text-white">
        <h1 className="text-4xl font-bold mb-6 text-primary text-center">StackPilot Product Overview</h1>
        <Swiper spaceBetween={30} autoplay={{ delay: 3000 }} loop>
          {productFeatures.map((f, i) => (
            <SwiperSlide key={i} className="bg-surface p-6 rounded-xl shadow text-center">
              <h2 className="text-2xl font-semibold mb-2">{f.title}</h2>
              <p className="text-muted mb-4">{f.description}</p>
              <img src={f.image} alt={f.title} className="mx-auto rounded shadow" />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default Product;