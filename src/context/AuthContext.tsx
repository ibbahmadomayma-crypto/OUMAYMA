import React, { createContext, useContext, useState, useEffect } from 'react';

interface OwnerUser {
  email: string;
  name: string;
  role: 'owner' | 'admin';
  lastLogin: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: OwnerUser | null;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AUTH_STORAGE_KEY = 'maison_omayma_auth_session_v1';
const CREDENTIALS_KEY = 'maison_omayma_owner_creds_v1';

const DEFAULT_CREDENTIALS = {
  email: 'ibbahmadomayma@gmail.com',
  password: 'admin123',
  name: 'Omayma (Store Owner)'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      return session ? JSON.parse(session).isLoggedIn : false;
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<OwnerUser | null>(() => {
    try {
      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      return session ? JSON.parse(session).user : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize stored credentials if not set
  useEffect(() => {
    if (!localStorage.getItem(CREDENTIALS_KEY)) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    }
  }, []);

  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    try {
      const credsRaw = localStorage.getItem(CREDENTIALS_KEY);
      const creds = credsRaw ? JSON.parse(credsRaw) : DEFAULT_CREDENTIALS;

      const trimmedEmail = email.trim().toLowerCase();
      const targetEmail = creds.email.toLowerCase();

      if (trimmedEmail === targetEmail && pass === creds.password) {
        const ownerUser: OwnerUser = {
          email: creds.email,
          name: creds.name || 'Store Owner',
          role: 'owner',
          lastLogin: new Date().toISOString(),
        };

        setIsAuthenticated(true);
        setUser(ownerUser);
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ isLoggedIn: true, user: ownerUser })
        );
        setIsLoginModalOpen(false);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Invalid credentials. Only the verified store owner has access.',
        };
      }
    } catch {
      return { success: false, error: 'Authentication service temporarily unavailable.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updatePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    try {
      const credsRaw = localStorage.getItem(CREDENTIALS_KEY);
      const creds = credsRaw ? JSON.parse(credsRaw) : DEFAULT_CREDENTIALS;

      if (creds.password !== oldPass) {
        return { success: false, error: 'Current password does not match.' };
      }
      if (newPass.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }

      creds.password = newPass;
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update credentials.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updatePassword,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
