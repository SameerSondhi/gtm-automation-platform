// src/hooks/useCurrentUser.js
import { useAuth } from '../context/AuthContext';

export default function useCurrentUser() {
  const { session } = useAuth();
  return session?.user;
}