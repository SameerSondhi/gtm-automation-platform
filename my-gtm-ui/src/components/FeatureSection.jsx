// src/components/FeatureSection.jsx
import React from 'react';
import outreach from '../assets/images/outreach_detail.png';
import leads from '../assets/images/lead_detail.png';
import insights from '../assets/images/insights_dashboard.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const features = [
  {
    title: '📥 Lead Intake',
    text: 'Capture, organize, and act on leads in seconds — from manual form entries to bulk CSV uploads. Smart filters, dynamic tags, and instant tracking make StackPilot the fastest way to get from lead to action.',
    image: leads,
  },
  {
    title: '🧠 AI Enrichment',
    text: 'Say goodbye to blank fields and guessing games. StackPilot instantly enriches leads with contextual personas, titles, industries, and tailored outreach suggestions — powered by lightweight, on-demand AI.',
    image: outreach,
  },
  {
    title: '📊 CRM Insights',
    text: 'See what’s working and what’s not — instantly. StackPilot’s built-in dashboard and activity logs surface lead engagement, sync history, and messaging performance at a glance, no clunky setup required.',
    image: insights,
  },
];

const FeatureSection = () => (
  <section className="p-6 md:p-10">

    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={true}
      className="max-w-6xl mx-auto"
    >
      {features.map((feature, idx) => (
        <SwiperSlide key={idx}>
          <div className={`flex flex-col md:flex-row items-center gap-10 px-4`}>
            <div className="card-surface text-center md:text-left space-y-3">
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-muted text-sm">{feature.text}</p>
            </div>
            
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default FeatureSection;
