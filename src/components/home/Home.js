import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category.toLowerCase() === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-12 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to JomTickets</h1>
        <p className="text-xl mb-6">Discover and book tickets for the best events in town!</p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          {['all', 'concert', 'sports', 'theatre'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 first:rounded-l-md last:rounded-r-md`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString('en-MY', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Venue:</span> {event.venue}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Price:</span> From RM
                  {Math.min(...Object.values(event.prices))}
                </p>
              </div>
              <Link
                to={`/purchase/${event.id}`}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No events found for this category.
        </div>
      )}
    </div>
  );
};

export default Home; 