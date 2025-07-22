import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthHooks';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const verifySession = async () => {
      try {
        await axios.get('/dashboard/verify-session', {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        const e = error
       throw new Error(`An unexpected value was thrown: ${e}`);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);
  const login = () => setIsAuthenticated(true);
  const logout = async () => {
    try {
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};