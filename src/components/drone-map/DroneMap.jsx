import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, Polygon, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Map.css';
import L from 'leaflet';
import DrawingOverlay from './DrawingOverlay';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ZoomAwareCircles = ({ airports, aerodromes }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => map.off('zoomend', onZoom);
  }, [map]);

  const getCircleStyle = (type, zoom) => {
    const baseColor = getCircleColor(type);
    
    if (zoom <= 6) {
      return {
        color: baseColor,
        fillColor: baseColor,
        fillOpacity: 0.4,
        weight: 4
      };
    } else if (zoom <= 8) {
      return {
        color: baseColor,
        fillColor: baseColor,
        fillOpacity: 0.3,
        weight: 3
      };
    } else {
      return {
        color: baseColor,
        fillColor: baseColor,
        fillOpacity: 0.2,
        weight: 2
      };
    }
  };

  const getCircleRadius = (radiusKm, zoom) => {
    const baseRadius = radiusKm * 1000;
    
    if (zoom <= 6) {
      const minRadius = 50000;
      return Math.max(baseRadius, minRadius);
    } else if (zoom <= 8) {
      const minRadius = 25000;
      return Math.max(baseRadius, minRadius);
    } else {
      return baseRadius;
    }
  };

  const getCircleColor = (type) => {
    switch (type) {
      case 'international':
        return '#1E40AF';
      case 'domestic':
        return '#3B82F6';
      case 'aerodrome':
        return '#60A5FA';
      default:
        return '#6B7280';
    }
  };

  return (
    <>
      {airports.map((airport) => {
        const radiusKm = parseFloat(airport.radius) || 5;
        const circleStyle = getCircleStyle(airport.type, zoom);
        const circleRadius = getCircleRadius(radiusKm, zoom);
        
        const zoneType = airport.type === 'international' ? 'Aéroport international' : 'Aéroport';
        
        return (
          <Circle
            key={airport.id}
            center={airport.coordinates}
            radius={circleRadius}
            pathOptions={circleStyle}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={0.9}
              className="custom-tooltip"
            >
              <div className="text-center">
                <div className="font-semibold text-black">
                  {zoneType} : Zone interdite aux drones domestiques
                </div>
              </div>
            </Tooltip>
          </Circle>
        );
      })}

      {aerodromes.map((aerodrome) => {
        const radiusKm = parseFloat(aerodrome.radius) || 3;
        const circleStyle = getCircleStyle(aerodrome.type, zoom);
        const circleRadius = getCircleRadius(radiusKm, zoom);
        
        return (
          <Circle
            key={aerodrome.id}
            center={aerodrome.coordinates}
            radius={circleRadius}
            pathOptions={circleStyle}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={0.9}
              className="custom-tooltip"
            >
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  Aérodrome : Zone interdite aux drones domestiques
                </div>
              </div>
            </Tooltip>
          </Circle>
        );
      })}
    </>
  );
};

const DroneMap = ({ airports, aerodromes, naturalReserves, nationalParks, drawingCoordinates, isDrawing }) => {
  
  return (
    <MapContainer
      center={[6.5244, -5.9500]}
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
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <ZoomAwareCircles airports={airports} aerodromes={aerodromes} />

      {naturalReserves.map((reserve) => (
        <React.Fragment key={reserve.id}>
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
                <div className="font-semibold text-black">
                  Réserve naturelle : Zone interdite aux drones domestiques
                </div>
              </div>
            </Tooltip>
          </Polygon>
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

      {nationalParks.map((park) => (
        <React.Fragment key={park.id}>
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
                <div className="font-semibold text-black">
                  Parc national : Zone interdite aux drones domestiques
                </div>
              </div>
            </Tooltip>
          </Polygon>
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

      {/* Aperçu du dessin en cours */}
      <DrawingOverlay 
        coordinates={drawingCoordinates} 
        isDrawing={isDrawing} 
      />
    </MapContainer>
  );
};

export default DroneMap;
