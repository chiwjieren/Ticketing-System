import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      console.error('Fetch events error:', err);
      setError('Failed to fetch events');
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
              }}
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="mb-4">
                <p className="text-sm">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Venue:</span> {event.venue}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Starting from:</span> RM
                  {Math.min(...Object.values(event.prices))}
                </p>
              </div>
              <Link
                to={`/purchase/${event.id}`}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Buy Tickets
              </Link>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          No upcoming events at the moment.
        </div>
      )}
    </div>
  );
};

export default EventList; 