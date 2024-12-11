import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import LoadingSpinner from '../common/LoadingSpinner';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // json-server returns the array directly, no need to check for success
        setTickets(data);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Fetch tickets error:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    return (filter.status === 'all' || ticket.status === filter.status) &&
           (filter.priority === 'all' || ticket.priority === filter.priority) &&
           (filter.category === 'all' || ticket.category === filter.category);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <div className="flex space-x-4">
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            name="priority"
            value={filter.priority}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="feature">Feature Request</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} onUpdate={fetchTickets} />
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {error ? 'Error loading tickets' : 'No tickets found matching your filters.'}
        </div>
      )}
    </div>
  );
};

export default TicketList; 