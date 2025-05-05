/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import DraftsIcon from "@mui/icons-material/Drafts";
import PaymentsIcon from "@mui/icons-material/Payments";

const EmployeeReports = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { organisationId } = useParams();

  // States
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch employee reports
  const { data: employeeReports, isLoading } = useQuery(
    ["employeeReports"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/employee-reports`,
        { headers: { Authorization: authToken } }
      );
      return response.data.reports;
    }
  );

  // Delete mutation
  const deleteReportMutation = useMutation(
    async (reportId) => {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/expense/${organisationId}/report/${reportId}`,
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employeeReports");
        handleAlert(true, "success", "Report deleted successfully");
      },
    }
  );

  // Add approval settings query
  const { data: approvalSettings } = useQuery(
    ["approval-settings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organisation/${organisationId}/approval-flow`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "APPROVED":
          return "bg-green-100 text-green-800";
        case "REJECTED":
          return "bg-red-100 text-red-800";
        case "PENDING":
          return "bg-yellow-100 text-yellow-800";
        case "PAID":
          return "bg-blue-100 text-blue-800";
        case "CLOSED":
          return "bg-gray-100 text-gray-800";
        case "PAYROLL":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}
      >
        {status}
      </span>
    );
  };

  // Check if report can be edited
  const canEditReport = (report) => {
    return !report.expenses.some(
      (exp) =>
        exp.firstLevelStatus === "APPROVED" || exp.finalStatus === "APPROVED"
    );
  };

  // Details Modal Component
  const ExpenseDetailsModal = () => {
    if (!selectedReport) return null;

    return (
      <ReusableModal
        open={!!selectedReport}
        onClose={() => {
          setSelectedReport(null);
          setActiveTab("details");
        }}
        heading="Report Information"
      >
        <div className="p-4">
          <div className="flex space-x-4 mb-4 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details & History
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "expenses"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("expenses")}
            >
              Expense Items
            </button>
          </div>

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Report Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Report Name:</span>{" "}
                    {selectedReport.reportName}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> ₹
                    {selectedReport.totalAmount}
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Approval Status</h3>
                {selectedReport.expenses.map((expense, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <div className="font-medium">{expense.expenseName}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm">
                          First Level:{" "}
                          <StatusBadge status={expense.firstLevelStatus} />
                        </div>
                        {expense.firstLevelReason && (
                          <div className="text-sm text-gray-600">
                            Reason: {expense.firstLevelReason}
                          </div>
                        )}
                      </div>

                      {approvalSettings?.approvalFlow?.requireSecondLevel && (
                        <div>
                          <div className="text-sm">
                            Final Level:{" "}
                            <StatusBadge status={expense.finalStatus} />
                          </div>
                          {expense.finalApprovalReason && (
                            <div className="text-sm text-gray-600">
                              Reason: {expense.finalApprovalReason}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="space-y-4">
              {selectedReport.expenses.map((expense) => (
                <div
                  key={expense._id || expense.expenseId}
                  className="border p-4 rounded-lg"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium">{expense.expenseName}</h4>
                    <p className="text-sm text-gray-600">
                      Amount: ₹{expense.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Description: {expense.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Region: {expense.region}
                    </p>
                    <div className="text-sm text-gray-600">
                      Period: {new Date(expense.startDate).toLocaleDateString()}{" "}
                      - {new Date(expense.endDate).toLocaleDateString()}
                    </div>

{/* Display category-specific fields */}
{expense.dynamicFields && Object.keys(expense.dynamicFields).length > 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p className="text-sm font-medium mb-1">Category Details:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(expense.dynamicFields).map(([key, value]) => (
                    value && (
                      <div key={key} className="text-sm">
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .trim()}:
                        </span>{" "}
                        {typeof value === 'object' && value !== null && value instanceof Date 
                          ? new Date(value).toLocaleDateString() 
                          : String(value)}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
        {/* Add Remote Punching Allowance Details if applicable */}
  {expense.isRemotePunchingAllowance && expense.remotePunchingDetails && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-700">Remote Punching Allowance</p>
                        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                          {/* <div>
                            <span className="font-medium">Date:</span> {new Date(expense.remotePunchingDetails.date).toLocaleDateString()}
                          </div> */}
                          <div>
                            <span className="font-medium">Distance:</span> {expense.remotePunchingDetails.km} KM
                          </div>
                          <div>
                            <span className="font-medium">Rate:</span> {expense.remotePunchingDetails.allowancePerKm} {expense.remotePunchingDetails.currency}/KM
                          </div>
                          {/* <div>
                            <span className="font-medium">Total:</span> {(expense.remotePunchingDetails.km * expense.remotePunchingDetails.allowancePerKm).toFixed(2)} {expense.remotePunchingDetails.currency}
                          </div> */}
                        </div>
                      </div>
                    )}
     

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
                </div>
              ))}
            </div>
          )}
        </div>
      </ReusableModal>
    );
  };
//   const StatCard = ({ title, value, icon, color }) => (
//     <div
//       className={`${color} p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-white text-sm">{title}</p>
//           <p className="text-white text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="bg-white/20 p-3 rounded-full">{icon}</div>
//       </div>
//     </div>
  
// );
// const StatCard = ({ title, value, icon, color }) => (
//   <div className={`${color} p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex-1 min-w-[200px] max-w-[250px]`}>
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-white text-sm whitespace-nowrap">{title}</p>
//         <p className="text-white text-2xl font-bold mt-1">{value}</p>
//       </div>
//       {/* <div className="bg-white/20 p-3 rounded-full"> */}
//       <div className={`p-3 rounded-full ${color}`}>
//         {icon}
//       </div>
//     </div>
//   </div>
// );
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex-1 min-w-[200px] max-w-[250px]`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm whitespace-nowrap">{title}</p>
        <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  </div>
);


  return ( 
    <BoxComponent>
      <HeadingOneLineInfo
        heading="My Expense Reports"
        info="View and manage your expense reports"
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : employeeReports?.length === 0 ? (
        <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No expense reports found</p>
            <p className="text-gray-500 text-sm mt-2">
              Create a new expense report to get started
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"> */}
          {/* <div className="flex  items-center gap-5 mb-6 ">
            <StatCard
              title="Total Expenses"
              value={`₹${
                employeeReports
                  ?.reduce((sum, report) => sum + report.totalAmount, 0)
                  .toLocaleString() || 0
              }`}
              icon={<AccountBalanceWalletIcon className="text-white" />}
              color="bg-blue-600"
            />
            <StatCard
              title="Pending Approval"
              value={
                employeeReports?.filter((report) => report.status === "PENDING")
                  .length || 0
              }
              icon={<PendingActionsIcon className="text-white" />}
              color="bg-yellow-500"
            />
            <StatCard
              title="Approved"
              value={
                employeeReports?.filter(
                  (report) => report.status === "APPROVED"
                ).length || 0
              }
              icon={<CheckCircleIcon className="text-white" />}
              color="bg-green-600"
            />
            <StatCard
              title="Rejected"
              value={
                employeeReports?.filter(
                  (report) => report.status === "REJECTED"
                ).length || 0
              }
              icon={<BlockIcon className="text-white" />}
              color="bg-red-600"
            />
            <StatCard
              title="Draft"
              value={
                employeeReports?.filter((report) => report.status === "DRAFT")
                  .length || 0
              }
              icon={<DraftsIcon className="text-white" />}
              color="bg-gray-600"
            />
            <StatCard
  title="Payment Completed"
  value={employeeReports?.filter(report => 
    report.paymentStatus === 'PAID' || report.paymentStatus === 'CLOSED'
  ).length || 0}
  icon={<PaymentsIcon className="text-white" />}
  color="bg-purple-600"
/>

          </div> */}

<div className="flex flex-wrap items-center gap-5 mb-6">
  <StatCard
    title="Total Expenses"
    value={`₹${employeeReports?.reduce((sum, report) => sum + report.totalAmount, 0).toLocaleString() || 0}`}
    icon={<AccountBalanceWalletIcon className="text-white" />}
    color="bg-blue-600"
  />
  {/* <StatCard
    title="Pending Approval"
    value={employeeReports?.filter(report => report.status === 'PENDING').length || 0}
    icon={<PendingActionsIcon className="text-white" />}
    color="bg-yellow-500"
  /> */}

<StatCard
  title="Pending Approval"
  value={employeeReports?.filter(report => 
    report.expenses.some(expense => 
      expense.firstLevelStatus === 'PENDING' || 
      (approvalSettings?.approvalFlow?.requireSecondLevel && expense.finalStatus === 'PENDING')
    )
  ).length || 0}
  icon={<PendingActionsIcon className="text-white" />}
  color="bg-yellow-500"
/>
{/* 
<StatCard
  title={approvalSettings?.approvalFlow?.requireSecondLevel ? "Partially Approved" : "Approved"}
  value={employeeReports?.filter(report => 
    approvalSettings?.approvalFlow?.requireSecondLevel ? 
    report.expenses.some(exp => exp.firstLevelStatus === 'APPROVED' && exp.finalStatus === 'PENDING') :
    report.status === 'APPROVED'
  ).length || 0}
  icon={<CheckCircleIcon className="text-white" />}
  color="bg-green-600"
/> */}

<StatCard
  title={approvalSettings?.approvalFlow?.requireSecondLevel ? "Partially Approved" : "Approved"}
  value={employeeReports?.filter(report => 
    approvalSettings?.approvalFlow?.requireSecondLevel ? 
    // For two-level approval: count reports with first level approved but final level pending
    report.expenses.every(exp => exp.firstLevelStatus === 'APPROVED') && 
    report.expenses.some(exp => exp.finalStatus === 'PENDING') :
    // For single-level approval: count fully approved reports
    report.expenses.every(exp => exp.firstLevelStatus === 'APPROVED')
  ).length || 0}
  icon={<CheckCircleIcon className="text-white" />}
  color="bg-green-600"
/>


  <StatCard
    title="Rejected"
    value={employeeReports?.filter(report => report.status === 'REJECTED').length || 0}
    icon={<BlockIcon className="text-white" />}
    color="bg-red-600"
  />
  <StatCard
    title="Draft"
    value={employeeReports?.filter(report => report.status === 'DRAFT').length || 0}
    icon={<DraftsIcon className="text-white" />}
    color="bg-gray-600"
  />
  
  <StatCard
    title="Payment Completed"
    value={employeeReports?.filter(report => 
      report.paymentStatus === 'PAID' || report.paymentStatus === 'CLOSED'|| report.paymentStatus === 'PAYROLL'
    ).length || 0}
    icon={<PaymentsIcon className="text-white" />}
    color="bg-purple-600"
  />
</div>


          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Report Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status & Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeReports?.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {report.reportName}
                          </span>
                          {/* <span className="text-sm text-gray-500">
                    By: {report.employeeId.first_name} {report.employeeId.last_name}
                  </span> */}
                          {/* {report.reportType && (
                    <span className="text-xs text-gray-500 mt-1">Type: {report.reportType}</span>
                  )} */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {new Date(report.reportDate).toLocaleDateString()}
                          </span>
                          {/* <span className="text-xs text-gray-500">{report.expenseId}</span> */}
                          {/* <span className="text-xs text-gray-400">
                    Created: {new Date(report.createdAt).toLocaleDateString()}
                  </span> */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {report.expenses.map((expense, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {expense.expenseName}
                                </span>
                                {/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {expense.category.name}
                                </span> */}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Amount: ₹{expense.amount.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2"> 
                            {  report.paymentStatus === 'CLOSED' ? (
                             <StatusBadge status="CLOSED" />
                         ) :       
                          report.paymentStatus === "PAID" ? (
                              <StatusBadge status={report.paymentStatus} />
                            ) : report.paymentStatus === "PAYROLL" ? (
                              <StatusBadge status={report.paymentStatus} />
                            ) : (
                              <>
                                <StatusBadge status={report.status} />
                                {report.paymentStatus !== "PENDING" && (
                                  <StatusBadge status={report.paymentStatus} />
                                )}
                              </>
                            )}
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{report.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* <div className="flex flex-col space-y-2"> */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            <span>View Details</span>
                          </button>
                          {canEditReport(report) && (
                            <>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/expense/${organisationId}/report/edit/${report._id}`
                                  )
                                }
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                              >
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this report?"
                                    )
                                  ) {
                                    deleteReportMutation.mutate(report._id);
                                  }
                                }}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                <span>Delete</span>
                              </button>
                            </>

                            // <>
                            //     <IconButton
                            //     color="primary"
                            //     size="small"
                            //     onClick={() => navigate(`/expense/${organisationId}/report/edit/${report._id}`)}
                            //   >
                            //     <EditOutlinedIcon />
                            //   </IconButton>
                            //   <IconButton
                            //     color="error"
                            //     size="small"
                            //     onClick={() => {
                            //       if(window.confirm('Are you sure you want to delete this report?')) {
                            //         deleteReportMutation.mutate(report._id);
                            //       }
                            //     }}
                            //   >
                            //   <DeleteOutlineIcon />
                            //   </IconButton>

                            // </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ExpenseDetailsModal />
    </BoxComponent>
  );
};

export default EmployeeReports;
