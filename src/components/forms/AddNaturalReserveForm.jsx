import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CoordinateSelectorModal from './CoordinateSelectorModal';
import { API_BASE_URL } from '../../config';
import authService from '../../services/authService';
import { 
  Add as AddIcon, 
  Refresh as RefreshIcon, 
  Edit as EditIcon, 
  Close as CloseIcon,
  Check as CheckIcon,
  Map as MapIcon
} from '@mui/icons-material';

const AddNaturalReserveForm = ({ onClose, onSuccess, onDrawingStart, onDrawingStop, onCoordinateAdd }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    reserve_id: '',
    name: '',
    area: '',
    description: ''
  });
  const [coordinates, setCoordinates] = useState([]);
  const [showCoordinateSelector, setShowCoordinateSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinatesSelected = (selectedCoordinates) => {
    setCoordinates(selectedCoordinates);
    setShowCoordinateSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour ajouter une réserve');
      return;
    }

    if (coordinates.length < 3) {
      setError('Veuillez sélectionner au moins 3 coordonnées pour former un polygone');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/protected-areas/reserves/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          ...formData,
          coordinates: coordinates
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data);
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la création de la réserve');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReserveId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    setFormData(prev => ({
      ...prev,
      reserve_id: `res-${timestamp}-${random}`
    }));
  };

  const handleMapClick = () => {
    if (onDrawingStart) onDrawingStart();
    setShowCoordinateSelector(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-4 sm:p-6 pb-0 border-b border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 m-0">
            <AddIcon className="text-green-600" /> Ajouter une réserve naturelle
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
            <label htmlFor="reserve_id" className="block mb-2 text-sm font-medium text-gray-700">
              Identifiant unique *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="reserve_id"
                name="reserve_id"
                value={formData.reserve_id}
                onChange={handleInputChange}
                required
                placeholder="res-azagny"
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button 
                type="button" 
                onClick={generateReserveId}
                className="px-4 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <RefreshIcon /> Générer
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Nom de la réserve *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Réserve Naturelle de..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="area" className="block mb-2 text-sm font-medium text-gray-700">
              Superficie *
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              placeholder="194 km²"
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
              placeholder="Description de la réserve naturelle..."
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
                    <span className="font-medium text-gray-700">Polygone avec {coordinates.length} points</span>
                    <button 
                      type="button"
                      onClick={() => setShowCoordinateSelector(true)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <EditIcon /> Modifier
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {coordinates.slice(0, 3).map((coord, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </span>
                    ))}
                    {coordinates.length > 3 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        +{coordinates.length - 3} autres...
                      </span>
                    )}
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
              disabled={isSubmitting}
            >
              <CloseIcon /> Annuler
            </button>
            <button 
              type="submit" 
              className="px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting || coordinates.length < 3}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création...
                </>
              ) : (
                <>
                  <CheckIcon /> Créer la réserve
                </>
              )}
            </button>
          </div>
        </form>

        {showCoordinateSelector && (
          <CoordinateSelectorModal
            onCoordinatesSelected={handleCoordinatesSelected}
            onClose={() => setShowCoordinateSelector(false)}
            onDrawingStart={onDrawingStart}
            onDrawingStop={onDrawingStop}
            onCoordinateAdd={onCoordinateAdd}
            isSinglePoint={false}
            maxCoordinates={null}
          />
        )}
      </div>
    </div>
  );
};

export default AddNaturalReserveForm;
