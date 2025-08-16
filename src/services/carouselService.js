import apiService from './api.js';
import { buildImageUrl } from '../config.js';

class CarouselService {

  async getCarouselImages() {
    try {
      const response = await apiService.get('/auth/carousel/');
      const images = response.images || [];
      
      const processedImages = images.map(image => {
        const processedUrl = buildImageUrl(image.image_url);
        
        return {
          ...image,
          image_url: processedUrl
        };
      });
      
      return processedImages;
      
    } catch (error) {
      return this.getDefaultImages();
    }
  }

  getDefaultImages() {
    return [
      {
        id: 'default-1',
        title: 'Drone 1',
        description: 'Image par défaut',
        image_url: '/src/assets/images/d2-Drx4MZxP.png',
        order: 0,
        is_active: true
      },
      {
        id: 'default-2',
        title: 'Drone 2',
        description: 'Image par défaut',
        image_url: '/src/assets/images/d4-jJhHUjr-.png',
        order: 1,
        is_active: true
      },
      {
        id: 'default-3',
        title: 'Drone 3',
        description: 'Image par défaut',
        image_url: '/src/assets/images/d5-BAxVu4DM.png',
        order: 2,
        is_active: true
      }
    ];
  }

  async getCarouselImage(id) {
    try {
      const response = await apiService.get(`/auth/carousel/${id}/`);
      if (response.image_url) {
        response.image_url = buildImageUrl(response.image_url);
      }
      return response;
    } catch (error) {
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
      throw error;
    }
  }

  async deleteCarouselImage(id) {
    try {
      await apiService.delete(`/auth/carousel/${id}/`);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await apiService.get('/auth/carousel/');
      return response && response.status === 'success';
    } catch (error) {
      return false;
    }
  }
}

export default new CarouselService();
