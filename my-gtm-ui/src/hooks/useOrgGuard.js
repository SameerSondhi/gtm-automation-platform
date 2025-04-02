// src/hooks/useOrgGuard.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useOrgGuard() {
  const { session } = useAuth();
  const user = session?.user;
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/org/check/${user.id}`);
        const result = await res.json();

        if (result?.inOrg) {
          // Return actual org ID if available
          setOrgId(result.orgId || true);
        }
      } catch (err) {
        console.error('🔐 Org check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user]);

  return { orgId, loading };
}