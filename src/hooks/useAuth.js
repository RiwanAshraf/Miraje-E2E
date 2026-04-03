import { useAuthContext } from "../context/AuthContext";

/**
 * Convenience hook — exposes { user, loading } from AuthContext.
 * Usage: const { user, loading } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}
