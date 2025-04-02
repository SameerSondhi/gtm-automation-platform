import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  CircleHelp,
  Mail
} from 'lucide-react';
import LogoutButton from './LogoutButton';

const MobileNav = () => {
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/crm', label: 'Leads', icon: Users },
    { to: '/personalization', label: 'Customize', icon: SlidersHorizontal },
    { to: '/outreach', label: 'Outeach', icon: Mail },
    { to: '/help', label: 'Help', icon: CircleHelp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-lg z-50">
      <div className="flex justify-around py-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center px-3 py-1 text-xs transition-all ${
                isActive ? 'text-primary scale-110' : 'text-white hover:text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="mt-1 text-[10px] sm:text-xs">{link.label}</span>
            </Link>
          );
        })}

        <div className="flex flex-col items-center px-3 py-1 text-xs text-red-500 hover:text-red-400">
          <LogoutButton iconOnly />
          <span className="mt-1 text-[10px] sm:text-xs">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;