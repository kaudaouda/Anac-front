import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import menuData from '../data/json/menu.json';

const Menu = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const { menuItems, styling } = menuData;

  const getFilteredMenuItems = () => {
    let filteredItems = menuItems.filter(item => {
      if (isAuthenticated && item.href === '/login') {
        return false;
      }
      return true;
    });

    return filteredItems.sort((a, b) => a.order - b.order);
  };

  const filteredMenuItems = getFilteredMenuItems();

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
 
          <div className="hidden md:flex items-center justify-center space-x-10">
            {filteredMenuItems.map((item) => {
              const isActive = isActiveLink(item.href);
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center transition-all duration-200 group relative py-2 ${
                    isActive 
                      ? 'text-blue-900' 
                      : 'text-gray-700 hover:text-blue-900'
                  }`}
                >
                  <span className="text-md font-semibold">{item.label || 'Sans titre'}</span>
                  <div className={`absolute top-0 left-0 w-full h-0.5 bg-orange-500 transform transition-transform duration-200 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </a>
              );
            })}

            {/* Icône de profil avec menu déroulant pour utilisateur connecté */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  onMouseEnter={() => setIsProfileMenuOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <span className="material-icons text-xl">
                    person
                  </span>
                </button>

                {/* Menu déroulant */}
                <div 
                  className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${
                    isProfileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  onMouseEnter={() => setIsProfileMenuOpen(true)}
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  {/* Tableau de bord */}
                  <a
                    href="/dashboard"
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-lg">dashboard</span>
                      <span>Tableau de Bord</span>
                    </div>
                  </a>

                  {/* Gestion des drones */}
                  <a
                    href="/drones"
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-lg">flight</span>
                      <span>Mes Drones</span>
                    </div>
                  </a>

                  {/* Journal de vols */}
                  <a
                    href="/flights"
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-lg">history</span>
                      <span>Journal de Vols</span>
                    </div>
                  </a>

                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Mon profil */}
                  <a
                    href="/profile"
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-lg">account_circle</span>
                      <span>Mon Profil</span>
                    </div>
                  </a>
                  
                  {/* Déconnexion */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-lg">logout</span>
                      <span>Se déconnecter</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
