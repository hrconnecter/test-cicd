/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputField from "../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../components/Modal/component";
import UserProfile from "../../hooks/UserData/useUser";
import { useCallback } from "react";
// import EmployeeReports from "./EmployeeReports";
import ReasonModal from "../../components/ExpenseManagement/ReasonModal";
import ApprovalButtons from "../../components/ExpenseManagement/ApprovalButtons";

const ApproveExpense = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  // eslint-disable-next-line no-unused-vars
  const user = getCurrentUser();
  const userRole = getCurrentUser().profile;
  //friday >roll based

  const isHRorAccountant =
    userRole.includes("HR") || userRole.includes("Accountant");
  const isHRorSuperAdmin =
    userRole.includes("HR") || userRole.includes("Super-Admin");
  const isSuperAdminOrAccountantOrManager = userRole.some((role) =>
    ["Super-Admin", "Accountant", "Manager"].includes(role)
  );
  const isHRorManagerSuperAdmin = userRole.some((role) =>
    ["HR", "Manager", "Super-Admin"].includes(role)
  );

  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  const [approvalLevel, setApprovalLevel] = useState("first");
  const [selectedExpense, setSelectedExpense] = useState(null);
  // const [expenseActions, setExpenseActions] = useState([]);
  // const [actionReason, setActionReason] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionReason: "",
  });
  const [pendingAction, setPendingAction] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payrollMonth, setPayrollMonth] = useState("");

  // const canApproveExpense = (creatorRole) => {
  //   if (creatorRole.includes('Super-Admin')) {
  //     return isHRorAccountant;
  //   }

  //   if (creatorRole.includes('Manager')) {
  //     return isHRorSuperAdmin;
  //   }
  //   if (creatorRole.includes('HR')) {
  //     return isSuperAdminOrAccountantOrManager;
  //   }
  //   if (creatorRole.includes('Accountant')) {
  //     return isHRorManagerSuperAdmin;
  //   }
  //   return false;
  // };

  const getApprovalMessage = (creatorRole) => {
    if (creatorRole.includes("Super-Admin")) {
      return "Only HR/Accountant roles can approve this expense";
    }

    if (creatorRole.includes("Manager")) {
      return "Only HR/SuperAdmin roles can approve this expense";
    }
    if (creatorRole.includes("HR")) {
      return "Only SuperAdmin/Accountant/Manager roles can approve this expense";
    }
    if (creatorRole.includes("Accountant")) {
      return "Only HR/Manager/SuperAdmin roles can approve this expense";
    }
    return "";
  };

  const handleModalClose = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setPendingAction(null);
  }, []);

  const handleReasonChange = useCallback((value) => {
    setModalState((prev) => ({
      ...prev,
      actionReason: value,
    }));
  }, []);

  const handleActionClick = useCallback((actionDetails) => {
    setSelectedExpense(null); // Close Expense Information modal
    setPendingAction(actionDetails); // Set pending action first
    setModalState({
      isOpen: true,
      actionReason: "",
    });
  }, []);

  // Fetch pending expenses
  const { data: pendingApprovals, isLoading } = useQuery(
    ["pendingExpenses", organisationId, approvalLevel],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/pending/${organisationId}`,
        { headers: { Authorization: authToken } }
      );

      console.log(" ReportReport API Response:", response); // Logs the full response
      console.log("ReportReport Data:", response.data.reports);

      return response.data.reports; // Now getting reports instead of expenses
    },
    {
      refetchOnWindowFocus: true,
      // refetchInterval: 4000, // Refetch every second
      staleTime: 0,
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

  // First Level Approval Mutation
  const firstLevelMutation = useMutation(
    ({ reportId, expenseId, action }) => {
      // const expense = selectedExpense.expenses.find(e => e.expenseId === expenseId);
      const isCreatorSuperAdmin =
        selectedExpense?.createdBy?.profile?.includes("Super-Admin");

      if (isCreatorSuperAdmin && !isHRorAccountant) {
        handleAlert(
          true,
          "error",
          "You don't have permission to approve this expense"
        );
        return Promise.reject("Permission denied");
      }

      const creatorRole =
        selectedExpense?.employeeInfo?.find(
          (emp) => emp._id === selectedExpense?.createdBy
        )?.profile || [];

      // if (!canApproveExpense(creatorRole)) {
      //   handleAlert(true, "error", getApprovalMessage(creatorRole));
      //   return Promise.reject("Permission denied");
      // }
      // if (!canApproveExpense(creatorRole)) {
      //   return (
      //     <div className="text-yellow-600 text-sm">
      //       {getApprovalMessage(creatorRole)}
      //     </div>
      //   );
      // }

      axios.patch(
        `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
        // { action, reason: actionReason },
        { action, reason: modalState.actionReason },
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries("pendingExpenses");
          await queryClient.refetchQueries("pendingExpenses");

          handleAlert(
            true,
            "success",
            "First level approval updated successfully"
          );

          setModalState({ isOpen: false, actionReason: "" });
          setPendingAction(null);
        } catch (error) {
          console.log("Query refresh error:", error);
          handleAlert(true, "error", "Error refreshing expense data");
        }
      },
    }
  );

  // Final Level Approval Mutation
  const finalLevelMutation = useMutation(
    async ({ reportId, expenseId, action, reason }) => {
      console.log("Attempting API call with:", {
        reportId,
        expenseId,
        action,
        reason,
      });

      // const expense = selectedExpense.expenses.find(e => e.expenseId === expenseId);
      const isCreatorSuperAdmin =
        selectedExpense?.createdBy?.profile?.includes("Super-Admin");

      if (isCreatorSuperAdmin && !isHRorAccountant) {
        handleAlert(
          true,
          "error",
          "You don't have permission to approve this expense"
        );
        return Promise.reject("Permission denied");
      }

      axios.patch(
        `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
        { action, reason: modalState.actionReason },
        { headers: { Authorization: authToken } }
      );
    },
    {
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries("pendingExpenses");
          await queryClient.refetchQueries("pendingExpenses");

          handleAlert(
            true,
            "success",
            "First level approval updated successfully"
          );

          setModalState({ isOpen: false, actionReason: "" });
          setPendingAction(null);
        } catch (error) {
          console.log("Query refresh error:", error);
          handleAlert(true, "error", "Error refreshing expense data");
        }
      },
      // onError: (error) => {
      //   handleAlert(
      //     true,
      //     "error",
      //     error.message || "Failed to update approval"
      //   );
      // },
    }
  );

  const handleFirstLevelApproval = useCallback(
    (reportId, expenseId, action) => {
      firstLevelMutation.mutate({ reportId, expenseId, action });
    },
    [firstLevelMutation]
  );

  const handleFinalApproval = useCallback(
    (reportId, expenseId, action) => {
      finalLevelMutation.mutate({ reportId, expenseId, action });
    },
    [finalLevelMutation]
  );

  const handleModalSubmit = useCallback(() => {
    console.log("Modal state when submitting:", modalState);
    console.log("Pending action:", pendingAction);
    if (!modalState.actionReason?.trim()) {
      handleAlert(true, "error", "Reason is required");
      return;
    }

    const mutationData = {
      reportId: pendingAction.reportId,
      expenseId: pendingAction.expenseId,
      action: pendingAction.action,
      reason: modalState.actionReason,
    };
    console.log("Mutation data being sent:", mutationData);
    const mutation =
      pendingAction.level === "first" ? firstLevelMutation : finalLevelMutation;

    mutation.mutate(mutationData, {
      onSuccess: async (response) => {
        console.log("Mutation success response:", response);

        try {
          await queryClient.invalidateQueries("pendingExpenses");
          await queryClient.refetchQueries("pendingExpenses");
          handleAlert(true, "success", `${pendingAction.action} successfully`);
          setModalState({ isOpen: false, actionReason: "" });
          // Remove this line to prevent reopening Expense Information modal
          // setSelectedExpense(pendingAction.expense);
          setPendingAction(null);
        } catch (error) {
          console.log("Query refresh error:", error);
          handleAlert(true, "error", "Error refreshing expense data");
        }
      },
    });
  }, [
    modalState.actionReason,
    pendingAction,
    firstLevelMutation,
    finalLevelMutation,
    handleAlert,
    queryClient,
  ]);

  // Payment processing mutation
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
        handleAlert(
          true,
          "error",
          error.message || "Payment processing failed"
        );
      },
    }
  );

  const handlePayment = async () => {
    if (paymentMethod === "MANUAL_PAYMENT") {
      try {
        const response = await paymentMutation.mutateAsync({
          expenseId: selectedExpense._id,
          data: { paymentMethod },
        });

        console.log("AP Payment Response:", response);
        console.log("AP Order ID:", response.data.order.id);
        console.log("AP Employee Details:", response.data.employeeDetails);

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: selectedExpense.amount * 100,
          currency: "INR",
          name: "AEGIS Expense Payment",
          description: `Payment for ${selectedExpense.expenseName}`,
          order_id: response.data.order.id,
          prefill: {
            name: response.data.employeeDetails.name,
            account_number: response.data.employeeDetails.accountNo,
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
              handleAlert(
                true,
                "error",
                error.message || "Payment verification failed"
              );
            }
          },
          modal: {
            ondismiss: () => {
              alert("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        handleAlert(
          true,
          "error",
          error.message || "Failed to initiate payment"
        );
      }
    } else {
      paymentMutation.mutate({
        expenseId: selectedExpense._id,
        data: {
          paymentMethod,
          payrollMonth,
        },
      });
    }
  };
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

  const ExpenseDetailsModal = () => {
    if (!selectedExpense) return null;

    // Handle both report and single expense cases
    const expensesArray =
      selectedExpense?.isReport && Array.isArray(selectedExpense?.expenses)
        ? selectedExpense.expenses
        : selectedExpense
        ? [selectedExpense]
        : [];

    const requiresSecondLevel =
      approvalSettings?.approvalFlow?.requireSecondLevel;

    return (
      <ReusableModal
        open={!!selectedExpense}
        onClose={() => {
          setSelectedExpense(null);
          setActiveTab("details");
        }}
        heading="Expense Information"
      >
        <div className="p-4">
          {/* Tab Navigation */}
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
            {selectedExpense.isReport && (
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
            )}
            {(role?.includes("Super-Admin") ||
              role?.includes("Accountant")) && (
              <button
                className={`pb-2 px-4 ${
                  activeTab === "payment"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </button>
            )}
          </div>

          {activeTab === "details" && expensesArray.length > 0 && (
            <div className="space-y-4">
              {/* monday v2 */}
              {/* Add Employee Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Employee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Employee Name:</span>{" "}
                    {selectedExpense.employeeDetails?.name ||
                      `${selectedExpense.employeeInfo?.[0]?.first_name || ""} ${
                        selectedExpense.employeeInfo?.[0]?.last_name || ""
                      }`}
                  </div>
                  {/* <div>
                    <span className="font-medium">Employee ID:</span>{" "}
                    {selectedExpense.employeeDetails?.employeeId ||
                      selectedExpense.employeeId}
                  </div> */}

<div>
          <span className="font-medium">Employee ID:</span>{" "}
          
          {selectedExpense.employeeDetails?.empId || 
       selectedExpense.employeeInfo?.[0]?.empId || 
       'N/A'}
        </div>
                  <div>
                    <span className="font-medium">Department:</span>{" "}
                    {selectedExpense.employeeDetails?.department ||
                      selectedExpense.employeeInfo?.[0]?.department?.name ||
                      "N/A"}
                  </div>
                  {/* <div>
                    <span className="font-medium">Designation:</span>{" "}
                    {selectedExpense.employeeDetails?.designation ||
                      selectedExpense.employeeInfo?.[0]?.designation?.name ||
                      "N/A"}
                  </div> */}
                  <div>
                    <span className="font-medium">Contact Number:</span>{" "}
                    {selectedExpense.employeeDetails?.contactNumber ||
                      selectedExpense.employeeInfo?.[0]?.phone_number ||
                      "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Email ID:</span>{" "}
                    {selectedExpense.employeeDetails?.email ||
                      selectedExpense.employeeInfo?.[0]?.email ||
                      "N/A"}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Report Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Report Name:</span>{" "}
                    {selectedExpense.reportName}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> ₹
                    {selectedExpense.totalAmount}
                  </div>
                  {/* <div><span className="font-medium">Created By:</span> {selectedExpense.employeeInfo?.first_name} {selectedExpense.employeeInfo?.last_name}</div> */}
                  {/* <div>
                    <span className="font-medium">Created By:</span>
                    {selectedExpense.employeeInfo?.[0]?.first_name}{" "}
                    {selectedExpense.employeeInfo?.[0]?.last_name}
                  </div> */}

                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedExpense.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Approval History</h3>
                {/* {selectedExpense.expenses.map((expense, index) => ( */}
                {/* page */}
                {expensesArray.map((expense, index) => (
                  <div
                    key={expense._id || index}
                    className="mb-4 border-b pb-2"
                  >
                    <div className="font-medium">{expense.expenseName}</div>



                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm">
                          First Level:{" "}
                          <StatusBadge status={expense.firstLevelStatus} />
                        </div>
                        {expense.firstLevelApprovedBy && (
                          <div className="text-sm text-gray-600">
                            {/* By: {expense.firstLevelApprovedBy.first_name} {expense.firstLevelApprovedBy.last_name} */}
                            {/* By:{" "} */}
                            {selectedExpense.employeeInfo?.find(
                              (emp) => emp._id === expense.firstLevelApprovedBy
                            )?.first_name || ""}{" "}
                            {selectedExpense.employeeInfo?.find(
                              (emp) => emp._id === expense.firstLevelApprovedBy
                            )?.last_name || ""}
                            {/* By: {typeof expense.firstLevelApprovedBy === 'object' ? 
                            `${expense.firstLevelApprovedBy.first_name} ${expense.firstLevelApprovedBy.last_name}` : 
                               expense.firstLevelApprovedBy} */}
                            <div>
                              At:{" "}
                              {new Date(
                                expense.firstLevelApprovedAt
                              ).toLocaleString()}
                            </div>
                            {expense.firstLevelReason && (
                              <div>Reason: {expense.firstLevelReason}</div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* {(approvalSettings?.approvalFlow?.requireSecondLevel || expense.finalStatus !== "PENDING") && ( */}
                      {requiresSecondLevel && (
                        <div>
                          <div className="text-sm">
                            Final Level:{" "}
                            <StatusBadge status={expense.finalStatus} />
                          </div>
                          {expense.finalApprovedBy && (
                            <div className="text-sm text-gray-600">
                              By: {expense.finalApprovedBy.first_name}{" "}
                              {expense.finalApprovedBy.last_name}
                              <div>
                                At:{" "}
                                {new Date(
                                  expense.finalApprovedAt
                                ).toLocaleString()}
                              </div>
                              {expense.finalApprovalReason && (
                                <div>Reason: {expense.finalApprovalReason}</div>
                              )}
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

          {/* Expense Items Tab Content */}
          {/* {activeTab === "expenses" && ( */}
          {/* page */}
          {activeTab === "expenses" && expensesArray.length > 0 && (
            <div className="space-y-4">
              {/* {selectedExpense.expenses.map((expense) => ( */}
              {expensesArray.map((expense) => (
                // <div key={expense.expenseId} className="border p-4 rounded-lg">
                <div
                  key={expense._id || expense.expenseId}
                  className="border p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
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
                        Period:{" "}
                        {new Date(expense.startDate).toLocaleDateString()} -{" "}
                        {new Date(expense.endDate).toLocaleDateString()}
                      </div>


  
                      {/* Display category-specific fields */}
                      {expense.dynamicFields &&
                        Object.keys(expense.dynamicFields).length > 0 && (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <p className="text-sm font-medium mb-1">
                              Category Details:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(expense.dynamicFields).map(
                                ([key, value]) =>
                                  value && (
                                    <div key={key} className="text-sm">
                                      <span className="font-medium">
                                        {key
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase()
                                          )
                                          .trim()}
                                        :
                                      </span>{" "}
                                      {typeof value === "object" &&
                                      value !== null &&
                                      value instanceof Date
                                        ? new Date(value).toLocaleDateString()
                                        : String(value)}
                                    </div>
                                  )
                              )}
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
                    <div className="space-y-2">
                      <StatusBadge status={expense.firstLevelStatus} />
                      {/* <StatusBadge status={expense.finalStatus} /> */}
                      {approvalSettings?.approvalFlow?.requireSecondLevel && (
                        <StatusBadge status={expense.finalStatus} />
                      )}
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

          {activeTab === "payment" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Processing</h3>

              {selectedExpense.isReport ? (
                // For expense reports - check all expenses in the array
                selectedExpense.expenses.every(
                  (exp) =>
                    exp.firstLevelStatus === "APPROVED" &&
                    exp.finalStatus === "APPROVED"
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

                    {paymentMethod === "PAYROLL" && (
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
                      disabled={
                        !paymentMethod ||
                        (paymentMethod === "PAYROLL" && !payrollMonth)
                      }
                    >
                      {paymentMutation.isLoading
                        ? "Processing..."
                        : "Process Payment"}
                    </button>
                  </div>
                ) : (
                  <div className="text-yellow-600">
                    All expenses in the report must be approved at both levels
                    before processing payment
                  </div>
                )
              ) : // For single expenses - check direct status
              selectedExpense.firstLevelStatus === "APPROVED" &&
                selectedExpense.finalStatus === "APPROVED" ? (
                // Payment form for single expense
                <div className="space-y-4">
                  {/* Same payment form as above */}
                </div>
              ) : (
                <div className="text-yellow-600">
                  Expense must be approved at both levels before processing
                  payment
                </div>
              )}
            </div>
          )}
        </div>
      </ReusableModal>
    );
  };

  // const renderApprovalButtons = (expense) => {

  //  const isCreatorSuperAdmin = selectedExpense.employeeInfo?.find(
  //   emp => emp._id === selectedExpense.createdBy
  // )?.profile?.includes('Super-Admin');

  //   if (isCreatorSuperAdmin) {
  //     if (!isHRorAccountant) {
  //       return (
  //         <div className="text-yellow-600 text-sm">
  //           Only HR/Accountant roles can approve expenses created by SuperAdmin
  //         </div>
  //       );
  //     }
  //   }

  //   const creatorRole = selectedExpense.employeeInfo?.find(
  //     emp => emp._id === selectedExpense.createdBy
  //   )?.profile || [];

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
  //           onClick={() =>
  //             setPendingAction({
  //               level: "first",
  //               reportId: selectedExpense._id,
  //               expenseId: expense.expenseId,
  //               action: "APPROVED",
  //             })
  //           }
  //           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
  //           // disabled={isCreatorSuperAdmin && !isHRorAccountant}
  //           // disabled={!canApproveExpense(creatorRole)}
  //           disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}

  //         >
  //           Approve
  //         </button>
  //         <button
  //           onClick={() =>
  //             setPendingAction({
  //               level: "first",
  //               reportId: selectedExpense._id,
  //               expenseId: expense.expenseId,
  //               action: "REJECTED",
  //             })
  //           }
  //           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
  //           // disabled={isCreatorSuperAdmin && !isHRorAccountant}
  //           // disabled={!canApproveExpense(creatorRole)}
  //           disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
  //         >
  //           Reject
  //         </button>
  //       </>
  //     );
  //   }

  //   if (
  //     approvalLevel === "final" &&
  //     expense.firstLevelStatus === "APPROVED" &&
  //     expense.finalStatus === "PENDING"
  //   ) {
  //     return (
  //       <>
  //         <button
  //           onClick={() =>
  //             setPendingAction({
  //               level: "final",
  //               reportId: selectedExpense._id,
  //               expenseId: expense.expenseId,
  //               action: "APPROVED",
  //             })
  //           }
  //           className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
  //           // disabled={isCreatorSuperAdmin && !isHRorAccountant}
  //           disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
  //         >
  //           Final Approve
  //         </button>
  //         <button
  //           onClick={() =>
  //             setPendingAction({
  //               level: "final",
  //               reportId: selectedExpense._id,
  //               expenseId: expense.expenseId,
  //               action: "REJECTED",
  //             })
  //           }
  //           className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
  //           // disabled={isCreatorSuperAdmin && !isHRorAccountant}
  //           disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
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
  const renderApprovalButtons = useCallback(
    (expense) => {
      const isCreatorSuperAdmin = selectedExpense.employeeInfo
        ?.find((emp) => emp._id === selectedExpense.createdBy)
        ?.profile?.includes("Super-Admin");

      const creatorRole =
        selectedExpense.employeeInfo?.find(
          (emp) => emp._id === selectedExpense.createdBy
        )?.profile || [];

      return (
        <ApprovalButtons
          expense={expense}
          approvalLevel={approvalLevel}
          isCreatorSuperAdmin={isCreatorSuperAdmin}
          isHRorAccountant={isHRorAccountant}
          isHRorSuperAdmin={isHRorSuperAdmin}
          isSuperAdminOrAccountantOrManager={isSuperAdminOrAccountantOrManager}
          isHRorManagerSuperAdmin={isHRorManagerSuperAdmin}
          creatorRole={creatorRole}
          onActionClick={handleActionClick}
          selectedExpense={selectedExpense}
          requiresSecondLevel={
            approvalSettings?.approvalFlow?.requireSecondLevel
          }
        />
      );
    },
    [
      selectedExpense,
      approvalLevel,
      isHRorAccountant,
      isHRorSuperAdmin,
      isSuperAdminOrAccountantOrManager,
      isHRorManagerSuperAdmin,
      handleActionClick,
      approvalSettings,
    ]
  );

  return (
    <BoxComponent>
      <div className="flex flex-col w-full">
        <HeadingOneLineInfo
          heading="Expense Approvals"
          info="Manage expense approvals and review submissions"
        />

        {/* <div className="mb-4">
        <select
          value={approvalLevel}
          onChange={(e) => setApprovalLevel(e.target.value)}
          className="form-select rounded-md border-gray-300"
        >
          <option value="first">First Level Approval</option>
          <option value="final">Final Level Approval</option>
        </select>
      </div>  */}

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
  {report.employeeDetails?.name || ""}
</td>

{/* <td className="px-6 py-4 whitespace-nowrap">
  {report.employeeDetails?.name || 
   (report.employeeInfo?.[0] ? 
     `${report.employeeInfo[0].first_name || ''} ${report.employeeInfo[0].last_name || ''}`.trim() : 
     '')}
</td> */}

                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.isReport && report.expenses?.length > 0
                        ? `Report (${report.expenses.length} expenses)`
                        : ""}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{report.totalAmount || report.amount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {report.isReport && report.expenses ? (
                          report.expenses.map((expense, index) => (
                            <div key={index} className="text-sm">
                              <div>
                                First Level:{" "}
                                <StatusBadge
                                  status={expense.firstLevelStatus || "PENDING"}
                                />
                              </div>
                              {approvalSettings?.approvalFlow
                                ?.requireSecondLevel && (
                                <div>
                                  Final Level:{" "}
                                  <StatusBadge
                                    status={expense.finalStatus || "PENDING"}
                                  />
                                </div>
                              )}
                              {expense.finalStatus === "APPROVED" &&
                                report.paymentStatus && (
                                  <div>
                                    Payment:{" "}
                                    <StatusBadge
                                      status={report.paymentStatus}
                                    />
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
                            <div>
                              First Level:{" "}
                              <StatusBadge
                                status={report.firstLevelStatus || "PENDING"}
                              />
                            </div>
                            <div>
                              Final Level:{" "}
                              <StatusBadge
                                status={report.finalStatus || "PENDING"}
                              />
                            </div>

                            {report.finalStatus === "APPROVED" &&
                              report.paymentStatus && (
                                <div>
                                  Payment:{" "}
                                  <StatusBadge status={report.paymentStatus} />
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
        <ReasonModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          actionReason={modalState.actionReason}
          setActionReason={handleReasonChange}
          pendingAction={pendingAction}
          onSubmit={handleModalSubmit}
        />
      </div>
    </BoxComponent>
  );
};
export default ApproveExpense;

// /* eslint-disable no-unused-vars */
// // /* eslint-disable no-unused-vars */
// import { useContext, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import ReusableModal from "../../components/Modal/component";
// import UserProfile from "../../hooks/UserData/useUser";
// import EmployeeReports from "./EmployeeReports";

// const ApproveExpense = () => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const user = getCurrentUser();
//   const userRole = getCurrentUser().profile;
//   //friday >roll based

//   const isHRorAccountant = userRole.includes('HR') || userRole.includes('Accountant');
//   const isHRorSuperAdmin = userRole.includes('HR') || userRole.includes('Super-Admin');
//   const isSuperAdminOrAccountantOrManager = userRole.some(role =>
//     ['Super-Admin', 'Accountant', 'Manager'].includes(role)
//   );
//   const isHRorManagerSuperAdmin = userRole.some(role =>
//     ['HR', 'Manager', 'Super-Admin'].includes(role)
//   );

//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();
//   const queryClient = useQueryClient();

//   const [approvalLevel, setApprovalLevel] = useState("first");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [expenseActions, setExpenseActions] = useState([]);
//   const [actionReason, setActionReason] = useState("");
//   const [pendingAction, setPendingAction] = useState(null);
//   const [activeTab, setActiveTab] = useState("details");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [payrollMonth, setPayrollMonth] = useState("");

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

//   const getApprovalMessage = (creatorRole) => {
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

//   // Fetch pending expenses
//   const { data: pendingApprovals, isLoading } = useQuery(
//     ["pendingExpenses", organisationId, approvalLevel],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/pending/${organisationId}`,
//         { headers: { Authorization: authToken } }
//       );

//       console.log(" ReportReport API Response:", response); // Logs the full response
//       console.log("ReportReport Data:", response.data.reports);

//       return response.data.reports; // Now getting reports instead of expenses
//     },
//     {
//       refetchOnWindowFocus: true,
//       // refetchInterval: 4000, // Refetch every second
//       staleTime: 0,
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
//     { enabled: !!selectedExpense && activeTab === "history" }
//   );

//   // First Level Approval Mutation
//   const firstLevelMutation = useMutation(
//     ({ reportId, expenseId, action }) => {
//       if (!actionReason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       const expense = selectedExpense.expenses.find(e => e.expenseId === expenseId);
//       const isCreatorSuperAdmin = selectedExpense.createdBy?.profile?.includes('Super-Admin');

//       if (isCreatorSuperAdmin && !isHRorAccountant) {
//         handleAlert(true, "error", "You don't have permission to approve this expense");
//         return Promise.reject("Permission denied");
//       }

//       const creatorRole = selectedExpense.employeeInfo?.find(
//         emp => emp._id === selectedExpense.createdBy
//       )?.profile || [];

//       // if (!canApproveExpense(creatorRole)) {
//       //   handleAlert(true, "error", getApprovalMessage(creatorRole));
//       //   return Promise.reject("Permission denied");
//       // }
//       if (!canApproveExpense(creatorRole)) {
//         return (
//           <div className="text-yellow-600 text-sm">
//             {getApprovalMessage(creatorRole)}
//           </div>
//         );
//       }

//       axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
//         { action, reason: actionReason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         // queryClient.refetchQueries("pendingExpenses");
//         handleAlert(
//           true,
//           "success",
//           "First level approval updated successfully"
//         );
//         setActionReason("");
//         setPendingAction(null);
//       },
//     }
//   );

//   // Final Level Approval Mutation
//   const finalLevelMutation = useMutation(
//     ({ reportId, expenseId, action }) => {
//       if (!actionReason.trim()) {
//         handleAlert(true, "error", "Reason is required for approval/rejection");
//         return Promise.reject("Reason is required");
//       }
//       const expense = selectedExpense.expenses.find(e => e.expenseId === expenseId);
//       const isCreatorSuperAdmin = selectedExpense.createdBy?.profile?.includes('Super-Admin');

//       if (isCreatorSuperAdmin && !isHRorAccountant) {
//         handleAlert(true, "error", "You don't have permission to approve this expense");
//         return Promise.reject("Permission denied");
//       }

//       axios.patch(
//         `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
//         { action, reason: actionReason },
//         { headers: { Authorization: authToken } }
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("pendingExpenses");
//         queryClient.refetchQueries("pendingExpenses");
//         handleAlert(true, "success", "Final approval updated successfully");
//         setActionReason("");
//         setPendingAction(null);
//       },
//       onError: (error) => {
//         handleAlert(
//           true,
//           "error",
//           error.message || "Failed to update approval"
//         );
//       },
//     }
//   );

//   // Handler Functions
//   const handleFirstLevelApproval = (reportId, expenseId, action) => {
//     firstLevelMutation.mutate({ reportId, expenseId, action });
//   };

//   const handleFinalApproval = (reportId, expenseId, action) => {
//     finalLevelMutation.mutate({ reportId, expenseId, action });
//   };

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
//       },
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
//         handleAlert(
//           true,
//           "error",
//           error.message || "Payment processing failed"
//         );
//       },
//     }
//   );

//   const handlePayment = async () => {
//     if (paymentMethod === "MANUAL_PAYMENT") {
//       try {
//         const response = await paymentMutation.mutateAsync({
//           expenseId: selectedExpense._id,
//           data: { paymentMethod },
//         });

//         console.log("AP Payment Response:", response);
//         console.log("AP Order ID:", response.data.order.id);
//         console.log("AP Employee Details:", response.data.employeeDetails);

//         const options = {
//           key: process.env.REACT_APP_RAZORPAY_KEY,
//           amount: selectedExpense.amount * 100,
//           currency: "INR",
//           name: "AEGIS Expense Payment",
//           description: `Payment for ${selectedExpense.expenseName}`,
//           order_id: response.data.order.id,
//           prefill: {
//             name: response.data.employeeDetails.name,
//             account_number: response.data.employeeDetails.accountNo,
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
//               handleAlert(
//                 true,
//                 "error",
//                 error.message || "Payment verification failed"
//               );
//             }
//           },
//           modal: {
//             ondismiss: () => {
//               alert("Payment cancelled");
//             },
//           },
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//       } catch (error) {
//         handleAlert(
//           true,
//           "error",
//           error.message || "Failed to initiate payment"
//         );
//       }
//     } else {
//       paymentMutation.mutate({
//         expenseId: selectedExpense._id,
//         data: {
//           paymentMethod,
//           payrollMonth,
//         },
//       });
//     }
//   };
//   const StatusBadge = ({ status }) => {
//     const getStatusColor = (status) => {
//       switch (status) {
//         case "APPROVED":
//           return "bg-green-100 text-green-800";
//         case "REJECTED":
//           return "bg-red-100 text-red-800";
//         case "PENDING":
//           return "bg-yellow-100 text-yellow-800";
//         case "PAID":
//           return "bg-blue-100 text-blue-800";
//         case "CLOSED":
//           return "bg-gray-100 text-gray-800";
//         case "PAYROLL":
//           return "bg-purple-100 text-purple-800";
//         default:
//           return "bg-gray-100 text-gray-800";
//       }
//     };

//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}
//       >
//         {status}
//       </span>
//     );
//   };
//   const ReasonModal = () => {
//     return (
//       <ReusableModal
//         open={!!pendingAction}
//         onClose={() => setPendingAction(null)}
//         heading={`${pendingAction?.action} REASON`}
//       >
//         <div className="space-y-4">
//           <textarea
//             value={actionReason}
//             onChange={(e) => setActionReason(e.target.value)}
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
//               onClick={() => {
//                 if (!actionReason.trim()) {
//                   handleAlert(true, "error", "Reason is required");
//                   return;
//                 }

//                 if (pendingAction.level === "first") {
//                   handleFirstLevelApproval(
//                     pendingAction.reportId,
//                     pendingAction.expenseId,
//                     pendingAction.action
//                   );
//                 } else {
//                   handleFinalApproval(
//                     pendingAction.reportId,
//                     pendingAction.expenseId,
//                     pendingAction.action
//                   );
//                 }
//               }}
//               className="px-4 py-2 bg-primary text-white rounded-md"
//               disabled={!actionReason.trim()}
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </ReusableModal>
//     );
//   };

//   // Update the ExpenseDetailsModal component
//   const ExpenseDetailsModal = () => {
//     if (!selectedExpense) return null;

//     return (
//       <ReusableModal
//         open={!!selectedExpense}
//         onClose={() => {
//           setSelectedExpense(null);
//           setActiveTab("details");
//         }}
//         heading="Expense Information"
//       >
//         <div className="p-4">
//           {/* Tab Navigation */}
//           <div className="flex space-x-4 mb-4 border-b">
//             <button
//               className={`pb-2 px-4 ${
//                 activeTab === "details"
//                   ? "border-b-2 border-primary text-primary"
//                   : "text-gray-500"
//               }`}
//               onClick={() => setActiveTab("details")}
//             >
//               Details & History
//             </button>
//             {selectedExpense.isReport && (
//               <button
//                 className={`pb-2 px-4 ${
//                   activeTab === "expenses"
//                     ? "border-b-2 border-primary text-primary"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("expenses")}
//               >
//                 Expense Items
//               </button>
//             )}
//             {(role?.includes("Super-Admin") ||
//               role?.includes("Accountant")) && (
//               <button
//                 className={`pb-2 px-4 ${
//                   activeTab === "payment"
//                     ? "border-b-2 border-primary text-primary"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("payment")}
//               >
//                 Payment
//               </button>
//             )}
//           </div>

//           {/* Details & History Tab Content */}
//           {activeTab === "details" && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold mb-2">Report Information</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="font-medium">Report Name:</span>{" "}
//                     {selectedExpense.reportName}
//                   </div>
//                   <div>
//                     <span className="font-medium">Total Amount:</span> ₹
//                     {selectedExpense.totalAmount}
//                   </div>
//                   {/* <div><span className="font-medium">Created By:</span> {selectedExpense.employeeInfo?.first_name} {selectedExpense.employeeInfo?.last_name}</div> */}
//                   <div>
//                     <span className="font-medium">Created By:</span>
//                     {selectedExpense.employeeInfo?.[0]?.first_name}{" "}
//                     {selectedExpense.employeeInfo?.[0]?.last_name}
//                   </div>
//                   <div>
//                     <span className="font-medium">Created At:</span>{" "}
//                     {new Date(selectedExpense.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold mb-2">Approval History</h3>
//                 {selectedExpense.expenses.map((expense, index) => (
//                   <div key={index} className="mb-4 border-b pb-2">
//                     <div className="font-medium">{expense.expenseName}</div>
//                     <div className="grid grid-cols-2 gap-4 mt-2">
//                       <div>
//                         <div className="text-sm">
//                           First Level:{" "}
//                           <StatusBadge status={expense.firstLevelStatus} />
//                         </div>
//                         {expense.firstLevelApprovedBy && (
//                           <div className="text-sm text-gray-600">
//                             {/* By: {expense.firstLevelApprovedBy.first_name} {expense.firstLevelApprovedBy.last_name} */}
//                             By:{" "}
//                             {selectedExpense.employeeInfo?.find(
//                               (emp) => emp._id === expense.firstLevelApprovedBy
//                             )?.first_name || ""}{" "}
//                             {selectedExpense.employeeInfo?.find(
//                               (emp) => emp._id === expense.firstLevelApprovedBy
//                             )?.last_name || ""}
//                             {/* By: {typeof expense.firstLevelApprovedBy === 'object' ?
//                             `${expense.firstLevelApprovedBy.first_name} ${expense.firstLevelApprovedBy.last_name}` :
//                                expense.firstLevelApprovedBy} */}
//                             <div>
//                               At:{" "}
//                               {new Date(
//                                 expense.firstLevelApprovedAt
//                               ).toLocaleString()}
//                             </div>
//                             {expense.firstLevelReason && (
//                               <div>Reason: {expense.firstLevelReason}</div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <div className="text-sm">
//                           Final Level:{" "}
//                           <StatusBadge status={expense.finalStatus} />
//                         </div>
//                         {expense.finalApprovedBy && (
//                           <div className="text-sm text-gray-600">
//                             By: {expense.finalApprovedBy.first_name}{" "}
//                             {expense.finalApprovedBy.last_name}
//                             <div>
//                               At:{" "}
//                               {new Date(
//                                 expense.finalApprovedAt
//                               ).toLocaleString()}
//                             </div>
//                             {expense.finalApprovalReason && (
//                               <div>Reason: {expense.finalApprovalReason}</div>
//                             )}
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
//           {activeTab === "expenses" && (
//             <div className="space-y-4">
//               {selectedExpense.expenses.map((expense) => (
//                 <div key={expense.expenseId} className="border p-4 rounded-lg">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-2">
//                       <h4 className="font-medium">{expense.expenseName}</h4>
//                       <p className="text-sm text-gray-600">
//                         Amount: ₹{expense.amount}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Description: {expense.description}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Region: {expense.region}
//                       </p>
//                       <div className="text-sm text-gray-600">
//                         Period:{" "}
//                         {new Date(expense.startDate).toLocaleDateString()} -{" "}
//                         {new Date(expense.endDate).toLocaleDateString()}
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

//           {activeTab === "payment" && (
//             <div className="space-y-4">
//               <h3 className="font-semibold">Payment Processing</h3>

//               {selectedExpense.isReport ? (
//                 // For expense reports - check all expenses in the array
//                 selectedExpense.expenses.every(
//                   (exp) =>
//                     exp.firstLevelStatus === "APPROVED" &&
//                     exp.finalStatus === "APPROVED"
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

//                     {paymentMethod === "PAYROLL" && (
//                       <input
//                         type="month"
//                         value={payrollMonth}
//                         onChange={(e) => setPayrollMonth(e.target.value)}
//                         className="w-full p-2 border rounded-md"
//                       />
//                     )}

//                     <button
//                       onClick={handlePayment}
//                       className="w-full p-2 bg-primary text-white rounded-md"
//                       disabled={
//                         !paymentMethod ||
//                         (paymentMethod === "PAYROLL" && !payrollMonth)
//                       }
//                     >
//                       {paymentMutation.isLoading
//                         ? "Processing..."
//                         : "Process Payment"}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="text-yellow-600">
//                     All expenses in the report must be approved at both levels
//                     before processing payment
//                   </div>
//                 )
//               ) : // For single expenses - check direct status
//               selectedExpense.firstLevelStatus === "APPROVED" &&
//                 selectedExpense.finalStatus === "APPROVED" ? (
//                 // Payment form for single expense
//                 <div className="space-y-4">
//                   {/* Same payment form as above */}
//                 </div>
//               ) : (
//                 <div className="text-yellow-600">
//                   Expense must be approved at both levels before processing
//                   payment
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </ReusableModal>
//     );
//   };

//   const renderApprovalButtons = (expense) => {

//    const isCreatorSuperAdmin = selectedExpense.employeeInfo?.find(
//     emp => emp._id === selectedExpense.createdBy
//   )?.profile?.includes('Super-Admin');

//     if (isCreatorSuperAdmin) {
//       if (!isHRorAccountant) {
//         return (
//           <div className="text-yellow-600 text-sm">
//             Only HR/Accountant roles can approve expenses created by SuperAdmin
//           </div>
//         );
//       }
//     }

//     const creatorRole = selectedExpense.employeeInfo?.find(
//       emp => emp._id === selectedExpense.createdBy
//     )?.profile || [];

//     if (!canApproveExpense(creatorRole)) {
//       return (
//         <div className="text-yellow-600 text-sm">
//           {getApprovalMessage(creatorRole)}
//         </div>
//       );
//     }

//     if (approvalLevel === "first" && expense.firstLevelStatus === "PENDING") {
//       return (
//         <>
//           <button
//             onClick={() =>
//               setPendingAction({
//                 level: "first",
//                 reportId: selectedExpense._id,
//                 expenseId: expense.expenseId,
//                 action: "APPROVED",
//               })
//             }
//             className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//             // disabled={isCreatorSuperAdmin && !isHRorAccountant}
//             // disabled={!canApproveExpense(creatorRole)}
//             disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}

//           >
//             Approve
//           </button>
//           <button
//             onClick={() =>
//               setPendingAction({
//                 level: "first",
//                 reportId: selectedExpense._id,
//                 expenseId: expense.expenseId,
//                 action: "REJECTED",
//               })
//             }
//             className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//             // disabled={isCreatorSuperAdmin && !isHRorAccountant}
//             // disabled={!canApproveExpense(creatorRole)}
//             disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
//           >
//             Reject
//           </button>
//         </>
//       );
//     }

//     if (
//       approvalLevel === "final" &&
//       expense.firstLevelStatus === "APPROVED" &&
//       expense.finalStatus === "PENDING"
//     ) {
//       return (
//         <>
//           <button
//             onClick={() =>
//               setPendingAction({
//                 level: "final",
//                 reportId: selectedExpense._id,
//                 expenseId: expense.expenseId,
//                 action: "APPROVED",
//               })
//             }
//             className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
//             // disabled={isCreatorSuperAdmin && !isHRorAccountant}
//             disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
//           >
//             Final Approve
//           </button>
//           <button
//             onClick={() =>
//               setPendingAction({
//                 level: "final",
//                 reportId: selectedExpense._id,
//                 expenseId: expense.expenseId,
//                 action: "REJECTED",
//               })
//             }
//             className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
//             // disabled={isCreatorSuperAdmin && !isHRorAccountant}
//             disabled={(isCreatorSuperAdmin && !isHRorAccountant) || !canApproveExpense(creatorRole)}
//           >
//             Final Reject
//           </button>
//         </>
//       );
//     }

//     return null;
//   };

//   // if (role === "Employee") {
//   //   return <EmployeeReports />;
//   // }

//   return (
//     <BoxComponent>
//       <div className="flex flex-col w-full">
//         <HeadingOneLineInfo
//           heading="Expense Approvals"
//           info="Manage expense approvals and review submissions"
//         />

//         {/* <div className="mb-4">
//         <select
//           value={approvalLevel}
//           onChange={(e) => setApprovalLevel(e.target.value)}
//           className="form-select rounded-md border-gray-300"
//         >
//           <option value="first">First Level Approval</option>
//           <option value="final">Final Level Approval</option>
//         </select>
//       </div>  */}

//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Report/Expense Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Submitted By
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {/* {pendingApprovals?.map((report) => (
//                 <tr key={report._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {report.reportName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {`${report.employeeInfo[0]?.first_name} ${report.employeeInfo[0]?.last_name}`}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     Report ({report.expenses.length} expenses)
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     ₹{report.totalAmount}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="space-y-1">
//                       {report.expenses.map((expense, index) => (
//                         <div key={index} className="space-y-1">
//                           <div>{expense.expenseName}:</div>
//                           <div>First Level: <StatusBadge status={expense.firstLevelStatus} /></div>
//                           <div>Final Level: <StatusBadge status={expense.finalStatus} /></div>
//                           {expense.finalStatus === 'APPROVED' && report.paymentStatus && (
//                             <div>
//                               Payment: <StatusBadge status={report.paymentStatus} />
//                               {report.paymentMethod && (
//                                 <span className="ml-2 text-xs text-gray-600">
//                                   ({report.paymentMethod})
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => setSelectedExpense(report)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}  */}

//                 {pendingApprovals?.map((report) => (
//                   <tr key={report._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {report.reportName || report.expenseName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {report.employeeInfo?.[0]?.first_name}{" "}
//                       {report.employeeInfo?.[0]?.last_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {report.isReport && report.expenses?.length > 0
//                         ? `Report (${report.expenses.length} expenses)`
//                         : ""}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       ₹{report.totalAmount || report.amount || 0}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="space-y-1">
//                         {report.isReport && report.expenses ? (
//                           report.expenses.map((expense, index) => (
//                             <div key={index} className="text-sm">
//                               <div>
//                                 First Level:{" "}
//                                 <StatusBadge
//                                   status={expense.firstLevelStatus || "PENDING"}
//                                 />
//                               </div>
//                               <div>
//                                 Final Level:{" "}
//                                 <StatusBadge
//                                   status={expense.finalStatus || "PENDING"}
//                                 />
//                               </div>
//                               {expense.finalStatus === "APPROVED" &&
//                                 report.paymentStatus && (
//                                   <div>
//                                     Payment:{" "}
//                                     <StatusBadge
//                                       status={report.paymentStatus}
//                                     />
//                                     {report.paymentMethod && (
//                                       <span className="ml-2 text-xs text-gray-600">
//                                         ({report.paymentMethod})
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}
//                             </div>
//                           ))
//                         ) : (
//                           <>
//                             <div>
//                               First Level:{" "}
//                               <StatusBadge
//                                 status={report.firstLevelStatus || "PENDING"}
//                               />
//                             </div>
//                             <div>
//                               Final Level:{" "}
//                               <StatusBadge
//                                 status={report.finalStatus || "PENDING"}
//                               />
//                             </div>

//                             {report.finalStatus === "APPROVED" &&
//                               report.paymentStatus && (
//                                 <div>
//                                   Payment:{" "}
//                                   <StatusBadge status={report.paymentStatus} />
//                                   {report.paymentMethod && (
//                                     <span className="ml-2 text-xs text-gray-600">
//                                       ({report.paymentMethod})
//                                     </span>
//                                   )}
//                                 </div>
//                               )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => setSelectedExpense(report)}
//                         className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <ExpenseDetailsModal />
//         <ReasonModal />
//       </div>
//     </BoxComponent>
//   );
// };
// export default ApproveExpense;
