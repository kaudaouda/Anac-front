import apiService from './api';

class AirportService {
  async getAirportsForMap() {
    try {
      const response = await apiService.get('/auth/airports/map/');
      
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
        error: 'Erreur lors de la récupération des aéroports'
      };
      
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'Erreur de connexion au serveur'
      };
    }
  }

  async getAirportsWithFallback() {
    try {
      const apiResult = await this.getAirportsForMap();
      
      if (apiResult.success) {
        return apiResult.data;
      }
      
      return {
        airports: [],
        aerodromes: []
      };
      
    } catch (error) {
      return {
        airports: [],
        aerodromes: []
      };
    }
  }
}

export const airportService = new AirportService();
