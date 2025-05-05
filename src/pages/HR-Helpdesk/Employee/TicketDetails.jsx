import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';

const TicketDetails = ({ ticket, employeeId }) => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const queryClient = useQueryClient();
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  console.log(isReplyLoading);



  useEffect(() => {
    if (ticket) {
      const initialMessages = [
        {
          id: 1,
          sender: 'user',
          text: ticket.description || 'No description available.',
          timestamp: new Date(ticket.createdAt).toLocaleString(),
        },
        ...ticket.activityLog.map((log, index) => ({
          id: index + 2,
          sender: log.action === 'Admin Message' ? 'admin' : 'user',
          text: log.comments,
          timestamp: new Date(log.date).toLocaleString(),
        })),
      ];
      setMessages(initialMessages);
    }
  }, [ticket]);

  const handleSendReply = async () => {
    if (reply.trim()) {
      setIsReplyLoading(true);

      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: reply,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setReply('');

      try {
        await axios.put(`${process.env.REACT_APP_API}/route/tickets/activity/employee`, {
          ticketId: ticket.ticketId,
          employeeId: employeeId,
          comment: reply,
        });

        await queryClient.invalidateQueries(["ticketsforemp"]);
      } catch (error) {
        console.error('Error updating ticket activity:', error);
      }
    }
  };

  const renderProfileImageOrInitial = (title) => {
    const initial = title ? title.charAt(0).toUpperCase() : '?';
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {initial}
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '89vh',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
      }}
    >
      {ticket ? (
        <>
          {/* Header */}
          <div
            style={{
              padding: '15px',
              borderBottom: '1px solid #ddd',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {ticket.imageUrl ? (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={ticket.imageUrl}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              renderProfileImageOrInitial(ticket.title)
            )}
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{ticket.title}</h3>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#777' }}> (Ref No.: {ticket.ticketId})</h3>
          </div>

          {/* Chat Section */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              overflowY: 'auto',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor:
                    message.sender === 'user' ? '#e0f7fa' : '#f1f1f1',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  maxWidth: '70%',
                  fontSize: '14px',
                  color: message.sender === 'user' ? '#00796b' : '#333',
                }}
              >
                {message.text}
                <div
                  style={{
                    fontSize: '10px',
                    color: '#999',
                    marginTop: '5px',
                    textAlign: 'right',
                  }}
                >
                  {message.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Section (only show if ticket is not closed) */}
          {ticket.status === 'Closed' ? (
            <div
              style={{
                padding: '15px',
                borderTop: '1px solid #ddd',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                color: '#dc3545',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              This ticket has been closed.
            </div>
          ) : (
            /* Reply Section */
            <div
            style={{
              padding: '15px',
              borderTop: '1px solid #ddd',
              display: 'flex',
              gap: '10px',
              backgroundColor: '#fff',
            }}
          >
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSendReply}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '20px',
              }}
            >
              Send
            </button>
          </div>
        )}
        </>
      ) : (
        <div
          style={{
            flex: 1,
            padding: '20px',
            textAlign: 'center',
            color: '#777',
          }}
        >
          Select a ticket to view the details
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
