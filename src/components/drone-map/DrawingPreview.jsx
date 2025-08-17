import React from 'react';
import { Polygon, Polyline, Circle } from 'react-leaflet';

const DrawingPreview = ({ coordinates, isDrawing }) => {
  if (!isDrawing || coordinates.length === 0) {
    return null;
  }

  // Afficher les points individuels
  const points = coordinates.map((coord, index) => (
    <Circle
      key={`point-${index}`}
      center={coord}
      radius={1000}
      pathOptions={{
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.6,
        weight: 2
      }}
    />
  ));

  // Afficher le polygone si on a au moins 3 points
  let polygon = null;
  let polyline = null;

  if (coordinates.length >= 3) {
    // Fermer le polygone en ajoutant le premier point à la fin
    const closedCoordinates = [...coordinates, coordinates[0]];
    
    polygon = (
      <Polygon
        positions={closedCoordinates}
        pathOptions={{
          color: '#007bff',
          fillColor: '#007bff',
          fillOpacity: 0.1,
          weight: 2
        }}
      />
    );

    polyline = (
      <Polyline
        positions={closedCoordinates}
        pathOptions={{
          color: '#007bff',
          weight: 3,
          dashArray: '5, 5'
        }}
      />
    );
  } else if (coordinates.length >= 2) {
    // Afficher une ligne entre les points
    polyline = (
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: '#007bff',
          weight: 3,
          dashArray: '5, 5'
        }}
      />
    );
  }

  return (
    <>
      {points}
      {polygon}
      {polyline}
    </>
  );
};

export default DrawingPreview;
