import React, { memo } from "react";
import ReusableModal from "../../components/Modal/component";

const ReasonModal = memo(({ pendingAction, actionReason, setActionReason, setPendingAction, handleAlert, handleFirstLevelApproval, handleFinalApproval }) => {

    
  return (
    <ReusableModal
      open={!!pendingAction}
      onClose={() => setPendingAction(null)}
      heading={`${pendingAction?.action} REASON`}
    >
      <div className="space-y-4">
        <textarea
          value={actionReason}
          onChange={(e) => setActionReason(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter reason..."
          rows="4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setPendingAction(null)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!actionReason.trim()) {
                handleAlert(true, "error", "Reason is required");
                return;
              }

              if (pendingAction.level === 'first') {
                handleFirstLevelApproval(
                  pendingAction.reportId,
                  pendingAction.expenseId,
                  pendingAction.action
                );
              } else {
                handleFinalApproval(
                  pendingAction.reportId,
                  pendingAction.expenseId,
                  pendingAction.action
                );
              }
            }}
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={!actionReason.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </ReusableModal>
  );
});

export default ReasonModal;