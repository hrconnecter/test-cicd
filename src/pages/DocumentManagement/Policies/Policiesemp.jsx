
// import React, { useContext } from "react";
// import { IconButton } from "@mui/material";
// import { Info } from "@mui/icons-material";
// import VisibilityIcon from '@mui/icons-material/Visibility';  // Eye icon for viewing the document
// // import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
// import axios from "axios";
// import { useQuery } from "react-query";


// // import UserProfile from "../../../hooks/UserData/useUser";
// import ViewDocumentSkeleton from "../components/ViewDocumentSkeleton";
// import { UseContext } from "../../../State/UseState/UseContext";
// // import { TestContext } from "../../../State/Function/Main";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const Policiesemp = () => {
//   // const { handleAlert } = useContext(TestContext);
//   // const { getCurrentUser } = UserProfile();
//   // const user = getCurrentUser();
//   // const employeeId = user && user._id;
//   // const organizationId = user && user.organizationId;
//   const { cookies } = useContext(UseContext);
//   const token = cookies["aegis"];

//   // Using React Query to fetch documents from the updated API
//   const { data: getRecordOfEmployee, isLoading } = useQuery(
//     ["getRecordOfDocs"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdocs/policies`,
//         {
//           headers: { Authorization: token },
//         }
//       );
//       return response.data.doc;  // Assuming the response structure includes `doc`
//     }
//   );

//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank"); // Open PDF in a new tab
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };

//   return (
//     <>
//     <BoxComponent>
//     <HeadingOneLineInfo heading={" Company Policies and Procedures"} />

//           {isLoading ? (
//             <ViewDocumentSkeleton />
//           ) : getRecordOfEmployee?.length > 0 ? (
//             <div className="w-full p-4">
//               <table className="min-w-full bg-white text-left text-sm font-light table-auto">
//                 <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                   <tr className="font-semibold">
//                     <th className="text-left pl-6 py-3">SR NO</th>
//                     <th className="px-6 py-3">File Name</th>
//                     <th className="px-8 py-3">Document Type</th>
//                     <th className="px-6 py-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getRecordOfEmployee.map((data, id) => {
//                     return (
//                       <tr className="font-medium border-b" key={id}>
//                         <td className="text-left pl-6 py-3">{id + 1}</td>
//                         <td className="py-3 pl-6">{data.title}</td>
//                         <td className="py-3 pl-6">{data.type}</td>
//                         <td className="whitespace-nowrap px-6 py-2 flex gap-2">
//                           {/* Eye Icon for View PDF */}
//                           <IconButton
//                             color="primary"
//                             onClick={() => handleViewPDF(data.url)}
//                           >
//                             <VisibilityIcon />
//                           </IconButton>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//               <article className="flex items-center mb-1 text-red-500 gap-2">
//                 <Info className="!text-2xl" />
//                 <h1 className="text-lg font-semibold">No Documents Found</h1>
//               </article>
//               <p>No documents available.</p>
//             </section>
//           )}
//         {/* </article>
//       </section> */}
//          </BoxComponent>
//     </>
//   );
// };

// export default Policiesemp;



// import React, { useContext, useState } from "react";
// import {
//   IconButton,
//   Pagination,
//   PaginationItem,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { Info } from "@mui/icons-material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import axios from "axios";
// import { useQuery } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import ViewDocumentSkeleton from "../components/ViewDocumentSkeleton";

// const Policiesemp = () => {
//   const { cookies } = useContext(UseContext);
//   const token = cookies["aegis"];

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10; // Number of documents per page
  

//   // Fetch documents data
//   const { data, isLoading } = useQuery(
//     ["getDocuments", currentPage],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdocs/policies`,
//         {
//           headers: { Authorization: token },
//         }
//       );
//       return response.data; // Response contains `doc`, `totalPages`, etc.
//     }
//   );

//   const documents = data?.doc || [];
//   const totalPages = data?.totalPages || 1;
//   const totalDocuments = data?.totalDocuments || 0;

//   // Open PDF function
//   const handleViewPDF = (url) => {
//     if (url) {
//       window.open(url, "_blank");
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };

//   return (
//     <div className="w-full">
//       <Typography variant="h5" className="mb-4">
//         Company Policies and Procedures
//       </Typography>

//       {isLoading ? (
//         <ViewDocumentSkeleton />
//       ) : documents.length > 0 ? (
//         <>
//           {/* Table for documents */}
//           <table className="min-w-full bg-white text-left text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium">
//               <tr>
//                 <th className="pl-6 py-3">SR NO</th>
//                 <th className="py-3">File Name</th>
//                 <th className="py-3">Document Type</th>
//                 <th className="py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.map((doc, index) => (
//                 <tr key={doc._id} className="border-b">
//                   <td className="pl-6 py-3">
//                     {(currentPage - 1) * rowsPerPage + index + 1}
//                   </td>
//                   <td className="py-3">{doc.title}</td>
//                   <td className="py-3">{doc.type}</td>
//                   <td className="py-3">
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleViewPDF(doc.url)}
//                     >
//                       <VisibilityIcon />
//                     </IconButton>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             className="border-t px-4 py-2"
//           >
//             <Typography variant="body2">
//               Showing page {currentPage} of {totalPages} ({totalDocuments}{" "}
//               documents)
//             </Typography>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               color="primary"
//               shape="rounded"
//               onChange={(event, value) => setCurrentPage(value)}
//               renderItem={(item) => (
//                 <PaginationItem
//                   {...item}
//                   components={{
//                     previous: ArrowBackIcon,
//                     next: ArrowForwardIcon,
//                   }}
//                 />
//               )}
//             />
//           </Stack>
//         </>
//       ) : (
//         <div className="text-center py-6">
//           <Info color="error" fontSize="large" />
//           <Typography variant="h6" className="mt-2">
//             No Documents Found
//           </Typography>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Policiesemp;




import React, { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Eye icon for viewing the document
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useQuery } from "react-query";

import ViewDocumentSkeleton from "../components/ViewDocumentSkeleton";
import { UseContext } from "../../../State/UseState/UseContext";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Policiesemp = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // const { data: getRecordOfEmployee, isLoading } = useQuery(
  //   ["getRecordOfDocs1"],
  //   async () => {
  //     const response = await axios.get(
  //       // `${process.env.REACT_APP_API}/route/org/getdocs/policies`,
  //       // `${process.env.REACT_APP_API}/route/org/getdocs/policies?documentStatus=active`,
  //       `${process.env.REACT_APP_API}/route/org/getdocs/policies?documentStatus=active`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     return response.data.doc; // Assuming the response structure includes `doc`
  //   }
  // );


  const { data: getRecordOfEmployee, isLoading } = useQuery(
    ["getRecordOfDocs1"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdocs/policies?documentStatus=active`,
        {
          headers: { Authorization: token },
        }
      );
      return response.data.doc;
    }
  );
  

  const totalPages = Math.ceil((getRecordOfEmployee?.length || 0) / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = getRecordOfEmployee?.slice(startIndex, startIndex + rowsPerPage) || [];

  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open PDF in a new tab
    } else {
      alert("PDF URL is not available.");
    }
  };

  return ( 
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading={"Company Policies and Procedures"} />

        {isLoading ? (
          <ViewDocumentSkeleton />
        ) : getRecordOfEmployee?.length > 0 ? (
          <div className="w-full p-4">
            <table className="min-w-full bg-white text-left text-sm font-light table-auto">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="font-semibold">
                  <th className="text-left pl-6 py-3">SR NO</th>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-8 py-3">Document Type</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((data, id) => {
                  return (
                    <tr className="font-medium border-b" key={id}>
                      <td className="text-left pl-6 py-3">{startIndex + id + 1}</td>
                      <td className="py-3 pl-6">{data.title}</td>
                      <td className="py-3 pl-6">{data.type}</td>
                      <td className="whitespace-nowrap px-6 py-2 flex gap-2">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewPDF(data.url)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
        ) : (
          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-lg font-semibold">No Documents Found</h1>
            </article>
            <p>No documents available.</p>
          </section>
        )}
      </BoxComponent>
    </>
  );
};

export default Policiesemp;
