import { useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Custom hook to fetch tickets by organization ID
const useFetchTicketsByOrganization = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { organisationId } = useParams();

  // Use useCallback to memoize the fetch function
  const fetchTickets = useCallback(async () => {
    if (!organisationId) {
      setError('Organization ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/route/tickets-by-organization`, { organisationId });
      setTickets(response.data.tickets);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching tickets');
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  return { tickets, loading, error, fetchTickets };
};

export default useFetchTicketsByOrganization;
