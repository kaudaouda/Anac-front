import React, { useEffect, useState } from 'react';
import { DroneMapHeader, DroneMap } from '../components/drone-map';
import regionsData from '../data/json/regions.json';

const DroneMapPage = () => {
  const [airports, setAirports] = useState([]);
  const [aerodromes, setAerodromes] = useState([]);
  const [naturalReserves, setNaturalReserves] = useState([]);
  const [nationalParks, setNationalParks] = useState([]);

  useEffect(() => {
    console.log('Composant DroneMapPage monté');
    console.log('Données chargées:', regionsData);

    setAirports(regionsData.airports);
    setAerodromes(regionsData.aerodromes);
    setNaturalReserves(regionsData.natural_reserves);
    setNationalParks(regionsData.national_parks);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la page */}
      <DroneMapHeader />
      
      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
          {/* Carte principale */}
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
