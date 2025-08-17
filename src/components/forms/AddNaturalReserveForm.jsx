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

const AddNaturalReserveForm = ({ onClose, onSuccess }) => {
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

  return (
    <div className="add-reserve-form-overlay">
      <div className="add-reserve-form-modal">
        <div className="form-header">
          <h2><AddIcon className="header-icon" /> Ajouter une réserve naturelle</h2>
          <button onClick={onClose} className="close-btn">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-reserve-form">
          <div className="form-group">
            <label htmlFor="reserve_id">Identifiant unique *</label>
            <div className="input-with-button">
              <input
                type="text"
                id="reserve_id"
                name="reserve_id"
                value={formData.reserve_id}
                onChange={handleInputChange}
                required
                placeholder="res-azagny"
              />
              <button 
                type="button" 
                onClick={generateReserveId}
                className="generate-btn"
              >
                <RefreshIcon /> Générer
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nom de la réserve *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Réserve Naturelle de..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">Superficie *</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              placeholder="194 km²"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Description de la réserve naturelle..."
            />
          </div>

          <div className="form-group">
            <label>Coordonnées GPS *</label>
            <div className="coordinates-section">
              {coordinates.length > 0 ? (
                <div className="coordinates-display">
                  <div className="coordinates-header">
                    <span>Polygone avec {coordinates.length} points</span>
                    <button 
                      type="button"
                      onClick={() => setShowCoordinateSelector(true)}
                      className="edit-coordinates-btn"
                    >
                      <EditIcon /> Modifier
                    </button>
                  </div>
                  <div className="coordinates-preview">
                    {coordinates.slice(0, 3).map((coord, index) => (
                      <span key={index} className="coordinate-preview">
                        {coord[0].toFixed(4)}, {coord[1].toFixed(4)}
                      </span>
                    ))}
                    {coordinates.length > 3 && (
                      <span className="more-coordinates">
                        +{coordinates.length - 3} autres...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setShowCoordinateSelector(true)}
                  className="select-coordinates-btn"
                >
                  <MapIcon /> Sélectionner sur la carte
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || coordinates.length < 3}
            >
              {isSubmitting ? '⏳ Création...' : <><CheckIcon /> Créer la réserve</>}
            </button>
          </div>
        </form>

        {showCoordinateSelector && (
          <CoordinateSelectorModal
            onCoordinatesSelected={handleCoordinatesSelected}
            onClose={() => setShowCoordinateSelector(false)}
          />
        )}
      </div>

      <style>{`
        .add-reserve-form-overlay {
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

        .add-reserve-form-modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e9ecef;
        }

        .form-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-icon {
          color: #28a745;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
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

        .add-reserve-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #495057;
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .input-with-button {
          display: flex;
          gap: 10px;
        }

        .input-with-button input {
          flex: 1;
        }

        .generate-btn {
          padding: 12px 16px;
          background: #6f42c1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .generate-btn:hover {
          background: #5a32a3;
        }

        .coordinates-section {
          margin-top: 10px;
        }

        .select-coordinates-btn {
          width: 100%;
          padding: 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .select-coordinates-btn:hover {
          background: #1e7e34;
        }

        .coordinates-display {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          background: #f8f9fa;
        }

        .coordinates-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .coordinates-header span {
          font-weight: 500;
          color: #495057;
        }

        .edit-coordinates-btn {
          padding: 8px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .edit-coordinates-btn:hover {
          background: #0056b3;
        }

        .coordinates-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .coordinate-preview {
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          color: #6c757d;
          border: 1px solid #dee2e6;
        }

        .more-coordinates {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #6c757d;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
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

export default AddNaturalReserveForm;
