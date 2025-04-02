import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from 'lucide-react';
import { supabase } from "../lib/supabaseClient";

const LogoutButton = ({ iconOnly = false }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let authListener;

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      authListener = listener;
    };

    fetchSession();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) return null;

  return iconOnly ? (
    <button onClick={handleLogout} aria-label="Logout">
      <LogOut size={20} />
    </button>
  ) : (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 flex items-center gap-2 hover:text-red-700 transition"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
};

export default LogoutButton;