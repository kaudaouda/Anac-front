import React, { useEffect, useState } from 'react';
import { DroneMapHeader, DroneMap } from '../components/drone-map';
import { airportService } from '../services/airportService';
import { protectedAreasService } from '../services/protectedAreasService';

const DroneMapPage = () => {
  const [airports, setAirports] = useState([]);
  const [aerodromes, setAerodromes] = useState([]);
  const [naturalReserves, setNaturalReserves] = useState([]);
  const [nationalParks, setNationalParks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api');

  useEffect(() => {
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

    loadMapData();
  }, []);

  const hasData = airports.length > 0 || aerodromes.length > 0 || 
                  naturalReserves.length > 0 || nationalParks.length > 0;

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

        <div className="w-full">
          <DroneMap
            airports={airports}
            aerodromes={aerodromes}
            naturalReserves={naturalReserves}
            nationalParks={nationalParks}
          />
        </div>
      </div>
    </div>
  );
};

export default DroneMapPage;
