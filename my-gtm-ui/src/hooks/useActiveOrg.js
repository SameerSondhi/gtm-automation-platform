import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useActiveOrg = () => {
  const { session } = useAuth();
  const user = session?.user;

  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/org/check/${user.id}`);
        const result = await res.json();

        if (result?.inOrg && result?.orgId) {
          setOrgId(result.orgId);
        }
      } catch (err) {
        console.error('Failed to fetch orgId:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, [user]);

  return { orgId, loading };
};

export default useActiveOrg;