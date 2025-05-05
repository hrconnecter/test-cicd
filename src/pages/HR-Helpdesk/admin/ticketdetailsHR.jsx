
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import ConfirmationDialog from './confirmClose';

const TicketDetailsHR = ({ ticket, adminId }) => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  console.log(isReplyLoading);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (ticket) {
      const initialMessages = [
        {
          id: 1,
          sender: 'user',
          text: ticket.description || 'No description available.',
          timestamp: new Date(ticket.createdAt).toLocaleString(),
          attachments: ticket.attachments || [], // Include attachments
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
        sender: 'admin',
        text: reply,
        timestamp: new Date().toLocaleString(),
      };
  
      // Optimistic UI update
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setReply('');
  
      try {
        await axios.put(`${process.env.REACT_APP_API}/route/tickets/activity/admin`, {
          ticketId: ticket.ticketId,
          adminId: adminId,
          comment: reply,
        });
  
        // Invalidate query to refresh the data
        await queryClient.invalidateQueries(['tickets']);
      } catch (error) {
        console.error('Error updating ticket activity:', error);
      } finally {
        setIsReplyLoading(false);
      }
    }
  };
  

  const handleCloseTicket = async () => {
    setIsDialogOpen(false); // Close the dialog
    setIsClosing(true);

    try {
      await axios.post(`${process.env.REACT_APP_API}/route/ticket/close`, {
        ticketId: ticket.ticketId,
        adminId: adminId,
      });

      await queryClient.invalidateQueries(['tickets']);
    } catch (error) {
      console.error('Error closing ticket:', error);
    } finally {
      setIsClosing(false);
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
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            <button
              onClick={() => setIsDialogOpen(true)} // Open dialog
              disabled={isClosing}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: isClosing ? 'not-allowed' : 'pointer',
              }}
            >
              {isClosing ? 'Closing...' : 'Close Ticket'}
            </button>
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
                  alignSelf: message.sender === 'admin' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.sender === 'admin' ? '#e0f7fa' : '#f1f1f1',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  maxWidth: '70%',
                  fontSize: '14px',
                  color: message.sender === 'admin' ? '#00796b' : '#333',
                }}
              >
                {message.text}
                {message.attachments && message.attachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      style={{
                        maxWidth: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                        cursor: 'pointer', // Make it clear the image is clickable
                      }}
                      onClick={() => setSelectedImage(attachment)} // Set the image for the modal
                    >
                      <img
                        src={attachment}
                        alt={`Attachment ${index + 1}`}
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
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

          {/* Reply Section */}
         {/* Replace the Reply Section */}
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

          <ConfirmationDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)} // Close dialog
            onConfirm={handleCloseTicket} // Confirm action
            title="Close Ticket?"
            message="Are you sure you want to close this support ticket? This action cannot be undone."
            confirmText="Yes, Close Ticket"
          />
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

{selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            left: 0,
            width: '100%',
            height: '94%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)} // Close the modal on click
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              zIndex: 1001, // Ensure it appears above everything else
            }}
          >
            &times; {/* Unicode for '×' */}
          </button>

          {/* Image */}
          <img
            src={selectedImage}
            alt="Full View"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '10px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TicketDetailsHR;
