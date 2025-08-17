import React, { useEffect, useState } from 'react';
import { DroneMapHeader, DroneMap } from '../components/drone-map';
import { airportService } from '../services/airportService';
import { protectedAreasService } from '../services/protectedAreasService';
import AddNaturalReserveForm from '../components/forms/AddNaturalReserveForm';
import AddNationalParkForm from '../components/forms/AddNationalParkForm';
import SuccessNotification from '../components/ui/SuccessNotification';
import { useAuth } from '../contexts/AuthContext';
import { 
  Add as AddIcon, 
  Park as ParkIcon 
} from '@mui/icons-material';

const DroneMapPage = () => {
  const { user } = useAuth();
  const [airports, setAirports] = useState([]);
  const [aerodromes, setAerodromes] = useState([]);
  const [naturalReserves, setNaturalReserves] = useState([]);
  const [nationalParks, setNationalParks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api');
  const [showAddReserveForm, setShowAddReserveForm] = useState(false);
  const [showAddParkForm, setShowAddParkForm] = useState(false);
  const [drawingCoordinates, setDrawingCoordinates] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadMapData();
  }, []);

  const hasData = airports.length > 0 || aerodromes.length > 0 || 
                  naturalReserves.length > 0 || nationalParks.length > 0;

  const handleReserveSuccess = (data) => {
    // Recharger les données après ajout
    loadMapData();
    // Afficher la notification de succès
    setNotification({
      isVisible: true,
      message: `Réserve naturelle "${data.reserve.name}" ajoutée avec succès ! En attente d'approbation admin.`,
      type: 'success'
    });
  };

  const handleParkSuccess = (data) => {
    // Recharger les données après ajout
    loadMapData();
    // Afficher la notification de succès
    setNotification({
      isVisible: true,
      message: `Parc national "${data.park.name}" ajouté avec succès ! En attente d'approbation admin.`,
      type: 'success'
    });
  };

  const handleDrawingStart = () => {
    setIsDrawing(true);
    setDrawingCoordinates([]);
  };

  const handleDrawingStop = () => {
    setIsDrawing(false);
    setDrawingCoordinates([]);
  };

  const handleCoordinateAdd = (lat, lng) => {
    if (isDrawing) {
      setDrawingCoordinates(prev => [...prev, [lat, lng]]);
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const loadMapData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [airportsData, protectedAreasData] = await Promise.all([
        airportService.getAirportsWithFallback(),
        protectedAreasService.getProtectedAreasWithFallback()
      ]);
      
      if (airportsData.airports || airportsData.aerodromes) {
        setAirports(airportsData.airports || []);
        setAerodromes(airportsData.aerodromes || []);
        setDataSource('api');
      } else {
        setAirports([]);
        setAerodromes([]);
        setDataSource('local');
        setError('Aucune donnée d\'aéroport disponible');
      }
      
      if (protectedAreasData.natural_reserves || protectedAreasData.national_parks) {
        setNaturalReserves(protectedAreasData.natural_reserves || []);
        setNationalParks(protectedAreasData.national_parks || []);
      } else {
        setNaturalReserves([]);
        setNationalParks([]);
      }
      
    } catch (err) {
      setError('Erreur lors du chargement des données de la carte');
      
      setAirports([]);
      setAerodromes([]);
      setNaturalReserves([]);
      setNationalParks([]);
      setDataSource('local');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DroneMapHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center space-x-2 text-red-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!hasData && !isLoading && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center space-x-2 text-yellow-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">
                Aucune donnée disponible. Vérifiez que le serveur Django est démarré et que les données sont chargées.
              </span>
            </div>
          </div>
        )}

        {/* Boutons d'ajout pour utilisateurs connectés */}
        {user && (
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setShowAddReserveForm(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <AddIcon className="w-4 h-4 mr-2" /> Ajouter une réserve naturelle
            </button>
            <button
              onClick={() => setShowAddParkForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ParkIcon className="w-4 h-4 mr-2" /> Ajouter un parc national
            </button>
          </div>
        )}

        <div className="w-full">
          <DroneMap
            airports={airports}
            aerodromes={aerodromes}
            naturalReserves={naturalReserves}
            nationalParks={nationalParks}
            drawingCoordinates={drawingCoordinates}
            isDrawing={isDrawing}
          />
        </div>
      </div>

      {/* Formulaires modaux */}
      {showAddReserveForm && (
        <AddNaturalReserveForm
          onClose={() => setShowAddReserveForm(false)}
          onSuccess={handleReserveSuccess}
          onDrawingStart={handleDrawingStart}
          onDrawingStop={handleDrawingStop}
          onCoordinateAdd={handleCoordinateAdd}
        />
      )}

      {showAddParkForm && (
        <AddNationalParkForm
          onClose={() => setShowAddParkForm(false)}
          onSuccess={handleParkSuccess}
          onDrawingStart={handleDrawingStart}
          onDrawingStop={handleDrawingStop}
          onCoordinateAdd={handleCoordinateAdd}
        />
      )}

      {/* Notification de succès */}
      <SuccessNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        autoHideDuration={6000}
      />
    </div>
  );
};

export default DroneMapPage;
