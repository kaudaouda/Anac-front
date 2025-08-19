import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les cookies côté client
 */
export const useCookies = () => {
  const [cookies, setCookies] = useState({});

  // Lire tous les cookies au chargement
  useEffect(() => {
    const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});
    
    setCookies(allCookies);
  }, []);

  // Lire un cookie spécifique
  const getCookie = useCallback((name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  }, []);

  // Définir un cookie
  const setCookie = useCallback((name, value, options = {}) => {
    const {
      expires = 7, // 7 jours par défaut
      path = '/',
      domain = '',
      secure = window.location.protocol === 'https:',
      sameSite = 'Lax'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }

    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += '; secure';
    if (sameSite) cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;

    // Mettre à jour l'état local
    setCookies(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Supprimer un cookie
  const deleteCookie = useCallback((name, options = {}) => {
    const { path = '/', domain = '' } = options;
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}`;
    
    // Mettre à jour l'état local
    setCookies(prev => {
      const newCookies = { ...prev };
      delete newCookies[name];
      return newCookies;
    });
  }, []);

  // Vérifier si un cookie existe
  const hasCookie = useCallback((name) => {
    return getCookie(name) !== null;
  }, [getCookie]);

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = useCallback(() => {
    return getCookie('is_authenticated') === 'true';
  }, [getCookie]);

  // Écouter les changements de cookies
  useEffect(() => {
    const handleStorageChange = () => {
      const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});
      
      setCookies(allCookies);
    };

    // Écouter les changements de cookies (approximatif)
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les cookies
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    cookies,
    getCookie,
    setCookie,
    deleteCookie,
    hasCookie,
    isAuthenticated
  };
};

export default useCookies;
