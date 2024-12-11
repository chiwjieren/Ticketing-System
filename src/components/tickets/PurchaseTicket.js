import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const PurchaseTicket = () => {
  const { eventId } = useParams();
  const [formData, setFormData] = useState({
    category: 'cat1',
    quantity: 1
  });
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token));
      
      const purchase = {
        eventId: event.id,
        userId: tokenData.userId,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        totalPrice: event.prices[formData.category] * formData.quantity,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed'
      };

      const response = await fetch('http://localhost:3001/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(purchase),
      });

      if (response.ok) {
        // Update available seats
        const updatedEvent = {
          ...event,
          availableSeats: {
            ...event.availableSeats,
            [formData.category]: event.availableSeats[formData.category] - formData.quantity
          }
        };

        await fetch(`http://localhost:3001/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent),
        });

        navigate('/my-tickets');
      } else {
        setError('Failed to purchase tickets');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('An error occurred while purchasing tickets');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{event.title}</h2>
      <div className="mb-6">
        <p className="text-gray-600">{event.description}</p>
        <p className="mt-2">
          <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleString()}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Venue:</span> {event.venue}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ticket Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(event.prices).map(([category, price]) => (
              <option key={category} value={category} disabled={event.availableSeats[category] < 1}>
                {category.toUpperCase()} - RM{price} 
                ({event.availableSeats[category]} seats left)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <select
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {[...Array(Math.min(4, event.availableSeats[formData.category]))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price:</span>
            <span className="text-xl font-bold">
              RM{(event.prices[formData.category] * formData.quantity).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Processing...' : 'Purchase Tickets'}
        </button>
      </form>
    </div>
  );
};

export default PurchaseTicket; 