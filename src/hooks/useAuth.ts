import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .verify()
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
      })
      .finally(() => setLoading(false));
  }, []);

  return { isAuthenticated, loading };
}
