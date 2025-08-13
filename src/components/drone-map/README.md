# Composants de la Carte des Drones

Ce dossier contient tous les composants React nécessaires pour afficher la carte interactive des zones drones en Côte d'Ivoire.

## 📁 Structure des fichiers

### `DroneMap.jsx`
- **Responsabilité** : Composant principal de la carte Leaflet
- **Fonctionnalités** : Affichage des zones, tooltips, interactions
- **Props** : `airports`, `aerodromes`, `naturalReserves`, `nationalParks`

### `DroneMapHeader.jsx`
- **Responsabilité** : En-tête de la page avec titre et légende rapide
- **Design** : Interface utilisateur élégante avec indicateurs colorés
- **Réutilisable** : Peut être adapté pour d'autres pages de cartes

### `ZoneLegend.jsx`
- **Responsabilité** : Légende détaillée des zones avec explications
- **Contenu** : Description des restrictions drones pour chaque type de zone
- **Avertissements** : Messages de sécurité et réglementation

### `index.js`
- **Responsabilité** : Export centralisé de tous les composants
- **Usage** : `import { DroneMap, DroneMapHeader, ZoneLegend } from '../components/drone-map'`

## 🎯 Utilisation

```jsx
import { DroneMap, DroneMapHeader, ZoneLegend } from '../components/drone-map';

const MyPage = () => {
  return (
    <div>
      <DroneMapHeader />
      <DroneMap 
        airports={airports}
        aerodromes={aerodromes}
        naturalReserves={naturalReserves}
        nationalParks={nationalParks}
      />
      <ZoneLegend />
    </div>
  );
};
```

## 🔧 Dépendances

- **React** : Framework principal
- **React-Leaflet** : Composants de carte
- **Leaflet.js** : Bibliothèque de cartographie
- **Tailwind CSS** : Styles et design

## 📱 Responsive

Tous les composants sont conçus pour être responsifs et s'adapter aux différentes tailles d'écran.
