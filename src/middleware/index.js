// Export des composants d'authentification
export { default as AuthMiddleware } from './authMiddleware';
export { withAuth, withGuest } from './withAuth';

// Export par défaut pour faciliter l'import
export default {
  AuthMiddleware: require('./authMiddleware').default,
  withAuth: require('./withAuth').withAuth,
  withGuest: require('./withAuth').withGuest,
};
