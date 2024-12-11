import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const MyTickets = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token));
      
      const response = await fetch(`http://localhost:3001/purchases?userId=${tokenData.userId}`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Fetch purchases error:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {purchases.map(purchase => (
          <div key={purchase.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-2">{purchase.eventTitle}</h2>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    {purchase.quantity} x {purchase.category.toUpperCase()} tickets
                  </p>
                  <p className="text-sm text-gray-500">
                    Purchased on: {new Date(purchase.purchaseDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order ID: #{purchase.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold mb-2">RM{purchase.totalPrice.toFixed(2)}</p>
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {purchase.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {purchases.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Tickets Yet</h3>
            <p className="text-gray-500 mb-4">You haven't purchased any tickets yet.</p>
            <a
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Events
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets; 