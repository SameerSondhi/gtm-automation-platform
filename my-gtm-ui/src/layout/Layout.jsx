import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

const Layout = () => {
  const { session } = useAuth();
  const user = session?.user;
  const navigate = useNavigate();
  const [checkingOrg, setCheckingOrg] = useState(true);

  useEffect(() => {
    const checkOrg = async () => {
      if (!user) return;

      const res = await fetch(`/api/org/check/${user.id}`);
const result = await res.json();

if (!result.inOrg) {
  navigate('/org-wizard');
} else {
  setCheckingOrg(false);
}
    };

    checkOrg();
  }, [user, navigate]);

  if (checkingOrg) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Checking organization...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-white">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;