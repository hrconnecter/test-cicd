/* eslint-disable no-unused-vars */
//previous ui
// import React, { useState } from "react";
// import {
//   DeleteOutline,
//   EditOutlined,
//   Visibility,
//   IosShare as IosShareIcon,
//   Send as SendIcon,
// } from "@mui/icons-material";
// import { IconButton, Pagination, PaginationItem, Stack, Typography } from "@mui/material";
// import useLetterWorkflowStore from "./useletterworkflow";
// import useGetUser from "../../../hooks/Token/useUser";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { useContext } from "react";
// import { useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const DocList = ({ data = [], onEdit, onDelete, onViewPDF, onApprove, rowsPerPage = 9 }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { letterWorkflow } = useLetterWorkflowStore();
//   const { setAppAlert } = useContext(UseContext);
//   const { authToken } = useGetUser();
//   const queryClient = useQueryClient();

//   // Pagination logic
//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentData = data.slice(startIndex, startIndex + rowsPerPage);

//   const handleEdit = (id) => onEdit(id);
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) window.open(pdfUrl, "_blank");
//     else alert("PDF URL is not available.");
//   };
//   const handleDelete = (id) => onDelete(id);

//   const mutation = useMutation(
//     async ({ docId, newStatus }) =>
//       axios.patch(
//         `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
//         { docId, newStatus },
//         { headers: { Authorization: authToken } }
//       ),
//     { onSuccess: () => queryClient.invalidateQueries("getOrgDocs") }
//   );

//   const handleApprove = (docId) => {
//     const newStatus = "Pending";
//     setAppAlert({ alert: true, type: "success", msg: "Document sent for approval." });
//     mutation.mutate({ docId, newStatus });
//   };

//   const handleSendButtonClick = async (item) => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/updatearr/${item._id}`,
//         { employeeId: [item.empidd] },
//         { headers: { Authorization: authToken } }
//       );
//       mutation.mutate({ docId: item._id, newStatus: "Send" });
//       setAppAlert({ alert: true, type: "success", msg: "Document sent successfully." });
//     } catch (error) {
//       setAppAlert({ alert: true, type: "error", msg: "Failed to send document." });
//     }
//   };

//   return (
//     <div className="w-full">
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-6 py-3 w-1/10">Sr. No</th>
//             <th scope="col" className="py-3 pl-2 w-1/40">Letter Type</th>
//             <th scope="col" className="py-3 w-1/10">Status</th>
//             <th scope="col" className="py-3 w-1/40 !text-right pr-16">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, idx) => {
//             const workflowStatus = letterWorkflow[item.letterType]?.workflow;
//             const status = item.docstatus || "To Do";

//             return (
//               <tr className="!font-medium border-b" key={item._id || idx}>
//                 <td className="!text-left pl-9 w-1/10">{startIndex + idx + 1}</td>
//                 <td className="py-3 text-left w-1/40">{item.letterType}</td>
//                 <td className="py-3 text-left w-1/10">{status}</td>
//                 <td className="text-right pr-4 w-1/40">
//                   {workflowStatus === true && status === "To Do" && (
//                     <IconButton
//                       color="primary"
//                       aria-label="approve"
//                       onClick={() => handleApprove(item._id)}
//                     >
//                       <IosShareIcon />
//                     </IconButton>
//                   )}
//                   {(workflowStatus === false && status === "To Do") ||
//                   (workflowStatus === true && status === "Accepted") ? (
//                     <IconButton
//                       color="primary"
//                       aria-label="send"
//                       onClick={() => handleSendButtonClick(item)}
//                     >
//                       <SendIcon />
//                     </IconButton>
//                   ) : null}
//                   <IconButton
//                     color="primary"
//                     aria-label="view"
//                     onClick={() => handleViewPDF(item.url)}
//                   >
//                     <Visibility />
//                   </IconButton>
//                   {status === "To Do" && (
//                     <IconButton
//                       color="primary"
//                       aria-label="edit"
//                       onClick={() => handleEdit(item._id)}
//                     >
//                       <EditOutlined />
//                     </IconButton>
//                   )}
//                   <IconButton
//                     color="error"
//                     onClick={() => handleDelete(item._id)}
//                     aria-label="delete"
//                   >
//                     <DeleteOutline />
//                   </IconButton>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Stack
//         direction={"row"}
//         className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 items-center w-full justify-between"
//       >
//         <Typography variant="body2">
//           Showing page {currentPage} of {totalPages} pages
//         </Typography>
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           color="primary"
//           shape="rounded"
//           siblingCount={0}
//           boundaryCount={0}
//           hidePrevButton={currentPage === 1}
//           hideNextButton={currentPage === totalPages}
//           onChange={(event, value) => setCurrentPage(value)}
//           renderItem={(item) => (
//             <PaginationItem
//               {...item}
//               components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
//             />
//           )}
//         />
//       </Stack>
//     </div>
//   );
// };

// export default DocList;

// //modified ui
// import React, { useState } from "react";
// import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
// import {
//   CheckBox as CheckBoxIcon,
//   CheckBoxOutlineBlank,
// } from "@mui/icons-material";

// import {
//   IconButton,
//   Pagination,
//   PaginationItem,
//   Stack,
//   Typography,
//   Tooltip 
// } from "@mui/material";
// import useLetterWorkflowStore from "./useletterworkflow";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const DocList = ({
//   data = [],
//   onEdit,
//   onDelete,
//   onViewPDF,
//   onSelect,
//   rowsPerPage = 9,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { letterWorkflow } = useLetterWorkflowStore();

//   const [selectedDocId, setSelectedDocId] = useState(null);

//   // Pagination logic
//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentData = data.slice(startIndex, startIndex + rowsPerPage);

//   const handleEdit = (id) => onEdit(id);

//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) window.open(pdfUrl, "_blank");
//     else alert("PDF URL is not available.");
//   };

//   const handleDelete = (id) => onDelete(id);

//   // const handleSelect = (id) => onSelect(id);
//     const handleSelect = (id) => {
//     // If clicking the already selected document, deselect it
//     if (selectedDocId === id) {
//       setSelectedDocId(null);
//     } else {
//       // Otherwise, select the new document
//       setSelectedDocId(id);
//     }
    
//     // Call the parent component's onSelect function
//     onSelect(id);
//   };

//   return (
//     <div className="w-full">
//  {selectedDocId && (
//         <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
//           <Typography variant="body2" className="text-blue-700">
//             <strong>Current Selection:</strong> {data.find(doc => doc._id === selectedDocId)?.letterType || "Document"} 
//             {data.find(doc => doc._id === selectedDocId)?.title ? ` - ${data.find(doc => doc._id === selectedDocId)?.title}` : ""}
//           </Typography>
//         </div>
//       )}

//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-6 py-3 w-1/10">
//               Sr. No
//             </th>
//             <th scope="col" className="py-3 pl-2 w-1/40">
//               Letter Type
//             </th>
//             <th scope="col" className="py-3 w-1/10">
//               Status
//             </th>
//             <th scope="col" className="py-3 w-1/40 !text-right pr-16">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, idx) => {
//             const status = item.docstatus || "To Do";

//             return (
//               <tr className="!font-medium border-b" key={item._id || idx}>
//                 <td className="!text-left pl-9 w-1/10">
//                   {startIndex + idx + 1}
//                 </td>
//                 <td className="py-3 text-left w-1/40">{item.letterType}</td>
//                 <td className="py-3 text-left w-1/10">{status}</td>
//                 <td className="text-right pr-4 w-1/40">
//                   {/* View PDF button - always visible */}
//                   <Tooltip title="View Document">
//                   <IconButton
//                     color="primary"
//                     aria-label="view"
//                     onClick={() => handleViewPDF(item.url)}
//                   >
//                     <Visibility />
//                   </IconButton>
//                   </Tooltip>

//                   <Tooltip title="Delete Document">
//                   <IconButton
//                     color="error"
//                     onClick={() => handleDelete(item._id)}
//                     aria-label="delete"
//                   >
//                     <DeleteOutline />
//                   </IconButton>
//                   </Tooltip>

//                   {/* Edit button - only if status is "To Do" */}
//                   {status === "To Do" ? (
//                     <Tooltip title="Edit Document"></Tooltip>   
//                     <IconButton
//                       color="primary"
//                       aria-label="edit"
//                       onClick={() => handleEdit(item._id)}
//                     >
//                       <EditOutlined />
//                     </IconButton>
//                     </Tooltip>
//                   ) : (
//                     <Tooltip title={selectedDocId === item._id ? "Deselect Document" : "Select Document"}>
//                     <IconButton
//                       color="secondary"
//                       aria-label="select"
//                       onClick={() => handleSelect(item._id)}
//                       className="bg-blue-50 hover:bg-blue-100"
//                     >
//                       {selectedDocs[item._id] ? (
//                         <CheckBoxIcon className="text-blue-600" />
//                       ) : (
//                         <CheckBoxOutlineBlank />
//                       )}
//                     </IconButton>
//                     </Tooltip>
//                   )}

//                   {/* Delete button - always visible */}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Stack
//         direction={"row"}
//         className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 items-center w-full justify-between"
//       >
//         <Typography variant="body2">
//           Showing page {currentPage} of {totalPages} pages
//         </Typography>
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           color="primary"
//           shape="rounded"
//           siblingCount={0}
//           boundaryCount={0}
//           hidePrevButton={currentPage === 1}
//           hideNextButton={currentPage === totalPages}
//           onChange={(event, value) => setCurrentPage(value)}
//           renderItem={(item) => (
//             <PaginationItem
//               {...item}
//               components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
//             />
//           )}
//         />
//       </Stack>
//     </div>
//   );
// };

// export default DocList;


//modified ui 2 working great
// import React, { useState } from "react";
// import {
//   DeleteOutline,
//   EditOutlined,
//   Visibility,
//   CheckBox as CheckBoxIcon,
//   CheckBoxOutlineBlank
// } from "@mui/icons-material";
// import { 
//   IconButton, 
//   Pagination, 
//   PaginationItem, 
//   Stack, 
//   Typography, 
//   Tooltip, 
//   Chip
// } from "@mui/material";
// import useLetterWorkflowStore from "./useletterworkflow";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const DocList = ({ data = [], onEdit, onDelete, onViewPDF, onSelect, rowsPerPage = 9 }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { letterWorkflow } = useLetterWorkflowStore();
  
//   // Change to store a single selected document ID instead of an object
//   const [selectedDocId, setSelectedDocId] = useState(null);

//   // Pagination logic
//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentData = data.slice(startIndex, startIndex + rowsPerPage);

//   const handleEdit = (id) => onEdit(id);
  
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) window.open(pdfUrl, "_blank");
//     else alert("PDF URL is not available.");
//   };
  
//   const handleDelete = (id) => onDelete(id);
  
//   // Modified to ensure only one checkbox can be selected at a time
//   const handleSelect = (id) => {
//     // If clicking the already selected document, deselect it
//     if (selectedDocId === id) {
//       setSelectedDocId(null);
//     } else {
//       // Otherwise, select the new document
//       setSelectedDocId(id);
//     }
    
//     // Call the parent component's onSelect function
//     onSelect(id);
//   };

//   // Function to determine status badge color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "To Do":
//         return { color: "default", bgcolor: "#e0e0e0" };
//       case "Pending":
//         return { color: "warning", bgcolor: "#fff8e1" };
//       case "Accepted":
//         return { color: "success", bgcolor: "#e8f5e9" };
//       case "Rejected":
//         return { color: "error", bgcolor: "#ffebee" };
//       case "Send":
//         return { color: "info", bgcolor: "#e3f2fd" };
//       default:
//         return { color: "default", bgcolor: "#f5f5f5" };
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Current selection indicator */}
//       {/* {selectedDocId && (
//         <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
//           <Typography variant="body2" className="text-blue-700">
//             <strong>Current Selection:</strong> {data.find(doc => doc._id === selectedDocId)?.letterType || "Document"} 
//             {data.find(doc => doc._id === selectedDocId)?.title ? ` - ${data.find(doc => doc._id === selectedDocId)?.title}` : ""}
//           </Typography>
//         </div>
//       )}
//      */}
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-6 py-3 w-1/10">Sr. No</th>
//             <th scope="col" className="py-3 pl-2 w-1/40">Letter Type</th>
//             <th scope="col" className="py-3 w-1/10">Status</th>
//             <th scope="col" className="py-3 w-1/40 !text-right pr-16">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, idx) => {
//             const status = item.docstatus || "To Do";
//             const statusStyle = getStatusColor(status);

//             return (
//               <tr 
//                 className={`!font-medium border-b ${selectedDocId === item._id ? 'bg-blue-50' : ''}`} 
//                 key={item._id || idx}
//               >
//                 <td className="!text-left pl-9 w-1/10">{startIndex + idx + 1}</td>
//                 <td className="py-3 text-left w-1/40">{item.letterType}</td>
//                 {/* <td className="py-3 text-left w-1/10">{status}</td> */}
//                 <td className="py-3 text-left w-1/10">
//                   <Chip 
//                     label={status}
//                     size="small"
//                     color={statusStyle.color}
//                     style={{ 
//                       backgroundColor: statusStyle.bgcolor,
//                       fontWeight: 500,
//                       fontSize: '0.75rem'
//                     }}
//                   />
//                 </td>
//                 <td className="text-right pr-4 w-1/40">
//                   {/* View PDF button with tooltip */}
//                   <Tooltip title="View Document">
//                     <IconButton
//                       color="primary"
//                       aria-label="view"
//                       onClick={() => handleViewPDF(item.url)}
//                     >
//                       <Visibility />
//                     </IconButton>
//                   </Tooltip>
                  
//                   {/* Edit button or Select checkbox based on status */}
//                   {status === "To Do" ? (
//                     <Tooltip title="Edit Document">
//                       <IconButton
//                         color="primary"
//                         aria-label="edit"
//                         onClick={() => handleEdit(item._id)}
//                       >
//                         <EditOutlined />
//                       </IconButton>
//                     </Tooltip>
//                   ) : (
//                     /* Checkbox with tooltip for non-editable documents */
//                     <Tooltip title={selectedDocId === item._id ? "Deselect Document" : "Select Document"}>
//                       <IconButton
//                         color="secondary"
//                         aria-label="select"
//                         onClick={() => handleSelect(item._id)}
//                         className="bg-blue-50 hover:bg-blue-100"
//                       >
//                         {selectedDocId === item._id ? 
//                           <CheckBoxIcon className="text-blue-600" /> : 
//                           <CheckBoxOutlineBlank />
//                         }
//                       </IconButton>
//                     </Tooltip>
//                   )}
                  
//                   {/* Delete button with tooltip */}
//                   <Tooltip title="Delete Document">
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete(item._id)}
//                       aria-label="delete"
//                     >
//                       <DeleteOutline />
//                     </IconButton>
//                   </Tooltip>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Stack
//         direction={"row"}
//         className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 items-center w-full justify-between"
//       >
//         <Typography variant="body2">
//           Showing page {currentPage} of {totalPages} pages
//         </Typography>
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           color="primary"
//           shape="rounded"
//           siblingCount={0}
//           boundaryCount={0}
//           hidePrevButton={currentPage === 1}
//           hideNextButton={currentPage === totalPages}
//           onChange={(event, value) => setCurrentPage(value)}
//           renderItem={(item) => (
//             <PaginationItem
//               {...item}
//               components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
//             />
//           )}
//         />
//       </Stack>
//     </div>
//   );
// };

// export default DocList;



//modified ui 3 >status badges
import React, { useState } from "react";
import {
  DeleteOutline,
  EditOutlined,
  Visibility,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank
} from "@mui/icons-material";
import { 
  IconButton, 
  Pagination, 
  PaginationItem, 
  Stack, 
  Typography, 
  Tooltip,
  Chip
} from "@mui/material";
import useLetterWorkflowStore from "./useletterworkflow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DocList = ({ data = [], onEdit, onDelete, onViewPDF, onSelect, rowsPerPage = 9 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { letterWorkflow } = useLetterWorkflowStore();
  
  // Store a single selected document ID
  const [selectedDocId, setSelectedDocId] = useState(null);

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleEdit = (id) => onEdit(id);
  
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
    else alert("PDF URL is not available.");
  };
  
  const handleDelete = (id) => onDelete(id);
  
  // Modified to ensure only one checkbox can be selected at a time
  const handleSelect = (id) => {
    // If clicking the already selected document, deselect it
    if (selectedDocId === id) {
      setSelectedDocId(null);
    } else {
      // Otherwise, select the new document
      setSelectedDocId(id);
    }
    
    // Call the parent component's onSelect function
    onSelect(id);
  };

  // Function to determine status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "To Do":
        return { 
          backgroundColor: "#e0e0e0", 
          color: "#424242",
          borderColor: "#bdbdbd"
        };
      case "Pending":
        return { 
          backgroundColor: "#fff8e1", 
          color: "#f57c00",
          borderColor: "#ffe082" 
        };
      case "Accepted":
        return { 
          backgroundColor: "#e8f5e9", 
          color: "#2e7d32",
          borderColor: "#a5d6a7" 
        };
      case "Rejected":
        return { 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderColor: "#ef9a9a" 
        };
      case "Send":
        return { 
          backgroundColor: "#e3f2fd", 
          color: "#1565c0",
          borderColor: "#90caf9" 
        };
      default:
        return { 
          backgroundColor: "#f5f5f5", 
          color: "#616161",
          borderColor: "#e0e0e0" 
        };
    }
  };

  return (
    <div className="w-full">
      
      <table className="min-w-full bg-white text-left !text-sm font-light shadow-sm rounded-md overflow-hidden">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left pl-6 py-3 w-1/10">Sr. No</th>
            <th scope="col" className="py-3 pl-2 w-1/40">Letter Type</th>
            <th scope="col" className="py-3 w-1/10">Status</th>
            <th scope="col" className="py-3 w-1/40 !text-right pr-16">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => {
            const status = item.docstatus || "To Do";
            const statusStyle = getStatusStyle(status);

            return (
              <tr 
                className={`!font-medium border-b transition-colors duration-200 ${selectedDocId === item._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`} 
                key={item._id || idx}
              >
                <td className="!text-left pl-9 w-1/10">{startIndex + idx + 1}</td>
                <td className="py-3 text-left w-1/40">{item.letterType}</td>
                <td className="py-3 text-left w-1/10">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium border"
                    style={{ 
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color,
                      borderColor: statusStyle.borderColor
                    }}
                  >
                    {status}
                  </span>
                </td>
                <td className="text-right pr-4 w-1/40">
                  {/* View PDF button with tooltip */}
                  <Tooltip title="View Document">
                    <IconButton
                      color="primary"
                      aria-label="view"
                      onClick={() => handleViewPDF(item.url)}
                      size="small"
                      className="mx-1"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  
                  {/* Edit button or Select checkbox based on status */}
                  {status === "To Do" ? (
                    <Tooltip title="Edit Document">
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        onClick={() => handleEdit(item._id)}
                        size="small"
                        className="mx-1"
                      >
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    /* Checkbox with tooltip for non-editable documents */
                    <Tooltip title={selectedDocId === item._id ? "Deselect Document" : "Select Document"}>
                      <IconButton
                        color="secondary"
                        aria-label="select"
                        onClick={() => handleSelect(item._id)}
                        size="small"
                        className={`mx-1 ${selectedDocId === item._id ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                      >
                        {selectedDocId === item._id ? 
                          <CheckBoxIcon className="text-blue-600" /> : 
                          <CheckBoxOutlineBlank />
                        }
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {/* Delete button with tooltip */}
                  <Tooltip title="Delete Document">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item._id)}
                      aria-label="delete"
                      size="small"
                      className="mx-1"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Stack
        direction={"row"}
        className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 items-center w-full justify-between"
      >
        <Typography variant="body2">
          Showing page {currentPage} of {totalPages} pages
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          shape="rounded"
          siblingCount={0}
          boundaryCount={0}
          hidePrevButton={currentPage === 1}
          hideNextButton={currentPage === totalPages}
          onChange={(event, value) => setCurrentPage(value)}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default DocList;
