
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import UserProfile from '../../../hooks/UserData/useUser';
import LeftNav from './leftnav';
import TicketDetails from './TicketDetails';

const fetchTicketsemployeeId = async (employeeId) => {
  const response = await axios.get(`${process.env.REACT_APP_API}/route/employee/${employeeId}/tickets`, {
    employeeId,
  });
  return response.data.tickets;
};

const TicketHistory = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const { data: tickets, error, isLoading, isError } = useQuery(
    ['ticketsforemp', employeeId],
    () => fetchTicketsemployeeId(employeeId),
    { enabled: !!employeeId }
  );

  const handleTicketSelect = (ticket) => setSelectedTicket(ticket);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '93%',
        width: '100%',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {/* Left Navigation */}
      <div
        style={{
          flex: '0 0 300px', // Fixed width for LeftNav
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #ddd',
          overflow: 'hidden',
        }}
      >
        <LeftNav
          tickets={tickets}
          isLoading={isLoading}
          isError={isError}
          error={error}
          selectedTicket={selectedTicket}
          onSelectTicket={handleTicketSelect}
        />
      </div>

      {/* Ticket Details */}
      <div
        style={{
          flex: 1, // Fill the remaining space
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TicketDetails ticket={selectedTicket} employeeId={employeeId} />
      </div>
    </div>
  );
};

export default TicketHistory;
