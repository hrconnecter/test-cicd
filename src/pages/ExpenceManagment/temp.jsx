/* eslint-disable no-unused-vars */
// import { useContext, useState, useCallback, memo } from "react";
// import { useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../components/Modal/component";
// import UserProfile from "../../hooks/UserData/useUser";
// import EmployeeReports from './EmployeeReports';

// const ApproveExpense = () => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const user = getCurrentUser();

//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();
//   const queryClient = useQueryClient();

//   const [approvalLevel, setApprovalLevel] = useState('first');
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [expenseActions, setExpenseActions] = useState([]);
//   const [actionReason, setActionReason] = useState('');
//   const [pendingAction, setPendingAction] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [payrollMonth, setPayrollMonth] = useState('');

//   // Fetch pending expenses
//   const { data: pendingApprovals, isLoading } = useQuery(
//     ["pendingExpenses", organisationId, approvalLevel],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/pending/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );

//       console.log("ReportReport API Response:", response); // Logs the full response
//       console.log("ReportReport Data:", response.data.reports);

//       return response.data.reports; // Now getting reports instead of expenses
//     },
//     {
//       refetchOnWindowFocus: true,
//       staleTime: 0
//     }
//   );

//   // Fetch expense history
//   const { data: expenseHistory } = useQuery(
//     ["expenseHistory", selectedExpense?._id],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/report/${selectedExpense._id}/approval-history`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.approvalHistory;
//     },
//     { enabled: !!selectedExpense && activeTab === 'history' }
//   );

//   // First Level Approval Mutation
//   const firstLevelMutation = useMutation(
//     ({ reportId, expenseId, action, reason }) => {
//       if (!reason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       return axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
//         { action, reason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "First level approval updated successfully");
//         setActionReason('');
//         setPendingAction(null);
//       }
//     }
//   );

//   // Final Level Approval Mutation
//   const finalLevelMutation = useMutation(
//     ({ reportId, expenseId, action, reason }) => {
//       if (!reason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       return axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
//         { action, reason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "Final approval updated successfully");
//         setActionReason('');
//         setPendingAction(null);
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.message || "Failed to update approval");
//       }
//     }
//   );

//   // Handler Functions
//   const handleFirstLevelApproval = useCallback((reportId, expenseId, action, reason) => {
//     firstLevelMutation.mutate({ reportId, expenseId, action, reason });
//   }, [firstLevelMutation]);

//   const handleFinalApproval = useCallback((reportId, expenseId, action, reason) => {
//     finalLevelMutation.mutate({ reportId, expenseId, action, reason });
//   }, [finalLevelMutation]);

//   // Handle Report Expenses Mutation
//   const handleReportMutation = useMutation(
//     ({ reportId, expenseActions }) =>
//       axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/handle-expenses`,
//         { expenseActions },
//         { headers: { Authorization: authToken } }
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "Report expenses updated successfully");
//         setSelectedExpense(null);
//         setExpenseActions([]);
//       }
//     }
//   );

//   // Payment processing mutation
//   const paymentMutation = useMutation(
//     async ({ expenseId, data }) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/expense/${expenseId}/payment`,
//         data,
//         { headers: { Authorization: authToken } }
//       );
//       return response;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "Payment processed successfully");
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.message || "Payment processing failed");
//       }
//     }
//   );

//   const handlePayment = async () => {
//     if (paymentMethod === 'MANUAL_PAYMENT') {
//       try {
//         const response = await paymentMutation.mutateAsync({
//           expenseId: selectedExpense._id,
//           data: { paymentMethod }
//         });

//         console.log('AP Payment Response:', response);
//         console.log('AP Order ID:', response.data.order.id);
//         console.log('AP Employee Details:', response.data.employeeDetails);

//         const options = {
//           key: process.env.REACT_APP_RAZORPAY_KEY,
//           amount: selectedExpense.amount * 100,
//           currency: "INR",
//           name: "AEGIS Expense Payment",
//           description: `Payment for ${selectedExpense.expenseName}`,
//           order_id: response.data.order.id,
//           prefill: {
//             name: response.data.employeeDetails.name,
//             account_number: response.data.employeeDetails.accountNo
//           },
//           handler: async (paymentResponse) => {
//             try {
//               await axios.post(
//                 `${process.env.REACT_APP_API}/route/expense/${selectedExpense._id}/verify-payment`,
//                 paymentResponse,
//                 { headers: { Authorization: authToken } }
//               );
//               handleAlert(true, "success", "Payment completed successfully");
//               queryClient.invalidateQueries("pendingExpenses");
//             } catch (error) {
//               handleAlert(true, "error", error.message || "Payment verification failed");
//             }
//           },
//           modal: {
//             ondismiss: () => {
//               alert("Payment cancelled");
//             }
//           }
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//       } catch (error) {
//         handleAlert(true, "error", error.message || "Failed to initiate payment");
//       }
//     } else {
//       paymentMutation.mutate({
//         expenseId: selectedExpense._id,
//         data: {
//           paymentMethod,
//           payrollMonth
//         }
//       });
//     }
//   };

//   const StatusBadge = ({ status }) => {
//     const getStatusColor = (status) => {
//       switch (status) {
//         case 'APPROVED': return 'bg-green-100 text-green-800';
//         case 'REJECTED': return 'bg-red-100 text-red-800';
//         case 'PENDING': return 'bg-yellow-100 text-yellow-800';
//         case 'PAID': return 'bg-blue-100 text-blue-800';
//         case 'CLOSED': return 'bg-gray-100 text-gray-800';
//         case 'PAYROLL': return 'bg-purple-100 text-purple-800';
//         default: return 'bg-gray-100 text-gray-800';
//       }
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
//         {status}
//       </span>
//     );
//   };

//   // ReasonModal Component
//   const ReasonModal = memo(() => {
//     const handleReasonChange = useCallback((e) => {
//       setActionReason(e.target.value);
//     }, []);

//     const handleSubmit = useCallback(() => {
//       if (!actionReason.trim()) {
//         handleAlert(true, "error", "Reason is required");
//         return;
//       }

//       if (pendingAction.level === 'first') {
//         handleFirstLevelApproval(
//           pendingAction.reportId,
//           pendingAction.expenseId,
//           pendingAction.action,
//           actionReason
//         );
//       } else {
//         handleFinalApproval(
//           pendingAction.reportId,
//           pendingAction.expenseId,
//           pendingAction.action,
//           actionReason
//         );
//       }
//     }, []);

//     return (
//       <ReusableModal
//         open={!!pendingAction}
//         onClose={() => setPendingAction(null)}
//         heading={`${pendingAction?.action} REASON`}
//       >
//         <div className="space-y-4">
//           <textarea
//             value={actionReason}
//             onChange={handleReasonChange}
//             className="w-full p-2 border rounded-md"
//             placeholder="Enter reason..."
//             rows="4"
//             required
//           />
//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={() => setPendingAction(null)}
//               className="px-4 py-2 border rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-primary text-white rounded-md"
//               disabled={!actionReason.trim()}
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </ReusableModal>
//     );

//   });
//   // ExpenseDetailsModal Component
//   const ExpenseDetailsModal = () => {
//     if (!selectedExpense) return null;

//     return (
//       <ReusableModal
//         open={!!selectedExpense}
//         onClose={() => {
//           setSelectedExpense(null);
//           setActiveTab('details');
//         }}
//         heading="Expense Information"
//       >
//         <div className="p-4">
//           {/* Tab Navigation */}
//           <div className="flex space-x-4 mb-4 border-b">
//             <button
//               className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('details')}
//             >
//               Details & History
//             </button>
//             {selectedExpense.isReport && (
//               <button
//                 className={`pb-2 px-4 ${activeTab === 'expenses' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab('expenses')}
//               >
//                 Expense Items
//               </button>
//             )}
//             {(role?.includes("Super-Admin") || role?.includes("Accountant")) && (
//               <button
//                 className={`pb-2 px-4 ${activeTab === 'payment' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab('payment')}
//               >
//                 Payment
//               </button>
//             )}
//           </div>

//           {/* Details & History Tab Content */}
//           {activeTab === 'details' && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold mb-2">Report Information</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div><span className="font-medium">Report Name:</span> {selectedExpense.reportName}</div>
//                   <div><span className="font-medium">Total Amount:</span> ₹{selectedExpense.totalAmount}</div>
//                   <div>
//                     <span className="font-medium">Created By:</span>
//                     {selectedExpense.employeeInfo?.[0]?.first_name} {selectedExpense.employeeInfo?.[0]?.last_name}
//                   </div>
//                   <div><span className="font-medium">Created At:</span> {new Date(selectedExpense.createdAt).toLocaleDateString()}</div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold mb-2">Approval History</h3>
//                 {selectedExpense.expenses.map((expense, index) => (
//                   <div key={index} className="mb-4 border-b pb-2">
//                     <div className="font-medium">{expense.expenseName}</div>
//                     <div className="grid grid-cols-2 gap-4 mt-2">
//                       <div>
//                         <div className="text-sm">First Level: <StatusBadge status={expense.firstLevelStatus} /></div>
//                         {expense.firstLevelApprovedBy && (
//                           <div className="text-sm text-gray-600">
//                             By: {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.first_name || ''} {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.last_name || ''}
//                             <div>At: {new Date(expense.firstLevelApprovedAt).toLocaleString()}</div>
//                             {expense.firstLevelReason && <div>Reason: {expense.firstLevelReason}</div>}
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <div className="text-sm">Final Level: <StatusBadge status={expense.finalStatus} /></div>
//                         {expense.finalApprovedBy && (
//                           <div className="text-sm text-gray-600">
//                             By: {expense.finalApprovedBy.first_name} {expense.finalApprovedBy.last_name}
//                             <div>At: {new Date(expense.finalApprovedAt).toLocaleString()}</div>
//                             {expense.finalApprovalReason && <div>Reason: {expense.finalApprovalReason}</div>}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Expense Items Tab Content */}
//           {activeTab === 'expenses' && (
//             <div className="space-y-4">
//               {selectedExpense.expenses.map((expense) => (
//                 <div key={expense.expenseId} className="border p-4 rounded-lg">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-2">
//                       <h4 className="font-medium">{expense.expenseName}</h4>
//                       <p className="text-sm text-gray-600">Amount: ₹{expense.amount}</p>
//                       <p className="text-sm text-gray-600">Description: {expense.description}</p>
//                       <p className="text-sm text-gray-600">Region: {expense.region}</p>
//                       <div className="text-sm text-gray-600">
//                         Period: {new Date(expense.startDate).toLocaleDateString()} - {new Date(expense.endDate).toLocaleDateString()}
//                       </div>
//                       {expense.attachments?.length > 0 && (
//                         <div className="text-sm">
//                           <span className="font-medium">Attachments:</span>
//                           <div className="flex gap-2 mt-1">
//                             {expense.attachments.map((att, idx) => (
//                               <a
//                                 key={idx}
//                                 href={att.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-500 hover:underline"
//                               >
//                                 View Attachment {idx + 1}
//                               </a>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <StatusBadge status={expense.firstLevelStatus} />
//                       <StatusBadge status={expense.finalStatus} />
//                     </div>
//                   </div>

//                   {/* Approval Actions */}
//                   <div className="mt-4 flex justify-end space-x-2">
//                     {renderApprovalButtons(expense)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Payment Tab Content */}
//           {activeTab === 'payment' && (
//             <div className="space-y-4">
//               <h3 className="font-semibold">Payment Processing</h3>

//               {selectedExpense.isReport ? (
//                 // For expense reports - check all expenses in the array
//                 selectedExpense.expenses.every(exp =>
//                   exp.firstLevelStatus === 'APPROVED' && exp.finalStatus === 'APPROVED'
//                 ) ? (
//                   <div className="space-y-4">
//                     <select
//                       value={paymentMethod}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-full p-2 border rounded-md"
//                     >
//                       <option value="">Select Payment Method</option>
//                       <option value="PAYROLL">Add to Payroll</option>
//                       <option value="MANUAL_PAYMENT">Manual Payment</option>
//                       <option value="CLOSED">Mark as Closed</option>
//                     </select>

//                     {paymentMethod === 'PAYROLL' && (
//             <input
//               type="month"
//               value={payrollMonth}
//               onChange={(e) => setPayrollMonth(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             />
//           )}

//           <button
//             onClick={handlePayment}
//             className="w-full p-2 bg-primary text-white rounded-md"
//             disabled={!paymentMethod || (paymentMethod === 'PAYROLL' && !payrollMonth)}
//           >
//             {paymentMutation.isLoading ? "Processing..." : "Process Payment"}
//           </button>
//         </div>
//       ) : (
//         <div className="text-yellow-600">
//           All expenses in the report must be approved at both levels before processing payment
//         </div>
//       )
//     ) : (
//       // For single expenses - check direct status
//       selectedExpense.firstLevelStatus === 'APPROVED' && 
//       selectedExpense.finalStatus === 'APPROVED' ? (
//         // Payment form for single expense
//         <div className="space-y-4">
//           {/* Same payment form as above */}
//         </div>
//       ) : (
//         <div className="text-yellow-600">
//           Expense must be approved at both levels before processing payment
//         </div>
//       )
//     )}
//   </div>
// )}

//       </div>
//     </ReusableModal>
//   );
// };

// const renderApprovalButtons = (expense) => {
//   if (approvalLevel === 'first' && expense.firstLevelStatus === 'PENDING') {
//     return (
//       <>
//         <button
//           onClick={() => setPendingAction({
//             level: 'first',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'APPROVED'
//           })}
//           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Approve
//         </button>
//         <button
//           onClick={() => setPendingAction({
//             level: 'first',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'REJECTED'
//           })}
//           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           Reject
//         </button>
//       </>
//     );
//   }
  
//   if (approvalLevel === 'final' && expense.firstLevelStatus === 'APPROVED' && expense.finalStatus === 'PENDING') {
//     return (
//       <>
//         <button
//           onClick={() => setPendingAction({
//             level: 'final',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'APPROVED'
//           })}
//           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Final Approve
//         </button>
//         <button
//           onClick={() => setPendingAction({
//             level: 'final',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'REJECTED'
//           })}
//           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           Final Reject
//         </button>
//       </>
//     );
//   }
  
//   return null;
// };

// // if (role === "Employee") {
// //   return <EmployeeReports />;
// // }


// return (
//   <BoxComponent>
//     <div className="flex flex-col w-full">
//       <HeadingOneLineInfo
//         heading="Expense Approvals"
//         info="Manage expense approvals and review submissions"
//       />

//        {/* <div className="mb-4">
//         <select
//           value={approvalLevel}
//           onChange={(e) => setApprovalLevel(e.target.value)}
//           className="form-select rounded-md border-gray-300"
//         >
//           <option value="first">First Level Approval</option>
//           <option value="final">Final Level Approval</option>
//         </select>
//       </div>  */}

//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Report/Expense Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Submitted By
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
            
// {pendingApprovals?.map((report) => (
//   <tr key={report._id}>
//     <td className="px-6 py-4 whitespace-nowrap">
//       {report.reportName || report.expenseName}
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       {report.employeeInfo?.[0]?.first_name} {report.employeeInfo?.[0]?.last_name}
//     </td>
//  <td className="px-6 py-4 whitespace-nowrap">
//   {report.isReport && report.expenses?.length > 0 
//     ? `Report (${report.expenses.length} expenses)`
//     : ''}
// </td>


//     <td className="px-6 py-4 whitespace-nowrap">
//       ₹{report.totalAmount || report.amount || 0}
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <div className="space-y-1">
//         {report.isReport && report.expenses ? ( 
//           report.expenses.map((expense, index) => (
//             <div key={index} className="text-sm">
//               <div>First Level: <StatusBadge status={expense.firstLevelStatus || 'PENDING'} /></div>
//               <div>Final Level: <StatusBadge status={expense.finalStatus || 'PENDING'} /></div>
//               {expense.finalStatus === 'APPROVED' && report.paymentStatus && (
//                             <div>
//                               Payment: <StatusBadge status={report.paymentStatus} />
//                               {report.paymentMethod && (
//                                 <span className="ml-2 text-xs text-gray-600">
//                                   ({report.paymentMethod})
//                                 </span>
//                               )}
//                             </div>
//                           )}
//             </div>
//           ))
//         ) : (
//           <>
//             <div>First Level: <StatusBadge status={report.firstLevelStatus || 'PENDING'} /></div>
//             <div>Final Level: <StatusBadge status={report.finalStatus || 'PENDING'} /></div>

//             {report.finalStatus === 'APPROVED' && report.paymentStatus && (
//                             <div>
//                               Payment: <StatusBadge status={report.paymentStatus} />
//                               {report.paymentMethod && (
//                                 <span className="ml-2 text-xs text-gray-600">
//                                   ({report.paymentMethod})
//                                 </span>
//                               )}
//                             </div>
//                           )}
//           </>
//         )}
//       </div>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <button
//         onClick={() => setSelectedExpense(report)}
//         className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//       >
//         View Details
//       </button>
//     </td>
//   </tr>
// ))}

//             </tbody>
//           </table>
//         </div>
//       )}

//       <ExpenseDetailsModal />
//       <ReasonModal />
//     </div>
//   </BoxComponent>
// );
// }
// export default ApproveExpense;



//monday v2
// import { useContext, useState, useCallback, memo } from "react";
// import { useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../components/Modal/component";
// import UserProfile from "../../hooks/UserData/useUser";
// import EmployeeReports from './EmployeeReports';

// const ApproveExpense = () => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const user = getCurrentUser();

//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();
//   const queryClient = useQueryClient();

//   const [approvalLevel, setApprovalLevel] = useState('first');
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [expenseActions, setExpenseActions] = useState([]);
//   const [actionReason, setActionReason] = useState('');
//   const [pendingAction, setPendingAction] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [payrollMonth, setPayrollMonth] = useState('');

//   // Fetch pending expenses
//   const { data: pendingApprovals, isLoading } = useQuery(
//     ["pendingExpenses", organisationId, approvalLevel],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/pending/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.reports;
//     },
//     {
//       refetchOnWindowFocus: true,
//       staleTime: 0
//     }
//   );

//   // Fetch expense history
//   const { data: expenseHistory } = useQuery(
//     ["expenseHistory", selectedExpense?._id],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/report/${selectedExpense._id}/approval-history`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data.approvalHistory;
//     },
//     { enabled: !!selectedExpense && activeTab === 'history' }
//   );

//   // First Level Approval Mutation
//   const firstLevelMutation = useMutation(
//     ({ reportId, expenseId, action, reason }) => {
//       if (!reason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       return axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
//         { action, reason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "First level approval updated successfully");
//         setActionReason('');
//         setPendingAction(null);
//       }
//     }
//   );

//   // Final Level Approval Mutation
//   const finalLevelMutation = useMutation(
//     ({ reportId, expenseId, action, reason }) => {
//       if (!reason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       return axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
//         { action, reason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "Final approval updated successfully");
//         setActionReason('');
//         setPendingAction(null);
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.message || "Failed to update approval");
//       }
//     }
//   );

//   // Handler Functions
//   const handleFirstLevelApproval = useCallback((reportId, expenseId, action, reason) => {
//     firstLevelMutation.mutate({ reportId, expenseId, action, reason });
//   }, [firstLevelMutation]);

//   const handleFinalApproval = useCallback((reportId, expenseId, action, reason) => {
//     finalLevelMutation.mutate({ reportId, expenseId, action, reason });
//   }, [finalLevelMutation]);

//   // ReasonModal Component
//   const ReasonModal = memo(() => {
//     const handleReasonChange = useCallback((e) => {
//       setActionReason(e.target.value);
//     }, []);

//     const handleSubmit = useCallback(() => {
//       if (!actionReason.trim()) {
//         handleAlert(true, "error", "Reason is required");
//         return;
//       }

//       if (pendingAction.level === 'first') {
//         handleFirstLevelApproval(
//           pendingAction.reportId,
//           pendingAction.expenseId,
//           pendingAction.action,
//           actionReason
//         );
//       } else {
//         handleFinalApproval(
//           pendingAction.reportId,
//           pendingAction.expenseId,
//           pendingAction.action,
//           actionReason
//         );
//       }
//     }, []);

//     return (
//       <ReusableModal
//         open={!!pendingAction}
//         onClose={() => setPendingAction(null)}
//         heading={`${pendingAction?.action} REASON`}
//       >
//         <div className="space-y-4">
//           <textarea
//             value={actionReason}
//             onChange={handleReasonChange}
//             className="w-full p-2 border rounded-md"
//             placeholder="Enter reason..."
//             rows="4"
//             required
//           />
//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={() => setPendingAction(null)}
//               className="px-4 py-2 border rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-primary text-white rounded-md"
//               disabled={!actionReason.trim()}
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </ReusableModal>
//     );
//   });

//   //   // Handle Report Expenses Mutation
//   // const handleReportMutation = useMutation(
//   //   ({ reportId, expenseActions }) =>
//   //     axios.patch(
//   //       `${process.env.REACT_APP_API}/route/expense/report/${reportId}/handle-expenses`,
//   //       { expenseActions },
//   //       { headers: { Authorization: authToken } }
//   //     ),
//   //   {
//   //     onSuccess: () => {
//   //       queryClient.invalidateQueries("pendingExpenses");
//   //       handleAlert(true, "success", "Report expenses updated successfully");
//   //       setSelectedExpense(null);
//   //       setExpenseActions([]);
//   //     }
//   //   }
//   // );

//   // Payment processing mutation
//   const paymentMutation = useMutation(
//     async ({ expenseId, data }) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/expense/${expenseId}/payment`,
//         data,
//         { headers: { Authorization: authToken } }
//       );
//       return response;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         handleAlert(true, "success", "Payment processed successfully");
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.message || "Payment processing failed");
//       }
//     }
//   );

//   const handlePayment = async () => {
//     if (paymentMethod === 'MANUAL_PAYMENT') {
//       try {
//         const response = await paymentMutation.mutateAsync({
//           expenseId: selectedExpense._id,
//           data: { paymentMethod }
//         });

//         console.log('AP Payment Response:', response);
//         console.log('AP Order ID:', response.data.order.id);
//         console.log('AP Employee Details:', response.data.employeeDetails);

//         const options = {
//           key: process.env.REACT_APP_RAZORPAY_KEY,
//           amount: selectedExpense.amount * 100,
//           currency: "INR",
//           name: "AEGIS Expense Payment",
//           description: `Payment for ${selectedExpense.expenseName}`,
//           order_id: response.data.order.id,
//           prefill: {
//             name: response.data.employeeDetails.name,
//                     account_number: response.data.employeeDetails.accountNo
//           },
//           handler: async (paymentResponse) => {
//             try {
//               await axios.post(
//                 `${process.env.REACT_APP_API}/route/expense/${selectedExpense._id}/verify-payment`,
//                 paymentResponse,
//                 { headers: { Authorization: authToken } }
//               );
//               handleAlert(true, "success", "Payment completed successfully");
//               queryClient.invalidateQueries("pendingExpenses");
//             } catch (error) {
//               handleAlert(true, "error", error.message || "Payment verification failed");
//             }
//           },
//           modal: {
//             ondismiss: () => {
//               alert("Payment cancelled");
//             }
//           }
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//       } catch (error) {
//         handleAlert(true, "error", error.message || "Failed to initiate payment");
//       }
//     } else {
//       paymentMutation.mutate({
//         expenseId: selectedExpense._id,
//         data: {
//           paymentMethod,
//           payrollMonth
//         }
//       });
//     }
//   };
//   const StatusBadge = ({ status }) => {
//     const getStatusColor = (status) => {
//       switch (status) {
//         case 'APPROVED': return 'bg-green-100 text-green-800';
//         case 'REJECTED': return 'bg-red-100 text-red-800';
//         case 'PENDING': return 'bg-yellow-100 text-yellow-800';
//         case 'PAID': return 'bg-blue-100 text-blue-800';
//         case 'CLOSED': return 'bg-gray-100 text-gray-800';
//         case 'PAYROLL': return 'bg-purple-100 text-purple-800';
//         default: return 'bg-gray-100 text-gray-800';
//       }
//     };
  
//     return (
//       <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
//         {status}
//       </span>
//     );
//   };
// // Update the ExpenseDetailsModal component
// const ExpenseDetailsModal = () => {
//   if (!selectedExpense) return null;

//   return (
//     <ReusableModal
//       open={!!selectedExpense}
//       onClose={() => {
//         setSelectedExpense(null);
//         setActiveTab('details');
//       }}
//       heading="Expense Information"
//     >
//       <div className="p-4">
//         {/* Tab Navigation */}
//         <div className="flex space-x-4 mb-4 border-b">
//           <button
//             className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('details')}
//           >
//             Details & History
//           </button>
//           {selectedExpense.isReport && (
//             <button
//               className={`pb-2 px-4 ${activeTab === 'expenses' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('expenses')}
//             >
//               Expense Items
//             </button>
//           )}
//           {(role?.includes("Super-Admin") || role?.includes("Accountant")) && (
//             <button
//               className={`pb-2 px-4 ${activeTab === 'payment' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
//               onClick={() => setActiveTab('payment')}
//             >
//               Payment
//             </button>
//           )}
//         </div>

//         {/* Details & History Tab Content */}
//         {activeTab === 'details' && (
//           <div className="space-y-4">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Report Information</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div><span className="font-medium">Report Name:</span> {selectedExpense.reportName}</div>
//                 <div><span className="font-medium">Total Amount:</span> ₹{selectedExpense.totalAmount}</div>
//                 {/* <div><span className="font-medium">Created By:</span> {selectedExpense.employeeInfo?.first_name} {selectedExpense.employeeInfo?.last_name}</div> */}
//                 <div>
//   <span className="font-medium">Created By:</span> 
//   {selectedExpense.employeeInfo?.[0]?.first_name} {selectedExpense.employeeInfo?.[0]?.last_name}
// </div>
//                 <div><span className="font-medium">Created At:</span> {new Date(selectedExpense.createdAt).toLocaleDateString()}</div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2">Approval History</h3>
//               {selectedExpense.expenses.map((expense, index) => (
//                 <div key={index} className="mb-4 border-b pb-2">
//                   <div className="font-medium">{expense.expenseName}</div>
//                   <div className="grid grid-cols-2 gap-4 mt-2">
//                     <div>
//                       <div className="text-sm">First Level: <StatusBadge status={expense.firstLevelStatus} /></div>
//                       {expense.firstLevelApprovedBy && (
//                         <div className="text-sm text-gray-600">
//                           {/* By: {expense.firstLevelApprovedBy.first_name} {expense.firstLevelApprovedBy.last_name} */}
//                           By: {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.first_name || ''} {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.last_name || ''}
//                            {/* By: {typeof expense.firstLevelApprovedBy === 'object' ? 
//                             `${expense.firstLevelApprovedBy.first_name} ${expense.firstLevelApprovedBy.last_name}` : 
//                                expense.firstLevelApprovedBy} */}
//                           <div>At: {new Date(expense.firstLevelApprovedAt).toLocaleString()}</div>
//                           {expense.firstLevelReason && <div>Reason: {expense.firstLevelReason}</div>}
//                         </div>
//                       )}
//                     </div> 
//                     <div>
//                       <div className="text-sm">Final Level: <StatusBadge status={expense.finalStatus} /></div>
//                       {expense.finalApprovedBy && (
//                         <div className="text-sm text-gray-600">
//                           By: {expense.finalApprovedBy.first_name} {expense.finalApprovedBy.last_name}
//                           <div>At: {new Date(expense.finalApprovedAt).toLocaleString()}</div>
//                           {expense.finalApprovalReason && <div>Reason: {expense.finalApprovalReason}</div>}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Expense Items Tab Content */}
//         {activeTab === 'expenses' && (
//           <div className="space-y-4">
//             {selectedExpense.expenses.map((expense) => (
//               <div key={expense.expenseId} className="border p-4 rounded-lg">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-2">
//                     <h4 className="font-medium">{expense.expenseName}</h4>
//                     <p className="text-sm text-gray-600">Amount: ₹{expense.amount}</p>
//                     <p className="text-sm text-gray-600">Description: {expense.description}</p>
//                     <p className="text-sm text-gray-600">Region: {expense.region}</p>
//                     <div className="text-sm text-gray-600">
//                       Period: {new Date(expense.startDate).toLocaleDateString()} - {new Date(expense.endDate).toLocaleDateString()}
//                     </div>
//                     {expense.attachments?.length > 0 && (
//                       <div className="text-sm">
//                         <span className="font-medium">Attachments:</span>
//                         <div className="flex gap-2 mt-1">
//                           {expense.attachments.map((att, idx) => (
//                             <a
//                               key={idx}
//                               href={att.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 hover:underline"
//                             >
//                               View Attachment {idx + 1}
//                             </a>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="space-y-2">
//                     <StatusBadge status={expense.firstLevelStatus} />
//                     <StatusBadge status={expense.finalStatus} />
//                   </div>
//                 </div>
                
//                 {/* Approval Actions */}
//                 <div className="mt-4 flex justify-end space-x-2">
//                   {renderApprovalButtons(expense)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

      
// {activeTab === 'payment' && (
//   <div className="space-y-4">
//     <h3 className="font-semibold">Payment Processing</h3>

//     {selectedExpense.isReport ? (
//       // For expense reports - check all expenses in the array
//       selectedExpense.expenses.every(exp => 
//         exp.firstLevelStatus === 'APPROVED' && exp.finalStatus === 'APPROVED'
//       ) ? (
//         <div className="space-y-4">
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             className="w-full p-2 border rounded-md"
//           >
//             <option value="">Select Payment Method</option>
//             <option value="PAYROLL">Add to Payroll</option>
//             <option value="MANUAL_PAYMENT">Manual Payment</option>
//             <option value="CLOSED">Mark as Closed</option>
//           </select>

//           {paymentMethod === 'PAYROLL' && (
//             <input
//               type="month"
//               value={payrollMonth}
//               onChange={(e) => setPayrollMonth(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             />
//           )}

//           <button
//             onClick={handlePayment}
//             className="w-full p-2 bg-primary text-white rounded-md"
//             disabled={!paymentMethod || (paymentMethod === 'PAYROLL' && !payrollMonth)}
//           >
//             {paymentMutation.isLoading ? "Processing..." : "Process Payment"}
//           </button>
//         </div>
//       ) : (
//         <div className="text-yellow-600">
//           All expenses in the report must be approved at both levels before processing payment
//         </div>
//       )
//     ) : (
//       // For single expenses - check direct status
//       selectedExpense.firstLevelStatus === 'APPROVED' && 
//       selectedExpense.finalStatus === 'APPROVED' ? (
//         // Payment form for single expense
//         <div className="space-y-4">
//           {/* Same payment form as above */}
//         </div>
//       ) : (
//         <div className="text-yellow-600">
//           Expense must be approved at both levels before processing payment
//         </div>
//       )
//     )}
//   </div>
// )}

//       </div>
//     </ReusableModal>
//   );
// };

// const renderApprovalButtons = (expense) => {
//   if (approvalLevel === 'first' && expense.firstLevelStatus === 'PENDING') {
//     return (
//       <>
//         <button
//           onClick={() => setPendingAction({
//             level: 'first',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'APPROVED'
//           })}
//           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Approve
//         </button>
//         <button
//           onClick={() => setPendingAction({
//             level: 'first',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'REJECTED'
//           })}
//           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           Reject
//         </button>
//       </>
//     );
//   }
  
//   if (approvalLevel === 'final' && expense.firstLevelStatus === 'APPROVED' && expense.finalStatus === 'PENDING') {
//     return (
//       <>
//         <button
//           onClick={() => setPendingAction({
//             level: 'final',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'APPROVED'
//           })}
//           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//         >
//           Final Approve
//         </button>
//         <button
//           onClick={() => setPendingAction({
//             level: 'final',
//             reportId: selectedExpense._id,
//             expenseId: expense.expenseId,
//             action: 'REJECTED'
//           })}
//           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//         >
//           Final Reject
//         </button>
//       </>
//     );
//   }
  
//   return null;
// };

// if (role === "Employee") {
//   return <EmployeeReports />;
// }


//   // Rest of the component remains unchanged...
//   return (
//     <BoxComponent>
//       <div className="flex flex-col w-full">
//         <HeadingOneLineInfo
//           heading="Expense Approvals"
//           info="Manage expense approvals and review submissions"
//         />
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//              <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Report/Expense Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Submitted By
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
            
//  {pendingApprovals?.map((report) => (
//   <tr key={report._id}>
//     <td className="px-6 py-4 whitespace-nowrap">
//       {report.reportName || report.expenseName}
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       {report.employeeInfo?.[0]?.first_name} {report.employeeInfo?.[0]?.last_name}
//     </td>
//  <td className="px-6 py-4 whitespace-nowrap">
//   {report.isReport && report.expenses?.length > 0 
//     ? `Report (${report.expenses.length} expenses)`
//     : ''}
// </td>


//     <td className="px-6 py-4 whitespace-nowrap">
//       ₹{report.totalAmount || report.amount || 0}
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <div className="space-y-1">
//         {report.isReport && report.expenses ? ( 
//           report.expenses.map((expense, index) => (
//             <div key={index} className="text-sm">
//               <div>First Level: <StatusBadge status={expense.firstLevelStatus || 'PENDING'} /></div>
//               <div>Final Level: <StatusBadge status={expense.finalStatus || 'PENDING'} /></div>
//               {expense.finalStatus === 'APPROVED' && report.paymentStatus && (
//                             <div>
//                               Payment: <StatusBadge status={report.paymentStatus} />
//                               {report.paymentMethod && (
//                                 <span className="ml-2 text-xs text-gray-600">
//                                   ({report.paymentMethod})
//                                 </span>
//                               )}
//                             </div>
//                           )}
//             </div>
//           ))
//         ) : (
//           <>
//             <div>First Level: <StatusBadge status={report.firstLevelStatus || 'PENDING'} /></div>
//             <div>Final Level: <StatusBadge status={report.finalStatus || 'PENDING'} /></div>

//             {report.finalStatus === 'APPROVED' && report.paymentStatus && (
//                             <div>
//                               Payment: <StatusBadge status={report.paymentStatus} />
//                               {report.paymentMethod && (
//                                 <span className="ml-2 text-xs text-gray-600">
//                                   ({report.paymentMethod})
//                                 </span>
//                               )}
//                             </div>
//                           )}
//           </>
//         )}
//       </div>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <button
//         onClick={() => setSelectedExpense(report)}
//         className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//       >
//         View Details
//       </button>
//     </td>
//   </tr>
// ))}

//             </tbody>
//           </table>
//           </div>
//         )}
//         <ExpenseDetailsModal />
//         <ReasonModal />
//       </div>
//     </BoxComponent>
//   );
// };

// export default ApproveExpense;
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import UserProfile from "../../hooks/UserData/useUser";
import EmployeeReports from './EmployeeReports';

const ApproveExpense = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();

  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  const [approvalLevel, setApprovalLevel] = useState('first');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseActions, setExpenseActions] = useState([]);
  const [actionReason, setActionReason] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payrollMonth, setPayrollMonth] = useState('');
  const [currentAction, setCurrentAction] = useState(null); // Track the current action (approve/reject)
  const [currentExpenseId, setCurrentExpenseId] = useState(null); // Track the current expense ID

  // Fetch pending expenses
  const { data: pendingApprovals, isLoading } = useQuery(
    ["pendingExpenses", organisationId, approvalLevel],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/pending/${organisationId}`,
        { headers: { Authorization: authToken } }
      );
      return response.data.reports;
    },
    {
      refetchOnWindowFocus: true,
      staleTime: 0
    }
  );

  // Fetch expense history
  const { data: expenseHistory } = useQuery(
    ["expenseHistory", selectedExpense?._id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/report/${selectedExpense._id}/approval-history`,
        { headers: { Authorization: authToken } }
      );
      return response.data.approvalHistory;
    },
    { enabled: !!selectedExpense && activeTab === 'history' }
  );

  // First Level Approval Mutation
  const firstLevelMutation = useMutation(
    ({ reportId, expenseId, action, reason }) => {
      if (!reason.trim()) {
        handleAlert(true, "error", "Reason is required for approval/rejection");
        return Promise.reject("Reason is required");
      }
      return axios.patch(
        `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
        { action, reason },
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingExpenses");
        handleAlert(true, "success", "First level approval updated successfully");
        setActionReason('');
        setCurrentAction(null);
        setCurrentExpenseId(null);
      }
    }
  );

  // Final Level Approval Mutation
  const finalLevelMutation = useMutation(
    ({ reportId, expenseId, action, reason }) => {
      if (!reason.trim()) {
        handleAlert(true, "error", "Reason is required for approval/rejection");
        return Promise.reject("Reason is required");
      }
      return axios.patch(
        `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
        { action, reason },
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingExpenses");
        handleAlert(true, "success", "Final approval updated successfully");
        setActionReason('');
        setCurrentAction(null);
        setCurrentExpenseId(null);
      },
      onError: (error) => {
        handleAlert(true, "error", error.message || "Failed to update approval");
      }
    }
  );

  // Handler Functions
  const handleFirstLevelApproval = (reportId, expenseId, action) => {
    if (!actionReason.trim()) {
      handleAlert(true, "error", "Reason is required");
      return;
    }
    firstLevelMutation.mutate({ reportId, expenseId, action, reason: actionReason });
  };

  const handleFinalApproval = (reportId, expenseId, action) => {
    if (!actionReason.trim()) {
      handleAlert(true, "error", "Reason is required");
      return;
    }
    finalLevelMutation.mutate({ reportId, expenseId, action, reason: actionReason });
  };

  // Render Approval Buttons with Reason Field
  const renderApprovalButtons = (expense) => {
    const isCurrentExpense = currentExpenseId === expense.expenseId;

    return (
      <div className="space-y-2">
        {approvalLevel === 'first' && expense.firstLevelStatus === 'PENDING' && (
          <>
            <button
              onClick={() => {
                setCurrentAction('APPROVED');
                setCurrentExpenseId(expense.expenseId);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setCurrentAction('REJECTED');
                setCurrentExpenseId(expense.expenseId);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Reject
            </button>
          </>
        )}

        {approvalLevel === 'final' && expense.firstLevelStatus === 'APPROVED' && expense.finalStatus === 'PENDING' && (
          <>
            <button
              onClick={() => {
                setCurrentAction('APPROVED');
                setCurrentExpenseId(expense.expenseId);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Final Approve
            </button>
            <button
              onClick={() => {
                setCurrentAction('REJECTED');
                setCurrentExpenseId(expense.expenseId);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Final Reject
            </button>
          </>
        )}

        {isCurrentExpense && (
          <div className="space-y-2">
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter reason..."
              rows="2"
              required
            />
            <button
              onClick={() => {
                if (currentAction === 'APPROVED') {
                  handleFirstLevelApproval(selectedExpense._id, expense.expenseId, 'APPROVED');
                } else if (currentAction === 'REJECTED') {
                  handleFirstLevelApproval(selectedExpense._id, expense.expenseId, 'REJECTED');
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  };

  const paymentMutation = useMutation(
    async ({ expenseId, data }) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/expense/${expenseId}/payment`,
        data,
        { headers: { Authorization: authToken } }
      );
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pendingExpenses");
        handleAlert(true, "success", "Payment processed successfully");
      },
      onError: (error) => {
        handleAlert(true, "error", error.message || "Payment processing failed");
      }
    }
  );

  const handlePayment = async () => {
    if (paymentMethod === 'MANUAL_PAYMENT') {
      try {
        const response = await paymentMutation.mutateAsync({
          expenseId: selectedExpense._id,
          data: { paymentMethod }
        });

        console.log('AP Payment Response:', response);
        console.log('AP Order ID:', response.data.order.id);
        console.log('AP Employee Details:', response.data.employeeDetails);

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: selectedExpense.amount * 100,
          currency: "INR",
          name: "AEGIS Expense Payment",
          description: `Payment for ${selectedExpense.expenseName}`,
          order_id: response.data.order.id,
          prefill: {
            name: response.data.employeeDetails.name,
                    account_number: response.data.employeeDetails.accountNo
          },
          handler: async (paymentResponse) => {
            try {
              await axios.post(
                `${process.env.REACT_APP_API}/route/expense/${selectedExpense._id}/verify-payment`,
                paymentResponse,
                { headers: { Authorization: authToken } }
              );
              handleAlert(true, "success", "Payment completed successfully");
              queryClient.invalidateQueries("pendingExpenses");
            } catch (error) {
              handleAlert(true, "error", error.message || "Payment verification failed");
            }
          },
          modal: {
            ondismiss: () => {
              alert("Payment cancelled");
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        handleAlert(true, "error", error.message || "Failed to initiate payment");
      }
    } else {
      paymentMutation.mutate({
        expenseId: selectedExpense._id,
        data: {
          paymentMethod,
          payrollMonth
        }
      });
    }
  };
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'APPROVED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'PAID': return 'bg-blue-100 text-blue-800';
        case 'CLOSED': return 'bg-gray-100 text-gray-800';
        case 'PAYROLL': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  const ExpenseDetailsModal = () => {
    if (!selectedExpense) return null;
  
    return (
      <ReusableModal
        open={!!selectedExpense}
        onClose={() => {
          setSelectedExpense(null);
          setActiveTab('details');
        }}
        heading="Expense Information"
      >
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-4 border-b">
            <button
              className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details & History
            </button>
            {selectedExpense.isReport && (
              <button
                className={`pb-2 px-4 ${activeTab === 'expenses' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('expenses')}
              >
                Expense Items
              </button>
            )}
            {(role?.includes("Super-Admin") || role?.includes("Accountant")) && (
              <button
                className={`pb-2 px-4 ${activeTab === 'payment' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('payment')}
              >
                Payment
              </button>
            )}
          </div>
  
          {/* Details & History Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Report Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Report Name:</span> {selectedExpense.reportName}</div>
                  <div><span className="font-medium">Total Amount:</span> ₹{selectedExpense.totalAmount}</div>
                  {/* <div><span className="font-medium">Created By:</span> {selectedExpense.employeeInfo?.first_name} {selectedExpense.employeeInfo?.last_name}</div> */}
                  <div>
    <span className="font-medium">Created By:</span> 
    {selectedExpense.employeeInfo?.[0]?.first_name} {selectedExpense.employeeInfo?.[0]?.last_name}
  </div>
                  <div><span className="font-medium">Created At:</span> {new Date(selectedExpense.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Approval History</h3>
                {selectedExpense.expenses.map((expense, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <div className="font-medium">{expense.expenseName}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm">First Level: <StatusBadge status={expense.firstLevelStatus} /></div>
                        {expense.firstLevelApprovedBy && (
                          <div className="text-sm text-gray-600">
                            {/* By: {expense.firstLevelApprovedBy.first_name} {expense.firstLevelApprovedBy.last_name} */}
                            By: {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.first_name || ''} {selectedExpense.employeeInfo?.find(emp => emp._id === expense.firstLevelApprovedBy)?.last_name || ''}
                             {/* By: {typeof expense.firstLevelApprovedBy === 'object' ? 
                              `${expense.firstLevelApprovedBy.first_name} ${expense.firstLevelApprovedBy.last_name}` : 
                                 expense.firstLevelApprovedBy} */}
                            <div>At: {new Date(expense.firstLevelApprovedAt).toLocaleString()}</div>
                            {expense.firstLevelReason && <div>Reason: {expense.firstLevelReason}</div>}
                          </div>
                        )}
                      </div> 
                      <div>
                        <div className="text-sm">Final Level: <StatusBadge status={expense.finalStatus} /></div>
                        {expense.finalApprovedBy && (
                          <div className="text-sm text-gray-600">
                            By: {expense.finalApprovedBy.first_name} {expense.finalApprovedBy.last_name}
                            <div>At: {new Date(expense.finalApprovedAt).toLocaleString()}</div>
                            {expense.finalApprovalReason && <div>Reason: {expense.finalApprovalReason}</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Expense Items Tab Content */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              {selectedExpense.expenses.map((expense) => (
                <div key={expense.expenseId} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium">{expense.expenseName}</h4>
                      <p className="text-sm text-gray-600">Amount: ₹{expense.amount}</p>
                      <p className="text-sm text-gray-600">Description: {expense.description}</p>
                      <p className="text-sm text-gray-600">Region: {expense.region}</p>
                      <div className="text-sm text-gray-600">
                        Period: {new Date(expense.startDate).toLocaleDateString()} - {new Date(expense.endDate).toLocaleDateString()}
                      </div>
                      {expense.attachments?.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Attachments:</span>
                          <div className="flex gap-2 mt-1">
                            {expense.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                View Attachment {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <StatusBadge status={expense.firstLevelStatus} />
                      <StatusBadge status={expense.finalStatus} />
                    </div>
                  </div>
                  
                  {/* Approval Actions */}
                  <div className="mt-4 flex justify-end space-x-2">
                    {renderApprovalButtons(expense)}
                  </div>
                </div>
              ))}
            </div>
          )}
  
        
  {activeTab === 'payment' && (
    <div className="space-y-4">
      <h3 className="font-semibold">Payment Processing</h3>
  
      {selectedExpense.isReport ? (
        // For expense reports - check all expenses in the array
        selectedExpense.expenses.every(exp => 
          exp.firstLevelStatus === 'APPROVED' && exp.finalStatus === 'APPROVED'
        ) ? (
          <div className="space-y-4">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Payment Method</option>
              <option value="PAYROLL">Add to Payroll</option>
              <option value="MANUAL_PAYMENT">Manual Payment</option>
              <option value="CLOSED">Mark as Closed</option>
            </select>
  
            {paymentMethod === 'PAYROLL' && (
              <input
                type="month"
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            )}
  
            <button
              onClick={handlePayment}
              className="w-full p-2 bg-primary text-white rounded-md"
              disabled={!paymentMethod || (paymentMethod === 'PAYROLL' && !payrollMonth)}
            >
              {paymentMutation.isLoading ? "Processing..." : "Process Payment"}
            </button>
          </div>
        ) : (
          <div className="text-yellow-600">
            All expenses in the report must be approved at both levels before processing payment
          </div>
        )
      ) : (
        // For single expenses - check direct status
        selectedExpense.firstLevelStatus === 'APPROVED' && 
        selectedExpense.finalStatus === 'APPROVED' ? (
          // Payment form for single expense
          <div className="space-y-4">
            {/* Same payment form as above */}
          </div>
        ) : (
          <div className="text-yellow-600">
            Expense must be approved at both levels before processing payment
          </div>
        )
      )}
    </div>
  )}
  
        </div>
      </ReusableModal>
    );
  };
  
//   const renderApprovalButtons = (expense) => {
//     if (approvalLevel === 'first' && expense.firstLevelStatus === 'PENDING') {
//       return (
//         <>
//           <button
//             onClick={() => setPendingAction({
//               level: 'first',
//               reportId: selectedExpense._id,
//               expenseId: expense.expenseId,
//               action: 'APPROVED'
//             })}
//             className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//           >
//             Approve
//           </button>
//           <button
//             onClick={() => setPendingAction({
//               level: 'first',
//               reportId: selectedExpense._id,
//               expenseId: expense.expenseId,
//               action: 'REJECTED'
//             })}
//             className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//           >
//             Reject
//           </button>
//         </>
//       );
//     }
    
//     if (approvalLevel === 'final' && expense.firstLevelStatus === 'APPROVED' && expense.finalStatus === 'PENDING') {
//       return (
//         <>
//           <button
//             onClick={() => setPendingAction({
//               level: 'final',
//               reportId: selectedExpense._id,
//               expenseId: expense.expenseId,
//               action: 'APPROVED'
//             })}
//             className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//           >
//             Final Approve
//           </button>
//           <button
//             onClick={() => setPendingAction({
//               level: 'final',
//               reportId: selectedExpense._id,
//               expenseId: expense.expenseId,
//               action: 'REJECTED'
//             })}
//             className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//           >
//             Final Reject
//           </button>
//         </>
//       );
//     }
    
//     return null;
//   };
  // Rest of the component remains unchanged...
  return (
    <BoxComponent>
      <div className="flex flex-col w-full">
        <HeadingOneLineInfo
          heading="Expense Approvals"
          info="Manage expense approvals and review submissions"
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report/Expense Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            
{pendingApprovals?.map((report) => (
  <tr key={report._id}>
    <td className="px-6 py-4 whitespace-nowrap">
      {report.reportName || report.expenseName}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {report.employeeInfo?.[0]?.first_name} {report.employeeInfo?.[0]?.last_name}
    </td>
 <td className="px-6 py-4 whitespace-nowrap">
  {report.isReport && report.expenses?.length > 0 
    ? `Report (${report.expenses.length} expenses)`
    : ''}
</td>


    <td className="px-6 py-4 whitespace-nowrap">
      ₹{report.totalAmount || report.amount || 0}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="space-y-1">
        {report.isReport && report.expenses ? ( 
          report.expenses.map((expense, index) => (
            <div key={index} className="text-sm">
              <div>First Level: <StatusBadge status={expense.firstLevelStatus || 'PENDING'} /></div>
              <div>Final Level: <StatusBadge status={expense.finalStatus || 'PENDING'} /></div>
              {expense.finalStatus === 'APPROVED' && report.paymentStatus && (
                            <div>
                              Payment: <StatusBadge status={report.paymentStatus} />
                              {report.paymentMethod && (
                                <span className="ml-2 text-xs text-gray-600">
                                  ({report.paymentMethod})
                                </span>
                              )}
                            </div>
                          )}
            </div>
          ))
        ) : (
          <>
            <div>First Level: <StatusBadge status={report.firstLevelStatus || 'PENDING'} /></div>
            <div>Final Level: <StatusBadge status={report.finalStatus || 'PENDING'} /></div>

            {report.finalStatus === 'APPROVED' && report.paymentStatus && (
                            <div>
                              Payment: <StatusBadge status={report.paymentStatus} />
                              {report.paymentMethod && (
                                <span className="ml-2 text-xs text-gray-600">
                                  ({report.paymentMethod})
                                </span>
                              )}
                            </div>
                          )}
          </>
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => setSelectedExpense(report)}
        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        View Details
      </button>
    </td>
  </tr>
))}

            </tbody>
          </table>
          </div>
        )}
        <ExpenseDetailsModal />
      </div>
    </BoxComponent>
  );
};

export default ApproveExpense;