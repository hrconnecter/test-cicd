/* eslint-disable no-unused-vars */
//v1
import React from 'react';
import { useQuery } from 'react-query';
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { CircularProgress, Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PartiallyApprovedIcon from '@mui/icons-material/HourglassEmpty';

const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={2} className="p-6 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <Typography variant="subtitle2" className="text-gray-600">{title}</Typography>
        <Typography variant="h4" className="font-bold mt-1">{value}</Typography>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </Paper>
);

const ExpenseStats = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { data: dashboardStats, isLoading } = useQuery(
    ['expenseStats', organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/stats/${organisationId}`,
        {
          headers: { Authorization: authToken }
        }
      );
      return response.data.data;
    },
    {
      enabled: !!organisationId && !!authToken,
      refetchInterval: 30000
    }
  );

  if (isLoading || !dashboardStats) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  const { reports, payments, totals } = dashboardStats;

  return (
    <Box className="space-y-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-6"> */}
      <div className="flex flex-wrap items-center gap-5 mb-6 ">        
         {/* <Typography variant="h6" className="col-span-3 text-gray-700">Report Status</Typography> */}
        <StatCard
          title="Pending Reports"
          value={reports.pending}
          icon={<PendingActionsIcon className="text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Partially Approved"
          value={reports.partiallyApproved}
          icon={<PartiallyApprovedIcon className="text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Fully Approved"
          value={reports.fullyApproved}
          icon={<CheckCircleIcon className="text-white" />}
          color="bg-green-500"
        />
      {/* </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> */}
        {/* <Typography variant="h6" className="col-span-3 text-gray-700">Payment Status</Typography> */}
        <StatCard
          title="Pending Payment"
          value={payments.pending} 
          icon={<PendingActionsIcon className="text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="In Payroll"
          value={payments.payroll}
          icon={<PaymentsIcon className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Paid"
          value={payments.paid}
          icon={<AccountBalanceWalletIcon className="text-white" />}
          color="bg-green-600"
        />
      {/* </div> */}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
        {/* <Typography variant="h6" className="col-span-3 text-gray-700">Overall Statistics</Typography> */}
        <StatCard
          title="Total Reports"
          value={totals.reports}
          icon={<AssessmentIcon className="text-white" />}
          color="bg-purple-500"
        />
        {/* <StatCard
          title="Total Expenses"
          value={totals.expenses}
          icon={<ReceiptIcon className="text-white" />}
          color="bg-indigo-500"
        /> */}
        <StatCard
          title="Total Amount"
          value={`₹${totals.amount.toLocaleString()}`}
          icon={<AccountBalanceWalletIcon className="text-white" />}
          color="bg-green-700"
        />
      </div>
    </Box>
  );
};

export default ExpenseStats;



//modified with graph v2
// import React from 'react';
// import { useQuery } from 'react-query';
// import { useContext } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router-dom";
// import axios from 'axios';
// import { CircularProgress, Paper, Typography, Box, Grid, TextField, MenuItem, Tooltip } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PaymentsIcon from '@mui/icons-material/Payments';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import PartiallyApprovedIcon from '@mui/icons-material/HourglassEmpty';
// import SearchIcon from '@mui/icons-material/Search';

// const StatCard = ({ title, value, icon, color, tooltip }) => (
//   <Tooltip title={tooltip} arrow>
//     <Paper elevation={2} className="p-6 transition-all duration-300 hover:shadow-lg">
//       <div className="flex items-center justify-between">
//         <div>
//           <Typography variant="subtitle2" className="text-gray-600">{title}</Typography>
//           <Typography variant="h4" className="font-bold mt-1">{value}</Typography>
//         </div>
//         <div className={`p-3 rounded-full ${color}`}>
//           {icon}
//         </div>
//       </div>
//     </Paper>
//   </Tooltip>
// );

// const ExpenseStats = () => {
//   const { organisationId } = useParams();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   const { data: dashboardStats, isLoading } = useQuery(
//     ['expenseStats', organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/stats/${organisationId}`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data.data;
//     },
//     {
//       enabled: !!organisationId && !!authToken,
//       refetchInterval: 30000
//     }
//   );

//   if (isLoading || !dashboardStats) {
//     return (
//       <Box className="flex justify-center items-center h-64">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const { reports, payments, totals } = dashboardStats;

//   // Data for charts
//   const reportData = [
//     { name: 'Pending', value: reports.pending },
//     { name: 'Partially Approved', value: reports.partiallyApproved },
//     { name: 'Fully Approved', value: reports.fullyApproved },
//   ];

//   const paymentData = [
//     { name: 'Pending', value: payments.pending },
//     { name: 'In Payroll', value: payments.payroll },
//     { name: 'Paid', value: payments.paid },
//   ];

//   const COLORS = ['#FFBB28', '#FF8042', '#00C49F', '#0088FE'];

//   return (
//     <Box className="space-y-6 p-6">
//       {/* Filter Section */}
//       <Grid container spacing={3} className="mb-6">
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Search Expenses"
//             variant="outlined"
//             InputProps={{
//               startAdornment: <SearchIcon />,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             select
//             label="Filter by Status"
//             variant="outlined"
//             defaultValue="all"
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="pending">Pending</MenuItem>
//             <MenuItem value="approved">Approved</MenuItem>
//             <MenuItem value="paid">Paid</MenuItem>
//           </TextField>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             type="date"
//             label="Filter by Date"
//             variant="outlined"
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//       </Grid>

//       {/* Stat Cards */}
//       <Grid container spacing={3} className="mb-6">
//         <Grid item xs={12} md={4}>
//           <StatCard
//             title="Pending Reports"
//             value={reports.pending}
//             icon={<PendingActionsIcon className="text-white" />}
//             color="bg-yellow-500"
//             tooltip="Reports awaiting approval"
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <StatCard
//             title="Partially Approved"
//             value={reports.partiallyApproved}
//             icon={<PartiallyApprovedIcon className="text-white" />}
//             color="bg-orange-500"
//             tooltip="Reports partially approved"
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <StatCard
//             title="Fully Approved"
//             value={reports.fullyApproved}
//             icon={<CheckCircleIcon className="text-white" />}
//             color="bg-green-500"
//             tooltip="Reports fully approved"
//           />
//         </Grid>
//       </Grid>

//       {/* Charts */}
//       <Grid container spacing={3} className="mb-6">
//         <Grid item xs={12} md={6}>
//           <Paper elevation={2} className="p-6">
//             <Typography variant="h6" className="mb-4">Report Status</Typography>
//             <BarChart width={500} height={300} data={reportData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <RechartsTooltip />
//               <Bar dataKey="value" fill="#8884d8" />
//             </BarChart>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={2} className="p-6">
//             <Typography variant="h6" className="mb-4">Payment Status</Typography>
//             <PieChart width={500} height={300}>
//               <Pie
//                 data={paymentData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label
//               >
//                 {paymentData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <RechartsTooltip />
//               <Legend />
//             </PieChart>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Total Stats */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <StatCard
//             title="Total Reports"
//             value={totals.reports}
//             icon={<AssessmentIcon className="text-white" />}
//             color="bg-purple-500"
//             tooltip="Total number of reports"
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <StatCard
//             title="Total Amount"
//             value={`₹${totals.amount.toLocaleString()}`}
//             icon={<AccountBalanceWalletIcon className="text-white" />}
//             color="bg-green-700"
//             tooltip="Total amount of expenses"
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ExpenseStats;
