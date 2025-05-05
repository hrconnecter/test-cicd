
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useState, useEffect } from 'react';
import ReusableModal from '../Modal/component';

const ReasonModal = memo(({ 
  isOpen, 
  onClose, 
  actionReason, 
  setActionReason, 
  pendingAction,
  onSubmit
}) => {
  const [localReason, setLocalReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalReason(actionReason || '');
    } else {
      setLocalReason('');
    }
  }, [isOpen, actionReason]);

  const handleChange = useCallback((value) => {
     console.log('Reason being typed:', value);
    setLocalReason(value);
    setActionReason(value);
  }, [setActionReason]);

  const handleModalSubmit = useCallback(() => {
    // if (localReason.trim()) {
      if (localReason.trim() && pendingAction?.expenseId) {
      console.log('Submitting reason from modal:', localReason);
      console.log('Submitting with expenseId:', pendingAction.expenseId);
      onSubmit();
    }
  }, [localReason, onSubmit,pendingAction]);

  return (
    <ReusableModal
      open={isOpen}
      onClose={onClose}
      heading={`${pendingAction?.action || ''} REASON`}
    >
      <div className="space-y-4">
        <textarea
          value={localReason}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter reason..."
          rows="4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleModalSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={!localReason?.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </ReusableModal>
  );
});

ReasonModal.displayName = 'ReasonModal';
export default ReasonModal;
