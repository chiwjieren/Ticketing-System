import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TicketCard = ({ ticket, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        onUpdate();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update ticket status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">
          <Link to={`/tickets/${ticket.id}`} className="hover:text-blue-600">
            {ticket.title}
          </Link>
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {ticket.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
          <span className="text-sm text-gray-500">
            {ticket.category}
          </span>
        </div>

        {!isUpdating && ticket.status !== 'resolved' && (
          <div className="flex space-x-2">
            {ticket.status === 'open' && (
              <button
                onClick={() => handleStatusChange('in-progress')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Start Progress
              </button>
            )}
            {ticket.status === 'in-progress' && (
              <button
                onClick={() => handleStatusChange('resolved')}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Mark Resolved
              </button>
            )}
          </div>
        )}

        {isUpdating && (
          <div className="text-sm text-gray-500">
            Updating...
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default TicketCard; 