/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useMemo, useCallback } from "react";
import axios from "axios";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Select from "react-select";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import { Button, CircularProgress } from "@mui/material";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import UserProfile from "../../hooks/UserData/useUser";
import ExpenseStats from "./ExpenseStats";
import EmployeeReports from "./EmployeeReports";
import ReasonModal from "../../components/ExpenseManagement/ReasonModal";
import ApprovalButtons from "../../components/ExpenseManagement/ApprovalButtons";

const ManageExpense = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();
  const authToken = cookies["aegis"];
  const userRole = getCurrentUser().profile;
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  // States
  // const [approvalLevel, setApprovalLevel] = useState("first");
  const [approvalLevel, setApprovalLevel] = useState("final");
  const [selectedExpense, setSelectedExpense] = useState(null);
  // const [expenseActions, setExpenseActions] = useState([]);
  // const [actionReason, setActionReason] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payrollMonth, setPayrollMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionReason: "",
  });

  // Add these states at the top with other states
  const [filter, setFilter] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "",
    approver: "",
    status: "",
    department: "",
    startDate: "",
    endDate: "",
    category: "",
    approverId: "",
  });

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

  const canApproveExpense = (creatorRole) => {
    if (creatorRole.includes("Employee")) {
      // return isHRorAccountant || isHRorSuperAdmin || isSuperAdminOrAccountantOrManager
      // return true
      return (
        isHRorAccountant ||
        isHRorSuperAdmin ||
        isSuperAdminOrAccountantOrManager ||
        true
      );
    }

    if (creatorRole.includes("Super-Admin")) {
      return isHRorAccountant;
    }

    if (creatorRole.includes("Manager")) {
      return isHRorSuperAdmin;
    }
    if (creatorRole.includes("HR")) {
      return isSuperAdminOrAccountantOrManager;
    }
    if (creatorRole.includes("Accountant")) {
      return isHRorManagerSuperAdmin;
    }
    return true;
  };

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

  //page
  const handleActionClick = useCallback((actionDetails) => {
    console.log("Action details received:", actionDetails);
    setSelectedExpense(null);
    setPendingAction({
      ...actionDetails,
      expenseId: actionDetails.expense._id || actionDetails.expense.expenseId,
    });
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
      return response.data.reports;
    }
  );

  const { data: approvalSettings } = useQuery(
    ["approval-settings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organisation/${organisationId}/approval-settings`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    }
  );

  const firstLevelMutation = useMutation(
    async ({ reportId, expenseId, action }) => {
      console.log("Making API call with:", { reportId, expenseId, action });

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/first-level`,
          {
            action,
            reason: modalState.actionReason,
          },
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error(
          "API Call Failed:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    {
      onSuccess: async (response) => {
        console.log("First level approval success:", response);
        await queryClient.invalidateQueries("pendingExpenses");
        handleAlert(
          true,
          "success",
          "First level approval updated successfully"
        );
        setModalState({ isOpen: false, actionReason: "" });
        setPendingAction(null);
      },
      onError: (error) => {
        console.error("Mutation Error:", error.message || error);
        handleAlert(
          true,
          "error",
          error.response?.data?.error || "Failed to update approval"
        );
      },
    }
  );

  //eve
  const finalLevelMutation = useMutation(
    async ({ reportId, expenseId, action, reason }) => {
      console.log("Attempting API call with:", {
        reportId,
        expenseId,
        action,
        reason,
      });

      try {
        console.log("Making API call...");
        const response = await axios.patch(
          `${process.env.REACT_APP_API}/route/expense/report/${reportId}/expense/${expenseId}/final-approval`,
          {
            action,
            reason,
            finalApprovalReason: reason,
          },
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error(
          "API Call Failed:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    {
      onSuccess: async () => {
        console.log("Final approval updated successfully");
        await queryClient.invalidateQueries("pendingExpenses");
        handleAlert(true, "success", "Final approval updated successfully");
        setModalState({ isOpen: false, actionReason: "" });
        setPendingAction(null);
      },
      onError: (error) => {
        console.error("Mutation Error:", error.message || error);
        handleAlert(
          true,
          "error",
          error.message || "Failed to update approval"
        );
      },
    }
  );

  // // Handler Functions
  // const handleFirstLevelApproval = (reportId, expenseId, action) => {
  //   firstLevelMutation.mutate({ reportId, expenseId, action });
  // };

  // const handleFinalApproval = (reportId, expenseId, action) => {
  //   finalLevelMutation.mutate({ reportId, expenseId, action });
  // };

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

  // const handleModalSubmit = useCallback(() => {

  //   console.log('Modal state when submitting:', modalState);
  // console.log('Pending action:', pendingAction);
  //   if (!modalState.actionReason?.trim()) {
  //     handleAlert(true, "error", "Reason is required");
  //     return;
  //   }

  //   const mutationData = {
  //     reportId: pendingAction.reportId,
  //     expenseId: pendingAction.expenseId,
  //     action: pendingAction.action,
  //     reason: modalState.actionReason
  //   };
  //   console.log('Mutation data being sent:', mutationData);
  //   const mutation = pendingAction.level === "first" ? firstLevelMutation : finalLevelMutation;

  //   mutation.mutate(mutationData, {
  //     // onSuccess: () => {
  //     //   // console.log('Mutation success response:', response);
  //     //   queryClient.invalidateQueries("pendingExpenses");
  //     //   handleAlert(true, "success", `${pendingAction.action} successfully`);
  //     //   setModalState({ isOpen: false, actionReason: '' });
  //     //   setSelectedExpense(pendingAction.expense);
  //     //   setPendingAction(null);
  //     // }
  //     onSuccess: async (response) => {
  //       console.log('Mutation success response:', response);

  //       try {
  //         await queryClient.invalidateQueries("pendingExpenses");
  //         await queryClient.refetchQueries("pendingExpenses");

  //         handleAlert(true, "success", `${pendingAction.action} successfully`);

  //         setModalState({ isOpen: false, actionReason: '' });
  //         setSelectedExpense(pendingAction.expense);
  //         setPendingAction(null);
  //       } catch (error) {
  //         console.log('Query refresh error:', error);
  //         handleAlert(true, "error", "Error refreshing expense data");
  //       }
  //     }

  //   });
  // }, [modalState.actionReason, pendingAction, firstLevelMutation, finalLevelMutation,handleAlert]);

  // Update the payment mutation to use expenseId instead of reportId

  // const handleModalSubmit = useCallback(() => {
  //   console.log('Modal state when submitting:', modalState);
  //   console.log('Pending action:', pendingAction);

  //   if (!modalState.actionReason?.trim()) {
  //     handleAlert(true, "error", "Reason is required");
  //     return;
  //   }
  //  // Add validation for expenseId
  //  if (!pendingAction.expenseId) {
  //   handleAlert(true, "error", "Invalid expense ID");
  //   return;
  // }

  //   const mutationData = {
  //     reportId: pendingAction.reportId,
  //     expenseId: pendingAction.expenseId,
  //     action: pendingAction.action,
  //     reason: modalState.actionReason
  //   };
  //   console.log('Submitting mutation with:', mutationData);

  //   const mutation = pendingAction.level === "first" ? firstLevelMutation : finalLevelMutation;

  //   mutation.mutate(mutationData, {
  //     onSuccess: async (response) => {
  //       console.log('Mutation success response:', response);

  //       try {
  //         await queryClient.invalidateQueries("pendingExpenses");
  //         await queryClient.refetchQueries("pendingExpenses");

  //         handleAlert(true, "success", `${pendingAction.action} successfully`);

  //         setModalState({ isOpen: false, actionReason: '' });
  //         setSelectedExpense(pendingAction.expense);
  //         setPendingAction(null);
  //       } catch (error) {
  //         console.log('Query refresh error:', error);
  //         handleAlert(true, "error", "Error refreshing expense data");
  //       }
  //     }
  //   });
  // }, [modalState.actionReason, pendingAction, firstLevelMutation, finalLevelMutation]);

  //page'
  const handleModalSubmit = useCallback(() => {
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

    console.log("Submitting approval with data:", mutationData);

    if (pendingAction.level === "first") {
      firstLevelMutation.mutate(mutationData);
    } else {
      finalLevelMutation.mutate(mutationData);
    }
  }, [
    modalState.actionReason,
    pendingAction,
    firstLevelMutation,
    finalLevelMutation,
  ]);

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
    }
  );

  // Update the handlePayment function
  const handlePayment = async () => {
    if (paymentMethod === "MANUAL_PAYMENT") {
      try {
        const response = await paymentMutation.mutateAsync({
          expenseId: selectedExpense._id, // Use expenseId instead of reportId
          data: { paymentMethod },
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: selectedExpense.totalAmount * 100,
          currency: "INR",
          name: "AEGIS Expense Payment",
          description: `Payment for ${selectedExpense.reportName}`,
          order_id: response.data.order.id,
          prefill: {
            name: response.data.employeeDetails.name,
            account_number: response.data.employeeDetails.accountNo,
          },
          handler: async (paymentResponse) => {
            await axios.post(
              `${process.env.REACT_APP_API}/route/expense/${selectedExpense._id}/verify-payment`,
              paymentResponse,
              { headers: { Authorization: authToken } }
            );
            handleAlert(true, "success", "Payment completed successfully");
            queryClient.invalidateQueries("pendingExpenses");
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        handleAlert(true, "error", "Failed to initiate payment");
      }
    } else {
      paymentMutation.mutate({
        expenseId: selectedExpense._id, // Use expenseId instead of reportId
        data: {
          paymentMethod,
          payrollMonth,
        },
      });
    }
  };

  // Fetch categories data
  const { data: categoriesData } = useQuery(
    ["expenseCategories", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/categories/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  // Fetch approvers data
  const { data: approversData } = useQuery(
    ["expenseApprovers", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/approvers/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  const categoryOptions =
    categoriesData?.categories?.map((cat) => ({
      label: cat.name,
      value: cat._id,
    })) || [];

  const approverOptions =
    approversData?.data?.approvers?.map((app) => ({
      label: app.name,
      value: app.id,
    })) || [];

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

  // Filter and Search Functions
  const handleResetFilters = () => {
    setFilters({
      dateRange: "",
      approver: "",
      status: "",
      department: "",
      startDate: "",
      endDate: "",
      category: "",
      approverId: "",
    });
    setFilter("");
    setSelectedExpenses([]);
  };

  const filterExpenses = (expenses) => {
    if (!expenses) return [];

    return expenses.filter((expense) => {
      const matchesSearch =
        filter === "" ||
        expense.reportName?.toLowerCase().includes(filter.toLowerCase()) ||
        expense.expenseName?.toLowerCase().includes(filter.toLowerCase()) ||
        expense.employeeInfo?.[0]?.first_name
          ?.toLowerCase()
          .includes(filter.toLowerCase());

      // const matchesStatus =
      //   !filters.status ||
      //   expense.status === filters.status ||
      //   expense.expenses?.some(
      //     (exp) =>
      //       exp.firstLevelStatus === filters.status ||
      //       exp.finalStatus === filters.status
      //   );

      const matchesStatus =
        !filters.status ||
        (() => {
          if (expense.isReport) {
            // For reports, check payment status first
            if (filters.status === "PAYROLL" || filters.status === "PAID") {
              return expense.paymentStatus === filters.status;
            }
            // Then check expense statuses
            return expense.expenses?.some(
              (exp) =>
                exp.firstLevelStatus === filters.status ||
                exp.finalStatus === filters.status
            );
          } else {
            // For single expenses
            if (filters.status === "PAYROLL" || filters.status === "PAID") {
              return expense.paymentStatus === filters.status;
            }
            return (
              expense.firstLevelStatus === filters.status ||
              expense.finalStatus === filters.status
            );
          }
        })();

      const matchesCategory =
        !filters.category ||
        expense.category === filters.category ||
        expense.expenses?.some((exp) => exp.category === filters.category);

      const matchesApprover =
        !filters.approverId || expense.approverId === filters.approverId;

      const matchesDateRange =
        !filters.dateRange ||
        (() => {
          const expenseDate = new Date(expense.createdAt);
          const today = new Date();
          const days = parseInt(filters.dateRange);
          const rangeStart = new Date(today.setDate(today.getDate() - days));
          return expenseDate >= rangeStart;
        })();

      const matchesCustomRange =
        !filters.startDate ||
        !filters.endDate ||
        (() => {
          const expenseDate = new Date(expense.createdAt);
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
          return expenseDate >= start && expenseDate <= end;
        })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesApprover &&
        (matchesDateRange || matchesCustomRange)
      );
    });
  };

  // Expense Report Details Modal
  const ExpenseDetailsModal = () => {
    if (!selectedExpense) return null;

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

          {/* Details Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4">
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
                  <div>
                    <span className="font-medium">Employee ID:</span>{" "}
                    {selectedExpense.employeeDetails?.empId ||
                      selectedExpense.employeeInfo?.[0]?.empId ||
                      "N/A"}
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
           selectedExpense.employeeInfo?.[0]?.designation?.name || 'N/A'}
        </div> */}
                  {/* <div>
      <span className="font-medium">Designation:</span>{" "}
     
      {(Array.isArray(selectedExpense.employeeDetails?.designation) && 
        selectedExpense.employeeDetails.designation.length > 0) ? 
       
        (typeof selectedExpense.employeeDetails.designation[0] === 'object' ? 
          selectedExpense.employeeDetails.designation[0].name : 
          'Designation ID: ' + selectedExpense.employeeDetails.designation[0]) : 
       
        (typeof selectedExpense.employeeDetails?.designation === 'object' ? 
          selectedExpense.employeeDetails.designation.name : 
          selectedExpense.employeeDetails?.designation || 
          selectedExpense.employeeInfo?.[0]?.designation?.name || 
          'N/A')}
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
                  {/* <div>
                    <span className="font-medium">Created By:</span>{" "}
                    {selectedExpense.employeeInfo?.[0]?.first_name}{" "}
                    {selectedExpense.employeeInfo?.[0]?.last_name}
                  </div> */}
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedExpense.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Approval History Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Approval History</h3>
                {selectedExpense.expenses?.map((expense, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <div className="font-medium">{expense.expenseName}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <div className="text-sm">
                          First Level:{" "}
                          <StatusBadge status={expense.firstLevelStatus} />
                        </div>
                        {expense.firstLevelApprovedBy && (
                          <div className="text-sm text-gray-600">
                            {/* By:{" "} */}
                            {selectedExpense.employeeInfo?.find(
                              (emp) => emp._id === expense.firstLevelApprovedBy
                            )?.first_name || ""}
                            {selectedExpense.employeeInfo?.find(
                              (emp) => emp._id === expense.firstLevelApprovedBy
                            )?.last_name || ""}
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
                      {approvalSettings?.approvalFlow?.requireSecondLevel && (
                        <div>
                          <div className="text-sm">
                            Final Level:{" "}
                            <StatusBadge status={expense.finalStatus} />
                          </div>

                          {expense.finalApprovedBy && (
                            <div className="text-sm text-gray-600">
                              {/* By: {expense.finalApprovedBy.first_name}{" "}
                            {expense.finalApprovedBy.last_name} */}
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
          {activeTab === "expenses" && (
            <div className="space-y-4">
              {selectedExpense.expenses.map((expense) => (
                <div key={expense.expenseId} className="border p-4 rounded-lg">
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
                      {/* {(approvalSettings?.approvalFlow?.requireSecondLevel || expense.finalStatus !== "PENDING") && ( */}
                      {approvalSettings?.approvalFlow?.requireSecondLevel && (
                        <StatusBadge status={expense.finalStatus} />
                      )}
                    </div>
                  </div>

                  {/* Approval Actions */}
                  <div className="mt-4 flex justify-end space-x-2">
                    {renderApprovalButtons(expense, selectedExpense._id)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Tab Content */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Processing</h3>
              {selectedExpense.isReport ? (
                // selectedExpense.expenses.every(
                //   (exp) =>
                //     exp.firstLevelStatus === "APPROVED" &&
                //     exp.finalStatus === "APPROVED"

                // ) ? (
                selectedExpense.expenses.every((exp) => {
                  // Check if expense is approved based on approval settings
                  const isApproved = approvalSettings?.approvalFlow
                    ?.requireSecondLevel
                    ? exp.firstLevelStatus === "APPROVED" &&
                      exp.finalStatus === "APPROVED"
                    : exp.firstLevelStatus === "APPROVED";
                  return isApproved;
                }) ? (
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
                    {/* All expenses in the report must be approved at both levels
                    before processing payment */}
                    {approvalSettings?.approvalFlow?.requireSecondLevel
                      ? "All expenses in the report must be approved at both levels before processing payment"
                      : "All expenses in the report must be approved before processing payment"}
                  </div>
                )
              ) : (
                <div className="text-yellow-600">
                  {approvalSettings?.approvalFlow?.requireSecondLevel
                    ? "Expense must be approved at both levels before processing payment"
                    : "Expense must be approved before processing payment"}
                </div>
              )}
            </div>
          )}
        </div>
      </ReusableModal>
    );
  };

  const renderApprovalButtons = (expense, reportId) => {
    // Add validation
    if (!expense?.expenseId) {
      console.log("Missing expenseId:", expense);
      return null;
    }

    const isCreatorSuperAdmin = selectedExpense.employeeInfo
      ?.find((emp) => emp._id === selectedExpense.createdBy)
      ?.profile?.includes("Super-Admin");

    const creatorRole =
      selectedExpense.employeeInfo?.find(
        (emp) => emp._id === selectedExpense.createdBy
      )?.profile || [];

    //approval-settings
    // const requiresSecondLevel = approvalSettings?.requireSecondLevel;
    const requiresSecondLevel =
      approvalSettings?.approvalFlow?.requireSecondLevel;

    // If second level not required and first level approved, show existing payment UI
    // if (!requiresSecondLevel && expense.firstLevelStatus === "APPROVED") {
    //   return (
    //     <div className="space-y-4">
    //       <select
    //         value={paymentMethod}
    //         onChange={(e) => setPaymentMethod(e.target.value)}
    //         className="w-full p-2 border rounded-md"
    //       >
    //         <option value="">Select Payment Method</option>
    //         <option value="PAYROLL">Add to Payroll</option>
    //         <option value="MANUAL_PAYMENT">Manual Payment</option>
    //         <option value="CLOSED">Mark as Closed</option>
    //       </select>

    //       {paymentMethod === "PAYROLL" && (
    //         <input
    //           type="month"
    //           value={payrollMonth}
    //           onChange={(e) => setPayrollMonth(e.target.value)}
    //           className="w-full p-2 border rounded-md"
    //         />
    //       )}

    //       <button
    //         onClick={handlePayment}
    //         className="w-full p-2 bg-primary text-white rounded-md"
    //         disabled={!paymentMethod || (paymentMethod === "PAYROLL" && !payrollMonth)}
    //       >
    //         {paymentMutation.isLoading ? "Processing..." : "Process Payment"}
    //       </button>
    //     </div>
    //   );
    // }

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
        // approval-settings
        requiresSecondLevel={requiresSecondLevel}
      />
    );
  };

  const handleExport = () => {
    if (!pendingApprovals?.length) {
      handleAlert(false, "warning", "No data to export");
      return;
    }

    const filteredData = pendingApprovals;
    const expensesToExport =
      selectedExpenses.length > 0
        ? filteredData.filter((exp) => selectedExpenses.includes(exp._id))
        : filteredData;

    const csvData = [
      ["AEGIS Expense Report", "", "", "", "", "", "", ""],
      [
        `Generated on: ${new Date().toLocaleString()}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["Filters Applied:", "", "", "", "", "", "", ""],
      [`Status: ${filters.status || "All"}`, "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      [
        "Report Name",
        "Employee",
        "Type",
        "Total Amount",
        "First Level Status",
        "Final Status",
        "Created Date",
        "Payment Status",
      ],
      ...expensesToExport.map((report) => [
        report.reportName || report.expenseName,
        `${report.employeeInfo?.[0]?.first_name} ${report.employeeInfo?.[0]?.last_name}`,
        report.isReport
          ? `Report (${report.expenses?.length} expenses)`
          : "Single Expense",
        report.totalAmount || report.amount,
        report.isReport
          ? report.expenses.map((exp) => exp.firstLevelStatus).join(", ")
          : report.firstLevelStatus,
        report.isReport
          ? report.expenses.map((exp) => exp.finalStatus).join(", ")
          : report.finalStatus,
        new Date(report.createdAt).toLocaleDateString(),
        report.paymentStatus || "N/A",
      ]),
    ];

    const blob = new Blob([csvData.map((row) => row.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `AEGIS_Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleAlert(true, "success", "Expense report generated successfully");
  };

  if (role === "Employee") {
    return <EmployeeReports />;
  }

  // Main Return/Render Section
  return (
    <BoxComponent>
      <div className="flex flex-col w-full">
        <HeadingOneLineInfo
          heading="Manage Expenses"
          info="Review and manage expense reports and submissions"
        />
        <ExpenseStats />
        <br />
        {/* 
        
        {/* euu bg */}
        <div className="bg-white p-4">
          <div className="  flex justify-between items-center mb-6">
            {/* euu left */}
            <div className="">
              <h1 className="text-2xl font-bold text-gray-800">
                Expense Analytics table
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor expense metrics, approvals, and financial trends in
                real-time
              </p>
            </div>

            {/* euu right */}
            <div className="flex gap-4">
              {/* <select
          value={approvalLevel}
          onChange={(e) => setApprovalLevel(e.target.value)}
          className="form-select rounded-md border border-gray-300 py-2 px-4 bg-white text-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
        >
          <option value="first">First Level Approval</option>
          <option value="final">Final Level Approval</option>
        </select> */}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <TuneIcon className="w-4 h-4" />
                Filters
              </button>

              <Button
                disabled={pendingApprovals?.length === 0}
                onClick={handleExport}
                startIcon={<DownloadIcon />}
                variant="contained"
              >
                Export{" "}
                {selectedExpenses.length > 0
                  ? `Selected (${selectedExpenses.length})`
                  : "All"}
              </Button>
            </div>
          </div>

          {/* euu filter  */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  {/* <Select
                    options={[
                      { value: "7", label: "Last 7 days" },
                      { value: "30", label: "Last 30 days" },
                      { value: "90", label: "Last 90 days" },
                      { value: "custom", label: "Custom Range" },
                    ]}
                    value={{
                      value: filters.dateRange,
                      label: filters.dateRange,
                    }}
                    onChange={(opt) =>
                      setFilters((prev) => ({ ...prev, dateRange: opt?.value }))
                    }
                    isClearable
                    placeholder="Select Date Range"
                  /> */}
                  <Select
                    options={[
                      { value: "7", label: "Last 7 days" },
                      { value: "30", label: "Last 30 days" },
                      { value: "90", label: "Last 90 days" },
                      // { value: "custom", label: "Custom Range" },
                    ]}
                    value={
                      filters.dateRange
                        ? [
                            { value: "7", label: "Last 7 days" },
                            { value: "30", label: "Last 30 days" },
                            { value: "90", label: "Last 90 days" },
                          ].find((opt) => opt.value === filters.dateRange)
                        : null
                    }
                    onChange={(opt) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: opt?.value || null,
                      }))
                    }
                    isClearable
                    placeholder="Select Date Range"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {/* <Select
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "APPROVED", label: "Approved" },
                      { value: "REJECTED", label: "Rejected" },
                      { value: "PAYROLL", label: "payroll" },
                      { value: "PAID", label: "paid" },
                    ]}
                    value={{ value: filters.status, label: filters.status }}
                    onChange={(opt) =>
                      setFilters((prev) => ({ ...prev, status: opt?.value }))
                    }
                    isClearable
                    placeholder="Select Status"         
                     className="basic-select"
                    classNamePrefix="select"
                  /> */}
                  <Select
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "APPROVED", label: "Approved" },
                      { value: "REJECTED", label: "Rejected" },
                      { value: "PAYROLL", label: "Payroll" },
                      { value: "PAID", label: "Paid" },
                    ]}
                    value={
                      filters.status
                        ? [
                            { value: "PENDING", label: "Pending" },
                            { value: "APPROVED", label: "Approved" },
                            { value: "REJECTED", label: "Rejected" },
                            { value: "PAYROLL", label: "Payroll" },
                            { value: "PAID", label: "Paid" },
                          ].find((opt) => opt.value === filters.status)
                        : null
                    }
                    // onChange={(opt) =>
                    //   setFilters((prev) => ({ ...prev, status: opt?.value || null }))
                    // }
                    onChange={(opt) => {
                      setFilters((prev) => ({
                        ...prev,
                        status: opt?.value || null,
                      }));
                    }}
                    isClearable
                    placeholder="Select Status"
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select
                    options={categoryOptions}
                    // value={{ value: filters.category, label: filters.category }}
                    value={
                      filters.category !== ""
                        ? categoryOptions.find(
                            (opt) => opt.value === filters.category
                          )
                        : ""
                    }
                    onChange={(opt) =>
                      setFilters((prev) => ({ ...prev, category: opt?.value }))
                    }
                    isClearable
                    placeholder="Select Category"
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div>

                {/* ✅commit and remove approver from filters */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approver
                  </label>
                  <Select
                    options={approverOptions}
                    value={   
                      filters.approverId !== "" ?
                      approverOptions.find(
                      (opt) => opt.value === filters.approverId
                    ) :""}


                    onChange={(opt) =>
                      setFilters((prev) => ({
                        ...prev,
                        approverId: opt?.value,
                      }))
                    }
                    isClearable
                         placeholder="Select Approver"
                    className="basic-select"
                    classNamePrefix="select"
                  />
                </div> */}
                {/* ✅commit and remove custom data range from filters */}
                {/* {filters.dateRange === "custom" && (
                  <>
                    <input
                      type="date"
                      className="form-input rounded-md"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="date"
                      className="form-input rounded-md"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </>
                )} */}
              </div>
              <div className="mt-4">
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  startIcon={<TuneIcon />}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {/* euu search  */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by expense name or employee..."
              className="w-full p-2 border rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600 rounded"
                        checked={
                          pendingApprovals?.length > 0 &&
                          selectedExpenses.length === pendingApprovals.length
                        }
                        onChange={(e) => {
                          setSelectedExpenses(
                            e.target.checked
                              ? pendingApprovals.map((exp) => exp._id)
                              : []
                          );
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>

                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
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
                  {/* {pendingApprovals?.map((report) => ( */}
                  {filterExpenses(pendingApprovals)?.map((report) => (
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="form-checkbox text-indigo-600 rounded"
                          checked={selectedExpenses.includes(report._id)}
                          onChange={(e) => {
                            setSelectedExpenses((prev) =>
                              e.target.checked
                                ? [...prev, report._id]
                                : prev.filter((id) => id !== report._id)
                            );
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.reportName || report.expenseName}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {report.employeeInfo?.[0]?.first_name}{" "}
                        {report.employeeInfo?.[0]?.last_name}
                      </td> */}

                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.employeeDetails?.name || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.isReport
                          ? `Report (${report.expenses?.length || 0} expenses)`
                          : "Single Expense"}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {report.isReport
                          ? "Multiple"
                          : categoryOptions.find(
                              (cat) => cat.value === report.category
                            )?.label}
                      </td> */}

                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{report.totalAmount || report.amount || 0}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {report.isReport ? (
                            // For reports with multiple expenses
                            <>
                              {(() => {
                                const allApproved = report.expenses.every(
                                  (expense) =>
                                    expense.firstLevelStatus === "APPROVED" &&
                                    expense.finalStatus === "APPROVED"
                                );
                                const allRejected = report.expenses.every(
                                  (expense) =>
                                    expense.firstLevelStatus === "REJECTED" ||
                                    expense.finalStatus === "REJECTED"
                                );
                                const anyPending = report.expenses.some(
                                  (expense) =>
                                    expense.firstLevelStatus === "PENDING" ||
                                    expense.finalStatus === "PENDING"
                                );
                                const anyApproved = report.expenses.some(
                                  (expense) =>
                                    expense.firstLevelStatus === "APPROVED" ||
                                    expense.finalStatus === "APPROVED"
                                );

                                // Determine the overall status
                                let status;
                                if (allApproved) {
                                  status = "APPROVED";
                                } else if (allRejected) {
                                  status = "REJECTED";
                                } else if (anyPending && anyApproved) {
                                  status = "PARTIALLY APPROVED";
                                } else if (anyPending) {
                                  status = "PENDING";
                                } else {
                                  status = "UNKNOWN";
                                }

                                // Check if payment is pending for approved reports
                                if (
                                  status === "APPROVED" &&
                                  report.paymentStatus === "CLOSED"
                                ) {
                                  // If payment is closed, show APPROVED
                                  status = "APPROVED";
                                } else if (
                                  status === "APPROVED" &&
                                  (!report.paymentStatus ||
                                    (report.paymentStatus !== "PAYROLL" &&
                                      report.paymentStatus !== "PAID"))
                                ) {
                                  // If payment is pending, show PAYMENT PENDING
                                  status = "PAYMENT PENDING";
                                }

                                return <StatusBadge status={status} />;
                              })()}
                              {report.paymentStatus && (
                                <div className="text-sm">
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
                          ) : (
                            // For single expenses
                            <>
                              <div className="text-sm">
                                First Level:{" "}
                                <StatusBadge
                                  status={report.firstLevelStatus || "PENDING"}
                                />
                              </div>
                              <div className="text-sm">
                                Final Level:{" "}
                                <StatusBadge
                                  status={report.finalStatus || "PENDING"}
                                />
                              </div>
                              {report.finalStatus === "APPROVED" &&
                                (report.paymentStatus === "CLOSED" ? (
                                  <div className="text-sm">
                                    Payment: <StatusBadge status="CLOSED" />
                                  </div>
                                ) : !report.paymentStatus ||
                                  (report.paymentStatus !== "PAYROLL" &&
                                    report.paymentStatus !== "PAID") ? (
                                  <div className="text-sm">
                                    Payment:{" "}
                                    <StatusBadge status="PAYMENT PENDING" />
                                  </div>
                                ) : (
                                  <div className="text-sm">
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
                                ))}
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
            // </div>
          )}
        </div>

        <ExpenseDetailsModal />
        {/* <ReasonModal /> */}
        {/* <ReasonModal 
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          actionReason={modalState.actionReason}
          setActionReason={handleReasonChange}
          pendingAction={pendingAction}
          onSubmit={handleModalSubmit}
        /> */}

        <ReasonModal
          isOpen={modalState.isOpen}
          onClose={() => {
            setModalState({ isOpen: false, actionReason: "" });
            setPendingAction(null);
          }}
          actionReason={modalState.actionReason}
          setActionReason={(value) =>
            setModalState((prev) => ({ ...prev, actionReason: value }))
          }
          pendingAction={pendingAction}
          onSubmit={handleModalSubmit}
        />
      </div>
    </BoxComponent>
  );
};

export default ManageExpense;
