import React, { useState } from 'react';
import { 
  Add as AddIcon, 
  Clear as ClearIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  Delete as DeleteIcon,
  MyLocation as LocationIcon
} from '@mui/icons-material';

const CoordinateSelectorModal = ({ 
  onCoordinatesSelected, 
  onClose, 
  onCoordinateSelect,
  onDrawingStart,
  onDrawingStop,
  onCoordinateAdd,
  isSinglePoint = false,
  maxCoordinates = null
}) => {
  const [coordinates, setCoordinates] = useState([]);
  const [currentLat, setCurrentLat] = useState('');
  const [currentLng, setCurrentLng] = useState('');

  const addCoordinate = () => {
    if (currentLat && currentLng) {
      const lat = parseFloat(currentLat);
      const lng = parseFloat(currentLng);
      
      if (isNaN(lat) || isNaN(lng)) {
        alert('Veuillez entrer des coordonnées valides');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        alert('La latitude doit être comprise entre -90 et 90');
        return;
      }
      
      if (lng < -180 || lng > 180) {
        alert('La longitude doit être comprise entre -180 et 180');
        return;
      }
      
      // Vérifier la limite de coordonnées
      if (maxCoordinates && coordinates.length >= maxCoordinates) {
        alert(`Vous ne pouvez ajouter que ${maxCoordinates} coordonnée${maxCoordinates > 1 ? 's' : ''}`);
        return;
      }
      
      setCoordinates(prev => [...prev, [lat, lng]]);
      setCurrentLat('');
      setCurrentLng('');
    }
  };

  const removeCoordinate = (index) => {
    setCoordinates(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setCoordinates([]);
  };

  const finishSelection = () => {
    if (maxCoordinates === 1 || isSinglePoint) {
      if (coordinates.length === 1) {
        onCoordinateSelect(coordinates[0][0], coordinates[0][1]);
      } else {
        alert('Veuillez ajouter exactement 1 coordonnée pour un point');
      }
    } else {
      if (coordinates.length >= 3) {
        // Fermer le polygone en ajoutant le premier point à la fin
        const closedCoordinates = [...coordinates, coordinates[0]];
        onCoordinatesSelected(closedCoordinates);
      } else {
        alert('Veuillez ajouter au moins 3 coordonnées pour former un polygone');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCoordinate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-4 sm:p-6 pb-0 border-b border-gray-200 mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 m-0">
            <LocationIcon className="text-blue-600" /> {isSinglePoint ? 'Sélectionner un point' : 'Sélectionner des coordonnées'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">{isSinglePoint ? 'Ajouter un point' : 'Ajouter une coordonnée'}</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-700">
                    Latitude (-90 à 90)
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    value={currentLat}
                    onChange={(e) => setCurrentLat(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="5.123456"
                    step="any"
                    min="-90"
                    max="90"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block mb-2 text-sm font-medium text-gray-700">
                    Longitude (-180 à 180)
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    value={currentLng}
                    onChange={(e) => setCurrentLng(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="-4.123456"
                    step="any"
                    min="-180"
                    max="180"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={addCoordinate}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!currentLat || !currentLng || (maxCoordinates && coordinates.length >= maxCoordinates)}
              >
                <AddIcon /> Ajouter
                {maxCoordinates && (
                  <span className="text-xs">
                    ({coordinates.length}/{maxCoordinates})
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Coordonnées sélectionnées ({coordinates.length})</h4>
            <div className="flex justify-end mb-4">
              <button 
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={coordinates.length === 0}
              >
                <ClearIcon /> Tout effacer
              </button>
            </div>
            
            {coordinates.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">Aucune coordonnée ajoutée</p>
                <p className="text-sm">
                  {maxCoordinates === 1 
                    ? 'Ajoutez exactement 1 coordonnée pour un point' 
                    : isSinglePoint 
                      ? 'Ajoutez exactement 1 coordonnée pour un point'
                      : 'Ajoutez au moins 3 coordonnées pour former un polygone'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {coordinates.map((coord, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-mono text-gray-700">
                        {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeCoordinate(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer cette coordonnée"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-5 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-5 py-3 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <CloseIcon /> Annuler
            </button>
            <button 
              onClick={finishSelection}
              className="px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={
                maxCoordinates === 1 
                  ? coordinates.length !== 1 
                  : isSinglePoint 
                    ? coordinates.length !== 1 
                    : coordinates.length < 3
              }
            >
              <CheckIcon /> Terminer ({coordinates.length} {maxCoordinates === 1 ? 'point' : isSinglePoint ? 'point' : 'points'})
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CoordinateSelectorModal;
