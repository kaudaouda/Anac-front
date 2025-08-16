import apiService from './api';

class ProtectedAreasService {
  async getProtectedAreasForMap() {
    try {
      const response = await apiService.get('/auth/protected-areas/map/');
      
      if (response) {
        return {
          success: true,
          data: response,
          error: null
        };
      }
      
      return {
        success: false,
        data: null,
        error: 'Erreur lors de la récupération des zones protégées'
      };
      
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Erreur de connexion au serveur'
      };
    }
  }

  async getProtectedAreasWithFallback() {
    try {
      const apiResult = await this.getProtectedAreasForMap();
      
      if (apiResult.success) {
        return apiResult.data;
      }
      
      return {
        natural_reserves: [],
        national_parks: []
      };
      
    } catch (error) {
      return {
        natural_reserves: [],
        national_parks: []
      };
    }
  }
}

export const protectedAreasService = new ProtectedAreasService();
