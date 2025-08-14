import React, { useState } from 'react';

const LoginTest = () => {
  const [credentials, setCredentials] = useState({
    email: 'qalby@mail.com',
    password: 'Weareanonymous'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async (endpoint) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      setResult({
        endpoint,
        status: response.status,
        success: response.ok,
        data: data
      });
    } catch (error) {
      setResult({
        endpoint,
        status: 'ERROR',
        success: false,
        data: { error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = [
    '/api/auth/login/',
    '/api/token/',
    '/auth/login/',
    '/api/auth/register/',
    '/api/auth/check-auth/'
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Test des Endpoints de Connexion</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Tester les endpoints :</h4>
        <div className="space-y-2">
          {testEndpoints.map((endpoint) => (
            <button
              key={endpoint}
              onClick={() => testLogin(endpoint)}
              disabled={loading}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded border text-sm"
            >
              {endpoint}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Test en cours...</p>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <h4 className="font-medium mb-2">
            Résultat pour {result.endpoint}
          </h4>
          <p className="text-sm mb-2">
            <strong>Status:</strong> {result.status}
          </p>
          <p className="text-sm mb-2">
            <strong>Succès:</strong> {result.success ? '✅ Oui' : '❌ Non'}
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Données reçues</summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default LoginTest;
