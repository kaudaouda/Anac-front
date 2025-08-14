const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Liste des endpoints qui ne nécessitent pas d'authentification
  get publicEndpoints() {
    return [
      '/auth/login/',
      '/auth/register/',
      '/auth/password-reset/',
      '/auth/refresh-token/',
      '/auth/check-auth/'
    ];
  }

  // Vérifier si un endpoint est public (ne nécessite pas d'authentification)
  isPublicEndpoint(endpoint) {
    return this.publicEndpoints.some(publicEndpoint => 
      endpoint.endsWith(publicEndpoint)
    );
  }

  // generic method for http calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // add authentication token only if endpoint is not public
    if (!this.isPublicEndpoint(endpoint)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      console.log(`Request API: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        console.log('Data sent:', JSON.parse(options.body));
      }
      
      const response = await fetch(url, config);
      
      console.log(`Response API: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.detail || `Erreur HTTP ${response.status}`;
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        
        console.error(' Erreur API:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorData: errorData
        });
        
        throw error;
      }

      const responseData = await response.json();
      console.log('Data received:', responseData);
      return responseData;
      
    } catch (error) {
      console.error('Error during API request:', error);
      throw error;
    }
  }

  // GET method
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST method
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT method
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH method
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
