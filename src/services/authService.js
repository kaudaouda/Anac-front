import apiService from './api';

class AuthService {
  constructor() {
    // Initialiser isAuthenticated de manière synchrone
    this.isAuthenticated = this.checkAuthStatusSync();
  }

  // Vérifier si l'utilisateur est connecté (version synchrone pour le constructeur)
  checkAuthStatusSync() {
    // Vérifier le cookie d'authentification
    const isAuthCookie = this.getCookie('is_authenticated');
    return isAuthCookie === 'true';
  }

  // Vérifier si l'utilisateur est connecté (version asynchrone pour l'API)
  async checkAuthStatus() {
    try {
      const response = await apiService.get('/auth/check-auth/');
      this.isAuthenticated = true;
      return response;
    } catch (error) {
      this.isAuthenticated = false;
      this.clearAuth();
      throw error;
    }
  }

  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      console.log('🔐 Tentative d\'inscription avec les données:', userData);
      
      const response = await apiService.post('/auth/register/', userData);
      
      console.log('✅ Inscription réussie:', response);
      
      if (response.success) {
        this.isAuthenticated = true;
        // Les cookies sont automatiquement définis par le serveur
      }
      
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      console.error('Données envoyées:', userData);
      
      // Améliorer le message d'erreur pour l'utilisateur
      if (error.message.includes('400')) {
        throw new Error('Données invalides. Vérifiez que tous les champs sont correctement remplis.');
      } else if (error.message.includes('409')) {
        throw new Error('Un compte avec cet email existe déjà.');
      } else if (error.message.includes('500')) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        throw new Error(`Erreur lors de la création du compte: ${error.message}`);
      }
    }
  }

  // Connexion utilisateur
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login/', credentials);
      
      if (response.success) {
        this.isAuthenticated = true;
        // Les cookies sont automatiquement définis par le serveur
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion utilisateur
  async logout() {
    try {
      await apiService.post('/auth/logout/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Rafraîchir le token d'accès
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh-token/');
      
      if (response.success) {
        // Le cookie d'accès est automatiquement mis à jour par le serveur
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Récupérer le profil utilisateur
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile/');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(profileData) {
    try {
      const response = await apiService.patch('/auth/profile/', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiService.post('/auth/change-password/', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Demander la réinitialisation du mot de passe
  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/password-reset/', { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les informations utilisateur depuis le cookie
  getUser() {
    try {
      // Essayer de récupérer les informations utilisateur depuis l'API
      // car les cookies HttpOnly ne sont pas accessibles côté client
      return null;
    } catch (error) {
      return null;
    }
  }

  // Nettoyer l'authentification
  clearAuth() {
    // Supprimer le cookie d'authentification côté client
    this.deleteCookie('is_authenticated');
    this.isAuthenticated = false;
  }

  // Utilitaires pour les cookies
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Vérifier si l'utilisateur est connecté
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Méthode pour forcer la vérification de l'authentification
  async forceAuthCheck() {
    try {
      await this.checkAuthStatus();
      return this.isAuthenticated;
    } catch (error) {
      this.isAuthenticated = false;
      return false;
    }
  }
}

export default new AuthService();
