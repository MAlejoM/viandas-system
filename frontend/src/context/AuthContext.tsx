import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/apiClient';

// ========================================
// TIPOS
// ========================================

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CADETE';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ========================================
// CONTEXT
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// PROVIDER
// ========================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true al inicio para verificar token guardado

  // Al montar, verificar si hay un token guardado en localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser: AuthUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        apiClient.setToken(savedToken);
      } catch {
        // Si hay algún dato corrupto, limpiar todo
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.instance.post<{ usuario: AuthUser; token: string }>(
      '/usuarios/login',
      { email, password }
    );

    const { usuario, token: newToken } = response.data;

    // Persistir en localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(usuario));

    // Actualizar el apiClient para que todas las llamadas siguientes incluyan el token
    apiClient.setToken(newToken);

    setUser(usuario);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    apiClient.clearToken();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ========================================
// HOOK
// ========================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
