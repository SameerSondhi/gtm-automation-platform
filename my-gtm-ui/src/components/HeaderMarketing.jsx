// src/components/HeaderMarketing.jsx
import { ArrowRight } from 'lucide-react';
import React from 'react';

const HeaderMarketing = () => {
  return (
    <nav className="bg-background text-white flex items-center justify-between px-6 py-4 fixed w-full top-0 z-50 overflow-hidden border border-b-[0.5px] border-muted">
     <div>
     <a href="#hero" className="flex items-center text-xl font-bold text-primary">
  <img
    src="/stackpilot-favicon.png"
    alt="StackPilot Logo"
    className="w-10 h-10 object-contain"
  />
  
    <span>StackPilot</span>
  </a>
</div>
      <div className="space-x-6 hidden md:flex text-muted">
        <a href="#product" className="hover:text-primary">Product</a>
        <a href="#solutions" className="hover:text-primary">Solutions</a>
        <a href="#pricing" className="hover:text-primary">Pricing</a>
        <a href="#contact" className="hover:text-primary">Contact</a>
      </div>
      <div className="flex items-center space-x-5">
        <a
          href="/login"
          className="text-primary hover:text-white transition"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-primary text-black px-4 py-1 rounded font-medium hover:bg-green-400 transition flex flex-row gap-[0.5rem]"
        >
          Sign Up
          <span><ArrowRight strokeWidth={2} /></span>
        </a>
      </div>
    </nav>
  );
};

export default HeaderMarketing;
