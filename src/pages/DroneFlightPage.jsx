import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const DroneFlightPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [flights, setFlights] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [formData, setFormData] = useState({
    drone: '',
    flight_date: '',
    duration: '',
    location: '',
    purpose: '',
    weather_conditions: '',
    notes: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFlights(),
        fetchDrones()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlights = async () => {
    try {
      console.log('🔍 Fetching flights...');
      const response = await apiService.get('/flights/');
      console.log('📡 API Response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response is array:', Array.isArray(response));
      
      // Vérifier la structure de la réponse
      let flightsData = [];
      if (Array.isArray(response)) {
        flightsData = response;
      } else if (response && Array.isArray(response.results)) {
        // Si c'est une réponse paginée
        flightsData = response.results;
      } else if (response && Array.isArray(response.flights)) {
        // Si c'est dans une propriété 'flights'
        flightsData = response.flights;
      } else if (response && typeof response === 'object') {
        // Si c'est un objet, essayer de l'extraire
        console.log('⚠️ Response is object, keys:', Object.keys(response));
        flightsData = [];
      } else {
        console.error('❌ Unexpected response format:', response);
        flightsData = [];
      }
      
      console.log('✈️ Processed flights data:', flightsData);
      setFlights(flightsData);
    } catch (err) {
      console.error('❌ Error fetching flights:', err);
      setError(err.message);
      setFlights([]); // S'assurer que flights est toujours un tableau
    }
  };

  const fetchDrones = async () => {
    try {
      console.log('🔍 Fetching drones for flights...');
      const response = await apiService.get('/drones/');
      console.log('📡 Drones API Response:', response);
      
      // Vérifier la structure de la réponse
      let dronesData = [];
      if (Array.isArray(response)) {
        dronesData = response;
      } else if (response && Array.isArray(response.results)) {
        dronesData = response.results;
      } else if (response && Array.isArray(response.drones)) {
        dronesData = response.drones;
      } else if (response && typeof response === 'object') {
        console.log('Drones response is object, keys:', Object.keys(response));
        dronesData = [];
      } else {
        console.error('Unexpected drones response format:', response);
        dronesData = [];
      }
      
      console.log('Processed drones data for flights:', dronesData);
      setDrones(dronesData);
    } catch (err) {
      console.error('Error fetching drones for flights:', err);
      setError(err.message);
      setDrones([]); // ensure drones is always an array
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // delete empty fields and format dates
      if (submitData.flight_date && submitData.flight_date.trim() !== '') {
        const date = new Date(submitData.flight_date);
        submitData.flight_date = date.toISOString();
      } else {
        delete submitData.flight_date;
      }

      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('Submitting flight data:', submitData);

      if (showEditModal) {
        await apiService.put(`/flights/${selectedFlight.id}/`, submitData);
      } else {
        await apiService.post('/flights/', submitData);
      }

      await fetchFlights();
      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error submitting flight:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (flightId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce vol ?')) {
      return;
    }

    try {
      await apiService.delete(`/flights/${flightId}/`);
      await fetchFlights();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (flight) => {
    setSelectedFlight(flight);
    setFormData({
      drone: flight.drone.id || '',
      flight_date: flight.flight_date ? flight.flight_date.split('T')[0] : '',
      duration: flight.duration || '',
      location: flight.location || '',
      purpose: flight.purpose || '',
      weather_conditions: flight.weather_conditions || '',
      notes: flight.notes || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      drone: '',
      flight_date: '',
      duration: '',
      location: '',
      purpose: '',
      weather_conditions: '',
      notes: ''
    });
    setSelectedFlight(null);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDroneName = (droneId) => {
    const drone = drones.find(d => d.id === droneId);
    return drone ? drone.name : 'Drone inconnu';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des vols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="material-icons mr-3 text-blue-600 text-4xl">flight_takeoff</span>
                Journal de Vols
              </h1>
              <p className="mt-2 text-gray-600">
                Suivez et gérez tous vos vols de drones
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors"
            >
              <span className="material-icons mr-2">add</span>
              Nouveau Vol
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="material-icons text-blue-600 text-xl">flight_takeoff</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total des vols</p>
                <p className="text-2xl font-bold text-gray-900">{flights.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="material-icons text-green-600 text-xl">schedule</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temps total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(flights.reduce((total, flight) => total + (flight.duration || 0), 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600 text-xl">flight</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drones utilisés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(flights.map(f => f.drone.id)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="material-icons text-yellow-600 text-xl">event</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dernier vol</p>
                <p className="text-lg font-bold text-gray-900">
                  {flights.length > 0 ? formatDateTime(flights[0].flight_date).split(' ')[0] : 'Aucun'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historique des vols</h3>
          </div>
          
          {flights.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons text-6xl text-gray-300 mx-auto mb-4">flight_takeoff</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun vol enregistré</h3>
              <p className="text-gray-600 mb-6">
                Commencez par enregistrer votre premier vol pour commencer votre journal de vols.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Enregistrer votre premier vol
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {flights.map((flight) => (
                <div key={flight.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <span className="material-icons text-blue-600">flight_takeoff</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            Vol de {flight.drone.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Pilote: {flight.pilot.first_name} {flight.pilot.last_name}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="material-icons mr-2 text-gray-400 text-sm">event</span>
                          <span className="font-medium mr-2">Date:</span>
                          {formatDateTime(flight.flight_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="material-icons mr-2 text-gray-400 text-sm">schedule</span>
                          <span className="font-medium mr-2">Durée:</span>
                          {formatDuration(flight.duration)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="material-icons mr-2 text-gray-400 text-sm">location_on</span>
                          <span className="font-medium mr-2">Lieu:</span>
                          {flight.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="material-icons mr-2 text-gray-400 text-sm">flight</span>
                          <span className="font-medium mr-2">Drone:</span>
                          {flight.drone.name}
                        </div>
                      </div>

                      {flight.purpose && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Objectif:</span>
                          <p className="text-sm text-gray-600 ml-2">{flight.purpose}</p>
                        </div>
                      )}

                      {flight.weather_conditions && (
                        <div className="mb-3">
                          <div className="flex items-start text-sm text-gray-600">
                            <span className="material-icons mr-2 text-gray-400 text-sm mt-0.5">wb_sunny</span>
                            <div>
                              <span className="font-medium text-gray-700">Conditions météo:</span>
                              <p className="text-gray-600 ml-2">{flight.weather_conditions}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {flight.notes && (
                        <div className="mb-3">
                          <div className="flex items-start text-sm text-gray-600">
                            <span className="material-icons mr-2 text-gray-400 text-sm mt-0.5">note</span>
                            <div>
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="text-gray-600 ml-2">{flight.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(flight)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <span className="material-icons mr-1 text-sm">edit</span>
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(flight.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                      >
                        <span className="material-icons mr-1 text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showAddModal ? 'Nouveau Vol' : 'Modifier le Vol'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Drone Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drone *
                  </label>
                  <select
                    required
                    value={formData.drone}
                    onChange={(e) => setFormData({...formData, drone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un drone</option>
                    {drones.map(drone => (
                      <option key={drone.id} value={drone.id}>
                        {drone.name} - {drone.model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flight Date and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date et heure du vol *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.flight_date}
                      onChange={(e) => setFormData({...formData, flight_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location and Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de vol *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Ex: Parc de la ville, Zone industrielle..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectif du vol
                    </label>
                    <input
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      placeholder="Ex: Prise de vue aérienne, Inspection..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Weather Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions météorologiques
                  </label>
                  <textarea
                    rows="3"
                    value={formData.weather_conditions}
                    onChange={(e) => setFormData({...formData, weather_conditions: e.target.value})}
                    placeholder="Ex: Vent faible, ciel dégagé, température 20°C..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes de vol
                  </label>
                  <textarea
                    rows="4"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observations, incidents, points d'attention..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Form Actions */}
                <div className="border-t pt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {showAddModal ? 'Enregistrer le vol' : 'Modifier le vol'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneFlightPage;
