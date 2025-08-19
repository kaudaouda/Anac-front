import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement de l'app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Vérifier d'abord le cookie côté client
      if (authService.isAuthenticated) {
        // Vérifier avec l'API pour obtenir les informations utilisateur
        const response = await authService.checkAuthStatus();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        authService.isAuthenticated = true;
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        authService.isAuthenticated = true;
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      authService.isAuthenticated = false;
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(profileData);
      setUser(response);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshAuth = async () => {
    try {
      const isAuth = await authService.forceAuthCheck();
      if (isAuth) {
        await checkAuthStatus();
      }
      return isAuth;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'authentification:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    clearError,
    checkAuthStatus,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
