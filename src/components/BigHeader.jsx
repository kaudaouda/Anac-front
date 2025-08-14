import React from 'react';
import droneImage from '../assets/images/drones-iLJvTphP.png';

const BigHeader = () => {
  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden" 
      style={{ backgroundImage: `url(${droneImage})` }}>
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3/6 bg-black/70 rounded-xl p-5">
            <h1 className="text-2xl lg:text-4xl font-black text-white mb-4 leading-none tracking-tight">
              AKWABA
            </h1>            

            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 leading-tight">
              cher Droner
            </h2>
            
            <p className="text-xl lg:text-xl text-white mb-5 leading-relaxed max-w-3xl font-light">
              Bienvenu(e) sur DiGIDRONE, la plateforme électronique de gestion des aéronefs télépilotés (drônes) civiles de l'Autorité Nationale de l'Aviation Civile (ANAC) de Côte d'Ivoire.
            </p>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
              S'inscrire ?
            </button>
          </div>
        </div>
      </div>
      

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
};

export default BigHeader;