import React from 'react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'Do you really want to perform this action?',
  confirmText = 'Yes, Close Ticket',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px 25px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '15px', fontSize: '20px', color: '#333' }}>{title}</h2>
        <p style={{ marginBottom: '25px', color: '#666', fontSize: '16px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f1f1f1',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 18px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 18px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
