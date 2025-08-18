import React, { useState } from 'react';
import { 
  Add as AddIcon, 
  Refresh as RefreshIcon, 
  Edit as EditIcon, 
  Close as CloseIcon, 
  Check as CheckIcon, 
  Map as MapIcon 
} from '@mui/icons-material';
import CoordinateSelectorModal from './CoordinateSelectorModal';
import { API_BASE_URL } from '../../config';
import authService from '../../services/authService';

const AddAirportForm = ({ onClose, onSuccess, onDrawingStart, onDrawingStop, onCoordinateAdd }) => {
  const [formData, setFormData] = useState({
    airport_id: '',
    name: '',
    code: '',
    airport_type: 'aerodrome',
    city: '',
    latitude: '',
    longitude: '',
    radius: '5',
    description: ''
  });

  const [showCoordinateSelector, setShowCoordinateSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coordinates.length) {
      setError('Veuillez sélectionner les coordonnées GPS de l\'aéroport');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/airports/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(coordinates[0][0]),
          longitude: parseFloat(coordinates[0][1])
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data);
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la création de l\'aéroport');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAirportId = () => {
    const timestamp = Date.now().toString(36).substr(-3);
    const random = Math.random().toString(36).substr(2, 3);
    const type = formData.airport_type === 'international' ? 'i' : 
                 formData.airport_type === 'domestic' ? 'd' : 'a';
    setFormData(prev => ({
      ...prev,
      airport_id: `${type}${timestamp}${random}`
    }));
  };

  const handleCoordinateSelect = (lat, lng) => {
    setCoordinates([[lat, lng]]);
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
    setShowCoordinateSelector(false);
  };

  const handleMapClick = () => {
    onDrawingStart();
    setShowCoordinateSelector(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-4 sm:p-6 pb-0 border-b border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 m-0">
            <AddIcon className="text-green-600" /> Ajouter un aéroport/aérodrome
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-6">
          <div className="mb-5">
            <label htmlFor="airport_id" className="block mb-2 text-sm font-medium text-gray-700">
              Identifiant unique *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="airport_id"
                name="airport_id"
                value={formData.airport_id}
                onChange={handleInputChange}
                required
                maxLength="10"
                placeholder="a123b"
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button 
                type="button" 
                onClick={generateAirportId}
                className="px-4 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <RefreshIcon /> Générer
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Nom de l'aéroport *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Aéroport de..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-700">
              Code IATA
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              maxLength="3"
              placeholder="ABJ"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="airport_type" className="block mb-2 text-sm font-medium text-gray-700">
              Type d'aéroport *
            </label>
            <select
              id="airport_type"
              name="airport_type"
              value={formData.airport_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="aerodrome">Aérodrome</option>
              <option value="domestic">Aéroport Domestique</option>
              <option value="international">Aéroport International</option>
            </select>
          </div>

          <div className="mb-5">
            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder="Abidjan"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="radius" className="block mb-2 text-sm font-medium text-gray-700">
              Rayon de la zone interdite (km) *
            </label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={formData.radius}
              onChange={handleInputChange}
              required
              min="0.1"
              max="50"
              step="0.1"
              placeholder="5"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Description de l'aéroport..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Coordonnées GPS *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              {coordinates.length > 0 ? (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Point sélectionné</span>
                    <button 
                      type="button"
                      onClick={() => setShowCoordinateSelector(true)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <EditIcon /> Modifier
                    </button>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Latitude: {coordinates[0][0].toFixed(6)}</span>
                    <span>Longitude: {coordinates[0][1].toFixed(6)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="mb-3">Aucune coordonnée sélectionnée</p>
                  <button 
                    type="button"
                    onClick={handleMapClick}
                    className="px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <MapIcon /> Sélectionner sur la carte
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg mb-5 text-sm">
              <span>❌ {error}</span>
            </div>
          )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-5 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <CloseIcon /> Annuler
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || coordinates.length === 0} 
            className="px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Création...
              </>
            ) : (
              <>
                <CheckIcon /> Créer l'aéroport
              </>
            )}
          </button>
        </div>
        </form>

                 {showCoordinateSelector && (
           <CoordinateSelectorModal
             onClose={() => setShowCoordinateSelector(false)}
             onCoordinateSelect={handleCoordinateSelect}
             onDrawingStart={onDrawingStart}
             onDrawingStop={onDrawingStop}
             onCoordinateAdd={onCoordinateAdd}
             isSinglePoint={true}
             maxCoordinates={1}
           />
         )}
      </div>


    </div>
  );
};

export default AddAirportForm;
