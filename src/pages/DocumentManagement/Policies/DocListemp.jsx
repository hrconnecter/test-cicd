/* eslint-disable no-unused-vars */

// import { DeleteOutline, EditOutlined, Visibility } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";

// // Helper function to compare the applicableDate with today's date
// const isActiveStatus = (applicableDate) => {
//   const currentDate = new Date();
//   const applicableDateObj = new Date(applicableDate);
//   return applicableDateObj >= currentDate ? "Inactive" : "Active";
// };

// const DocListemp = ({ data, onEdit, onDelete, onViewPDF }) => {
//   const handleEdit = (id) => {
//     onEdit(id);
//   };

//   const handleDelete = (id) => {
//     onDelete(id);
//   };

//   const handleViewPDF = (url) => {
//     onViewPDF(url); // Calls the function passed via props to open the PDF URL
//   };

//   return (
//     <div className="w-full">
//       <div className="w-full"></div>
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/10">
//               Sr. No
//             </th>
//             <th scope="col" className="py-3 w-1/40">
//               Title
//             </th>
//             <th scope="col" className="py-3 w-1/20">
//               Status
//             </th>

//             <th scope="col" className="py-3 w-1/3o !text-right pr-14">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((item, idx) => (
//             <tr className="!font-medium border-b" key={idx}>
//               <td className="!text-left pl-9 w-1/10">{idx + 1}</td>
//               <td className="py-3 text-left w-1/40">{item.title}</td>
//               <td className="py-3 text-left w-1/20">{isActiveStatus(item.applicableDate)}</td>
//               <td className="text-right pr-4 w-1/30">
//               <IconButton
//                   color="primary"
//                   aria-label="view"
//                   onClick={() => handleViewPDF(item.url)} // Trigger PDF view when clicked
//                 >
//                   <Visibility /> {/* Eye symbol */}
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   aria-label="edit"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(item._id)}
//                   aria-label="delete"
//                 >
//                   <DeleteOutline />
//                 </IconButton>

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocListemp;

// import React from "react";
// import IconButton from "@mui/material/IconButton";
// import Visibility from "@mui/icons-material/Visibility";
// import EditOutlined from "@mui/icons-material/EditOutlined";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";

// const isActiveStatus = (applicableDate) => {
//   // Replace this with your logic to determine the status
//   const today = new Date();
//   const date = new Date(applicableDate);
//   return date >= today ? "Active" : "Inactive";
// };

// const DocListemp = ({ data = [], onEdit, onDelete, onViewPDF, sortField = "title" }) => {
//   // Safeguard for empty or invalid data
//   const handleEdit = (id) => onEdit(id);
//   const handleDelete = (id) => onDelete(id);
//   const handleViewPDF = (url) => onViewPDF(url);

//   // Sort data based on the given sortField
//   const sortedData = [...(data || [])].sort((a, b) => {
//     const fieldA =
//       sortField === "status"
//         ? isActiveStatus(a.applicableDate)
//         : (a[sortField] || "").toLowerCase();
//     const fieldB =
//       sortField === "status"
//         ? isActiveStatus(b.applicableDate)
//         : (b[sortField] || "").toLowerCase();
//     return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
//   });
//   console.log("sortedData",data)

//   return (
//     <div className="w-full">
//       <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/10">Sr. No</th>
//             <th scope="col" className="py-3 w-1/40">Title</th>
//             <th scope="col" className="py-3 w-1/20">Status</th>
//             <th scope="col" className="py-3 w-1/30 !text-right pr-14">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedData.map((item, idx) => (
//             <tr className="!font-medium border-b" key={idx}>
//               <td className="!text-left pl-9 w-1/10">{idx + 1}</td>
//               <td className="py-3 text-left w-1/40">{item.title}</td>
//               <td className="py-3 text-left w-1/20">{isActiveStatus(item.applicableDate)}</td>
//               <td className="text-right pr-4 w-1/30">
//                 <IconButton
//                   color="primary"
//                   aria-label="view"
//                   onClick={() => handleViewPDF(item.url)}
//                 >
//                   <Visibility />
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   aria-label="edit"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(item._id)}
//                   aria-label="delete"
//                 >
//                   <DeleteOutline />
//                 </IconButton>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DocListemp;

// import React, { useState } from "react";
// import IconButton from "@mui/material/IconButton";
// import Visibility from "@mui/icons-material/Visibility";
// import EditOutlined from "@mui/icons-material/EditOutlined";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";
// import Pagination from "@mui/material/Pagination";
// import PaginationItem from "@mui/material/PaginationItem";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import axios from "axios";
// import {  useQueryClient } from "react-query";

// const isActiveStatus = (applicableDate) => {
//   const today = new Date();
//   const date = new Date(applicableDate);
//   return date >= today ? "Active" : "Inactive";
// };

// const DocListemp = ({ data = [], onEdit, onDelete, onViewPDF , sortField = "title", rowsPerPage = 10 }) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   // // Sort data based on the given sortField
//   // const sortedData = [...(data || [])].sort((a, b) => {
//   //   const fieldA =
//   //     sortField === "status"
//   //       ? isActiveStatus(a.applicableDate)
//   //       : (a[sortField] || "").toLowerCase();
//   //   const fieldB =
//   //     sortField === "status"
//   //       ? isActiveStatus(b.applicableDate)
//   //       : (b[sortField] || "").toLowerCase();
//   //   return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
//   // });

//   // Pagination logic
//   const totalPages = Math.ceil(data.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const currentData = data.slice(startIndex, startIndex + rowsPerPage);
//    const queryClient = useQueryClient();

//   // Action handlers
//   const handleEdit = (id) => onEdit(id);
//   const handleDelete = (id) => onDelete(id);
//   const handleViewPDF = (url) => onViewPDF(url);

//   const handleStatusToggle = async (id, currentStatus) => {
//     try {
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       await axios.patch(`${process.env.REACT_APP_API}/route/org/toggle-document-status/${id}`, {
//         status: newStatus
//       });
//       queryClient.invalidateQueries('getOrgDocs');
//     } catch (error) {
//       console.error('Error toggling status:', error);
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Table */}
//       {/* <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3 w-1/10">Sr. No</th>
//             <th scope="col" className="py-3 w-1/40">Title</th>
//             <th scope="col" className="py-3 w-1/20">Status</th>
//             <th scope="col" className="py-3 w-1/30 !text-right pr-14">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, idx) => (
//             <tr className="!font-medium border-b" key={item._id || idx}>
//               <td className="!text-left pl-9 w-1/10">{startIndex + idx + 1}</td>
//               <td className="py-3 text-left w-1/40">{item.title}</td>
//               <td className="py-3 text-left w-1/20">{isActiveStatus(item.applicableDate)}</td>
//               <td className="text-right pr-4 w-1/30">
//                 <IconButton
//                   color="primary"
//                   aria-label="view"
//                   onClick={() => handleViewPDF(item.url)}
//                 >
//                   <Visibility />
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   aria-label="edit"
//                   onClick={() => handleEdit(item._id)}
//                 >
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleDelete(item._id)}
//                   aria-label="delete"
//                 >
//                   <DeleteOutline />
//                 </IconButton>
//               </td>
//               <td className="py-3 text-left w-1/20">
//       {item.documentStatus === 'draft' ? (
//         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Draft</span>
//       ) : (
//         <button
//           onClick={() => handleStatusToggle(item._id, item.documentStatus)}
//           className={`px-2 py-1 rounded ${
//             item.documentStatus === 'active'
//               ? 'bg-red-500 text-white'
//               : 'bg-green-500 text-white'
//           }`}
//         >
//           {item.documentStatus === 'active' ? 'Deactivate' : 'Activate'}
//         </button>
//       )}
//     </td>
//             </tr>
//           ))}
//         </tbody>
//       </table> */}
//    <table className="min-w-full bg-white text-left !text-sm font-light">
//         <thead className="border-b bg-gray-200 font-medium">
//           <tr className="!font-semibold">
//             <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//             <th scope="col" className="py-3">Title</th>
//             <th scope="col" className="py-3">Status</th>
//             <th scope="col" className="py-3">Actions</th>
//             <th scope="col" className="py-3">Document Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentData.map((item, idx) => (
//             <tr className="!font-medium border-b" key={item._id || idx}>
//               <td className="!text-left pl-9">{startIndex + idx + 1}</td>
//               <td className="py-3 text-left">{item.title}</td>
//               <td className="py-3 text-left">{isActiveStatus(item.applicableDate)}</td>
//               <td className="text-right pr-4">
//                 <IconButton color="primary" onClick={() => handleViewPDF(item.url)}>
//                   <Visibility />
//                 </IconButton>
//                 <IconButton color="primary" onClick={() => handleEdit(item._id)}>
//                   <EditOutlined />
//                 </IconButton>
//                 <IconButton color="error" onClick={() => handleDelete(item._id)}>
//                   <DeleteOutline />
//                 </IconButton>
//               </td>
//               <td className="py-3 text-center">
//                 <button
//                   onClick={() => handleStatusToggle(item._id, item.documentStatus)}
//                   className={`px-3 py-1 rounded-full text-white ${
//                     item.documentStatus === 'active'
//                       ? 'bg-red-500 hover:bg-red-600'
//                       : 'bg-green-500 hover:bg-green-600'
//                   }`}
//                 >
//                   {item.documentStatus === 'active' ? 'Deactivate' : 'Activate'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {/* Pagination */}
//       <Stack
//         direction={"row"}
//         className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
//       >
//         <div>
//           <Typography variant="body2">
//             Showing page {currentPage} of {totalPages} pages
//           </Typography>
//         </div>

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
//               components={{
//                 previous: ArrowBackIcon,
//                 next: ArrowForwardIcon,
//               }}
//             />
//           )}
//         />
//       </Stack>
//     </div>
//   );
// };

// export default DocListemp;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";

const isActiveStatus = (applicableDate) => {
  const today = new Date();
  const date = new Date(applicableDate);
  return date >= today ? "Active" : "Inactive";
};

const DocListemp = ({
  data = [],
  onEdit,
  onDelete,
  onViewPDF,
  rowsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  // Action handlers
  const handleEdit = (id) => onEdit(id);
  const handleDelete = (id) => onDelete(id);
  const handleViewPDF = (url) => onViewPDF(url);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "draft" : "active";
      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/toggle-document-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the data
      queryClient.invalidateQueries("getOrgDocs");
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update document status");
    }
  };

  // const getDocumentStatusDisplay = (item) => {
  //   if (item.documentStatus === 'active') {
  //     return (
  //       <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
  //         Active
  //       </span>
  //     );
  //   } else {
  //     const activeDate = new Date(item.activeDate);
  //     const today = new Date();

  //     if (activeDate <= today) {
  //       return (
  //         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
  //           Pending Activation
  //         </span>
  //       );
  //     } else {
  //       return (
  //         <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
  //           Inactive (Active on {new Date(item.activeDate).toLocaleDateString()})
  //         </span>
  //       );
  //     }
  //   }
  // };

  const getDocumentStatusDisplay = (item) => {
    if (item.documentStatus === "active") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-medium">
          Inactive
        </span>
      );
    }
  };

  // Simplified button display

  return (
    <div className="w-full">
      {/* Table */}
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left pl-8 py-3 w-1/10">
              Sr. No
            </th>
            <th scope="col" className="py-3 w-1/40">
              Title
            </th>
            <th scope="col" className="py-3 w-1/20">
              Status
            </th>
            <th scope="col" className="py-3 w-1/20">
              Document Status
            </th>
            <th scope="col" className="py-3 w-1/30 !text-right pr-14">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => (
            <tr className="!font-medium border-b" key={item._id || idx}>
              <td className="!text-left pl-9 w-1/10">{startIndex + idx + 1}</td>
              <td className="py-3 text-left w-1/40">{item.title}</td>
              {/* <td className="py-3 text-left w-1/20">{isActiveStatus(item.applicableDate)}</td> */}
              <td className="py-3 text-center w-1/20">
                {getDocumentStatusDisplay(item)}
              </td>
              <td className="py-3 text-left w-1/20">
                {/* {item.documentStatus === 'draft' ? (
                  <button
                    onClick={() => handleStatusToggle(item._id, 'draft')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusToggle(item._id, 'active')}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Deactivate
                  </button>
                )} */}

                {item.documentStatus === "active" ? (
                  <button
                    onClick={() => handleStatusToggle(item._id, "active")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusToggle(item._id, "draft")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Activate
                  </button>
                )}
              </td>

              <td className="text-right pr-4 w-1/30">
                <IconButton
                  color="primary"
                  aria-label="view"
                  onClick={() => handleViewPDF(item.url)}
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="edit"
                  onClick={() => handleEdit(item._id)}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                  aria-label="delete"
                >
                  <DeleteOutline />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Stack
        direction={"row"}
        className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
      >
        <div>
          <Typography variant="body2">
            Showing page {currentPage} of {totalPages} pages
          </Typography>
        </div>

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
              components={{
                previous: ArrowBackIcon,
                next: ArrowForwardIcon,
              }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default DocListemp;
