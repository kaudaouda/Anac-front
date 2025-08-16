// Configuration pour l'application ANAC
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Construit l'URL complète d'une image à partir de l'URL relative
 * @param {string} imageUrl - URL relative de l'image
 * @returns {string} URL complète de l'image
 */
export function buildImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/storage/')) {
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  }
  
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  }
  
  
  return `${API_BASE_URL}${imageUrl}`;
}

export { API_BASE_URL };
