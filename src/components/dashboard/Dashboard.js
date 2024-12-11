import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.stats) {
        setStats(data.stats);
      } else {
        setError('No dashboard data available');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Tickets</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalTickets || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Open Tickets</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{stats?.openTickets || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">In Progress</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">{stats?.inProgressTickets || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600">Resolved</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats?.resolvedTickets || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center py-2 border-b last:border-0">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
              <div className="flex-grow">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            {['high', 'medium', 'low'].map(priority => (
              <div key={priority} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{priority}</span>
                  <span>{stats?.priorityDistribution?.[priority] || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'high' ? 'bg-red-500' :
                      priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${(stats?.priorityDistribution?.[priority] / stats?.totalTickets * 100) || 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 