// src/pages/Contact.jsx
import React from 'react';
import { FiMail, FiCalendar, FiGithub, FiLinkedin } from 'react-icons/fi';

const Contact = () => {
  return (
    <section id="contact" className="p-10 max-w-3xl mx-auto text-white text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
      <p className="text-muted mb-6">
        We’re currently onboarding early users and would love to hear from you. Have feedback, a feature request, or just want to connect?
      </p>

      <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-10">
          <a
            href="mailto:stackpilotapp@gmail.com"
            className="flex flex-col items-center gap-3 text-primary hover:text-white text-lg"
          >
            <FiMail size={28} /> 
            <span>Email Us</span>
          </a>

          <a
            href="https://calendly.com/stackpilot/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-primary hover:text-white text-lg"
          >
            <FiCalendar size={28} /> <span>Book a Call</span>
          </a>

          <a
            href="https://github.com/SameerSondhi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-primary hover:text-white text-lg"
          >
            <FiGithub size={28} /> <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/sameer-sondhi/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-primary hover:text-white text-lg"
          >
            <FiLinkedin size={28} /> <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
