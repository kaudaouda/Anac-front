import React, { useState } from 'react';
import { 
  Add as AddIcon, 
  Clear as ClearIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  Delete as DeleteIcon,
  MyLocation as LocationIcon
} from '@mui/icons-material';

const CoordinateSelectorModal = ({ onCoordinatesSelected, onClose }) => {
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
    if (coordinates.length >= 3) {
      // Fermer le polygone en ajoutant le premier point à la fin
      const closedCoordinates = [...coordinates, coordinates[0]];
      onCoordinatesSelected(closedCoordinates);
    } else {
      alert('Veuillez ajouter au moins 3 coordonnées pour former un polygone');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCoordinate();
    }
  };

  return (
    <div className="coordinate-selector-modal-overlay">
      <div className="coordinate-selector-modal">
        <div className="modal-header">
          <h3><LocationIcon className="header-icon" /> Sélection des coordonnées</h3>
          <button onClick={onClose} className="close-btn">
            <CloseIcon />
          </button>
        </div>

        <div className="modal-content">
          <div className="coordinate-input-section">
            <h4>Ajouter une coordonnée</h4>
            <div className="coordinate-inputs">
              <div className="input-group">
                <label htmlFor="latitude">Latitude (-90 à 90)</label>
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
                />
              </div>
              <div className="input-group">
                <label htmlFor="longitude">Longitude (-180 à 180)</label>
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
                />
              </div>
              <button 
                onClick={addCoordinate}
                className="add-coordinate-btn"
                disabled={!currentLat || !currentLng}
              >
                <AddIcon /> Ajouter
              </button>
            </div>
          </div>

          <div className="coordinates-list-section">
            <div className="coordinates-header">
              <h4>Coordonnées sélectionnées ({coordinates.length})</h4>
              <button 
                onClick={clearAll}
                className="clear-all-btn"
                disabled={coordinates.length === 0}
              >
                <ClearIcon /> Tout effacer
              </button>
            </div>
            
            {coordinates.length === 0 ? (
              <div className="no-coordinates">
                <p>Aucune coordonnée ajoutée</p>
                <p className="hint">Ajoutez au moins 3 coordonnées pour former un polygone</p>
              </div>
            ) : (
              <div className="coordinates-grid">
                {coordinates.map((coord, index) => (
                  <div key={index} className="coordinate-item">
                    <span className="coordinate-index">{index + 1}</span>
                    <span className="coordinate-lat">{coord[0].toFixed(6)}</span>
                    <span className="coordinate-lng">{coord[1].toFixed(6)}</span>
                    <button 
                      onClick={() => removeCoordinate(index)}
                      className="remove-coordinate-btn"
                      title="Supprimer cette coordonnée"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              onClick={onClose}
              className="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              onClick={finishSelection}
              className="btn btn-primary"
              disabled={coordinates.length < 3}
            >
              <CheckIcon /> Terminer ({coordinates.length} points)
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .coordinate-selector-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .coordinate-selector-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon {
          color: #007bff;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6c757d;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .modal-content {
          padding: 24px;
        }

        .coordinate-input-section {
          margin-bottom: 24px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .coordinate-input-section h4 {
          margin: 0 0 16px 0;
          color: #495057;
          font-size: 16px;
          font-weight: 600;
        }

        .coordinate-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: end;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          margin-bottom: 8px;
          color: #495057;
          font-weight: 500;
          font-size: 14px;
        }

        .input-group input {
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #007bff;
        }

        .add-coordinate-btn {
          padding: 12px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .add-coordinate-btn:hover:not(:disabled) {
          background: #1e7e34;
        }

        .add-coordinate-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .coordinates-list-section {
          margin-bottom: 24px;
        }

        .coordinates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .coordinates-header h4 {
          margin: 0;
          color: #495057;
          font-size: 16px;
          font-weight: 600;
        }

        .clear-all-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-all-btn:hover:not(:disabled) {
          background: #c82333;
        }

        .clear-all-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .no-coordinates {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }

        .no-coordinates p {
          margin: 8px 0;
        }

        .hint {
          font-size: 14px;
          color: #adb5bd;
        }

        .coordinates-grid {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 8px;
        }

        .coordinate-item {
          display: grid;
          grid-template-columns: 50px 1fr 1fr 60px;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f3f4;
          align-items: center;
        }

        .coordinate-item:last-child {
          border-bottom: none;
        }

        .coordinate-index {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
        }

        .coordinate-lat,
        .coordinate-lng {
          color: #495057;
          font-family: monospace;
          font-size: 14px;
        }

        .remove-coordinate-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .remove-coordinate-btn:hover {
          background: #f8d7da;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
        }
      `}</style>
    </div>
  );
};

export default CoordinateSelectorModal;
