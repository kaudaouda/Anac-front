import React, { useState } from 'react';
import { Home, Menu as MenuIcon, Close } from '@mui/icons-material';
import menuData from '../data/json/menu.json';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const iconMap = {
    Home
  };

  const { menuItems, styling } = menuData;

  const menuItemsWithIcons = menuItems.map(item => ({
    ...item,
    iconComponent: item.icon ? iconMap[item.icon] : null
  }));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
 
          <div className="hidden md:flex items-center justify-center space-x-20">
            {menuItemsWithIcons.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center text-gray-700 hover:text-blue-900 transition-all duration-200 group relative py-2"
              >
                {item.iconComponent && (
                  <item.iconComponent className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors duration-200" />
                )}
              <span className="text-md font-semibold">{item.label || 'Sans titre'}</span>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
            ))}
          </div>

          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? (
                <Close className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {menuItemsWithIcons.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.iconComponent && (
                    <item.iconComponent className="w-5 h-5 mr-3" />
                  )}
                  <span className="text-sm font-medium">{item.label || 'Sans titre'}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Menu;
