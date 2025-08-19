import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthMiddleware from '../middleware/authMiddleware';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsChecking(true);
        
        if (requireAuth) {
          // Route protégée - vérifier l'authentification
          const isAuth = await AuthMiddleware.requireAuth();
          if (!isAuth) {
            // Redirection automatique gérée par le middleware
            return;
          }
        } else {
          // Route pour invités - vérifier que l'utilisateur n'est PAS connecté
          const isGuest = await AuthMiddleware.requireGuest();
          if (!isGuest) {
            // Redirection automatique gérée par le middleware
            return;
          }
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setIsChecking(false);
        
        if (requireAuth) {
          navigate('/login', { 
            state: { from: location },
            replace: true 
          });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    verifyAuth();
  }, [requireAuth, navigate, location]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si l'authentification est en cours de vérification côté contexte
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Vérifier l'authentification selon le type de route
  if (requireAuth && !isAuthenticated) {
    // Route protégée mais utilisateur non authentifié
    navigate('/login', { 
      state: { from: location },
      replace: true 
    });
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    // Route pour invités mais utilisateur déjà connecté
    navigate('/dashboard', { replace: true });
    return null;
  }

  // Route accessible - afficher le contenu
  return children;
};

export default ProtectedRoute;
