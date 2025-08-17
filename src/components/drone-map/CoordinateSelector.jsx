import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';

const CoordinateSelector = ({ onCoordinatesSelected, isActive, onCancel }) => {
  const [coordinates, setCoordinates] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (!isActive) {
      setCoordinates([]);
      setIsDrawing(false);
      return;
    }

    // Activer le mode de sélection
    const handleMapClick = (e) => {
      if (!isActive || !isDrawing) return;
      
      const { lat, lng } = e.latlng;
      setCoordinates(prev => [...prev, [lat, lng]]);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && coordinates.length > 2) {
        // Fermer le polygone
        setCoordinates(prev => [...prev, prev[0]]);
        setIsDrawing(false);
      }
    };

    map.on('click', handleMapClick);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      map.off('click', handleMapClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [map, isActive, isDrawing, coordinates, onCancel]);

  const startDrawing = () => {
    setIsDrawing(true);
    setCoordinates([]);
  };

  const finishDrawing = () => {
    if (coordinates.length > 2) {
      // Fermer le polygone
      const closedCoordinates = [...coordinates, coordinates[0]];
      onCoordinatesSelected(closedCoordinates);
    }
    setIsDrawing(false);
    setCoordinates([]);
  };

  const clearCoordinates = () => {
    setCoordinates([]);
    setIsDrawing(false);
  };

  if (!isActive) return null;

  return (
    <div className="coordinate-selector">
      <div className="coordinate-selector-panel">
        <h3>🎯 Sélection des coordonnées</h3>
        
        {!isDrawing ? (
          <div className="coordinate-selector-controls">
            <button 
              onClick={startDrawing}
              className="btn btn-primary"
            >
              🖊️ Commencer le dessin
            </button>
            <button 
              onClick={onCancel}
              className="btn btn-secondary"
            >
              ❌ Annuler
            </button>
          </div>
        ) : (
          <div className="coordinate-selector-controls">
            <p className="coordinate-instructions">
              💡 Cliquez sur la carte pour ajouter des points.<br/>
              Appuyez sur <kbd>Entrée</kbd> pour fermer le polygone.<br/>
              Appuyez sur <kbd>Échap</kbd> pour annuler.
            </p>
            <div className="coordinate-actions">
              <button 
                onClick={finishDrawing}
                className="btn btn-success"
                disabled={coordinates.length < 3}
              >
                ✅ Terminer ({coordinates.length} points)
              </button>
              <button 
                onClick={clearCoordinates}
                className="btn btn-warning"
              >
                🔄 Recommencer
              </button>
              <button 
                onClick={onCancel}
                className="btn btn-secondary"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        )}
        
        {coordinates.length > 0 && (
          <div className="coordinates-list">
            <h4>Points sélectionnés ({coordinates.length})</h4>
            <div className="coordinates-grid">
              {coordinates.map((coord, index) => (
                <div key={index} className="coordinate-item">
                  <span className="coordinate-index">{index + 1}</span>
                  <span className="coordinate-lat">{coord[0].toFixed(6)}</span>
                  <span className="coordinate-lng">{coord[1].toFixed(6)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .coordinate-selector {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          max-width: 400px;
          font-family: 'Inter', sans-serif;
        }

        .coordinate-selector-panel h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
        }

        .coordinate-selector-controls {
          margin-bottom: 20px;
        }

        .coordinate-instructions {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.5;
          color: #495057;
        }

        .coordinate-instructions kbd {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        .coordinate-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover {
          background: #1e7e34;
        }

        .btn-success:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning:hover {
          background: #e0a800;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .coordinates-list {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }

        .coordinates-list h4 {
          margin: 0 0 15px 0;
          color: #495057;
          font-size: 16px;
          font-weight: 600;
        }

        .coordinates-grid {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #dee2e6;
          border-radius: 6px;
        }

        .coordinate-item {
          display: grid;
          grid-template-columns: 40px 1fr 1fr;
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1px solid #f1f3f4;
          font-size: 12px;
          font-family: monospace;
        }

        .coordinate-item:last-child {
          border-bottom: none;
        }

        .coordinate-index {
          background: #e9ecef;
          color: #495057;
          padding: 2px 6px;
          border-radius: 4px;
          text-align: center;
          font-weight: 600;
        }

        .coordinate-lat,
        .coordinate-lng {
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default CoordinateSelector;
