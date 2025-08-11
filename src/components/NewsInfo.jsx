import React, { useState, useEffect } from 'react';
import { 
  Email, 
  Phone, 
  Facebook, 
  WhatsApp, 
  YouTube, 
  LinkedIn,
  KeyboardArrowDown
} from '@mui/icons-material';
import newsData from '../data/json/news.json';

const NewsInfo = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('enter');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const animationSequence = () => {
      // Phase 1: Le texte entre depuis la droite
      setAnimationPhase('enter');
      
      // Phase 2: Après 1 seconde, le texte est au centre
      setTimeout(() => {
        setAnimationPhase('center');
      }, 1000);
      
      // Phase 3: Après 3 secondes, le texte sort vers la gauche
      setTimeout(() => {
        setAnimationPhase('exit');
      }, 4000);
      
      // Phase 4: Après 1 seconde, on change de nouvelle
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentNewsIndex((prevIndex) => 
            prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
          );
          setAnimationPhase('enter');
          setIsTransitioning(false);
        }, 100);
      }, 5000);
    };

    const interval = setInterval(animationSequence, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentNews = newsData[currentNewsIndex];

  return (
    <div className="bg-blue-900 text-white py-1 px-6 w-screen flex items-center justify-between space-x-1 shadow-inner shadow-lg">
      {/* Section gauche - Label catégorie */}
      <div>
        <span className="text-white font-bold text-xs uppercase tracking-wide">
          {currentNews.category}
        </span>
      </div>

      {/* Section centrale - Titre de la nouvelle avec effet ticker */}
      <div className="flex-1 relative">
        <div className="bg-white text-black px-4 py-0.5 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div 
            className={`whitespace-nowrap transition-all duration-1000 ease-in-out ${
              isTransitioning ? 'opacity-0' :
              animationPhase === 'enter' ? 'transform translate-x-full opacity-100' :
              animationPhase === 'center' ? 'transform translate-x-0 opacity-100' :
              'transform -translate-x-full opacity-100'
            }`}
          >
            <span className="font-bold text-sm block px-4 py-2">
              {currentNews.title}
            </span>
          </div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10 bg-white">
          <div className="bg-blue-900 px-3 py-1 rounded-full flex items-center gap-2">
            <Email className="text-white" fontSize="small" />
            <span className="text-white text-xs font-medium">
              digidrone@anac.ci
            </span>
          </div>
          <div className="bg-blue-900 px-3 py-1 rounded-full flex items-center gap-2">
            <Phone className="text-white" fontSize="small" />
            <span className="text-white text-xs font-medium">
              (+225) 27 21 58 69 00 / 01
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <a href="https://facebook.com/anac.ci" target="_blank" rel="noopener noreferrer">
            <Facebook className="text-white cursor-pointer hover:text-blue-300 transition-colors" fontSize="small" />
          </a>
          <a href="https://wa.me/2252721586900" target="_blank" rel="noopener noreferrer">
            <WhatsApp className="text-white cursor-pointer hover:text-green-300 transition-colors" fontSize="small" />
          </a>
          <a href="https://youtube.com/@anac.ci" target="_blank" rel="noopener noreferrer">
            <YouTube className="text-white cursor-pointer hover:text-red-300 transition-colors" fontSize="small" />
          </a>
          <a href="https://linkedin.com/company/anac-ci" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="text-white cursor-pointer hover:text-blue-300 transition-colors" fontSize="small" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsInfo;