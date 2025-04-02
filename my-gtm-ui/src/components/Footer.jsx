import React from 'react'
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
     <div>
   <div className="p-10 text-sm text-muted bg-background border-t border-border">
   <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 justify-between items-center">
     <div>
       <p className="text-lg md:text-xl text-muted max-w-sm sm:max-w-md">
         Capture leads, enrich with AI, manage outreach, and track performance — all in one elegant platform.
       </p>
       <div className="mt-6 flex gap-4">
         <button
           onClick={() => window.location.href='/signup'}
           className="bg-primary text-black font-medium px-6 py-2 rounded shadow hover:bg-green-400 transition flex items-center gap-2"
         >
           <span>Get started for free</span> <ArrowRight strokeWidth={2} />
         </button>
       </div>
     </div>
 
     <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:space-y-4 gap-20 md:gap-0">
  {/* Logo + Name */}
  <a href="#hero" className="flex flex-row items-center text-3xl font-bold text-primary">
    <img
      src="/stackpilot-favicon.png"
      alt="StackPilot Logo"
      className="w-16 h-16 object-contain"
    />
    <span>StackPilot</span>
  </a>

  {/* Colored Social Icons */}
  <div className="flex gap-4 sm:gap-5 text-xl">
    <a
      href="https://github.com/SameerSondhi"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 transition"
    >
      <FaGithub className="text-gray-400 hover:text-white" />
    </a>
    <a
      href="https://www.linkedin.com/in/sameer-sondhi/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 transition"
    >
      <FaLinkedin className="text-[#0A66C2]" />
    </a>
    <a
      href="https://twitter.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 transition"
    >
      <FaTwitter className="text-[#1DA1F2]" />
    </a>
    <a
      href="https://www.youtube.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 transition"
    >
      <FaYoutube className="text-[#FF0000]" />
    </a>
  </div>
</div>
</div>
 
   <div className="max-w-7xl grid grid-cols-3 mt-12 text-center md:text-center mx-auto">
     <div className="space-y-2">
       <h4 className="text-white font-semibold text-base">Product</h4>
       <ul className="space-y-1">
         <li><a href="#product" className="hover:text-white">Overview</a></li>
         <li><a href="#solutions" className="hover:text-white">Solutions</a></li>
         <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
       </ul>
     </div>
 
     <div className="space-y-2">
       <h4 className="text-white font-semibold text-base">Company</h4>
       <ul className="space-y-1">
         <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
         <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
         <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
       </ul>
     </div>
 
     <div className="space-y-2">
       <h4 className="text-white font-semibold text-base">Connect</h4>
       <ul className="space-y-1">
         <li><a href="mailto:stackpilotapp@gmail.com" className="hover:text-white">Email</a></li>
         <li><a href="https://github.com/SameerSondhi" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
         <li><a href="https://www.linkedin.com/in/sameer-sondhi/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
       </ul>
     </div>
   </div>
 
   <div className="text-center mt-10 text-xs text-muted">
     © {new Date().getFullYear()} StackPilot. Built with ❤️ by Sameer Sondhi.
   </div>
 </div>
 </div>
  )
}

export default Footer