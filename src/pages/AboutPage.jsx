import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          À propos de l'ANAC
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          L'Autorité Nationale de l'Aviation Civile de Côte d'Ivoire (ANAC) est l'organisme 
          responsable de la régulation et de la supervision de l'aviation civile dans notre pays. 
          Notre plateforme drone officielle offre des services innovants pour la gestion et 
          la régulation des opérations de drones.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Mission</h3>
            <p className="text-gray-600">
              Assurer la sécurité et la régularité de l'aviation civile en Côte d'Ivoire.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Vision</h3>
            <p className="text-gray-600">
              Devenir un leader régional dans la régulation de l'aviation civile.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Valeurs</h3>
            <p className="text-gray-600">
              Excellence, sécurité, innovation et service public de qualité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
