// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import useActiveOrg from '../hooks/useActiveOrg';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import {
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  ScrollText,
  Settings,
  CircleHelp,
  Mail,
  MessageCircle
} from 'lucide-react';


const Sidebar = () => {
  const location = useLocation();
  const { session } = useAuth();
const { orgId } = useActiveOrg();
const user = session?.user;
const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

useEffect(() => {
  if (!orgId || !user?.id) return;

  const channel = supabase
    .channel('realtime:sidebar-unread')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages' },
      (payload) => {
        const msg = payload.new;
        if (msg.organization_id !== orgId) return;

        const isUnread = !(msg.read_by || []).includes(user.id);
        setHasUnreadMessages((prev) => prev || isUnread);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [orgId, user]);

  const menu = [
    { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "CRM", to: "/crm", icon: <Users size={18} /> },
    { name: "Outreach", to: "/outreach", icon: <Mail size={18} /> },
    { name: "Message Board", to: "/messages", icon: <MessageCircle size={18} /> }, // ✅ Updated route and icon
    { name: "Personalization", to: "/personalization", icon: <SlidersHorizontal size={18} /> },
    { name: "Activity Log", to: "/activity-log", icon: <ScrollText size={18} /> },
    { name: "Settings", to: "/settings", icon: <Settings size={18} /> },
    { name: "Help", to: "/help", icon: <CircleHelp size={18} /> },
  ];

  return (
    <div className="w-64 bg-surface text-white h-full shadow-md p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-primary">StackPilot</h2>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                location.pathname === item.to
                  ? 'bg-primary text-black font-semibold'
                  : 'text-white hover:bg-muted hover:text-white'
              }`}
            >
              <div className="relative flex items-center gap-2">
  {item.icon}
  {item.name}
  {item.name === 'Message Board' && hasUnreadMessages && (
    <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
  )}
</div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-sm text-muted">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;