import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const DroneManagementPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    brand: '',
    drone_type: 'quadcopter',
    serial_number: '',
    weight: '',
    max_payload: '',
    max_flight_time: '',
    max_range: '',
    max_altitude: '',
    status: 'active',
    registration_number: '',
    insurance_info: '',
    maintenance_notes: '',
    purchase_date: '',
    last_maintenance: '',
    next_maintenance: ''
  });

  const droneTypes = [
    { value: 'quadcopter', label: 'Quadricoptère' },
    { value: 'hexacopter', label: 'Hexacoptère' },
    { value: 'octocopter', label: 'Octocoptère' },
    { value: 'fixed_wing', label: 'Aile fixe' },
    { value: 'helicopter', label: 'Hélicoptère' },
    { value: 'other', label: 'Autre' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
    { value: 'maintenance', label: 'En maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
    { value: 'retired', label: 'Retiré', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchDrones();
    }
  }, [isAuthenticated]);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching drones...');
      const response = await apiService.get('/drones/');
      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response is array:', Array.isArray(response));
      
      // check response structure
      let dronesData = [];
      if (Array.isArray(response)) {
        dronesData = response;
      } else if (response && Array.isArray(response.results)) {
        dronesData = response.results;
      } else if (response && Array.isArray(response.drones)) {
        dronesData = response.drones;
      } else if (response && typeof response === 'object') {
        console.log('Response is object, keys:', Object.keys(response));
        dronesData = [];
      } else {
        console.error('Unexpected response format:', response);
        dronesData = [];
      }
      
      console.log('Processed drones data:', dronesData);
      setDrones(dronesData);
      
    } catch (err) {
      console.error('Error fetching drones:', err);
      setError(err.message);
      setDrones([]); // ensure drones is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // delete empty date fields and format other dates
      if (submitData.purchase_date && submitData.purchase_date.trim() !== '') {
        const date = new Date(submitData.purchase_date);
        submitData.purchase_date = date.toISOString().split('T')[0];
      } else {
        delete submitData.purchase_date;
      }
      
      if (submitData.last_maintenance && submitData.last_maintenance.trim() !== '') {
        const date = new Date(submitData.last_maintenance);
        submitData.last_maintenance = date.toISOString().split('T')[0];
      } else {
        delete submitData.last_maintenance;
      }
      
      if (submitData.next_maintenance && submitData.next_maintenance.trim() !== '') {
        const date = new Date(submitData.next_maintenance);
        submitData.next_maintenance = date.toISOString().split('T')[0];
      } else {
        delete submitData.next_maintenance;
      }

      // delete other empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('Submitting drone data:', submitData);

      if (showEditModal) {
        await apiService.put(`/drones/${selectedDrone.id}/`, submitData);
      } else {
        await apiService.post('/drones/', submitData);
      }

      await fetchDrones();
      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error submitting drone:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (droneId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce drone ?')) {
      return;
    }

    try {
      await apiService.delete(`/drones/${droneId}/`);
      await fetchDrones();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (drone) => {
    setSelectedDrone(drone);
    setFormData({
      name: drone.name || '',
      model: drone.model || '',
      brand: drone.brand || '',
      drone_type: drone.drone_type || 'quadcopter',
      serial_number: drone.serial_number || '',
      weight: drone.weight || '',
      max_payload: drone.max_payload || '',
      max_flight_time: drone.max_flight_time || '',
      max_range: drone.max_range || '',
      max_altitude: drone.max_altitude || '',
      status: drone.status || 'active',
      registration_number: drone.registration_number || '',
      insurance_info: drone.insurance_info || '',
      maintenance_notes: drone.maintenance_notes || '',
      purchase_date: drone.purchase_date || '',
      last_maintenance: drone.last_maintenance || '',
      next_maintenance: drone.next_maintenance || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      brand: '',
      drone_type: 'quadcopter',
      serial_number: '',
      weight: '',
      max_payload: '',
      max_flight_time: '',
      max_range: '',
      max_altitude: '',
      status: 'active',
      registration_number: '',
      insurance_info: '',
      maintenance_notes: '',
      purchase_date: '',
      last_maintenance: '',
      next_maintenance: ''
    });
    setSelectedDrone(null);
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
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
          <p className="mt-4 text-gray-600">Chargement des drones...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(drones)) {
    console.error(' Drones is not an array:', drones);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Erreur de données</h2>
            <p className="text-red-700 mb-4">
              Les données reçues ne sont pas dans le format attendu.
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-red-800">Détails techniques</summary>
              <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(drones, null, 2)}
              </pre>
            </details>
            <button
              onClick={fetchDrones}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
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
                <span className="material-icons mr-3 text-blue-600 text-4xl">flight</span>
                Gestion des Drones
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez votre flotte de drones et leurs informations
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors"
            >
              <span className="material-icons mr-2">add</span>
              Ajouter un Drone
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drones.map((drone) => (
            <div key={drone.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                {drone.photo ? (
                  <img 
                    src={drone.photo} 
                    alt={drone.name}
                    className="h-full w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <span className="material-icons text-6xl text-blue-400">flight</span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{drone.name}</h3>
                    <p className="text-gray-600">{drone.model}</p>
                    {drone.brand && (
                      <p className="text-sm text-gray-500">{drone.brand}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
                    {getStatusLabel(drone.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {drone.weight && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Poids:</span>
                      {drone.weight} kg
                    </div>
                  )}
                  {drone.max_flight_time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="material-icons mr-2 text-gray-400 text-sm">schedule</span>
                      <span className="font-medium mr-2">Vol max:</span>
                      {drone.max_flight_time} min
                    </div>
                  )}
                  {drone.max_range && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="material-icons mr-2 text-gray-400 text-sm">location_on</span>
                      <span className="font-medium mr-2">Portée:</span>
                      {drone.max_range} km
                    </div>
                  )}
                </div>

                {drone.next_maintenance && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center text-sm text-yellow-800">
                      <span className="material-icons mr-2 text-sm">event</span>
                      <span className="font-medium">Prochaine maintenance:</span>
                    </div>
                    <p className="text-yellow-700 ml-6">{new Date(drone.next_maintenance).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(drone)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <span className="material-icons mr-2 text-sm">edit</span>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(drone.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <span className="material-icons mr-2 text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {drones.length === 0 && !loading && (
          <div className="text-center py-12">
            <span className="material-icons text-6xl text-gray-300 mx-auto mb-4">flight</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun drone enregistré</h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier drone pour commencer à gérer votre flotte.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ajouter votre premier drone
            </button>
          </div>
        )}
      </div>

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {showAddModal ? 'Ajouter un Drone' : 'Modifier le Drone'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du drone *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de drone *
                    </label>
                    <select
                      required
                      value={formData.drone_type}
                      onChange={(e) => setFormData({...formData, drone_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {droneTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de série
                    </label>
                    <input
                      type="text"
                      value={formData.serial_number}
                      onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Spécifications techniques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poids (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Charge utile max (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.max_payload}
                        onChange={(e) => setFormData({...formData, max_payload: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temps de vol max (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.max_flight_time}
                        onChange={(e) => setFormData({...formData, max_flight_time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portée max (km)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.max_range}
                        onChange={(e) => setFormData({...formData, max_range: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altitude max (m)
                    </label>
                    <input
                      type="number"
                      value={formData.max_altitude}
                      onChange={(e) => setFormData({...formData, max_altitude: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations temporelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'achat
                      </label>
                      <input
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dernière maintenance
                      </label>
                      <input
                        type="date"
                        value={formData.last_maintenance}
                        onChange={(e) => setFormData({...formData, last_maintenance: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prochaine maintenance
                      </label>
                      <input
                        type="date"
                        value={formData.next_maintenance}
                        onChange={(e) => setFormData({...formData, next_maintenance: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro d'enregistrement
                      </label>
                      <input
                        type="text"
                        value={formData.registration_number}
                        onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informations d'assurance
                      </label>
                      <textarea
                        rows="3"
                        value={formData.insurance_info}
                        onChange={(e) => setFormData({...formData, insurance_info: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes de maintenance
                      </label>
                      <textarea
                        rows="3"
                        value={formData.maintenance_notes}
                        onChange={(e) => setFormData({...formData, maintenance_notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

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
                    {showAddModal ? 'Ajouter' : 'Modifier'}
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

export default DroneManagementPage;
