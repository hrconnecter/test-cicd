import React, { memo } from 'react';

const ApprovalButtons = memo(({ 
  expense,
  approvalLevel,
  isCreatorSuperAdmin,
  isHRorAccountant,
  isHRorSuperAdmin,
  isSuperAdminOrAccountantOrManager,
  isHRorManagerSuperAdmin,
  creatorRole,
  onActionClick,
  selectedExpense,
  // approval-settings
  requiresSecondLevel,
}) => {
  const handleButtonClick = (level, action) => {
    console.log('Expense object:', expense);
    console.log('Approval button clicked:', { level, action, expenseId: expense._id || expense.expenseId });
    onActionClick({
      level,
      reportId: selectedExpense._id,
      expenseId: expense._id || expense.expenseId,
      action,
      expense
    });
  };

  const canApproveExpense = (creatorRole) => {
    if (creatorRole.includes('Employee')) {
      return isHRorAccountant || isHRorSuperAdmin || isSuperAdminOrAccountantOrManager || true;
    }
    if (creatorRole.includes('Super-Admin')) {
      return isHRorAccountant;
    }
    if (creatorRole.includes('Manager')) {
      return isHRorSuperAdmin;
    }
    if (creatorRole.includes('HR')) {
      return isSuperAdminOrAccountantOrManager;
    }
    if (creatorRole.includes('Accountant')) {
      return isHRorManagerSuperAdmin;
    }
    return true;
  };

  const getApprovalMessage = (creatorRole) => {
    if (creatorRole.includes('Super-Admin')) {
      return "Only HR/Accountant roles can approve this expense";
    }
    if (creatorRole.includes('Manager')) {
      return "Only HR/SuperAdmin roles can approve this expense";
    }
    if (creatorRole.includes('HR')) {
      return "Only SuperAdmin/Accountant/Manager roles can approve this expense";
    }
    if (creatorRole.includes('Accountant')) {
      return "Only HR/Manager/SuperAdmin roles can approve this expense";
    }
    return "";
  };

  if (isCreatorSuperAdmin && !isHRorAccountant) {
    return (
      <div className="text-yellow-600 text-sm">
        Only HR/Accountant roles can approve expenses created by SuperAdmin
      </div>
    );
  }

  if (!canApproveExpense(creatorRole)) {
    return (
      <div className="text-yellow-600 text-sm">
        {getApprovalMessage(creatorRole)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* First Level Approval */}
      {expense.firstLevelStatus === "PENDING" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleButtonClick("first", "APPROVED")}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => handleButtonClick("first", "REJECTED")}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}

      {/* Final Level Approval */}
      {requiresSecondLevel && 
       expense.firstLevelStatus === "APPROVED" && 
       expense.finalStatus === "PENDING" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleButtonClick("final", "APPROVED")}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Final Approve
          </button>
          <button
            onClick={() => handleButtonClick("final", "REJECTED")}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Final Reject
          </button>
        </div>
      )}
    </div>
  );
});

ApprovalButtons.displayName = 'ApprovalButtons';
export default ApprovalButtons;


//ABOVE BACKUP
/* eslint-disable no-unused-vars */
// import React, { memo } from 'react';
// const ApprovalButtons = memo(({ 
//   expense,
//   approvalLevel,
//   isCreatorSuperAdmin,
//   isHRorAccountant,
//   isHRorSuperAdmin,
//   isSuperAdminOrAccountantOrManager,
//   isHRorManagerSuperAdmin,
//   creatorRole,
//   onActionClick,
//   selectedExpense,
//   // approval-settings
//   requiresSecondLevel,
  
// }) => {
//   if (!requiresSecondLevel && expense.firstLevelStatus === "APPROVED") {
//     return null; // Payment buttons will be shown instead
//   }

//   // const handleButtonClick = (level, action) => {
//   //   console.log('Approval button clicked:', { level, action });
//   //   onActionClick({
//   //     level,
//   //     reportId: selectedExpense._id,
//   //     expenseId: expense.expenseId,
//   //     action,
//   //     expense: selectedExpense
//   //   });
//   // };

//   //page
//   // const handleButtonClick = (level, action) => {
//   //   console.log('Approval button clicked:', { level, action, expenseId: expense.expenseId });
//   //   onActionClick({
//   //     level,
//   //     reportId: selectedExpense._id,
//   //     expenseId: expense.expenseId,
//   //     action,
//   //     expense: selectedExpense
//   //   });
//   // };
//   const handleButtonClick = (level, action) => {
//     // Log the expense object to verify its structure
//     console.log('Expense object:', expense);
//     console.log('Approval button clicked:', { level, action,  expenseId: expense._id || expense.expenseId });
//     onActionClick({
//       level,
//       reportId: selectedExpense._id,
//       expenseId: expense._id || expense.expenseId, // Handle both possible ID fields
//       action,
//       expense
//     });
//   };
  
  
  
//   const canApproveExpense = (creatorRole) => {
//     if (creatorRole.includes('Employee')) {
//       // return isHRorAccountant || isHRorSuperAdmin || isSuperAdminOrAccountantOrManager
//       // return true
//       return isHRorAccountant || isHRorSuperAdmin || isSuperAdminOrAccountantOrManager || true;
//     }

//     if (creatorRole.includes('Super-Admin')) {
//       return isHRorAccountant;
//     }
//     if (creatorRole.includes('Manager')) {
//       return isHRorSuperAdmin;
//     }
//     if (creatorRole.includes('HR')) {
//       return isSuperAdminOrAccountantOrManager;
//     }
//     if (creatorRole.includes('Accountant')) {
//       return isHRorManagerSuperAdmin;
//     }
//     return true;
//   };

//   if (isCreatorSuperAdmin && !isHRorAccountant) {
//     return (
//       <div className="text-yellow-600 text-sm">
//         Only HR/Accountant roles can approve expenses created by SuperAdmin
//       </div>
//     );
//   }
//    const getApprovalMessage = (creatorRole) => {
//     if (creatorRole.includes('Super-Admin')) {
//       return "Only HR/Accountant roles can approve this expense";
//     }

//     if (creatorRole.includes('Manager')) {
//       return "Only HR/SuperAdmin roles can approve this expense";
//     }
//     if (creatorRole.includes('HR')) {
//       return "Only SuperAdmin/Accountant/Manager roles can approve this expense";
//     }
//     if (creatorRole.includes('Accountant')) {
//       return "Only HR/Manager/SuperAdmin roles can approve this expense";
//     }
//     return "";
//   };

//   if (!canApproveExpense(creatorRole)) {
//     return (
//       <div className="text-yellow-600 text-sm">
//         {getApprovalMessage(creatorRole)}
//       </div>
//     );
//   }

//   if (approvalLevel === "first" && expense.firstLevelStatus === "PENDING") {
//     return (
//       <>
       
//         <button
//   onClick={() => handleButtonClick("first", "APPROVED")}
//   className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//   // disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
// >
//   Approve
// </button>

// <button
//   onClick={() => handleButtonClick("first", "REJECTED")}
//   className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//   // disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
// >
//   Reject
// </button>
//       </>
//     );
//   }


//   // Similar logic for final approval buttons...
//   if (approvalLevel === "final" && 
//     expense.firstLevelStatus === "APPROVED" && 
//     expense.finalStatus === "PENDING") {
//   return (
//     <>
//       <button
//         onClick={() => handleButtonClick("final", "APPROVED")}
//         className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         // disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
//       >
//         Final Approve
//       </button>

//       <button
//         onClick={() => handleButtonClick("final", "REJECTED")}
//         className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         // disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
//       >
//         Final Reject
//       </button>
//     </>
//   );
// }
//   return null;
// });

// ApprovalButtons.displayName = 'ApprovalButtons';
// export default ApprovalButtons;





// FOR ANY ROLE
// import React, { memo } from 'react';
// const ApprovalButtons = memo(({ 
//   expense,
//   approvalLevel,
//   isCreatorSuperAdmin,
//   isHRorAccountant,
//   isHRorSuperAdmin,
//   isSuperAdminOrAccountantOrManager,
//   isHRorManagerSuperAdmin,
//   creatorRole,
//   onActionClick,
//   selectedExpense
// }) => {

//   const handleButtonClick = (level, action) => {
//     console.log('Expense object:', expense);
//     console.log('Approval button clicked:', { level, action,  expenseId: expense._id || expense.expenseId });
//     onActionClick({
//       level,
//       reportId: selectedExpense._id,
//       expenseId: expense._id || expense.expenseId,
//       action,
//       expense
//     });
//   };
  
//   const canApproveExpense = (creatorRole) => {
//     if (creatorRole.includes('Super-Admin')) {
//       return isHRorAccountant;
//     }
//     if (creatorRole.includes('Manager')) {
//       return isHRorSuperAdmin;
//     }
//     if (creatorRole.includes('HR')) {
//       return isSuperAdminOrAccountantOrManager;
//     }
//     if (creatorRole.includes('Accountant')) {
//       return isHRorManagerSuperAdmin;
//     }
//     return false;
//   };

//   if (isCreatorSuperAdmin && !isHRorAccountant) {
//     return (
//       <div className="text-yellow-600 text-sm">
//         Only HR/Accountant roles can approve expenses created by SuperAdmin
//       </div>
//     );
//   }
  
//   if (approvalLevel === "first" && expense.firstLevelStatus === "PENDING") {
//     return (
//       <>
//         <button
//           onClick={() => handleButtonClick("first", "APPROVED")}
//           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//           disabled={(isCreatorSuperAdmin && !isHRorAccountant)}
//         >
//           Approve
//         </button>
//         <button
//           onClick={() => handleButtonClick("first", "REJECTED")}
//           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//           disabled={(isCreatorSuperAdmin && !isHRorAccountant)}
//         >
//           Reject
//         </button>
//       </>
//     );
//   }

//   if (approvalLevel === "final" && 
//     expense.firstLevelStatus === "APPROVED" && 
//     expense.finalStatus === "PENDING") {
//   return (
//     <>
//       <button
//         onClick={() => handleButtonClick("final", "APPROVED")}
//         className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         disabled={(isCreatorSuperAdmin && !isHRorAccountant)}
//       >
//         Final Approve
//       </button>

//       <button
//         onClick={() => handleButtonClick("final", "REJECTED")}
//         className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         disabled={(isCreatorSuperAdmin && !isHRorAccountant)}
//       >
//         Final Reject
//       </button>
//     </>
//   );
// }
//   return null;
// });

// ApprovalButtons.displayName = 'ApprovalButtons';
// export default ApprovalButtons;
