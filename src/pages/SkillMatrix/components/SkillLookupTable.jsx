/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// // SkillLookupTable.js
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { West } from "@mui/icons-material";
// import { IconButton } from "@mui/material";

const SkillLookupTable = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();
  // const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("umm:", response.data);
        setIsLoading(true);
        setAssessments(response.data.data);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        handleAlert("Failed to fetch assessments", "error");
      }
    };

    fetchAssessments();
  }, [organisationId, authToken, currentPage]);

  const handleGotoInsightsk = () => {
    // const id = items._id;
    // navigate(`/organisation/${organisationId}/remote/info/${id}`);
  };
   // Status Color Mapping
   const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600';
      case 'in progress': return 'text-yellow-600';
      case 'pending': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Box>
      {isLoading && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}
      {/* <Typography variant="h5" mb={2}>
        Skill Lookup
      </Typography> */}

      <Grid container spacing={2}>
        <Grid item lg={8}>
          <TextField
            placeholder="Search Employee"
            variant="outlined"
            size="small"
            sx={{ bgcolor: "white" }}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Sr. No
                </th>

                <th scope="col" className="!text-left pl-8 py-3">
                  Employee Name
                </th>
                {/* <th scope="col" className="!text-left pl-8 py-3">
                  Manager Name
                </th> */}
                <th scope="col" className="!text-left pl-8 py-3">
                  {/* Status of Self + Supervisior Assessment */}
                  Assessment Status
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  OverallRating
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  More
                </th>
              </tr>
            </thead>
            <tbody>
              {assessments.length > 0 ? (
                assessments.map((assessment, idx) => (
                  <tr className="!font-medium border-b" key={assessment.srNo}>
                    <td className="!text-left pl-8 py-3">{idx + 1}</td>

                    <td className="py-3 pl-8">{assessment.employeeName}</td>
                    {/* <td className="py-3 pl-8">{assessment.managerName}</td> */}
                    <td className="py-3 pl-8">{assessment.status}</td>

                    <td className={`py-3 pl-8 ${getStatusColor(assessment.status)}`}>
                      {assessment.status}
                    </td>
                    <td className="py-3 pl-8">{assessment.overallRating}</td>
                    <td
                      onClick={handleGotoInsightsk}
                      className="py-3 pl-8 cursor-pointer text-blue-500"
                    >
                      Go to Insights
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No Employees data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
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
            onChange={(e, value) => setCurrentPage(value)}
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
        </Box>
      </Box>
    </Box>
  );
};

export default SkillLookupTable;



// ... above code with design
// import React, { useState, useEffect, useContext } from 'react';
// import { Box, CircularProgress, Grid, TextField, Typography, Pagination, PaginationItem, Button, Card, CardHeader, CardContent, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { TestContext } from '../../../State/Function/Main';
// import { UseContext } from '../../../State/UseState/UseContext';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import useAuthToken from "../../../hooks/Token/useAuth";

// const SkillLookupTable = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = useAuthToken();
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId, employeeId } = useParams();
//   const navigate = useNavigate();
//   const [assessments, setAssessments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/SkillLookuptableassessment`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         setAssessments(response.data.data);
//         setTotalPages(response.data.totalPages);
//       } catch (error) {
//         handleAlert('Failed to fetch assessments', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAssessments();
//   }, [organisationId, authToken, currentPage]);

//   const handleViewAssessment = (employeeId, assessmentId) => {
//     navigate(`/organisation/${organisationId}/employee/${employeeId}/assessment/${assessmentId}`);
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-lg">
//       <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//         <Typography variant="h5" className="text-3xl font-bold">Skill Lookup</Typography>
//       </CardHeader>

//       <CardContent className="p-6">
//         {/* Search Section */}
//         <div className="flex items-center space-x-2 mb-6">
//           <div className="relative flex-1">
//             <TextField
//               placeholder="Search Employee"
//               variant="outlined"
//               size="small"
//               fullWidth
//               sx={{ bgcolor: 'white', paddingLeft: 3 }}
//             />
//           </div>
//           <Button className="rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
//             Search
//           </Button>
//         </div>

//         {/* Table Section */}
//         <div className="rounded-lg border border-gray-200 overflow-hidden">
//           <Table className="min-w-full">
//             <TableHead>
//               <TableRow className="bg-gray-100">
//                 <TableCell className="font-bold text-gray-700">Sr. No</TableCell>
//                 <TableCell className="font-bold text-gray-700">Employee Name</TableCell>
//                 <TableCell className="font-bold text-gray-700">Status</TableCell>
//                 <TableCell className="font-bold text-gray-700">Overall Rating</TableCell>
//                 <TableCell className="font-bold text-gray-700 text-right">Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <TableRow key={assessment._id} className="hover:bg-gray-50 transition-colors">
//                     <TableCell>{idx + 1}</TableCell>
//                     <TableCell>{assessment.employeeName}</TableCell>
//                     <TableCell>
//                       <div className={`font-semibold px-2 py-1 rounded-full ${assessment.status === 'Completed' ? 'bg-green-200' : 'bg-yellow-200'}`}>
//                         {assessment.status}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {assessment.overallRating ? (
//                         <div className="flex items-center">
//                           <span className="font-semibold">{assessment.overallRating.toFixed(1)}</span>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400">N/A</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => handleViewAssessment(assessment.employeeId, assessment._id)}
//                       >
//                         View Details
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center text-gray-500">
//                     No assessments found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination Section */}
//         <div className="flex items-center justify-between space-x-2 py-4">
//           <Typography variant="body2" className="text-gray-600">
//             Showing page {currentPage} of {totalPages}
//           </Typography>
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(e, value) => setCurrentPage(value)}
//             renderItem={(item) => (
//               <PaginationItem
//                 {...item}
//                 components={{
//                   previous: ArrowBackIcon,
//                   next: ArrowForwardIcon,
//                 }}
//               />
//             )}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SkillLookupTable;

//api change
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   Box,
//   CircularProgress,
//   Grid,
//   TextField,
//   Typography,
//   Pagination,
//   PaginationItem,
//   Button,
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { TestContext } from '../../../State/Function/Main';
// import { UseContext } from '../../../State/UseState/UseContext';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// import useAuthToken from "../../../hooks/Token/useAuth";

// const SkillLookupTable = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = useAuthToken();
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId,employeeId,} = useParams();
//   const navigate = useNavigate();
//   const [assessments, setAssessments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/SkillLookuptableassessment`,
//         // `${process.env.REACT_APP_API}/route/organisation/${organisationId}/employee/${employeeId}/assessment/${assessmentId}`,

//           {
//             headers: {
//               Authorization: authToken,
//             },

//           }
//         );
//         console.log('API Response:', response.data);
//         setAssessments(response.data.data); // Assuming `data` contains the array of assessments
//         setTotalPages(response.data.totalPages); // Assuming `totalPages` is part of the response
//       } catch (error) {
//         handleAlert('Failed to fetch assessments', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAssessments();
//   }, [organisationId, authToken, currentPage]);

//   const handleViewAssessment = (employeeId, assessmentId) => {
//     navigate(
//       `/organisation/${organisationId}/employee/${employeeId}/assessment/${assessmentId}`
//     );
//   };

//   return (
//     <Box>
//       {isLoading && (
//         <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//           <CircularProgress />
//         </div>
//       )}
//       <Typography variant="h5" mb={2}>
//         Skill Lookup
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item lg={8}>
//           <TextField placeholder="Search Employee" variant="outlined" size="small" sx={{ bgcolor: 'white' }} />
//         </Grid>
//       </Grid>

//       <Box mt={2}>
//         <div className="overflow-auto border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr>
//                 <th className="!text-left pl-8 py-3">Sr. No</th>
//                 <th className="!text-left pl-8 py-3">Employee Name</th>
//                 <th className="!text-left pl-8 py-3">Status</th>
//                 <th className="!text-left pl-8 py-3">Overall Rating</th>
//                 <th className="!text-left pl-8 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <tr key={assessment._id} className="border-b">
//                     <td className="pl-8 py-3">{idx + 1}</td>
//                     <td className="pl-8 py-3">{assessment.employeeName}</td>
//                     <td className="pl-8 py-3">{assessment.status}</td>
//                     <td className="pl-8 py-3">{assessment.overallRating ?? 'N/A'}</td>
//                     <td className="pl-8 py-3">
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() =>
//                           handleViewAssessment(assessment.employeeId, assessment._id)
//                         }
//                       >
//                         View Details
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center py-3">
//                     No assessments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="body2">
//             Showing page {currentPage} of {totalPages}
//           </Typography>
//           <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(e, value) => setCurrentPage(value)}
//             renderItem={(item) => (
//               <PaginationItem
//                 {...item}
//                 components={{
//                   previous: ArrowBackIcon,
//                   next: ArrowForwardIcon,
//                 }}
//               />
//             )}
//           />
//         </Box>
//       </Box>
//     </Box>

//   );
// };

// export default SkillLookupTable;

//api change widh vo.dev

// import React, { useState, useEffect, useContext } from 'react';
// import { Box, CircularProgress, Grid, TextField, Typography, Button } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { TestContext } from '../../../State/Function/Main';
// import { UseContext } from '../../../State/UseState/UseContext';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import useAuthToken from "../../../hooks/Token/useAuth";

// // TailwindCSS design adjustments
// import { Card, CardHeader, CardContent, Table, TableHead, TableBody, TableRow, TableCell, Pagination } from '@mui/material';
// // import { Badge } from 'your-badge-component-library';  // If it's a third-party library
// // import { Loader2 } from 'your-loader-library';        // If it's a custom loader
// import { Search } from '@mui/icons-material';         // If you're using MUI icons
// import { Star } from '@mui/icons-material';            // For star icon

// const SkillLookupTable = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = useAuthToken();
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId, employeeId } = useParams();
//   const navigate = useNavigate();
//   const [assessments, setAssessments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/SkillLookuptableassessment`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         console.log('API Response:', response.data);
//         setAssessments(response.data.data); // Assuming `data` contains the array of assessments
//         setTotalPages(response.data.totalPages); // Assuming `totalPages` is part of the response
//       } catch (error) {
//         handleAlert('Failed to fetch assessments', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAssessments();
//   }, [organisationId, authToken, currentPage]);

//   const handleViewAssessment = (employeeId, assessmentId) => {
//     navigate(
//       `/organisation/${organisationId}/employee/${employeeId}/assessment/${assessmentId}`
//     );
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-lg">
//       <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//         <Typography variant="h5" className="text-3xl font-bold">Skill Lookup</Typography>
//       </CardHeader>

//       <CardContent className="p-6">
//         {/* Search Section */}
//         <div className="flex items-center space-x-2 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <TextField
//               placeholder="Search Employee"
//               variant="outlined"
//               size="small"
//               fullWidth
//               className="pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 focus:border-purple-500 transition-colors"
//             />
//           </div>
//           <Button className="rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
//             Search
//           </Button>
//         </div>

//         {/* Table Section */}
//         <div className="rounded-lg border border-gray-200 overflow-hidden">
//           <Table className="min-w-full">
//             <TableHead>
//               <TableRow className="bg-gray-100">
//                 <TableCell className="font-bold text-gray-700">Sr. No</TableCell>
//                 <TableCell className="font-bold text-gray-700">Employee Name</TableCell>
//                 <TableCell className="font-bold text-gray-700">Status</TableCell>
//                 <TableCell className="font-bold text-gray-700">Overall Rating</TableCell>
//                 <TableCell className="font-bold text-gray-700 text-right">Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center">
//                     {/* <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" /> */}
//                   </TableCell>
//                 </TableRow>
//               ) : assessments.length > 0 ? (
//                 assessments.map((assessment, idx) => (
//                   <TableRow key={assessment._id} className="hover:bg-gray-50 transition-colors">
//                     <TableCell>{idx + 1}</TableCell>
//                     <TableCell className="font-semibold text-gray-700">{assessment.employeeName}</TableCell>
//                     <TableCell>
//                       <div className={`(assessment.status)} font-semibold px-2 py-1 rounded-full`}>
//                         {assessment.status}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {assessment.overallRating ? (
//                         <div className="flex items-center">
//                           <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
//                           <span className="font-semibold">{assessment.overallRating.toFixed(1)}</span>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400">N/A</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         size="sm"
//                         className="bg-purple-600 hover:bg-purple-700 transition-colors"
//                         onClick={() => handleViewAssessment(assessment.employeeId, assessment._id)}
//                       >
//                         View Details
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={5} className="h-24 text-center text-gray-500">
//                     No assessments found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination Section */}
//         <div className="flex items-center justify-between space-x-2 py-4">
//           <div className="text-sm text-gray-600">
//             Showing page {currentPage} of {totalPages}
//           </div>
//           {/* <Pagination
//             count={totalPages}
//             page={currentPage}
//             onChange={(e, value) => setCurrentPage(value)}
//             renderItem={(item) => (
//             //   <PaginationItem
//             //     {...item}
//             //     components={{
//             //       previous: ArrowBackIcon,
//             //       next: ArrowForwardIcon,
//             //     }}
//             //   />
//             )}
//           /> */}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SkillLookupTable;

// //advance design
// import { Search, Star } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"

// export default function SkillLookup() {
//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-lg">
//       <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//         <CardTitle className="text-3xl font-bold">Skill Lookup</CardTitle>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div className="flex items-center space-x-2 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input placeholder="Search Employee" className="pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 focus:border-purple-500 transition-colors" />
//           </div>
//           <Button className="rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
//             Search
//           </Button>
//         </div>

//         <div className="rounded-lg border border-gray-200 overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gray-100">
//                 <TableHead className="font-bold text-gray-700">Sr. No</TableHead>
//                 <TableHead className="font-bold text-gray-700">Employee Name</TableHead>
//                 <TableHead className="font-bold text-gray-700">Status</TableHead>
//                 <TableHead className="font-bold text-gray-700">Overall Rating</TableHead>
//                 <TableHead className="font-bold text-gray-700 text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {/* Example row - you can remove this and populate with your data */}
//               <TableRow className="hover:bg-gray-50 transition-colors">
//                 <TableCell className="font-medium">1</TableCell>
//                 <TableCell className="font-semibold text-gray-700">John Doe</TableCell>
//                 <TableCell>
//                   <Badge className="bg-green-100 text-green-800 font-semibold px-2 py-1 rounded-full">
//                     Completed
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center">
//                     <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
//                     <span className="font-semibold">4.5</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Button
//                     size="sm"
//                     className="bg-purple-600 hover:bg-purple-700 transition-colors"
//                   >
//                     View Details
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>

//         <div className="flex items-center justify-between space-x-2 py-4">
//           <div className="text-sm text-gray-600">
//             Showing page 1 of 1
//           </div>
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious href="#" className="hover:bg-purple-100 transition-colors" />
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href="#" isActive className="bg-purple-600 text-white">
//                   1
//                 </PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationNext href="#" className="hover:bg-purple-100 transition-colors" />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
