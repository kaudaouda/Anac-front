import apiService from './api';

class AuthService {
  constructor() {
    // Initialiser isAuthenticated de manière synchrone
    this.isAuthenticated = this.checkAuthStatusSync();
  }

  // Vérifier si l'utilisateur est connecté (version synchrone pour le constructeur)
  checkAuthStatusSync() {
    const token = localStorage.getItem('accessToken');
    return !!token && !this.isTokenExpired(token);
  }

  // Vérifier si l'utilisateur est connecté (version asynchrone pour l'API)
  async checkAuthStatus() {
    try {
      const response = await apiService.get('/auth/check-auth/');
      this.isAuthenticated = true;
      this.setUser(response.user);
      return response;
    } catch (error) {
      this.isAuthenticated = false;
      this.clearAuth();
      throw error;
    }
  }

  // Vérifier si le token est expiré
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  // Inscription d'un nouvel utilisateur
  async register(userData) {
    try {
      console.log('🔐 Tentative d\'inscription avec les données:', userData);
      
      const response = await apiService.post('/auth/register/', userData);
      
      console.log('✅ Inscription réussie:', response);
      
      if (response.tokens) {
        this.setTokens(response.tokens);
        this.setUser(response.user);
        this.isAuthenticated = true;
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      console.error('📊 Données envoyées:', userData);
      
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
      
      if (response.tokens) {
        this.setTokens(response.tokens);
        this.setUser(response.user);
        this.isAuthenticated = true;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion utilisateur
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await apiService.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Rafraîchir le token d'accès
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement disponible');
      }

      const response = await apiService.post('/auth/refresh-token/', {
        refresh_token: refreshToken
      });

      if (response.access) {
        localStorage.setItem('accessToken', response.access);
        return response.access;
      }
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
      this.setUser(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(profileData) {
    try {
      const response = await apiService.patch('/auth/profile/', profileData);
      this.setUser(response);
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

  // Stocker les tokens
  setTokens(tokens) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  }

  // Stocker les informations utilisateur
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Récupérer les informations utilisateur
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Récupérer le token d'accès
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Nettoyer l'authentification
  clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
  }
}

export default new AuthService();
