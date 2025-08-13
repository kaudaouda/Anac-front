import React from 'react';

const ZoneLegend = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Légende des Zones
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <h4 className="font-medium text-gray-900">Aéroports</h4>
            <p className="text-sm text-gray-600">
              Zones aéronautiques - Survol drone interdit dans un rayon de 5km
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <h4 className="font-medium text-gray-900">Aérodromes</h4>
            <p className="text-sm text-gray-600">
              Zones aéronautiques - Survol drone interdit dans un rayon de 3km
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <h4 className="font-medium text-gray-900">Réserves Naturelles</h4>
            <p className="text-sm text-gray-600">
              Zones réglementées - Autorisation requise pour survol drone
            </p>
          </div>
        </div>


        <div className="flex items-start space-x-3">
          <div className="w-4 h-4 bg-red-600 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <h4 className="font-medium text-gray-900">Parcs Nationaux</h4>
            <p className="text-sm text-gray-600">
              Zones interdites - Survol drone strictement interdit
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-yellow-600 text-lg">⚠️</div>
          <div>
            <h4 className="font-medium text-yellow-800">Important</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Respectez toujours la réglementation en vigueur. En cas de doute, 
              consultez les autorités compétentes avant tout survol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneLegend;
