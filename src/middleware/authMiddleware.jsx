import authService from '../services/authService';

/**
 * Middleware d'authentification pour les routes protégées
 */
export class AuthMiddleware {
  /**
   * Vérifier si l'utilisateur est authentifié
   */
  static async checkAuth() {
    try {
      // Vérifier d'abord le cookie côté client
      if (authService.isAuthenticated) {
        // Vérifier avec l'API pour confirmer
        const response = await authService.checkAuthStatus();
        return response.success && response.user;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      return false;
    }
  }

  /**
   * Rediriger vers la page de connexion si non authentifié
   */
  static redirectToLogin() {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Rediriger vers le dashboard si déjà authentifié
   */
  static redirectToDashboard() {
    if (window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  }

  /**
   * Vérifier l'authentification et rediriger si nécessaire
   */
  static async requireAuth() {
    const isAuth = await this.checkAuth();
    if (!isAuth) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  /**
   * Vérifier que l'utilisateur n'est PAS authentifié (pour les pages de connexion)
   */
  static async requireGuest() {
    const isAuth = await this.checkAuth();
    if (isAuth) {
      this.redirectToDashboard();
      return false;
    }
    return true;
  }

  /**
   * Rafraîchir l'authentification automatiquement
   */
  static async refreshAuth() {
    try {
      const isAuth = await authService.forceAuthCheck();
      return isAuth;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'authentification:', error);
      return false;
    }
  }

  /**
   * Déconnecter l'utilisateur et rediriger
   */
  static async logout() {
    try {
      await authService.logout();
      this.redirectToLogin();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la redirection même en cas d'erreur
      this.redirectToLogin();
    }
  }
}

export default AuthMiddleware;
