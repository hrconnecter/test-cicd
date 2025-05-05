import React from 'react';

// Function to format the time passed
const timeAgo = (timestamp) => {
  const now = new Date();
  const updatedTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - updatedTime) / 1000); // Difference in seconds

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / (3600 * 24));

  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} mins ago`;
  } else if (hours < 24) {
    return `${hours} hrs ago`;
  } else {
    return `${days} days ago`;
  }
};

const LeftNav = ({ tickets, isLoading, isError, error, selectedTicket, onSelectTicket }) => {
  // Sort tickets by latest update (most recent first)
  const sortedTickets = tickets?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // console.log("Tickets", )

  return (
    <div
      style={{
        width: '300px',
        borderRight: '1px solid #e0e0e0',
        padding: '15px',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        height: '89vh',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Raised Tickets</h3>
      {isLoading && <p style={{ color: '#777' }}>Loading tickets...</p>}
      
      {/* Handle error for empty ticket list */}
      {isError && !tickets?.length && (
        <p style={{ color: '#777' }}>No tickets available for this organization.</p> // Display message if no tickets
      )}

      {/* Handle error message */}
      {isError && tickets?.length === 0 && (
        <p style={{ color: 'red' }}>{error?.message || 'An error occurred'}</p>
      )}

      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {sortedTickets?.map((ticket) => (
          <li
            key={ticket._id}
            onClick={() => onSelectTicket(ticket)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: selectedTicket?._id === ticket._id ? '#f0f8ff' : '#f9f9f9',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: selectedTicket?._id === ticket._id ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
          >
            {/* Placeholder image; replace with actual profile image */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ddd',
                marginRight: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#555',
                overflow: 'hidden',
              }}
            >
              {ticket?.employeeId?.user_logo_url ? (
                <img
                  src={ticket.employeeId.user_logo_url}
                  alt="User"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                ticket.employeeId?.first_name.charAt(0).toUpperCase()
              )}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                {ticket.employeeId.first_name + ' ' + ticket.employeeId.last_name}
              </p>
              <p style={{ margin: '5px 0 0', color: '#777', fontSize: '12px' }}>
                {ticket.title}
              </p>
              <p style={{ margin: '5px 0 0', color: '#777', fontSize: '12px' }}>
                {ticket.status} - {timeAgo(ticket.updatedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftNav;
