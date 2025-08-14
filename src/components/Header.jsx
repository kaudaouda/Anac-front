import React from 'react';
import backgroundImage from '../assets/images/fond-formes-geometriques-bleu-abstrait-COS2Lu06.jpg';
import logo from '../assets/logo/logo.png';
import drone from '../assets/images/drone.png';


const Header = () => {
  return (
    <header className="relative w-full bg-white overflow-hidden">
      <div className="absolute inset-0">
        <img src={backgroundImage} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 flex items-center justify-between py-10">
        
        <div className="flex flex-col items-center space-y-4 flex-1">
          <div className="text-blue-900 font-semibold text-sm uppercase text-center">
            <p>Ministère des Transports</p>
          </div>
          <div className='logoContent flex justify-center'>
            <img src={logo} className="w-32 h-32" />
          </div>
          <div className="Logoname text-center text-sm font-semibold text-blue-900 uppercase">
            <p>AUTORITE NATIONALE</p>
            <p>DE L'AVIATION CIVILE DE CÔTE D'IVOIRE</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 flex-1">
          <h1 className="text-6xl font-bold text-blue-900 tracking-wider drop-shadow-lg font-orbitron">
            DIGIDRONE
          </h1>
          <p className="text-gray-700 text-sm font-semibold text-center leading-relaxed max-w-md">
            Plateforme électronique de gestion des aéronefs télépilotés
          </p>
        </div>

        <div className="flex justify-center flex-1 w-full relative">
          <div className="drone-pulse-ring drone-pulse-ring-1 w-40 h-40"></div>
          <div className="drone-pulse-ring drone-pulse-ring-2 w-40 h-40"></div>
          <img src={drone} className="w-2/3 drone-flying relative z-10" alt="Drone" />
        </div>
      </div>
    </header>
  );
};

export default Header;
