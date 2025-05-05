
//tour
// import { useState } from "react"; 
// import { Link, useParams } from "react-router-dom";
// import Joyride, { STATUS } from 'react-joyride';
// import { motion } from "framer-motion";  // Import motion for cursor animation
// import {
//   FaPlus,
//   FaCheckCircle,
//   FaListAlt,
//   FaFileInvoiceDollar,
//   FaPlay,
// } from "react-icons/fa";
// import { Box, Card, CardContent, Typography, Grid, Button } from "@mui/material";
// import UserProfile from "../../hooks/UserData/useUser";

// function Dashboard() {
//   const { organisationId } = useParams();
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
  
//   const [runTour, setRunTour] = useState(false);
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

//   const tourSteps = [
//     {
//       target: '.welcome-section',
//       content: 'Welcome to Aegis SpendWise - Your complete expense management solution',
//       placement: 'bottom',
//     },
//     {
//       target: '.create-expense-section',
//       content: 'Create and submit new expenses quickly with proper documentation',
//       placement: 'bottom',
//     },
//     {
//       target: '.approvals-section',
//       content: 'Review and approve team expenses efficiently',
//       placement: 'bottom',
//       disableBeacon: true,
//     },
//     {
//       target: '.manage-expense-section',
//       content: 'Track and manage all your expense records in one place',
//       placement: 'bottom',
//     },
//     {
//       target: '.guidelines-section',
//       content: 'Review important company expense policies and guidelines',
//       placement: 'top',
//     }
//   ];

//   const handleJoyrideCallback = (data) => {
//     const { status, step } = data;
    
//     if (status === STATUS.RUNNING && step) {
//       const element = document.querySelector(step.target);
//       if (element) {
//         const rect = element.getBoundingClientRect();
//         setCursorPos({
//           x: rect.left + rect.width / 2,
//           y: rect.top + rect.height / 2
//         });
//       }
//     }
//   };

//   return (
//     <Box className="container mx-auto px-6 py-8">
//       {/* Start Tour Button */}
//       <Button
//         startIcon={<FaPlay />}
//         variant="contained"
//         color="primary"
//         onClick={() => setRunTour(true)}
//         className="mb-4 absolute top-4 right-4"
//       >
//         Start Tour
//       </Button>

//       {/* Animated Cursor */}
//       <motion.div
//         className="fixed w-6 h-6 bg-blue-500 rounded-full shadow-lg"
//         animate={{ x: cursorPos.x, y: cursorPos.y }}
//         transition={{ type: "spring", stiffness: 100 }}
//         style={{ position: "fixed", zIndex: 2000 }}
//       />

//       {/* Joyride Tour */}
//       <Joyride
//         steps={tourSteps}
//         run={runTour}
//         continuous
//         showProgress
//         showSkipButton
//         callback={handleJoyrideCallback}
//         styles={{
//           options: {
//             primaryColor: '#2563eb',
//             zIndex: 1000,
//           },
//           tooltip: {
//             fontSize: '16px',
//           },
//           buttonNext: {
//             backgroundColor: '#2563eb',
//           },
//           buttonBack: {
//             marginRight: 10,
//           }
//         }}
//       />

//       {/* Dashboard Content */}
//       <Typography variant="h4" className="welcome-section text-center text-gray-900 mb-8 font-bold">
//         Welcome to Aegis SpendWise
//       </Typography>

//       <Typography variant="h6" className="text-center text-gray-900 mb-8 mt-3">
//         Streamline your expense management with our intuitive Expense Management system.
//       </Typography>

//       <Grid container spacing={4} className="mb-8 mt-6" justifyContent={role === "Employee" ? "center" : "flex-start"}>
//         {/* Create Expense Card */}
//         <Grid item xs={12} md={4}>
//           <Card className="create-expense-section hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-blue-100">
//                   <FaPlus className="text-4xl text-blue-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2 text-center text-gray-900 font-bold">
//                 Create Expense
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Submit new expenses and reports quickly
//               </Typography>
//               <Link to={`/organisation/${organisationId}/ExpenseManagment/create`}
//                 className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                 Create New
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Approvals Section (Visible for Managers/Admins) */}
//         {role !== "Employee" && (
//           <Grid item xs={12} md={4}>
//             <Card className="approvals-section hover:shadow-lg transition-shadow duration-300">
//               <CardContent className="text-center">
//                 <Box className="flex items-center justify-center mb-4">
//                   <div className="p-4 rounded-full bg-green-100">
//                     <FaCheckCircle className="text-4xl text-green-600" />
//                   </div>
//                 </Box>
//                 <Typography variant="h6" className="mb-2 text-center text-gray-900 font-bold">
//                   Approvals
//                 </Typography>
//                 <Typography className="text-gray-600 mb-4 p-2 my-2">
//                   Review and approve pending expenses
//                 </Typography>
//                 <Link to={`/organisation/${organisationId}/ExpenseManagment/approve`}
//                   className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//                   View Approvals
//                 </Link>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );
// }

// export default Dashboard;


//tour
// import { useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import Joyride, { STATUS } from 'react-joyride';
// import MoveCursor from 'react-move-cursor';
// import {
//   FaPlus,
//   FaCheckCircle,
//   FaListAlt,
//   FaFileInvoiceDollar,
//   FaPlay,
// } from "react-icons/fa";
// import { Box, Card, CardContent, Typography, Grid, Button } from "@mui/material";
// import UserProfile from "../../hooks/UserData/useUser";

// function Dashboard() {
//   const { organisationId } = useParams();
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
  
//   const [runTour, setRunTour] = useState(false);
//   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

//   const tourSteps = [
//     {
//       target: '.welcome-section',
//       content: 'Welcome to Aegis SpendWise - Your complete expense management solution',
//       placement: 'bottom',
//     },
//     {
//       target: '.create-expense-section',
//       content: 'Create and submit new expenses quickly with proper documentation',
//       placement: 'bottom',
//     },
//     {
//       target: '.approvals-section',
//       content: 'Review and approve team expenses efficiently',
//       placement: 'bottom',
//       disableBeacon: true,
//     },
//     {
//       target: '.manage-expense-section',
//       content: 'Track and manage all your expense records in one place',
//       placement: 'bottom',
//     },
//     {
//       target: '.guidelines-section',
//       content: 'Review important company expense policies and guidelines',
//       placement: 'top',
//     }
//   ];

//   const handleJoyrideCallback = (data) => {
//     const { status, step } = data;
    
//     if (status === STATUS.RUNNING) {
//       const element = document.querySelector(step.target);
//       if (element) {
//         const rect = element.getBoundingClientRect();
//         setCursorPosition({
//           x: rect.x + rect.width/2,
//           y: rect.y + rect.height/2
//         });
//       }
//     }
//   };

//   return (
//     <Box className="container mx-auto px-6 py-8">
//       <Button
//         startIcon={<FaPlay />}
//         variant="contained"
//         color="primary"
//         onClick={() => setRunTour(true)}
//         className="mb-4 absolute top-4 right-4"
//       >
//         Start Tour
//       </Button>

//       <Joyride
//         steps={tourSteps}
//         run={runTour}
//         continuous
//         showProgress
//         showSkipButton
//         callback={handleJoyrideCallback}
//         styles={{
//           options: {
//             primaryColor: '#2563eb',
//             zIndex: 1000,
//           },
//           tooltip: {
//             fontSize: '16px',
//           },
//           buttonNext: {
//             backgroundColor: '#2563eb',
//           },
//           buttonBack: {
//             marginRight: 10,
//           }
//         }}
//       />

//       <MoveCursor
//         x={cursorPosition.x}
//         y={cursorPosition.y}
//         easing="easeOutQuad"
//         duration={800}
//         zIndex={2000}
//       />

//       <Typography
//         variant="h4"
//         className="welcome-section text-center text-gray-900 mb-8 font-bold">
//         Welcome to Aegis SpendWise
//       </Typography>

//       <Typography
//         variant="h6"
//         className="text-center text-gray-900 mb-8 mt-3">
//         Streamline your expense management with our intuitive Expense Management system.
//       </Typography>

//       <Grid 
//         container 
//         spacing={4} 
//         className="mb-8 mt-6"
//         justifyContent={role === "Employee" ? "center" : "flex-start"}
//       >
//         <Grid item xs={12} md={4}>
//           <Card className="create-expense-section hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-blue-100">
//                   <FaPlus className="text-4xl text-blue-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2 text-center text-gray-900 font-bold">
//                 Create Expense
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Submit new expenses and reports quickly
//               </Typography>
//               <Link
//                 to={`/organisation/${organisationId}/ExpenseManagment/create`}
//                 className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create New
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>

//         {role !== "Employee" && (
//           <Grid item xs={12} md={4}>
//             <Card className="approvals-section hover:shadow-lg transition-shadow duration-300">
//               <CardContent className="text-center">
//                 <Box className="flex items-center justify-center mb-4">
//                   <div className="p-4 rounded-full bg-green-100">
//                     <FaCheckCircle className="text-4xl text-green-600" />
//                   </div>
//                 </Box>
//                 <Typography variant="h6" className="mb-2 text-center text-gray-900 font-bold">
//                   Approvals
//                 </Typography>
//                 <Typography className="text-gray-600 mb-4 p-2 my-2">
//                   Review and approve pending expenses
//                 </Typography>
//                 <Link
//                   to={`/organisation/${organisationId}/ExpenseManagment/approve`}
//                   className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   View Approvals
//                 </Link>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}

//         <Grid item xs={12} md={4}>
//           <Card className="manage-expense-section hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-purple-100">
//                   <FaListAlt className="text-4xl text-purple-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2 text-center text-gray-900 font-bold">
//                 Manage Expenses
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Track and manage all your expenses
//               </Typography>
//               <Link
//                 to={`/organisation/${organisationId}/ExpenseManagment/manage`}
//                 className="block w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 Manage Expenses
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card className="guidelines-section mt-8 mb-8 bg-gradient-to-r from-gray-50 to-gray-100">
//         <CardContent className="p-8">
//           <Typography
//             variant="h5"
//             className="flex items-center mb-6 font-bold text-gray-800"
//           >
//             <FaFileInvoiceDollar className="mr-3 text-blue-500" />
//             Company Expense Guidelines
//           </Typography>
//           <Grid container spacing={6}>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-blue-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Submission Timeline
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   All expenses must be submitted within 30 days of occurrence
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-green-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Documentation
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Original receipts required for all expenses above ₹100
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-purple-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Processing
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Expenses are typically processed within 3-5 business days
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Dashboard;


import { Link, useParams } from "react-router-dom";
import {
  FaPlus,
  FaCheckCircle,
  FaListAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import UserProfile from "../../hooks/UserData/useUser";

function Dashboard() {
  const { organisationId } = useParams();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  

  return (
    <Box className="container mx-auto px-6 py-8">
      <Typography
        variant="h4"
        className="text-center text-gray-900 mb-8 font-bold  ">
        Welcome to Aegis SpendRite
      </Typography>
      <Typography
        variant="h6"
        className="text-center text-gray-900 mb-8  mt-3 ">
        Streamline your expense management with our intuitive Expense Managment .
      </Typography>

      <br />

      <Grid 
        container 
        spacing={4} 
        className="mb-8 mt-6"
        justifyContent={role === "Employee" ? "center" : "flex-start"}
      >
        <Grid item xs={12} md={4}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="text-center">
              <Box className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-blue-100">
                  <FaPlus className="text-4xl text-blue-600" />
                </div>
              </Box>
              <Typography variant="h6" className="mb-2 text-center text-gray-900  font-bold ">
                Create Expense
              </Typography>
              <Typography className="text-gray-600 mb-4 p-2 my-2">
                Submit new expenses and reports quickly
              </Typography>
              <Link
                to={`/organisation/${organisationId}/ExpenseManagment/create`} 
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {role !== "Employee" && (
          <Grid item xs={12} md={4}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="text-center">
                <Box className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-100">
                    <FaCheckCircle className="text-4xl text-green-600" />
                  </div>
                </Box>
                <Typography variant="h6" className="mb-2  text-center text-gray-900  font-bold">
                  Approvals
                </Typography>
                <Typography className="text-gray-600 mb-4 p-2 my-2">
                  Review and approve pending expenses
                </Typography>
                <Link
                  to={`/organisation/${organisationId}/ExpenseManagment/approve`}
                  className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Approvals
                </Link>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="text-center">
              <Box className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-purple-100">
                  <FaListAlt className="text-4xl text-purple-600" />
                </div>
              </Box>
              <Typography variant="h6" className="mb-2  text-center text-gray-900  font-bold">
                Manage Expenses
              </Typography>
              <Typography className="text-gray-600 mb-4 p-2 my-2">
                Track and manage all your expenses
              </Typography>
              <Link
                to={`/organisation/${organisationId}/ExpenseManagment/manage`}
                className="block w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Manage Expenses
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <br />

      <Card className="mt-8 mb-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-8">
          <Typography
            variant="h5"
            className="flex items-center mb-6 font-bold text-gray-800"
          >
            <FaFileInvoiceDollar className="mr-3 text-blue-500" />
            Company Expense Guidelines
          </Typography>
          <br />
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box className="border-l-4 border-blue-500 pl-4">
                <Typography variant="h6" className="font-bold mb-2">
                  Submission Timeline
                </Typography>
                <Typography className="text-gray-600">
                  All expenses must be submitted within 30 days of occurrence
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="border-l-4 border-green-500 pl-4">
                <Typography variant="h6" className="font-bold mb-2">
                  Documentation
                </Typography>
                <Typography className="text-gray-600">
                  Original receipts required for all expenses above ₹100
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="border-l-4 border-purple-500 pl-4">
                <Typography variant="h6" className="font-bold mb-2">
                  Processing
                </Typography>
                <Typography className="text-gray-600">
                  Expenses are typically processed within 3-5 business days
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;



// import { Link, useParams } from "react-router-dom";
// import {
//   FaPlus,
//   FaCheckCircle,
//   FaListAlt,
//   FaFileInvoiceDollar,
// } from "react-icons/fa";
// import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
// import UserProfile from "../../hooks/UserData/useUser";

// function Dashboard() {
//   const { organisationId } = useParams();
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   return (
//     <Box className="container mx-auto px-6 py-8">
//       <Typography
//         variant="h4"
//         className="text-center text-gray-900 mb-8 font-bold  ">
//         Welcome to Aegis SpendWise
//       </Typography>
//       <Typography
//         variant="h6"
//         className="text-center text-gray-900 mb-8  mt-3 ">
//         Streamline your expense management with our intuitive Expense Managment .
//       </Typography>

//       <br />

//       {/* Main Actions Section */}
//       <Grid container spacing={4} className="mb-8 mt-6">
//         <Grid item xs={12} md={4}>
//           <Card className="hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-blue-100">
//                   <FaPlus className="text-4xl text-blue-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2 text-center text-gray-900  font-bold ">
//                 Create Expense
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Submit new expenses and reports quickly
//               </Typography>
//               <Link
//                 to={`/organisation/${organisationId}/ExpenseManagment/create`} 
//                 className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create New
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>

//         {role !== "Employee" && (
//         <Grid item xs={12} md={4}>
//           <Card className="hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-green-100">
//                   <FaCheckCircle className="text-4xl text-green-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2  text-center text-gray-900  font-bold">
//                 Approvals
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Review and approve pending expenses
//               </Typography>
//               <Link
//                 to={`/organisation/${organisationId}/ExpenseManagment/approve`}
//                 className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 View Approvals
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>
// )}

//         <Grid item xs={12} md={4}>
//           <Card className="hover:shadow-lg transition-shadow duration-300">
//             <CardContent className="text-center">
//               <Box className="flex items-center justify-center mb-4">
//                 <div className="p-4 rounded-full bg-purple-100">
//                   <FaListAlt className="text-4xl text-purple-600" />
//                 </div>
//               </Box>
//               <Typography variant="h6" className="mb-2  text-center text-gray-900  font-bold">
//                 Manage Expenses
//               </Typography>
//               <Typography className="text-gray-600 mb-4 p-2 my-2">
//                 Track and manage all your expenses
//               </Typography>
//               <Link
//                 to={`/organisation/${organisationId}/ExpenseManagment/manage`}
//                 className="block w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//               >
//                 Manage Expenses
//               </Link>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <br />

//       <Card className="mt-8 mb-8 bg-gradient-to-r from-gray-50 to-gray-100">
//         <CardContent className="p-8">
//           <Typography
//             variant="h5"
//             className="flex items-center mb-6 font-bold text-gray-800"
//           >
//             <FaFileInvoiceDollar className="mr-3 text-blue-500" />
//             Company Expense Guidelines
//           </Typography>
//           <br />
//           <Grid container spacing={6}>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-blue-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Submission Timeline
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   All expenses must be submitted within 30 days of occurrence
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-green-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Documentation
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Original receipts required for all expenses above ₹100
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Box className="border-l-4 border-purple-500 pl-4">
//                 <Typography variant="h6" className="font-bold mb-2">
//                   Processing
//                 </Typography>
//                 <Typography className="text-gray-600">
//                   Expenses are typically processed within 3-5 business days
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Dashboard;

