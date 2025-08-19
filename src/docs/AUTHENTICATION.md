# 🔐 Système d'Authentification JWT + Cookies HttpOnly

## 📋 Vue d'ensemble

Ce système d'authentification utilise une approche moderne et sécurisée avec :
- **JWT (JSON Web Tokens)** pour l'authentification
- **Cookies HttpOnly** pour le stockage sécurisé côté serveur
- **Refresh automatique** des tokens
- **Gestion d'état** côté client avec React Context
- **Middleware d'authentification** pour les routes protégées

## 🏗️ Architecture

### Backend (Django)
```
authentication/
├── authentication.py      # Classes d'authentification personnalisées
├── jwt_utils.py          # Gestionnaire de tokens et cookies
├── views.py              # Vues d'authentification mises à jour
└── models.py             # Modèles utilisateur existants
```

### Frontend (React)
```
src/
├── contexts/
│   └── AuthContext.jsx   # Contexte d'authentification
├── services/
│   ├── authService.js    # Service d'authentification
│   └── api.js           # Service API avec gestion des cookies
├── middleware/
│   └── authMiddleware.js # Middleware d'authentification
├── hooks/
│   └── useCookies.js     # Hook pour la gestion des cookies
├── components/
│   └── ProtectedRoute.jsx # Composant de protection des routes
└── config/
    └── auth.config.js    # Configuration de l'authentification
```

## 🔧 Configuration

### Backend Django

#### 1. Installation des dépendances
```bash
pip install djangorestframework-simplejwt PyJWT
```

#### 2. Configuration des settings
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'authentication.authentication.JWTCookieAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

#### 3. Configuration CORS
```python
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]
```

### Frontend React

#### 1. Variables d'environnement
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### 2. Configuration des routes
```jsx
// App.jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## 🚀 Utilisation

### 1. Connexion utilisateur

```jsx
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (credentials) => {
    try {
      const response = await login(credentials);
      if (response.success) {
        // Redirection automatique vers le dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    // Formulaire de connexion
  );
};
```

### 2. Protection des routes

```jsx
// Route protégée
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Route pour invités (non connectés)
<ProtectedRoute requireAuth={false}>
  <LoginPage />
</ProtectedRoute>
```

### 3. Vérification de l'authentification

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return <div>Bienvenue {user.first_name} !</div>;
};
```

### 4. Déconnexion

```jsx
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Redirection automatique vers la page de connexion
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
};
```

## 🔒 Sécurité

### 1. Cookies HttpOnly
- **access_token** : Token d'accès (1 heure, HttpOnly)
- **refresh_token** : Token de rafraîchissement (7 jours, HttpOnly)
- **is_authenticated** : Indicateur d'authentification (accessible côté client)

### 2. Protection XSS
- Les tokens JWT sont stockés dans des cookies HttpOnly
- Impossible d'accéder aux tokens via JavaScript
- Protection contre les attaques XSS

### 3. Protection CSRF
- Utilisation de `SameSite=Lax` pour les cookies
- Vérification des origines des requêtes

### 4. Rotation des tokens
- Les refresh tokens sont automatiquement renouvelés
- Blacklist des anciens tokens
- Limitation du nombre de tentatives de rafraîchissement

## 🔄 Gestion automatique des tokens

### 1. Rafraîchissement automatique
```javascript
// api.js
if (response.status === 401) {
  try {
    await this.refreshToken();
    return this.request(endpoint, options);
  } catch (refreshError) {
    this.handleAuthError();
    throw new Error('Session expirée');
  }
}
```

### 2. Gestion des erreurs
- Redirection automatique vers la page de connexion
- Suppression des cookies expirés
- Messages d'erreur informatifs

## 📱 Gestion des états

### 1. États d'authentification
```javascript
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

### 2. Persistance
- L'état d'authentification est vérifié au chargement de l'application
- Synchronisation automatique avec le serveur
- Gestion des sessions expirées

## 🧪 Tests

### 1. Tests d'authentification
```javascript
// Test de connexion
test('should login user successfully', async () => {
  const credentials = { email: 'test@example.com', password: 'password' };
  const response = await authService.login(credentials);
  expect(response.success).toBe(true);
});

// Test de protection des routes
test('should redirect unauthenticated user to login', () => {
  render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
  expect(mockNavigate).toHaveBeenCalledWith('/login');
});
```

### 2. Tests des cookies
```javascript
// Test de présence des cookies
test('should set authentication cookies after login', async () => {
  await authService.login(credentials);
  expect(document.cookie).toContain('is_authenticated=true');
});
```

## 🚨 Dépannage

### 1. Problèmes courants

#### Cookies non définis
- Vérifier la configuration CORS
- Vérifier que `credentials: 'include'` est défini
- Vérifier les paramètres des cookies (domain, path, secure)

#### Tokens expirés
- Vérifier la durée de vie des tokens dans les settings
- Vérifier le rafraîchissement automatique
- Vérifier la gestion des erreurs 401

#### Redirections en boucle
- Vérifier la logique de `ProtectedRoute`
- Vérifier les conditions d'authentification
- Vérifier les routes protégées vs publiques

### 2. Logs de débogage
```javascript
// Activer les logs de débogage
console.log('Cookie is_authenticated:', document.cookie);
console.log('État d\'authentification:', isAuthenticated);
console.log('Utilisateur:', user);
```

## 📚 Ressources

- [JWT.io](https://jwt.io/) - Documentation JWT
- [Django REST Framework](https://www.django-rest-framework.org/) - Framework Django
- [React Context](https://reactjs.org/docs/context.html) - Gestion d'état React
- [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) - Documentation des cookies

## 🔄 Mise à jour

### Version 1.0.0
- Authentification JWT de base
- Cookies HttpOnly
- Gestion automatique des tokens
- Protection des routes
- Middleware d'authentification

### Prochaines fonctionnalités
- Authentification à deux facteurs (2FA)
- Gestion des rôles et permissions
- Audit des connexions
- Intégration OAuth (Google, Facebook)
- Sessions multiples
