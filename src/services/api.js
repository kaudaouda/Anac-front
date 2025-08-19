const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  get publicEndpoints() {
    return [
      '/auth/login/',
      '/auth/register/',
      '/auth/password-reset/',
      '/auth/refresh-token/',
      '/auth/carousel/',
      '/auth/airports/map/',
      '/auth/protected-areas/map/'
    ];
  }

  isPublicEndpoint(endpoint) {
    return this.publicEndpoints.some(publicEndpoint => 
      endpoint.endsWith(publicEndpoint)
    );
  }

  // Méthode générique pour les appels HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important pour inclure les cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        // Essayer de rafraîchir le token automatiquement
        if (!this.isPublicEndpoint(endpoint)) {
          try {
            await this.refreshToken();
            // Réessayer la requête originale
            return this.request(endpoint, options);
          } catch (refreshError) {
            // Rediriger vers la page de connexion si le refresh échoue
            this.handleAuthError();
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.detail || `Erreur HTTP ${response.status}`;
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        
        throw error;
      }

      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      throw error;
    }
  }

  // Méthode pour rafraîchir le token
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Gérer les erreurs d'authentification
  handleAuthError() {
    // Supprimer le cookie d'authentification côté client
    document.cookie = 'is_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Rediriger vers la page de connexion
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Méthode GET
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // Méthode POST
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Méthode PUT
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Méthode PATCH
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Méthode DELETE
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
