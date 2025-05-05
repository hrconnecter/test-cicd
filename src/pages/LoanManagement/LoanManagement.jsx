/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import { Cancel, CheckCircle, Error, Info, Pending } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import CreateLoanMgtModal from "../../components/Modal/ModalForLoanAdvanceSalary/CreateLoanMgtModal";
import EditLoanModal from "../../components/Modal/ModalForLoanAdvanceSalary/EditLoanModal";
import UserProfile from "../../hooks/UserData/useUser";
import LoanManagementPieChart from "./LoanManagementPieChart";
import LoanManagementSkeleton from "./LoanManagementSkeleton";
const LoanManagement = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user._id;
  const organisationId = user.organizationId;

  const isHRorSA =
    user.profile.includes("HR") || user.profile.includes("Super-Admin");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: getEmployeeLoanData, isLoading } = useQuery(
    ["loanDatas", organisationId],
    async () => {
      const endpoint = isHRorSA
        ? `${process.env.REACT_APP_API}/route/organization/${organisationId}/all-loans`
        : `${process.env.REACT_APP_API}/route/organization/${organisationId}/all-loans`;
      // : `${process.env.REACT_APP_API}/route/organization/${organisationId}/${userId}/get-loan-data`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data.data;
    }
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const calculateLoanStatus = (loan) => {
    const currentDate = new Date();
    const loanStartingDate = loan?.loanDisbursementDate
      ? new Date(loan.loanDisbursementDate)
      : null;
    const loanEndingDate = loan?.loanCompletedDate
      ? new Date(loan.loanCompletedDate)
      : null;
    const loanAmount = loan?.totalDeductionWithSi;
    const totalDeductionPerMonth = loan?.totalDeduction;

    let loanAmountPaid = 0;
    let loanAmountPending = loanAmount;

    if (!loanStartingDate || !loanEndingDate || !totalDeductionPerMonth) {
      return { loanAmountPaid, loanAmountPending };
    }

    if (currentDate >= loanStartingDate && currentDate <= loanEndingDate) {
      const elapsedMonths =
        (currentDate.getFullYear() - loanStartingDate.getFullYear()) * 12 +
        currentDate.getMonth() -
        loanStartingDate.getMonth() +
        1;
      loanAmountPaid = Math.min(
        loanAmount,
        totalDeductionPerMonth * elapsedMonths
      );
      loanAmountPending = loanAmount - loanAmountPaid;
    }

    let currentDateToCheck = new Date(loanStartingDate);
    while (
      currentDateToCheck <= loanEndingDate &&
      currentDateToCheck <= currentDate
    ) {
      loanAmountPaid = totalDeductionPerMonth;
      loanAmountPending = loanAmount - loanAmountPaid;
      currentDateToCheck.setMonth(currentDateToCheck.getMonth() + 1);
    }

    return { loanAmountPaid, loanAmountPending };
  };

  const [selectedLoans, setSelectedLoans] = useState([]);
  const [showPieChart, setShowPieChart] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loan, setLoan] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    let paidAmount = 0;
    let pendingAmount = 0;

    selectedLoans.forEach((selectedLoan) => {
      const { loanAmountPaid, loanAmountPending } =
        calculateLoanStatus(selectedLoan);
      paidAmount += loanAmountPaid;
      pendingAmount += loanAmountPending;
    });

    setTotalPaidAmount(paidAmount);
    setTotalPendingAmount(pendingAmount);
  }, [selectedLoans]);

  const handleCheckboxChange = (loan) => {
    if (selectedLoans.includes(loan)) {
      setSelectedLoans(
        selectedLoans.filter((selectedLoan) => selectedLoan !== loan)
      );
      setShowPieChart(false);
    } else {
      setSelectedLoans([...selectedLoans, loan]);
      setShowPieChart(true);
    }
  };

  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleEditModalOpen = (loan) => {
    setEditModalOpen(true);
    setLoan(loan);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setLoan(null);
  };
  const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
  const handleCloseConfirmation = () => setDeleteConfirmation(null);

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-loan-data/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("loanDatas");
        handleAlert(true, "success", "Loan data deleted successfully");
      },
    }
  );

  const filteredLoanData = getEmployeeLoanData?.filter((loan) =>
    statusFilter === "all" ? true : loan.status === statusFilter
  );

  return (
    <>
      <BoxComponent>
        <div className="flex items-center justify-between">
          <HeadingOneLineInfo
            heading={"Loan Management"}
            info={"Manage the loan here."}
          />
          {/* <BasicButton
            color={"primary"}
            onClick={handleCreateModalOpen}
            title={"Apply For Loan"}
          /> */}
        </div>

        <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
          {isHRorSA && (
            <div className="flex gap-2 p-4 border-b w-full">
              <Button
                variant={statusFilter === "all" ? "contained" : "outlined"}
                onClick={() => setStatusFilter("all")}
              >
                All Loans
              </Button>
              <Button
                variant={statusFilter === "Pending" ? "contained" : "outlined"}
                onClick={() => setStatusFilter("Pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "Ongoing" ? "contained" : "outlined"}
                onClick={() => setStatusFilter("Ongoing")}
              >
                Ongoing
              </Button>
            </div>
          )}

          {isLoading ? (
            <LoanManagementSkeleton />
          ) : filteredLoanData?.length > 0 ? (
            <div className="flex w-full scrolling">
              <div className="overflow-auto scrolling p-0 border border-gray-200">
                <table className="min-w-full bg-white text-left text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="font-semibold">
                      <th scope="col" className="px-3 py-3"></th>
                      <th scope="col" className="text-left pl-6 py-3">
                        SR NO
                      </th>
                      {isHRorSA && (
                        <th scope="col" className="px-6 py-3">
                          Employee Name
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3">
                        Loan Status
                      </th>
                      <th scope="col" className="px-8 py-3">
                        Loan Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Loan Amount Applied
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total Loan Amount
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Loan Amount Paid Monthly
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Loan Amount Pending
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total Deduction Monthly
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ROI (%)
                      </th>
                      <th scope="col" className="px-8 py-3">
                        Disbursement Date
                      </th>
                      <th scope="col" className="px-8 py-3">
                        Completion Date
                      </th>
                      {/* <th scope="col" className="px-8 py-3">Edit</th> */}
                      {/* {filteredLoanData?.some(loan => loan.status === "Pending") && (
      <th scope="col" className="px-8 py-3">Edit</th>
    )} */}

                      {filteredLoanData?.some(
                        (loan) => loan.status === "Pending"
                      ) ? (
                        <th scope="col" className="px-8 py-3">
                          Edit
                        </th>
                      ) : (
                        <th scope="col" className="px-8 py-3"></th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoanData.map((loanMgtData, id) => {
                      const { loanAmountPaid, loanAmountPending } =
                        calculateLoanStatus(loanMgtData);
                      return (
                        <tr className="font-medium border-b" key={id}>
                          <td className="py-3 pl-3">
                            <input
                              type="checkbox"
                              checked={selectedLoans.includes(loanMgtData)}
                              onChange={() => handleCheckboxChange(loanMgtData)}
                            />
                          </td>
                          <td className="text-left pl-6 py-3">{id + 1}</td>
                          {isHRorSA && (
                            <td className="py-3 pl-6">
                              {`${loanMgtData.userId?.first_name || ""} ${
                                loanMgtData.userId?.last_name || ""
                              }`}
                            </td>
                          )}
                          <td className="text-left leading-7 text-[16px] w-[200px]">
                            {loanMgtData.status === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <Pending className="text-yellow-400" />
                                <span className="text-yellow-400">Pending</span>
                              </div>
                            ) : loanMgtData.status === "Ongoing" ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-400" />
                                <span className="text-green-400">Ongoing</span>
                              </div>
                            ) : loanMgtData.status === "Rejected" ? (
                              <div className="flex items-center gap-2">
                                <Cancel className="text-red-400" />
                                <span className="text-red-400">Rejected</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Error className="text-gray-400" />
                                <span className="text-gray-400">
                                  {loanMgtData.status}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData.loanType?.loanName}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData?.loanAmount}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData?.totalDeductionWithSi}
                          </td>
                          <td className="py-3 pl-6">{loanAmountPaid}</td>
                          <td className="py-3 pl-6">{loanAmountPending}</td>
                          <td className="py-3 pl-6">
                            {loanMgtData?.totalDeduction}
                          </td>
                          <td className="py-3 pl-6">
                            {loanMgtData?.rateOfIntereset}
                          </td>
                          <td className="py-3 pl-6">
                            {formatDate(loanMgtData?.loanDisbursementDate) ||
                              ""}
                          </td>
                          <td className="py-3 pl-6">
                            {formatDate(loanMgtData?.loanCompletedDate) || ""}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2">
                            {loanMgtData.status === "Pending" && (
                              <>
                                <IconButton
                                  color="primary"
                                  aria-label="edit"
                                  onClick={() =>
                                    handleEditModalOpen(loanMgtData)
                                  }
                                >
                                  <EditOutlinedIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleDeleteConfirmation(loanMgtData?._id)
                                  }
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Apply Loan</h1>
              </article>
              <p>No loan found. add the loan.</p>
            </section>
          )}
        </article>

        {showPieChart && (
          <LoanManagementPieChart
            totalPaidAmount={totalPaidAmount}
            totalPendingAmount={totalPendingAmount}
          />
        )}
      </BoxComponent>

      <CreateLoanMgtModal
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        organisationId={organisationId}
      />

      <EditLoanModal
        handleClose={handleEditModalClose}
        open={editModalOpen}
        organisationId={organisationId}
        loan={loan}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this loan data, as this
            action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoanManagement;

/* eslint-disable no-unused-vars */
// import { Cancel, CheckCircle, Error, Info, Pending } from "@mui/icons-material";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { TestContext } from "../../State/Function/Main";
// import { UseContext } from "../../State/UseState/UseContext";
// import BasicButton from "../../components/BasicButton";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import CreateLoanMgtModal from "../../components/Modal/ModalForLoanAdvanceSalary/CreateLoanMgtModal";
// import EditLoanModal from "../../components/Modal/ModalForLoanAdvanceSalary/EditLoanModal";
// import UserProfile from "../../hooks/UserData/useUser";
// import LoanManagementPieChart from "./LoanManagementPieChart";
// import LoanManagementSkeleton from "./LoanManagementSkeleton";

// const LoanManagement = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const userId = user._id;
//   const organisationId = user.organizationId;

//   const [statusFilter, setStatusFilter] = useState("all");

//   const { data: getEmployeeLoanData, isLoading } = useQuery(
//     ["loanDatas", organisationId],
//     async () => {
//       const endpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/all-loans`;

//       const response = await axios.get(endpoint, {
//         headers: {
//           Authorization: authToken,
//         },
//       });
//       return response.data.data;
//     }
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toDateString();
//   };

//   const calculateLoanStatus = (loan) => {
//     const currentDate = new Date();
//     const loanStartingDate = loan?.loanDisbursementDate
//       ? new Date(loan.loanDisbursementDate)
//       : null;
//     const loanEndingDate = loan?.loanCompletedDate
//       ? new Date(loan.loanCompletedDate)
//       : null;
//     const loanAmount = loan?.totalDeductionWithSi;
//     const totalDeductionPerMonth = loan?.totalDeduction;

//     let loanAmountPaid = 0;
//     let loanAmountPending = loanAmount;

//     if (!loanStartingDate || !loanEndingDate || !totalDeductionPerMonth) {
//       return { loanAmountPaid, loanAmountPending };
//     }

//     if (currentDate >= loanStartingDate && currentDate <= loanEndingDate) {
//       const elapsedMonths =
//         (currentDate.getFullYear() - loanStartingDate.getFullYear()) * 12 +
//         currentDate.getMonth() -
//         loanStartingDate.getMonth() +
//         1;
//       loanAmountPaid = Math.min(
//         loanAmount,
//         totalDeductionPerMonth * elapsedMonths
//       );
//       loanAmountPending = loanAmount - loanAmountPaid;
//     }

//     let currentDateToCheck = new Date(loanStartingDate);
//     while (
//       currentDateToCheck <= loanEndingDate &&
//       currentDateToCheck <= currentDate
//     ) {
//       loanAmountPaid = totalDeductionPerMonth;
//       loanAmountPending = loanAmount - loanAmountPaid;
//       currentDateToCheck.setMonth(currentDateToCheck.getMonth() + 1);
//     }

//     return { loanAmountPaid, loanAmountPending };
//   };

//   const [selectedLoans, setSelectedLoans] = useState([]);
//   const [showPieChart, setShowPieChart] = useState(false);
//   const [totalPaidAmount, setTotalPaidAmount] = useState(0);
//   const [totalPendingAmount, setTotalPendingAmount] = useState(0);
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [loan, setLoan] = useState(null);
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);

//   useEffect(() => {
//     let paidAmount = 0;
//     let pendingAmount = 0;

//     selectedLoans.forEach((selectedLoan) => {
//       const { loanAmountPaid, loanAmountPending } =
//         calculateLoanStatus(selectedLoan);
//       paidAmount += loanAmountPaid;
//       pendingAmount += loanAmountPending;
//     });

//     setTotalPaidAmount(paidAmount);
//     setTotalPendingAmount(pendingAmount);
//   }, [selectedLoans]);

//   const handleCheckboxChange = (loan) => {
//     if (selectedLoans.includes(loan)) {
//       setSelectedLoans(
//         selectedLoans.filter((selectedLoan) => selectedLoan !== loan)
//       );
//       setShowPieChart(false);
//     } else {
//       setSelectedLoans([...selectedLoans, loan]);
//       setShowPieChart(true);
//     }
//   };

//   const handleCreateModalOpen = () => setCreateModalOpen(true);
//   const handleCreateModalClose = () => setCreateModalOpen(false);
//   const handleEditModalOpen = (loan) => {
//     setEditModalOpen(true);
//     setLoan(loan);
//   };
//   const handleEditModalClose = () => {
//     setEditModalOpen(false);
//     setLoan(null);
//   };
//   const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
//   const handleCloseConfirmation = () => setDeleteConfirmation(null);

//   const handleDelete = (id) => {
//     deleteMutation.mutate(id);
//     handleCloseConfirmation();
//   };

//   const deleteMutation = useMutation(
//     (id) =>
//       axios.delete(
//         `${process.env.REACT_APP_API}/route/delete-loan-data/${id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("loanDatas");
//         handleAlert(true, "success", "Loan data deleted successfully");
//       },
//     }
//   );

//   const filteredLoanData = getEmployeeLoanData?.filter(loan =>
//     statusFilter === "all" ? true : loan.status === statusFilter
//   );

//   return (
//     <>
//       <BoxComponent>
//         <div className="flex items-center justify-between">
//           <HeadingOneLineInfo
//             heading={"Loan Management"}
//             info={"Manage the loan here."}
//           />
//           {/* <BasicButton
//             color={"primary"}
//             onClick={handleCreateModalOpen}
//             title={"Apply For Loan"}
//           /> */}
//         </div>

//         <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
//           <div className="flex gap-2 p-4 border-b w-full">
//             <Button
//               variant={statusFilter === "all" ? "contained" : "outlined"}
//               onClick={() => setStatusFilter("all")}
//             >
//               All Loans
//             </Button>
//             <Button
//               variant={statusFilter === "Pending" ? "contained" : "outlined"}
//               onClick={() => setStatusFilter("Pending")}
//             >
//               Pending
//             </Button>
//             <Button
//               variant={statusFilter === "Ongoing" ? "contained" : "outlined"}
//               onClick={() => setStatusFilter("Ongoing")}
//             >
//               Ongoing
//             </Button>
//           </div>

//           {isLoading ? (
//             <LoanManagementSkeleton />
//           ) : filteredLoanData?.length > 0 ? (
//             <div className="flex w-full scrolling">
//               <div className="overflow-auto scrolling p-0 border border-gray-200">
//                 <table className="min-w-full bg-white text-left text-sm font-light">
//                   <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                     <tr className="font-semibold">
//                       <th scope="col" className="px-3 py-3"></th>
//                       <th scope="col" className="text-left pl-6 py-3">SR NO</th>
//                       <th scope="col" className="px-6 py-3">Employee Name</th>
//                       <th scope="col" className="px-6 py-3">Loan Status</th>
//                       <th scope="col" className="px-8 py-3">Loan Type</th>
//                       <th scope="col" className="px-6 py-3">Loan Amount Applied</th>
//                       <th scope="col" className="px-6 py-3">Total Loan Amount</th>
//                       <th scope="col" className="px-6 py-3">Loan Amount Paid Monthly</th>
//                       <th scope="col" className="px-6 py-3">Loan Amount Pending</th>
//                       <th scope="col" className="px-6 py-3">Total Deduction Monthly</th>
//                       <th scope="col" className="px-6 py-3">ROI (%)</th>
//                       <th scope="col" className="px-8 py-3">Disbursement Date</th>
//                       <th scope="col" className="px-8 py-3">Completion Date</th>
//                       {filteredLoanData?.some(loan => loan.status === "Pending") ? (
//                         <th scope="col" className="px-8 py-3">Edit</th>
//                       ) : (
//                         <th scope="col" className="px-8 py-3"></th>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredLoanData.map((loanMgtData, id) => {
//                       const { loanAmountPaid, loanAmountPending } = calculateLoanStatus(loanMgtData);
//                       return (
//                         <tr className="font-medium border-b" key={id}>
//                           <td className="py-3 pl-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedLoans.includes(loanMgtData)}
//                               onChange={() => handleCheckboxChange(loanMgtData)}
//                             />
//                           </td>
//                           <td className="text-left pl-6 py-3">{id + 1}</td>
//                           <td className="py-3 pl-6">
//                             {`${loanMgtData.userId?.first_name || ''} ${loanMgtData.userId?.last_name || ''}`}
//                           </td>
//                           <td className="text-left leading-7 text-[16px] w-[200px]">
//                             {loanMgtData.status === "Pending" ? (
//                               <div className="flex items-center gap-2">
//                                 <Pending className="text-yellow-400" />
//                                 <span className="text-yellow-400">Pending</span>
//                               </div>
//                             ) : loanMgtData.status === "Ongoing" ? (
//                               <div className="flex items-center gap-2">
//                                 <CheckCircle className="text-green-400" />
//                                 <span className="text-green-400">Ongoing</span>
//                               </div>
//                             ) : loanMgtData.status === "Rejected" ? (
//                               <div className="flex items-center gap-2">
//                                 <Cancel className="text-red-400" />
//                                 <span className="text-red-400">Rejected</span>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-2">
//                                 <Error className="text-gray-400" />
//                                 <span className="text-gray-400">{loanMgtData.status}</span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="py-3 pl-6">{loanMgtData.loanType?.loanName}</td>
//                           <td className="py-3 pl-6">{loanMgtData?.loanAmount}</td>
//                           <td className="py-3 pl-6">{loanMgtData?.totalDeductionWithSi}</td>
//                           <td className="py-3 pl-6">{loanAmountPaid}</td>
//                           <td className="py-3 pl-6">{loanAmountPending}</td>
//                           <td className="py-3 pl-6">{loanMgtData?.totalDeduction}</td>
//                           <td className="py-3 pl-6">{loanMgtData?.rateOfIntereset}</td>
//                           <td className="py-3 pl-6">
//                             {formatDate(loanMgtData?.loanDisbursementDate) || ""}
//                           </td>
//                           <td className="py-3 pl-6">
//                             {formatDate(loanMgtData?.loanCompletedDate) || ""}
//                           </td>
//                           <td className="whitespace-nowrap px-6 py-2">
//                             {loanMgtData.status === "Pending" && (
//                               <>
//                                 <IconButton
//                                   color="primary"
//                                   aria-label="edit"
//                                   onClick={() => handleEditModalOpen(loanMgtData)}
//                                 >
//                                   <EditOutlinedIcon />
//                                 </IconButton>
//                                 <IconButton
//                                   color="error"
//                                   aria-label="delete"
//                                   onClick={() => handleDeleteConfirmation(loanMgtData?._id)}
//                                 >
//                                   <DeleteOutlineIcon />
//                                 </IconButton>
//                               </>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//               <article className="flex items-center mb-1 text-red-500 gap-2">
//                 <Info className="!text-2xl" />
//                 <h1 className="text-lg font-semibold">Apply Loan</h1>
//               </article>
//               <p>No loan found. add the loan.</p>
//             </section>
//           )}
//         </article>

//         {showPieChart && (
//           <LoanManagementPieChart
//             totalPaidAmount={totalPaidAmount}
//             totalPendingAmount={totalPendingAmount}
//           />
//         )}
//       </BoxComponent>

//       <CreateLoanMgtModal
//         handleClose={handleCreateModalClose}
//         open={createModalOpen}
//         organisationId={organisationId}
//       />

//       <EditLoanModal
//         handleClose={handleEditModalClose}
//         open={editModalOpen}
//         organisationId={organisationId}
//         loan={loan}
//       />

//       <Dialog
//         open={deleteConfirmation !== null}
//         onClose={handleCloseConfirmation}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <p>
//             Please confirm your decision to delete this loan data, as this
//             action cannot be undone.
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleCloseConfirmation}
//             variant="outlined"
//             color="primary"
//             size="small"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => handleDelete(deleteConfirmation)}
//             color="error"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default LoanManagement;
