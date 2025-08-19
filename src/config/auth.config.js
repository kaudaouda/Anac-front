/**
 * Configuration de l'authentification
 */
export const AUTH_CONFIG = {
  // URLs des endpoints d'authentification
  ENDPOINTS: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh-token/',
    CHECK_AUTH: '/auth/check-auth/',
    PROFILE: '/auth/profile/',
    CHANGE_PASSWORD: '/auth/change-password/',
    PASSWORD_RESET: '/auth/password-reset/',
  },

  // Configuration des cookies
  COOKIES: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    IS_AUTHENTICATED: 'is_authenticated',
    PATH: '/',
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'Lax',
  },

  // Durées des tokens (en secondes)
  TOKEN_LIFETIMES: {
    ACCESS: 3600, // 1 heure
    REFRESH: 604800, // 7 jours
  },

  // Configuration de sécurité
  SECURITY: {
    AUTO_REFRESH: true,
    REFRESH_THRESHOLD: 300, // Rafraîchir 5 minutes avant expiration
    MAX_REFRESH_ATTEMPTS: 3,
    LOGOUT_ON_REFRESH_FAILURE: true,
  },

  // Messages d'erreur
  ERROR_MESSAGES: {
    SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.',
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
    NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
    SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
    UNAUTHORIZED: 'Accès non autorisé.',
    FORBIDDEN: 'Accès interdit.',
  },

  // Configuration des redirections
  REDIRECTS: {
    AFTER_LOGIN: '/dashboard',
    AFTER_LOGOUT: '/login',
    AFTER_REGISTER: '/dashboard',
    UNAUTHORIZED: '/login',
    FORBIDDEN: '/403',
  },

  // Configuration des notifications
  NOTIFICATIONS: {
    SHOW_SUCCESS: true,
    SHOW_ERROR: true,
    AUTO_HIDE_SUCCESS: 3000,
    AUTO_HIDE_ERROR: 5000,
  },
};

/**
 * Configuration des routes protégées
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/drones',
  '/flights',
  '/settings',
];

/**
 * Configuration des routes publiques
 */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/faq',
];

/**
 * Configuration des routes d'authentification
 */
export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Vérifier si une route est protégée
 */
export const isProtectedRoute = (pathname) => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Vérifier si une route est publique
 */
export const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Vérifier si une route est une route d'authentification
 */
export const isAuthRoute = (pathname) => {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
};

export default AUTH_CONFIG;
