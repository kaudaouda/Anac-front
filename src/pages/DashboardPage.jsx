import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [drones, setDrones] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDrones: 0,
    activeDrones: 0,
    maintenanceDrones: 0,
    totalFlights: 0,
    totalFlightTime: 0,
    thisMonthFlights: 0,
    thisMonthFlightTime: 0
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
        fetchDrones(),
        fetchFlights()
      ]);
      calculateStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrones = async () => {
    try {
      const data = await apiService.get('/drones/');
      setDrones(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFlights = async () => {
    try {
      const data = await apiService.get('/flights/');
      setFlights(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalDrones = drones.length;
    const activeDrones = drones.filter(d => d.status === 'active').length;
    const maintenanceDrones = drones.filter(d => d.status === 'maintenance').length;
    
    const totalFlights = flights.length;
    const totalFlightTime = flights.reduce((total, flight) => total + (flight.duration || 0), 0);
    
    const thisMonthFlights = flights.filter(flight => {
      const flightDate = new Date(flight.flight_date);
      return flightDate.getMonth() === thisMonth && flightDate.getFullYear() === thisYear;
    }).length;
    
    const thisMonthFlightTime = flights.filter(flight => {
      const flightDate = new Date(flight.flight_date);
      return flightDate.getMonth() === thisMonth && flightDate.getFullYear() === thisYear;
    }).reduce((total, flight) => total + (flight.duration || 0), 0);

    setStats({
      totalDrones,
      activeDrones,
      maintenanceDrones,
      totalFlights,
      totalFlightTime,
      thisMonthFlights,
      thisMonthFlightTime
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getDronesNeedingMaintenance = () => {
    return drones.filter(drone => drone.is_maintenance_due);
  };

  const getRecentFlights = () => {
    return flights
      .sort((a, b) => new Date(b.flight_date) - new Date(a.flight_date))
      .slice(0, 5);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {user?.first_name} ! Voici un aperçu de votre flotte de drones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="material-icons text-blue-600 text-xl">flight</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Drones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDrones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="material-icons text-green-600 text-xl">check_circle</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drones Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDrones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="material-icons text-yellow-600 text-xl">build</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenanceDrones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600 text-xl">flight_takeoff</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vols</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFlights}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Temps de vol total</h3>
              <span className="material-icons text-blue-600">schedule</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {formatDuration(stats.totalFlightTime)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Tous les vols confondus
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ce mois-ci</h3>
              <span className="material-icons text-green-600">event</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">
                {stats.thisMonthFlights} vols
              </p>
              <p className="text-lg text-gray-700">
                {formatDuration(stats.thisMonthFlightTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Vos Drones</h3>
                  <Link
                    to="/drones"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voir tous →
                  </Link>
                </div>
              </div>
              
              {drones.length === 0 ? (
                <div className="p-6 text-center">
                  <span className="material-icons text-4xl text-gray-300 mx-auto mb-3">flight</span>
                  <p className="text-gray-600 mb-4">Aucun drone enregistré</p>
                  <Link
                    to="/drones"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ajouter un drone
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {drones.slice(0, 3).map((drone) => (
                    <div key={drone.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-icons text-blue-600">flight</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{drone.name}</h4>
                            <p className="text-xs text-gray-500">{drone.model}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            drone.status === 'active' ? 'bg-green-100 text-green-800' :
                            drone.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {drone.status === 'active' ? 'Actif' :
                             drone.status === 'maintenance' ? 'Maintenance' :
                             drone.status === 'inactive' ? 'Inactif' : 'Retiré'}
                          </span>
                          {drone.next_maintenance && (
                            <p className="text-xs text-gray-500 mt-1">
                              Maintenance: {formatDate(drone.next_maintenance)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {getDronesNeedingMaintenance().length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="material-icons text-yellow-600 text-xl mr-3">warning</span>
                  <h3 className="text-lg font-medium text-yellow-800">
                    Maintenance requise
                  </h3>
                </div>
                <div className="space-y-2">
                  {getDronesNeedingMaintenance().map((drone) => (
                    <div key={drone.id} className="flex items-center justify-between text-sm">
                      <span className="text-yellow-700">{drone.name}</span>
                      <span className="text-yellow-600 font-medium">
                        Maintenance due
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/drones"
                  className="mt-4 inline-flex items-center text-yellow-800 hover:text-yellow-900 text-sm font-medium"
                >
                  Gérer la maintenance →
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Vols Récents</h3>
                  <Link
                    to="/flights"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voir tous →
                  </Link>
                </div>
              </div>
              
              {flights.length === 0 ? (
                <div className="p-6 text-center">
                  <span className="material-icons text-4xl text-gray-300 mx-auto mb-3">flight_takeoff</span>
                  <p className="text-gray-600 mb-4">Aucun vol enregistré</p>
                  <Link
                    to="/flights"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Enregistrer un vol
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {getRecentFlights().map((flight) => (
                    <div key={flight.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-icons text-green-600">flight_takeoff</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {flight.drone.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <span className="material-icons mr-1 text-xs">location_on</span>
                                {flight.location}
                              </span>
                              <span className="flex items-center">
                                <span className="material-icons mr-1 text-xs">schedule</span>
                                {formatDuration(flight.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDate(flight.flight_date)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {flight.pilot.first_name} {flight.pilot.last_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <Link
                  to="/drones"
                  className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="material-icons text-blue-600 mr-3">flight</span>
                  <span className="text-blue-800 font-medium">Gérer mes drones</span>
                </Link>
                <Link
                  to="/flights"
                  className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <span className="material-icons text-green-600 mr-3">flight_takeoff</span>
                  <span className="text-green-800 font-medium">Enregistrer un vol</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <span className="material-icons text-purple-600 mr-3">person</span>
                  <span className="text-purple-800 font-medium">Mon profil</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance des Vols</h3>
            <span className="material-icons text-blue-600">show_chart</span>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="material-icons text-4xl mx-auto mb-2">show_chart</span>
              <p>Graphique de performance à venir</p>
              <p className="text-sm">Statistiques détaillées des vols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
