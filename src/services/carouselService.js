import apiService from './api.js';
import { buildImageUrl } from '../config.js';

class CarouselService {

  async getCarouselImages() {
    try {
      const response = await apiService.get('/auth/carousel/');
      const images = response.images || [];
      
      console.log('Images reçues du backend:', images);
      

      const processedImages = images.map(image => {
        const originalUrl = image.image_url;
        const processedUrl = buildImageUrl(image.image_url);
        console.log(`Image: ${image.title || 'Sans titre'}`);
        console.log(`  URL originale: ${originalUrl}`);
        console.log(`  URL traitée: ${processedUrl}`);
        
        return {
          ...image,
          image_url: processedUrl
        };
      });
      
      console.log('Images traitées:', processedImages);
      return processedImages;
    } catch (error) {
      console.error('Erreur lors de la récupération des images de carrousel:', error);
      
      return [];
    }
  }


  async getCarouselImage(id) {
    try {
      const response = await apiService.get(`/auth/carousel/${id}/`);
      if (response.image_url) {
        response.image_url = buildImageUrl(response.image_url);
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'image ${id}:`, error);
      return null;
    }
  }


  async createCarouselImage(formData) {
    try {
      const response = await fetch(`${apiService.baseURL}/auth/carousel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.image && result.image.image_url) {
        result.image.image_url = buildImageUrl(result.image.image_url);
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la création de l\'image de carrousel:', error);
      throw error;
    }
  }


  async updateCarouselImage(id, formData) {
    try {
      const response = await fetch(`${apiService.baseURL}/auth/carousel/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.image_url) {
        result.image_url = buildImageUrl(result.image_url);
      }
      return result;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'image ${id}:`, error);
      throw error;
    }
  }


  async deleteCarouselImage(id) {
    try {
      await apiService.delete(`/auth/carousel/${id}/`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'image ${id}:`, error);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await apiService.get('/auth/carousel/');
      return response && response.status === 'success';
    } catch (error) {
      console.error('Erreur de santé de l\'API carrousel:', error);
      return false;
    }
  }
}

export default new CarouselService();
