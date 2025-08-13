import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import regionsData from '../data/json/regions.json';

// Correction des icônes Leaflet pour React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const [airports, setAirports] = useState([]);
  const [aerodromes, setAerodromes] = useState([]);
  const [naturalReserves, setNaturalReserves] = useState([]);
  const [nationalParks, setNationalParks] = useState([]);

  useEffect(() => {
    console.log('Composant Map monté');
    console.log('Données chargées:', regionsData);
    
    setAirports(regionsData.airports);
    setAerodromes(regionsData.aerodromes);
    setNaturalReserves(regionsData.natural_reserves);
    setNationalParks(regionsData.national_parks);
  }, []);

  return (
    <div className="w-full">
      {/* Carte Leaflet */}
      <div className="w-full">
        <MapContainer
          center={[6.5244, -5.9500]} // Centre de la Côte d'Ivoire
          zoom={7}
          style={{ height: '700px', width: '100%' }}
          className="rounded-lg"
          doubleClickZoom={false}
          zoomControl={true}
          scrollWheelZoom={true}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          dragging={true}
          tap={false}
        >
          {/* Fond de carte OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Aéroports - Cercles bleus */}
          {airports.map((airport) => (
            <CircleMarker
              key={airport.id}
              center={airport.coordinates}
              radius={10}
              pathOptions={{
                color: '#1E40AF',
                fillColor: '#1E40AF',
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={0.9}
                className="custom-tooltip"
              >
                <div className="text-center">
                  <div className="font-semibold text-blue-600">Aéroport : Zone interdite au drone domestique</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Aérodromes - Cercles bleus plus petits */}
          {aerodromes.map((aerodrome) => (
            <CircleMarker
              key={aerodrome.id}
              center={aerodrome.coordinates}
              radius={8}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.8,
                    weight: 2
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={0.9}
                className="custom-tooltip"
              >
                <div className="text-center">
                  <div className="font-semibold text-blue-600">Aérodrome : Zone interdite au drone domestique</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Réserves naturelles - Lignes orange en zigzag */}
          {naturalReserves.map((reserve) => (
            <React.Fragment key={reserve.id}>
              {/* Fond transparent orange */}
              <Polygon
                positions={reserve.coordinates}
                pathOptions={{
                  color: '#F97316',
                  fillColor: '#F97316',
                  fillOpacity: 0.1,
                  weight: 0
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.9}
                  className="custom-tooltip"
                  permanent={false}
                  sticky={true}
                >
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">Réserve naturelle : Zone interdite au drone domestique</div>
      </div>
                </Tooltip>
              </Polygon>
              {/* Bordure orange */}
              <Polyline
                positions={reserve.coordinates}
                pathOptions={{
                  color: '#F97316',
                  weight: 2.5,
                  className: 'zigzag-border natural-reserve'
                }}
              />
            </React.Fragment>
          ))}

          {/* Parcs nationaux - Lignes rouges en zigzag */}
          {nationalParks.map((park) => (
            <React.Fragment key={park.id}>
              {/* Fond transparent rouge */}
              <Polygon
                positions={park.coordinates}
                pathOptions={{
                  color: '#DC2626',
                  fillColor: '#DC2626',
                  fillOpacity: 0.1,
                  weight: 0
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.9}
                  className="custom-tooltip"
                  permanent={false}
                  sticky={true}
                >
                  <div className="text-center">
                    <div className="font-semibold text-red-600">Parc national : Zone interdite au drone domestique</div>
                </div>
                </Tooltip>
              </Polygon>
              {/* Bordure rouge */}
              <Polyline
                positions={park.coordinates}
                pathOptions={{
                  color: '#DC2626',
                  weight: 2.5,
                  className: 'zigzag-border national-park'
                }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;