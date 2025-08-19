import React, { useState, useEffect } from 'react';
import AuthMiddleware from './authMiddleware';

/**
 * HOC pour protéger les composants (utilisateur authentifié requis)
 */
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const auth = await AuthMiddleware.checkAuth();
        setIsAuthenticated(auth);
        setIsLoading(false);
      };

      checkAuth();
    }, []);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      AuthMiddleware.redirectToLogin();
      return null;
    }

    return <Component {...props} />;
  };
};

/**
 * HOC pour les composants invités (utilisateur NON authentifié requis)
 */
export const withGuest = (Component) => {
  return function GuestComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const auth = await AuthMiddleware.checkAuth();
        setIsAuthenticated(auth);
        setIsLoading(false);
      };

      checkAuth();
    }, []);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      AuthMiddleware.redirectToDashboard();
      return null;
    }

    return <Component {...props} />;
  };
};

export default { withAuth, withGuest };
