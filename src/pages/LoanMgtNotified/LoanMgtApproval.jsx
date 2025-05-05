import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TestContext } from "../../State/Function/Main";
import { useQuery, useQueryClient } from "react-query";
import ViewDocumentModal from "./ViewDocumentModal";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

const LoanMgtApproval = ({ employee, isArchived = false }) => {
  // to define the state, hook, import other function
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const [loanData, setLoanData] = useState(null);
  
  // Get the loan ID from the employee prop
  const loanId = employee?._id;

  // For view the loan data
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userUploadDocumnet, setUserUploadDocumnet] = useState(null);

  // Get loan data - use the employee data directly if it's complete, otherwise fetch it
  const { data: fetchedLoanData, isLoading } = useQuery(
    ["empLoanInfo", loanId],
    async () => {
      console.log("Fetching loan data for ID:", loanId);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/loans/${loanId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("Fetched loan data:", response.data.data);
      return response.data.data;
    },
    {
      enabled: !!loanId, // Only run query if loanId exists
      onSuccess: (data) => {
        console.log("Query successful, data:", data);
        queryClient.invalidateQueries({ queryKey: ["empLoanApplyRequest"] });
        queryClient.invalidateQueries({ queryKey: ["empLoanArchivedRequests"] });
      },
      onError: (error) => {
        console.error("Error fetching loan data:", error);
      }
    }
  );

  // Use either the fetched data or the complete employee data
  useEffect(() => {
    if (fetchedLoanData) {
      setLoanData(fetchedLoanData);
    } else if (employee && employee.loanType && employee.userId) {
      // If employee data is complete, use it directly
      setLoanData(employee);
    }
  }, [fetchedLoanData, employee]);

  const formatDate = (dateString) => { 
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toDateString();
  };

  // to define the function for approved the loan data
  const handleApproval = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${loanId}`,
        {
          action: status === "ongoing" ? "ongoing" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        },
      );

      console.log("Approval response:", response);

      // Invalidate the query to force refetch
      queryClient.invalidateQueries(["empLoanInfo", loanId]);
      queryClient.invalidateQueries(["empLoanApplyRequest"]);
      queryClient.invalidateQueries(["empLoanArchivedRequests"]);
      
      // Display appropriate alert message based on action
      if (status === "ongoing") {
        handleAlert(
          true,
          "success",
          `Approved the request for loan application of ${loanData?.userId?.first_name}`
        );
      } else {
        handleAlert(
          true,
          "error",
          `Rejected the request for loan application of ${loanData?.userId?.first_name}`
        );
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating loan status:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  const handleViewModalOpen = () => {
    setViewModalOpen(true);
    setUserUploadDocumnet(loanData);
  };
  
  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setUserUploadDocumnet(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!loanData) {
    return (
      <div className="p-4 bg-yellow-100 rounded-md text-yellow-800">
        No loan data available. Please try selecting another loan.
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Card
          variant="outlined"
          sx={{ width: "100%" }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography gutterBottom variant="h4" component="div">
                {loanData?.userId?.first_name || ""} {loanData?.userId?.last_name || ""}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {isArchived 
                  ? `Loan application ${loanData.status === "Ongoing" ? "approved" : "rejected"}`
                  : `${loanData?.userId?.first_name || ""} has raised a request for loan application`
                }
              </Typography>
            </div>
            {isArchived && (
              <Chip 
                label={loanData.status === "Ongoing" ? "Approved" : "Rejected"} 
                color={loanData.status === "Ongoing" ? "success" : "error"}
                variant="outlined"
              />
            )}
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Type
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.loanType?.loanName || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Amount
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.loanAmount || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Rate Of Interest (%)
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.rateOfIntereset || loanData?.rateOfInterest || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Disbursement Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(loanData?.loanDisbursementDate)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Completed Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(loanData?.loanCompletedDate)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                No Of EMI
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.noOfEmi || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Total Deduction
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.totalDeduction || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Total Deduction With Simple Interest
              </Typography>
              <Typography gutterBottom component="div">
                {loanData?.totalDeductionWithSi || "N/A"}
              </Typography>
            </Stack>
            {loanData?.file && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography gutterBottom variant="h6" component="div">
                  Document
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleViewModalOpen}
                  sx={{ textTransform: "none" }}
                >
                  View
                </Button>
              </Stack>
            )}
          </Box>
          <Divider />
          {!isArchived && (
            <Box sx={{ p: 2 }}>
              <div className="flex justify-center gap-10">
                {/* Accept button */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleApproval("ongoing")}
                >
                  Accept
                </button>
                {/* Reject button */}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleApproval("reject")}
                >
                  Reject
                </button>
              </div>
            </Box>
          )}
        </Card>
        {/* for view */}
        <ViewDocumentModal
          handleClose={handleViewModalClose}
          open={viewModalOpen}
          userUploadDocumnet={userUploadDocumnet}
        />
      </div>
    </>
  );
};

export default LoanMgtApproval;



// import React, { useContext, useState } from "react";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import { TestContext } from "../../State/Function/Main";
// import { useQuery, useQueryClient } from "react-query";
// import ViewDocumentModal from "./ViewDocumentModal";
// import Button from "@mui/material/Button";
// import Chip from "@mui/material/Chip";

// const LoanMgtApproval = ({ employee, isArchived = false }) => {
//   // to define the state , hook , import other function
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   let loanId = employee?._id;

//   //for get loan data
//   const { data: getEmployeeLoanInfo } = useQuery(
//     ["empLoanInfo", loanId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/loans/${loanId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["empLoanApplyRequest"] });
//         queryClient.invalidateQueries({ queryKey: ["empLoanArchivedRequests"] });
//       }
//     }
//   );

//   const formatDate = (dateString) => { 
//     const date = new Date(dateString);
//     return date.toDateString();
//   };

//   // to define the function for approved the loan data
//   const handleApproval = async (status) => {
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${loanId}`,
//         {
//           action: status === "ongoing" ? "ongoing" : "reject",
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         },
//       );

//       console.log(response);

//       // Invalidate the query to force refetch
//       queryClient.invalidateQueries(["empLoanInfo", loanId]);
//       queryClient.invalidateQueries(["empLoanApplyRequest"]);
//       queryClient.invalidateQueries(["empLoanArchivedRequests"]);
      
//       // Display appropriate alert message based on action
//       if (status === "ongoing") {
//         handleAlert(
//           true,
//           "success",
//           `Approved the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
//         );
//       } else {
//         handleAlert(
//           true,
//           "error",
//           `Rejected the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
//         );
//       }

//       // Refresh the page to show updated data
//       window.location.reload();
//     } catch (error) {
//       console.error("Error adding salary data:", error);
//       handleAlert(true, "error", "Something went wrong");
//     }
//   };

//   // for view the loan data
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [userUploadDocumnet, setUserUploadDocumnet] = useState(null);
//   const handleViewModalOpen = () => {
//     setViewModalOpen(true);
//     setUserUploadDocumnet(getEmployeeLoanInfo);
//   };
//   const handleViewModalClose = () => {
//     setViewModalOpen(false);
//     setUserUploadDocumnet(null);
//   };

//   // Get status chip color
//   const getStatusChipColor = (status) => {
//     switch(status) {
//       case 'ongoing':
//         return 'success';
//       case 'reject':
//         return 'error';
//       case 'Pending':
//         return 'warning';
//       default:
//         return 'default';
//     }
//   };

//   return (
//     <>
//       <div style={{ marginBottom: '20px' }}>
//         <Card
//           variant="outlined"
//           sx={{ width: "100%" }}
//         >
//           <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <Typography gutterBottom variant="h4" component="div">
//                 {getEmployeeLoanInfo?.userId?.first_name || ""}
//               </Typography>
//               <Typography color="text.secondary" variant="body2">
//                 {getEmployeeLoanInfo?.userId?.first_name || ""} has raised a
//                 request for loan application
//               </Typography>
//             </div>
//             {isArchived && (
//               <Chip 
//                 label={getEmployeeLoanInfo?.status || "Unknown"} 
//                 color={getStatusChipColor(getEmployeeLoanInfo?.status)}
//               />
//             )}
//           </Box>
//           <Divider />
//           <Box sx={{ p: 2 }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Type
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.loanType?.loanName || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Amount
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.loanAmount || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Rate Of Interest (%)
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.rateOfIntereset || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Disbursement Date
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {formatDate(getEmployeeLoanInfo?.loanDisbursementDate) || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Completed Date
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {formatDate(getEmployeeLoanInfo?.loanCompletedDate) || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 No Of EMI
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.noOfEmi || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Total Deduction
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.totalDeduction || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Total Deduction With Simple Interest
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.totalDeductionWithSi || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Document
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleViewModalOpen}
//                 sx={{ textTransform: "none" }}
//               >
//                 View
//               </Button>
//             </Stack>
//           </Box>
//           <Divider />
//           {!isArchived && (
//             <Box sx={{ p: 2 }}>
//               <div className="flex justify-center gap-10">
//                 {/* Accept button */}
//                 <button
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                   onClick={() => handleApproval("ongoing")}
//                 >
//                   Accept
//                 </button>
//                 {/* Reject button */}
//                 <button
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                   onClick={() => handleApproval("reject")}
//                 >
//                   Reject
//                 </button>
//               </div>
//             </Box>
//           )}
//         </Card>
//         {/* for view */}
//         <ViewDocumentModal
//           handleClose={handleViewModalClose}
//           open={viewModalOpen}
//           userUploadDocumnet={userUploadDocumnet}
//         />
//       </div >
//     </>
//   );
// };

// export default LoanMgtApproval;



// import React, { useContext, useState } from "react";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import { TestContext } from "../../State/Function/Main";
// import { useQuery, useQueryClient } from "react-query";
// import ViewDocumentModal from "./ViewDocumentModal";
// import Button from "@mui/material/Button";
// const LoanMgtApproval = ({ employee }) => {
//   // to define the state , hook , import other function
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
//   let loanId = employee?._id;

//   //for get loan data
//   const { data: getEmployeeLoanInfo } = useQuery(
//     ["empLoanInfo", loanId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/loans/${loanId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["empLoanApplyRequest"] });
//       }
//     }
//   );

//   const formatDate = (dateString) => { 
//     const date = new Date(dateString);
//     return date.toDateString();
//   };

//   // to define the funcitn for approved the loan data
//   const handleApproval = async (status) => {
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${loanId}`,
//         {
//           action: status === "ongoing" ? "ongoing" : "reject",
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         },
//       );

//       console.log(response);

//       // Invalidate the query to force refetch
//       queryClient.invalidateQueries(["empLoanInfo", loanId]);
//       // Display appropriate alert message based on action
//       if (status === "ongoing") {
//         handleAlert(
//           true,
//           "success",
//           `Approved the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
//         );
//       } else {
//         handleAlert(
//           true,
//           "error",
//           `Rejected the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
//         );
//       }

//       window.location.reload();
//     } catch (error) {
//       console.error("Error adding salary data:", error);
//       handleAlert(true, "error", "Something went wrong");
//     }
//   };

//   // for view the loan data
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [userUploadDocumnet, setUserUploadDocumnet] = useState(null);
//   const handleViewModalOpen = () => {
//     setViewModalOpen(true);
//     setUserUploadDocumnet(getEmployeeLoanInfo);
//   };
//   const handleViewModalClose = () => {
//     setViewModalOpen(false);
//     setUserUploadDocumnet(null);
//   };

//   return (
//     <>
//       <div style={{ marginBottom: '20px' }}>
//         <Card
//           variant="outlined"
//           sx={{ width: "100%" }}
//         >
//           <Box sx={{ px: 2 }}>
//             <Typography gutterBottom variant="h4" component="div">
//               {getEmployeeLoanInfo?.userId?.first_name || ""}
//             </Typography>
//             <Typography color="text.secondary" variant="body2">
//               {getEmployeeLoanInfo?.userId?.first_name || ""} has raised a
//               request for loan application
//             </Typography>
//           </Box>
//           <Divider />
//           <Box sx={{ p: 2 }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Type
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.loanType?.loanName || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Amount
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.loanAmount || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Rate Of Interest (%)
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.rateOfIntereset || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Disbursement Date
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {formatDate(getEmployeeLoanInfo?.loanDisbursementDate) || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Loan Completed Date
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {formatDate(getEmployeeLoanInfo?.loanCompletedDate) || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 No Of EMI
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.noOfEmi || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Total Deduction
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.totalDeduction || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Total Deduction With Simple Interest
//               </Typography>
//               <Typography gutterBottom component="div">
//                 {getEmployeeLoanInfo?.totalDeductionWithSi || ""}
//               </Typography>
//             </Stack>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography gutterBottom variant="h6" component="div">
//                 Document
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleViewModalOpen}
//                 sx={{ textTransform: "none" }}
//               >
//                 View
//               </Button>
//             </Stack>
//           </Box>
//           <Divider />
//           <Box sx={{ p: 2 }}>
//             <div className="flex justify-center gap-10">
//               {/* Accept button */}
//               <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 onClick={() => handleApproval("ongoing")}
//               >
//                 Accept
//               </button>
//               {/* Reject button */}
//               <button
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                 onClick={() => handleApproval("reject")}
//               >
//                 Reject
//               </button>
//             </div>
//           </Box>
//         </Card>
//         {/* for view */}
//         <ViewDocumentModal
//           handleClose={handleViewModalClose}
//           open={viewModalOpen}
//           userUploadDocumnet={userUploadDocumnet}
//         />
//       </div >
//     </>
//   );
// };

// export default LoanMgtApproval;
