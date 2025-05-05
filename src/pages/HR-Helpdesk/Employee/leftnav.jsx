// import React from 'react';

// // Function to format the time passed
// const timeAgo = (timestamp) => {
//   const now = new Date();
//   const updatedTime = new Date(timestamp);
//   const diffInSeconds = Math.floor((now - updatedTime) / 1000); // Difference in seconds

//   const minutes = Math.floor(diffInSeconds / 60);
//   const hours = Math.floor(diffInSeconds / 3600);
//   const days = Math.floor(diffInSeconds / (3600 * 24));

//   if (minutes < 1) {
//     return "Just now";
//   } else if (minutes < 60) {
//     return `${minutes} mins ago`;
//   } else if (hours < 24) {
//     return `${hours} hrs ago`;
//   } else {
//     return `${days} days ago`;
//   }
// };

// const LeftNav = ({ tickets, isLoading, isError, error, selectedTicket, onSelectTicket }) => {
//   return (
//     <div
//       style={{
//         width: '300px',
//         borderRight: '1px solid #e0e0e0',
//         padding: '15px',
//         backgroundColor: '#ffffff',
//         fontFamily: 'Arial, sans-serif',
//         boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
//         height: '89vh',
//         overflowY: 'auto',
//       }}
//     >
//       <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Tickets history</h3>
//       {isLoading && <p style={{ color: '#777' }}>Loading tickets...</p>}
//       {isError && <p style={{ color: 'red' }}>{error?.message || 'An error occurred'}</p>}

//       <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
//         {tickets?.map((ticket) => (
//           <li
//             key={ticket._id}
//             onClick={() => onSelectTicket(ticket)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               padding: '10px',
//               marginBottom: '10px',
//               backgroundColor: selectedTicket?._id === ticket._id ? '#f0f8ff' : '#f9f9f9',
//               cursor: 'pointer',
//               borderRadius: '8px',
//               boxShadow: selectedTicket?._id === ticket._id ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
//               transition: 'background-color 0.3s, box-shadow 0.3s',
//             }}
//           >
//             {/* Placeholder image; replace with actual profile image */}
//             <div
//               style={{
//                 width: '40px',
//                 height: '40px',
//                 borderRadius: '50%',
//                 backgroundColor: '#ddd',
//                 marginRight: '10px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 color: '#555',
//               }}
//             >
//               {ticket.title.charAt(0).toUpperCase()}
//             </div>
//             <div style={{ flex: 1 }}>
//               <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
//                 {ticket.title}
//               </p>
//               <p style={{ margin: '5px 0 0', color: '#777', fontSize: '12px' }}>
//                 {ticket.status} - {timeAgo(ticket.updatedAt)}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default LeftNav;

import React, { useState } from 'react';
import TicketForm from './TicketForm';

// Function to format the time passed
const timeAgo = (timestamp) => {
  const now = new Date();
  const updatedTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - updatedTime) / 1000);

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
  const [isFormOpen, setIsFormOpen] = useState(false); // State to toggle TicketForm visibility

  const handleFormClose = () => {
    setIsFormOpen(false); // Close the form when the user finishes or cancels
  };

  // Sort tickets by latest update (most recent first)
  const sortedTickets = tickets?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Tickets history</h3>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading && <p style={{ color: '#777' }}>Loading tickets...</p>}
        {isError && !tickets?.length && (
          <p style={{ color: '#777' }}>No tickets available.</p> // Show when no tickets are found
        )}
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
              }}
              >
                {ticket.title.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
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

      <button
        onClick={() => setIsFormOpen(true)} // Open the form
        style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '15px',
          fontSize: '14px',
          width: '100%',
        }}
      >
        Create New Ticket
      </button>

      {/* Render TicketForm when isFormOpen is true */}
      {isFormOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <TicketForm onClose={handleFormClose} />
        </div>
      )}
    </div>
  );
};

export default LeftNav;
