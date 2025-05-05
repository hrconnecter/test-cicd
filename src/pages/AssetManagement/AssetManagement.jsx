/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// // /* eslint-disable no-unused-vars */


// import { useContext, useState } from "react"
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   CircularProgress,
//   Divider,
//   Paper,
//   Alert,
// } from "@mui/material"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts"
// import { useQuery } from "react-query"
// import axios from "axios"
// import { UseContext } from "../../State/UseState/UseContext"
// import { TestContext } from "../../State/Function/Main"
// import {
//   CloudDownload,
//   Refresh,
//   Dashboard as DashboardIcon,
//   Assessment as AssessmentIcon,
//   History as HistoryIcon,
//   Info as InfoIcon,
//   Warning as WarningIcon,
//   CategoryOutlined,
//   ErrorOutlineOutlined,
//   CheckBoxOutlined,
// } from "@mui/icons-material"
// import * as XLSX from "xlsx"

// const AssetManagement = () => {
//   const { cookies } = useContext(UseContext)
//   const { handleAlert } = useContext(TestContext)
//   const authToken = cookies["aegis"]
//   const [refreshTrigger, setRefreshTrigger] = useState(0)

//   // Fetch all assets for the organization
//   const {
//     data: assetStats,
//     isLoading: statsLoading,
//     error: statsError,
//     refetch: refetchStats,
//   } = useQuery(["assetStats", refreshTrigger], async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/stats`, {
//         headers: {
//           Authorization: authToken,
//         },
//       })
//       return response.data
//     } catch (err) {
//       console.error("Error fetching asset stats:", err)
//       handleAlert(true, "error", "Failed to load asset statistics")
//       throw err
//     }
//   })

//   // Fetch all assets for export
//   const {
//     data: allAssets,
//     isLoading: assetsLoading,
//     error: assetsError,
//   } = useQuery(["allAssets", refreshTrigger], async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/assets`, {
//         headers: {
//           Authorization: authToken,
//         },
//       })
//       return response.data.assets
//     } catch (err) {
//       console.error("Error fetching assets:", err)
//       handleAlert(true, "error", "Failed to load assets")
//       throw err
//     }
//   })

//   // Fetch recent asset assignments
//   const { data: recentAssignments, isLoading: assignmentsLoading } = useQuery(
//     ["recentAssetAssignments", refreshTrigger],
//     async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/recent-assignments`, {
//           headers: {
//             Authorization: authToken,
//           },
//         })
//         return response.data.assignments
//       } catch (err) {
//         console.error("Error fetching recent assignments:", err)
//         return []
//       }
//     },
//   )

//   const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"]

//   const handleRefresh = () => {
//     setRefreshTrigger((prev) => prev + 1)
//     refetchStats()
//     handleAlert(true, "success", "Data refreshed")
//   }

//   const exportToExcel = () => {
//     if (!allAssets || allAssets.length === 0) {
//       handleAlert(true, "error", "No assets to export")
//       return
//     }

//     try {
//       // Format the data for export
//       const formattedData = allAssets.map((asset) => ({
//         "Asset Name": asset.name,
//         "Asset Type": asset.type,
//         "Serial Number": asset.serialNumber,
//         Status: asset.status,
//         "Assigned To": asset.employeeId ? asset.employeeId.first_name + " " + asset.employeeId.last_name : "Unassigned",
//         Email: asset.employeeId ? asset.employeeId.email : "-",
//         "Assigned Date": asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : "-",
//         "Recertification Required": asset.recertificationRequired ? "Yes" : "No",
//         "Valid Until": asset.recertificationRequired
//           ? asset.recertificationDate
//             ? new Date(asset.recertificationDate).toLocaleDateString()
//             : "-"
//           : asset.validityDate
//             ? new Date(asset.validityDate).toLocaleDateString()
//             : "-",
//         "Created At": new Date(asset.createdAt).toLocaleDateString(),
//       }))

//       // Create workbook and worksheet
//       const worksheet = XLSX.utils.json_to_sheet(formattedData)
//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Assets")

//       // Generate Excel file
//       const today = new Date().toISOString().slice(0, 10)
//       XLSX.writeFile(workbook, `Assets_Report_${today}.xlsx`)

//       handleAlert(true, "success", "Asset report downloaded successfully")
//     } catch (error) {
//       console.error("Error exporting to Excel:", error)
//       handleAlert(true, "error", "Failed to export asset report")
//     }
//   }

//   // Calculate asset type distribution for bar chart
//   const getAssetTypeData = () => {
//     if (!allAssets || allAssets.length === 0) return []

//     const typeCount = {}
//     allAssets.forEach((asset) => {
//       typeCount[asset.type] = (typeCount[asset.type] || 0) + 1
//     })

//     return Object.entries(typeCount)
//       .map(([type, count]) => ({ type, count }))
//       .sort((a, b) => b.count - a.count)
//       // .slice(0, 5) // Top 5 asset types
//   }

//   const isLoading = statsLoading || assetsLoading
//   const error = statsError || assetsError

//   if (isLoading)
//     return (
//       <Box p={2} display="flex" justifyContent="center" alignItems="center" height="40vh">
//         <Card sx={{ p: 3, textAlign: "center", borderRadius: "8px", maxWidth: "350px" }}>
//           <CircularProgress size={40} sx={{ mb: 2 }} />
//           <Typography variant="h6" gutterBottom fontSize="1rem">
//             Loading Asset Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
//             Please wait while we gather your asset information
//           </Typography>
//         </Card>
//       </Box>
//     )

//   if (error)
//     return (
//       <Box p={2}>
//         <Card sx={{ p: 3, borderRadius: "8px" }}>
//           <Alert
//             severity="error"
//             variant="outlined"
//             sx={{
//               alignItems: "center",
//               "& .MuiAlert-icon": {
//                 fontSize: "1.5rem", 
//               },
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Error Loading Asset Dashboard
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               {error.message || "An unexpected error occurred while loading asset data."}
//             </Typography>
//             <Button variant="contained" color="primary" onClick={handleRefresh} startIcon={<Refresh />} size="small">
//               Retry
//             </Button>
//           </Alert>
//         </Card>
//       </Box>
//     )

//   const pieData = [
//     { name: "Active", value: assetStats?.active || 0 },
//     { name: "Expiring Soon", value: assetStats?.expiringSoon || 0 },
//     { name: "Expired", value: assetStats?.expired || 0 },
//     { name: "Unassigned", value: assetStats?.unassigned || 0 },
//   ]

//   const assetTypeData = getAssetTypeData()

//   return (
//     <Box p={2}>
//       {/* Dashboard Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//         flexDirection={{ xs: "column", sm: "row" }}
//         gap={1}
//       >
//         <Box>
//           <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
//             Asset Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Monitor and analyze your organization's asset inventory
//           </Typography>
//         </Box>

//         {/* Action Buttons */}
//         <Box display="flex" alignItems="center" gap={1}>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={handleRefresh}
//             startIcon={<Refresh />}
//             size="small"
//             sx={{
//               borderRadius: "6px",
//               textTransform: "none",
//               fontWeight: 600,
//             }}
//           >
//             Refresh
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={exportToExcel}
//             startIcon={<CloudDownload />}
//             disabled={!allAssets || allAssets.length === 0}
//             size="small"
//             sx={{
//               borderRadius: "6px",
//               textTransform: "none",
//               fontWeight: 600,
//             }}
//           >
//             Export Report
//           </Button>
//         </Box>
//       </Box>

//       {/* Asset Statistics Cards */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid item xs={6} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "divider",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <DashboardIcon color="action" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="text.secondary" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Total Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700}>
//                 {assetStats?.total || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Assets in your organization
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "success.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <CheckBoxOutlined color="success" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="success.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Active Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="success.main">
//                 {assetStats?.active || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {assetStats?.active ? Math.round((assetStats.active / assetStats.total) * 100) : 0}% of total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "warning.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <WarningIcon color="warning" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="warning.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Expiring Soon
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="warning.main">
//                 {assetStats?.expiringSoon || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Require attention within 30 days
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "error.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <ErrorOutlineOutlined color="error" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="error.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Expired Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="error.main">
//                 {assetStats?.expired || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Require immediate attention
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts Section */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Pie Chart */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//                   Asset Status Distribution
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />

//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <RechartsTooltip formatter={(value) => [`${value} assets`, "Count"]} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>

//               <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
//                 <Chip
//                   label="Active"
//                   color="success"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Expiring Soon"
//                   color="warning"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Expired"
//                   color="error"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Unassigned"
//                   color="default"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Bar Chart - Asset Types */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <CategoryOutlined color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//                   All Asset Types
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />

//               {assetTypeData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart
//                     data={assetTypeData}
//                     margin={{
//                       top: 5,
//                       right: 20,
//                       left: 10,
//                       bottom: 30,
//                     }}
//                     barSize={12} // Thinner bars
//                     barGap={1} // Small gap between bars
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="type"
//                      tick={{ fontSize: 9 }}
//                       interval={0} // Show all labels
//                       angle={-45} // Angle the labels to prevent overlap
//                       textAnchor="end" // Align the rotated text
//                       // height={60} // Increase height to accommodate angled labels
                    
//                     />
//                     <YAxis tick={{ fontSize: 10 }}  
//                      allowDecimals={false}
//                      domain={[0, 'dataMax']}
//                       />
//                     <RechartsTooltip />
//                     <Bar dataKey="count" fill="#A4C0E5" name="Count" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
//                   <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
//                     No asset type data available
//                   </Typography>
//                 </Box>
//               )}

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ mt: 1, textAlign: "center", display: "block" }}
//               >
//                 Distribution of assets by type across your organization
//               </Typography>
//             </CardContent>
            
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Recent Asset Assignments */}
//       <Card
//         sx={{
//           borderRadius: "8px",
//           boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//           mb: 2,
//         }}
//       >
//         <CardContent sx={{ p: 0 }}>
//           <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
//             <HistoryIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//             <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//               Recent Asset Assignments
//             </Typography>
//           </Box>
//           <Divider />

//           {assignmentsLoading ? (
//             <Box display="flex" justifyContent="center" p={2}>
//               <CircularProgress size={24} />
//             </Box>
//           ) : recentAssignments && recentAssignments.length > 0 ? (
//             <TableContainer sx={{ maxHeight: "300px" }}>
//               <Table size="small" stickyHeader>
//                 <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Asset</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Type</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Employee</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Assigned Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentAssignments.map((assignment) => (
//                     <TableRow
//                       key={assignment._id}
//                       sx={{
//                         "&:hover": {
//                           backgroundColor: "rgba(0, 0, 0, 0.04)",
//                         },
//                       }}
//                     >
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
//                           {assignment.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={assignment.type}
//                           size="small"
//                           variant="outlined"
//                           sx={{
//                             borderRadius: "4px",
//                             backgroundColor: "rgba(0, 0, 0, 0.04)",
//                             height: "18px",
//                             fontSize: "0.65rem",
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Box sx={{ display: "flex", flexDirection: "column" }}>
//                           <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
//                             {assignment.employeeId
//                               ? `${assignment.employeeId.first_name} ${assignment.employeeId.last_name}`
//                               : "Unassigned"}
//                           </Typography>
//                           {assignment.employeeId && (
//                             <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
//                               {assignment.employeeId.email}
//                             </Typography>
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" fontSize="0.75rem">
//                           {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : "-"}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={assignment.status}
//                           color={
//                             assignment.status === "Active"
//                               ? "success"
//                               : assignment.status === "Expiring Soon"
//                                 ? "warning"
//                                 : assignment.status === "Expired"
//                                   ? "error"
//                                   : "default"
//                           }
//                           size="small"
//                           sx={{
//                             fontWeight: 500,
//                             borderRadius: "4px",
//                             height: "18px",
//                             fontSize: "0.65rem",
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Box p={2} textAlign="center">
//               <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
//                 No recent asset assignments found
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Asset Management Tips */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 2,
//           backgroundColor: "rgba(25, 118, 210, 0.05)",
//           borderRadius: "8px",
//           border: "1px solid rgba(25, 118, 210, 0.1)",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
//           <InfoIcon color="primary" sx={{ mt: 0.5, fontSize: "1rem" }} />
//           <Box>
//             <Typography variant="subtitle2" fontWeight={600} color="primary.main" gutterBottom fontSize="0.8rem">
//               Asset Management Best Practices
//             </Typography>
//             <Typography variant="body2" paragraph mb={1} fontSize="0.75rem">
//               Regular audits of your asset inventory can help identify discrepancies and ensure accurate tracking.
//               Consider implementing a quarterly review process for all assets, especially those nearing expiration.
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               <Chip
//                 label="Regular Audits"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Timely Renewals"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Accurate Documentation"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Employee Onboarding"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Employee Offboarding"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   )
// }

// export default AssetManagement


//U1
// import { useContext, useState } from "react"
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   CircularProgress,
//   Divider,
//   Paper,
//   Alert,
// } from "@mui/material"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts"
// import { useQuery } from "react-query"
// import axios from "axios"
// import { UseContext } from "../../State/UseState/UseContext"
// import { TestContext } from "../../State/Function/Main"
// import {
//   CloudDownload,
//   Refresh,
//   Dashboard as DashboardIcon,
//   Assessment as AssessmentIcon,
//   History as HistoryIcon,
//   Info as InfoIcon,
//   Warning as WarningIcon,
//   CategoryOutlined,
//   ErrorOutlineOutlined,
//   CheckBoxOutlined,
//   AssignmentInd as AssignmentIndIcon,
//   Inventory as InventoryIcon
// } from "@mui/icons-material"
// import * as XLSX from "xlsx"

// const AssetManagement = () => {
//   const { cookies } = useContext(UseContext)
//   const { handleAlert } = useContext(TestContext)
//   const authToken = cookies["aegis"]
//   const [refreshTrigger, setRefreshTrigger] = useState(0)

//   // Fetch all assets for the organization
//   const {
//     data: assetStats,
//     isLoading: statsLoading,
//     error: statsError,
//     refetch: refetchStats,
//   } = useQuery(["assetStats", refreshTrigger], async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/stats`, {
//         headers: {
//           Authorization: authToken,
//         },
//       })
//       return response.data
//     } catch (err) {
//       console.error("Error fetching asset stats:", err)
//       handleAlert(true, "error", "Failed to load asset statistics")
//       throw err
//     }
//   })

//   // Fetch all assets for export
//   const {
//     data: allAssets,
//     isLoading: assetsLoading,
//     error: assetsError,
//   } = useQuery(["allAssets", refreshTrigger], async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API}/route/assets`, {
//         headers: {
//           Authorization: authToken,
//         },
//       })
//       return response.data.assets
//     } catch (err) {
//       console.error("Error fetching assets:", err)
//       handleAlert(true, "error", "Failed to load assets")
//       throw err
//     }
//   })

//   // Fetch recent asset assignments
//   const { data: recentAssignments, isLoading: assignmentsLoading } = useQuery(
//     ["recentAssetAssignments", refreshTrigger],
//     async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/recent-assignments`, {
//           headers: {
//             Authorization: authToken,
//           },
//         })
//         return response.data.assignments
//       } catch (err) {
//         console.error("Error fetching recent assignments:", err)
//         return []
//       }
//     },
//   )

//   const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"]

//   const handleRefresh = () => {
//     setRefreshTrigger((prev) => prev + 1)
//     refetchStats()
//     handleAlert(true, "success", "Data refreshed")
//   }

//   const exportToExcel = () => {
//     if (!allAssets || allAssets.length === 0) {
//       handleAlert(true, "error", "No assets to export")
//       return
//     }

//     try {
//       // Format the data for export
//       const formattedData = allAssets.map((asset) => ({
//         "Asset Name": asset.name,
//         "Asset Type": asset.type,
//         "Serial Number": asset.serialNumber,
//         Status: asset.status,
//         "Assigned To": asset.employeeId ? asset.employeeId.first_name + " " + asset.employeeId.last_name : "Unassigned",
//         Email: asset.employeeId ? asset.employeeId.email : "-",
//         "Assigned Date": asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : "-",
//         "Recertification Required": asset.recertificationRequired ? "Yes" : "No",
//         "Valid Until": asset.recertificationRequired
//           ? asset.recertificationDate
//             ? new Date(asset.recertificationDate).toLocaleDateString()
//             : "-"
//           : asset.validityDate
//             ? new Date(asset.validityDate).toLocaleDateString()
//             : "-",
//         "Created At": new Date(asset.createdAt).toLocaleDateString(),
//       }))

//       // Create workbook and worksheet
//       const worksheet = XLSX.utils.json_to_sheet(formattedData)
//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Assets")

//       // Generate Excel file
//       const today = new Date().toISOString().slice(0, 10)
//       XLSX.writeFile(workbook, `Assets_Report_${today}.xlsx`)

//       handleAlert(true, "success", "Asset report downloaded successfully")
//     } catch (error) {
//       console.error("Error exporting to Excel:", error)
//       handleAlert(true, "error", "Failed to export asset report")
//     }
//   }

//   // Calculate asset type distribution for bar chart - MODIFIED to show ALL asset types
//   const getAssetTypeData = () => {
//     if (!allAssets || allAssets.length === 0) return []

//     const typeCount = {}
//     allAssets.forEach((asset) => {
//       typeCount[asset.type] = (typeCount[asset.type] || 0) + 1
//     })

//     return Object.entries(typeCount)
//       .map(([type, count]) => ({ type, count }))
//       .sort((a, b) => b.count - a.count)
//       // Removed slice to show all asset types
//   }

//   const isLoading = statsLoading || assetsLoading
//   const error = statsError || assetsError

//   if (isLoading)
//     return (
//       <Box p={2} display="flex" justifyContent="center" alignItems="center" height="40vh">
//         <Card sx={{ p: 3, textAlign: "center", borderRadius: "8px", maxWidth: "350px" }}>
//           <CircularProgress size={40} sx={{ mb: 2 }} />
//           <Typography variant="h6" gutterBottom fontSize="1rem">
//             Loading Asset Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
//             Please wait while we gather your asset information
//           </Typography>
//         </Card>
//       </Box>
//     )

//   if (error)
//     return (
//       <Box p={2}>
//         <Card sx={{ p: 3, borderRadius: "8px" }}>
//           <Alert
//             severity="error"
//             variant="outlined"
//             sx={{
//               alignItems: "center",
//               "& .MuiAlert-icon": {
//                 fontSize: "1.5rem", 
//               },
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>
//               Error Loading Asset Dashboard
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 2 }}>
//               {error.message || "An unexpected error occurred while loading asset data."}
//             </Typography>
//             <Button variant="contained" color="primary" onClick={handleRefresh} startIcon={<Refresh />} size="small">
//               Retry
//             </Button>
//           </Alert>
//         </Card>
//       </Box>
//     )

//   // Enhanced pieData with descriptions
//   const pieData = [
//     { name: "Active", value: assetStats?.active || 0, description: "Assets in good standing" },
//     { name: "Expiring Soon", value: assetStats?.expiringSoon || 0, description: "Assets expiring within 30 days" },
//     { name: "Expired", value: assetStats?.expired || 0, description: "Assets past their validity date" },
//     { name: "Unassigned", value: assetStats?.unassigned || 0, description: "Assets not assigned to any employee" }
//   ]

//   const assetTypeData = getAssetTypeData()

//   return (
//     <Box p={2}>
//       {/* Dashboard Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//         flexDirection={{ xs: "column", sm: "row" }}
//         gap={1}
//       >
//         <Box>
//           <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
//             Asset Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Monitor and analyze your organization's asset inventory
//           </Typography>
//         </Box>

//         {/* Action Buttons */}
//         <Box display="flex" alignItems="center" gap={1}>
//           <Button
//             variant="outlined"
//             color="primary"
//             onClick={handleRefresh}
//             startIcon={<Refresh />}
//             size="small"
//             sx={{
//               borderRadius: "6px",
//               textTransform: "none",
//               fontWeight: 600,
//             }}
//           >
//             Refresh
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={exportToExcel}
//             startIcon={<CloudDownload />}
//             disabled={!allAssets || allAssets.length === 0}
//             size="small"
//             sx={{
//               borderRadius: "6px",
//               textTransform: "none",
//               fontWeight: 600,
//             }}
//           >
//             Export Report
//           </Button>
//         </Box>
//       </Box>

//       {/* Asset Statistics Cards - Updated with clearer distinctions */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "divider",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <DashboardIcon color="action" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="text.secondary" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Total Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700}>
//                 {assetStats?.total || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Assets in your organization
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "primary.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <AssignmentIndIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="primary.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Assigned Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="primary.main">
//                 {assetStats?.total - (assetStats?.unassigned || 0)}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {assetStats?.total ? Math.round(((assetStats.total - (assetStats?.unassigned || 0)) / assetStats.total) * 100) : 0}% of total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "success.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <CheckBoxOutlined color="success" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="success.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Active Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="success.main">
//                 {assetStats?.active || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Assets in good standing
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "warning.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <WarningIcon color="warning" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="warning.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Expiring Soon
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="warning.main">
//                 {assetStats?.expiringSoon || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Require attention within 30 days
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "error.light",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <ErrorOutlineOutlined color="error" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="error.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Expired Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700} color="error.main">
//                 {assetStats?.expired || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Require immediate attention
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={6} sm={6} md={2}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//               border: "1px solid",
//               borderColor: "grey.300",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <InventoryIcon color="action" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography color="text.secondary" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
//                   Unassigned Assets
//                 </Typography>
//               </Box>
//               <Typography variant="h5" fontWeight={700}>
//                 {assetStats?.unassigned || 0}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Available for assignment
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts Section */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Pie Chart - Enhanced with better tooltips */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//                   Asset Status Distribution
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />

//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <RechartsTooltip 
//                     formatter={(value, name, props) => {
//                       const entry = pieData.find(item => item.name === name);
//                       return [`${value} assets - ${entry?.description || ''}`, name];
//                     }} 
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>

//               <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
//                 <Chip
//                   label="Active"
//                   color="success"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Expiring Soon"
//                   color="warning"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Expired"
//                   color="error"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//                 <Chip
//                   label="Unassigned"
//                   color="default"
//                   size="small"
//                   sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Bar Chart - Asset Types - MODIFIED to show ALL asset types with thinner bars */}
//         <Grid item xs={12} md={6}>
//           <Card
//             sx={{
//               height: "100%",
//               borderRadius: "8px",
//               boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//             }}
//           >
//             <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                 <CategoryOutlined color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//                 <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//                   All Asset Types
//                 </Typography>
//               </Box>
//               <Divider sx={{ mb: 2 }} />

//               {assetTypeData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart
//                     data={assetTypeData}
//                     margin={{
//                       top: 5,
//                       right: 20,
//                       left: 10,
//                       bottom: 60, // Increased to accommodate angled labels
//                     }}
//                     barSize={12} // Even thinner bars for more types
//                     barGap={1} // Smaller gap between bars
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis 
//                       dataKey="type" 
//                       tick={{ fontSize: 8 }} // Smaller font
//                       interval={0} // Show all labels
//                       angle={-45} // Angle the labels to prevent overlap
//                       textAnchor="end" // Align the rotated text
//                       height={70} // Increase height to accommodate angled labels
//                     />
//                     <YAxis 
//                       tick={{ fontSize: 10 }} 
//                       allowDecimals={false} // This ensures only integers are displayed
//                       domain={[0, 'dataMax']} // Start from 0 to the maximum value
//                       tickCount={5} // Control the number of ticks shown
//                     />
//                     <RechartsTooltip formatter={(value, name, props) => [`${value} assets`, props.payload.type]} />
//                     <Bar 
//                       dataKey="count" 
//                       fill="#A4C0E5" 
//                       name="Count" 
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
//                   <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
//                     No asset type data available
//                   </Typography>
//                 </Box>
//               )}

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ mt: 1, textAlign: "center", display: "block" }}
//               >
//                 Complete distribution of all asset types in your organization
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Recent Asset Assignments */}
//       <Card
//         sx={{
//           borderRadius: "8px",
//           boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
//           mb: 2,
//         }}
//       >
//         <CardContent sx={{ p: 0 }}>
//           <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
//             <HistoryIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
//             <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
//               Recent Asset Assignments
//             </Typography>
//           </Box>
//           <Divider />

//           {assignmentsLoading ? (
//             <Box display="flex" justifyContent="center" p={2}>
//               <CircularProgress size={24} />
//             </Box>
//           ) : recentAssignments && recentAssignments.length > 0 ? (
//             <TableContainer sx={{ maxHeight: "300px" }}>
//               <Table size="small" stickyHeader>
//                 <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Asset</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Type</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Employee</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Assigned Date</TableCell>
//                     <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentAssignments.map((assignment) => (
//                     <TableRow
//                       key={assignment._id}
//                       sx={{
//                         "&:hover": {
//                           backgroundColor: "rgba(0, 0, 0, 0.04)",
//                         },
//                       }}
//                     >
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
//                           {assignment.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={assignment.type}
//                           size="small"
//                           variant="outlined"
//                           sx={{
//                             borderRadius: "4px",
//                             backgroundColor: "rgba(0, 0, 0, 0.04)",
//                             height: "18px",
//                             fontSize: "0.65rem",
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Box sx={{ display: "flex", flexDirection: "column" }}>
//                           <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
//                             {assignment.employeeId
//                               ? `${assignment.employeeId.first_name} ${assignment.employeeId.last_name}`
//                               : "Unassigned"}
//                           </Typography>
//                           {assignment.employeeId && (
//                             <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
//                               {assignment.employeeId.email}
//                             </Typography>
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Typography variant="body2" fontSize="0.75rem">
//                           {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : "-"}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ py: 1 }}>
//                         <Chip
//                           label={assignment.status}
//                           color={
//                             assignment.status === "Active"
//                               ? "success"
//                               : assignment.status === "Expiring Soon"
//                                 ? "warning"
//                                 : assignment.status === "Expired"
//                                   ? "error"
//                                   : "default"
//                           }
//                           size="small"
//                           sx={{
//                             fontWeight: 500,
//                             borderRadius: "4px",
//                             height: "18px",
//                             fontSize: "0.65rem",
//                           }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Box p={2} textAlign="center">
//               <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
//                 No recent asset assignments found
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Asset Management Tips */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 2,
//           backgroundColor: "rgba(25, 118, 210, 0.05)",
//           borderRadius: "8px",
//           border: "1px solid rgba(25, 118, 210, 0.1)",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
//           <InfoIcon color="primary" sx={{ mt: 0.5, fontSize: "1rem" }} />
//           <Box>
//             <Typography variant="subtitle2" fontWeight={600} color="primary.main" gutterBottom fontSize="0.8rem">
//               Asset Management Best Practices
//             </Typography>
//             <Typography variant="body2" paragraph mb={1} fontSize="0.75rem">
//               Regular audits of your asset inventory can help identify discrepancies and ensure accurate tracking.
//               Consider implementing a quarterly review process for all assets, especially those nearing expiration.
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               <Chip
//                 label="Regular Audits"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Timely Renewals"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Accurate Documentation"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Employee Onboarding"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//               <Chip
//                 label="Employee Offboarding"
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//                 sx={{ height: "18px", fontSize: "0.65rem" }}
//               />
//             </Box>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   )
// }

// export default AssetManagement


//U2
import { useContext, useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Alert,
} from "@mui/material"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { useQuery } from "react-query"
import axios from "axios"
import { UseContext } from "../../State/UseState/UseContext"
import { TestContext } from "../../State/Function/Main"
import {
  CloudDownload,
  Refresh,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CategoryOutlined,
  ErrorOutlineOutlined,
  CheckBoxOutlined,
  AssignmentInd,
  Inventory as InventoryIcon
} from "@mui/icons-material"
import * as XLSX from "xlsx"

const AssetManagement = () => {
  const { cookies } = useContext(UseContext)
  const { handleAlert } = useContext(TestContext)
  const authToken = cookies["aegis"]
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch all assets for the organization
  const {
    data: assetStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(["assetStats", refreshTrigger], async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/stats`, {
        headers: {
          Authorization: authToken,
        },
      })
      return response.data
    } catch (err) {
      console.error("Error fetching asset stats:", err)
      handleAlert(true, "error", "Failed to load asset statistics")
      throw err
    }
  })

  // Fetch all assets for export
  const {
    data: allAssets,
    isLoading: assetsLoading,
    error: assetsError,
  } = useQuery(["allAssets", refreshTrigger], async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/assets`, {
        headers: {
          Authorization: authToken,
        },
      })
      return response.data.assets
    } catch (err) {
      console.error("Error fetching assets:", err)
      handleAlert(true, "error", "Failed to load assets")
      throw err
    }
  })

  // Fetch recent asset assignments
  const { data: recentAssignments, isLoading: assignmentsLoading } = useQuery(
    ["recentAssetAssignments", refreshTrigger],
    async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/route/assets/recent-assignments`, {
          headers: {
            Authorization: authToken,
          },
        })
        return response.data.assignments
      } catch (err) {
        console.error("Error fetching recent assignments:", err)
        return []
      }
    },
  )

  const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9E9E9E"]
  const ASSIGNMENT_COLORS = ["#1976d2", "#9e9e9e"] // Blue for assigned, Gray for unassigned

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
    refetchStats()
    handleAlert(true, "success", "Data refreshed")
  }

  const exportToExcel = () => {
    if (!allAssets || allAssets.length === 0) {
      handleAlert(true, "error", "No assets to export")
      return
    }

    try {
      // Format the data for export
      const formattedData = allAssets.map((asset) => ({
        "Asset Name": asset.name,
        "Asset Type": asset.type,
        "Serial Number": asset.serialNumber,
        Status: asset.status,
        "Assignment Status": asset.employeeId ? "Assigned" : "Unassigned",
        "Assigned To": asset.employeeId ? asset.employeeId.first_name + " " + asset.employeeId.last_name : "Unassigned",
        Email: asset.employeeId ? asset.employeeId.email : "-",
        "Assigned Date": asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : "-",
        "Recertification Required": asset.recertificationRequired ? "Yes" : "No",
        "Valid Until": asset.recertificationRequired
          ? asset.recertificationDate
            ? new Date(asset.recertificationDate).toLocaleDateString()
            : "-"
          : asset.validityDate
            ? new Date(asset.validityDate).toLocaleDateString()
            : "-",
        "Created At": new Date(asset.createdAt).toLocaleDateString(),
      }))

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Assets")

      // Generate Excel file
      const today = new Date().toISOString().slice(0, 10)
      XLSX.writeFile(workbook, `Assets_Report_${today}.xlsx`)

      handleAlert(true, "success", "Asset report downloaded successfully")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      handleAlert(true, "error", "Failed to export asset report")
    }
  }

  // Calculate asset type distribution for bar chart
  const getAssetTypeData = () => {
    if (!allAssets || allAssets.length === 0) return []

    const typeCount = {}
    allAssets.forEach((asset) => {
      typeCount[asset.type] = (typeCount[asset.type] || 0) + 1
    })

    return Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      // Show all asset types without limiting
  }

  const isLoading = statsLoading || assetsLoading
  const error = statsError || assetsError

  if (isLoading)
    return (
      <Box p={2} display="flex" justifyContent="center" alignItems="center" height="40vh">
        <Card sx={{ p: 3, textAlign: "center", borderRadius: "8px", maxWidth: "350px" }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom fontSize="1rem">
            Loading Asset Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
            Please wait while we gather your asset information
          </Typography>
        </Card>
      </Box>
    )

  if (error)
    return (
      <Box p={2}>
        <Card sx={{ p: 3, borderRadius: "8px" }}>
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              alignItems: "center",
              "& .MuiAlert-icon": {
                fontSize: "1.5rem", 
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Error Loading Asset Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {error.message || "An unexpected error occurred while loading asset data."}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRefresh} startIcon={<Refresh />} size="small">
              Retry
            </Button>
          </Alert>
        </Card>
      </Box>
    )

  // Calculate assigned assets count
  const assignedCount = assetStats?.total ? (assetStats.total - (assetStats.unassigned || 0)) : 0;
  
  // Data for status pie chart
  const statusPieData = [
    { name: "Active", value: assetStats?.active || 0, description: "Assets in good standing" },
    { name: "Expiring Soon", value: assetStats?.expiringSoon || 0, description: "Assets expiring soon" },
    { name: "Expired", value: assetStats?.expired || 0, description: "Assets expired" },
  ]

  // Data for assignment pie chart
  const assignmentPieData = [
    { name: "Assigned", value: assignedCount, description: "Assets assigned to employees" },
    { name: "Unassigned", value: assetStats?.unassigned || 0, description: "Available for assignment" },
  ]

  const assetTypeData = getAssetTypeData()

  return (
    <Box p={2}>
      {/* Dashboard Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={1}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
            Asset Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and analyze your organization's asset inventory
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            startIcon={<Refresh />}
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            startIcon={<CloudDownload />}
            disabled={!allAssets || allAssets.length === 0}
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Asset Statistics Cards - Updated with 6 cards in a row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <DashboardIcon color="action" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="text.secondary" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Total Assets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {assetStats?.total || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Assets in your organization
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AssignmentInd color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="primary.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Assigned Assets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {assignedCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {assetStats?.total ? Math.round((assignedCount / assetStats.total) * 100) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <InventoryIcon color="action" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="text.secondary" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Unassigned Assets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {assetStats?.unassigned || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Available for assignment
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "success.light",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CheckBoxOutlined color="success" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="success.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Active Assets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="success.main">
                {assetStats?.active || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
              {assetStats?.active ? Math.round((assetStats.active / assetStats.total) * 100) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "warning.light",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WarningIcon color="warning" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="warning.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Expiring Soon
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="warning.main">
                {assetStats?.expiringSoon || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Require attention within 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "error.light",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ErrorOutlineOutlined color="error" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography color="error.main" variant="subtitle2" fontWeight={600} fontSize="0.75rem">
                  Expired Assets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="error.main">
                {assetStats?.expired || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Require immediate attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section - Updated with 3 charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Assignment Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AssignmentInd color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
                  Assignment Distribution
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {assignmentPieData && assignmentPieData.some(item => item.value > 0) ? (              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={assignmentPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assignmentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ASSIGNMENT_COLORS[index % ASSIGNMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value, name, props) => {
                      const entry = assignmentPieData.find(item => item.name === name);
                      return [`${value} assets - ${entry?.description || ''}`, name];
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
) : (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
    <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
      No   assignment data available
    </Typography>
  </Box>
)}
              <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Assigned"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
                />
                <Chip
                  label="Unassigned"
                  color="default"
                  size="small"
                  sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
                  Status Distribution
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {statusPieData && statusPieData.some(item => item.value > 0) ? (              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    
                  >
                    <Cell fill="#4CAF50" /> {/* Active - Green */}
                    <Cell fill="#FFC107" /> {/* Expiring Soon - Yellow */}
                    <Cell fill="#F44336" /> {/* Expired - Red */}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value, name, props) => {
                      const entry = statusPieData.find(item => item.name === name);
                      return [`${value} assets - ${entry?.description || ''}`, name];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
                  <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    No status  data available
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Active"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
                />
                <Chip
                  label="Expiring Soon"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
                />
                <Chip
                  label="Expired"
                  color="error"
                  size="small"
                  sx={{ fontWeight: 500, height: "20px", fontSize: "0.7rem" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart - Asset Types */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CategoryOutlined color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
                  All Asset Types
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {assetTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={assetTypeData}
                    margin={{
                      top: 5,
                      // right: 20,
                      // left: 5,
                      bottom: 40, // Increased to accommodate angled labels
                    }}
                    barSize={8} // Thinner bars for more types
                    barGap={1} // Smaller gap between bars
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="type" 
                      tick={{ fontSize: 8 }} // Smaller font
                      interval={0} // Show all labels
                      angle={-45} // Angle the labels to prevent overlap
                      textAnchor="end" // Align the rotated text
                      // height={70} // Increase height to accommodate angled labels
                    />
                    <YAxis 
                      tick={{ fontSize: 8 }} 
                      allowDecimals={false} // This ensures only integers are displayed
                      domain={[0, 'dataMax']} // Start from 0 to the maximum value
                      tickCount={5} // Control the number of ticks shown
                    />
                    <RechartsTooltip formatter={(value, name, props) => [`${value} assets`, props.payload.type]} />
                    <Bar 
                      dataKey="count" 
                      fill="#A4C0E5" 
                      name="Count" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
                  <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                    No asset type data available
                  </Typography>
                </Box>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center", display: "block" }}
              >
                Complete distribution of all asset types in your organization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

      {/* Recent Asset Assignments - Updated to show assignment status */}
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <HistoryIcon color="primary" sx={{ mr: 1, fontSize: "1rem" }} />
            <Typography variant="subtitle1" fontWeight={600} fontSize="0.875rem">
              Recent Asset Assignments
            </Typography>
          </Box>
          <Divider />

          {assignmentsLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : recentAssignments && recentAssignments.length > 0 ? (
            <TableContainer sx={{ maxHeight: "300px" }}>
              <Table size="small" stickyHeader>
                <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Asset</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Assigned Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1 }}>Assignment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAssignments.map((assignment) => (
                    <TableRow
                      key={assignment._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
                          {assignment.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={assignment.type}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: "4px",
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            height: "18px",
                            fontSize: "0.65rem",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2" fontWeight={500} fontSize="0.75rem">
                            {assignment.employeeId
                              ? `${assignment.employeeId.first_name} ${assignment.employeeId.last_name}`
                              : "Unassigned"}
                          </Typography>
                          {assignment.employeeId && (
                            <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                              {assignment.employeeId.email}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" fontSize="0.75rem">
                          {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={assignment.status}
                          color={
                            assignment.status === "Active"
                              ? "success"
                              : assignment.status === "Expiring Soon"
                                ? "warning"
                                : assignment.status === "Expired"
                                  ? "error"
                                  : "default"
                          }
                          size="small"
                          sx={{
                            fontWeight: 500,
                            borderRadius: "4px",
                            height: "18px",
                            fontSize: "0.65rem",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                           label={assignment.employeeId ? "Assigned" : "Unassigned"}
                          color={assignment.employeeId ? "primary" : "default"}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            borderRadius: "4px",
                            height: "18px",
                            fontSize: "0.65rem",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box p={2} textAlign="center">
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                No recent asset assignments found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Asset Management Tips */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: "rgba(25, 118, 210, 0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(25, 118, 210, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <InfoIcon color="primary" sx={{ mt: 0.5, fontSize: "1rem" }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="primary.main" gutterBottom fontSize="0.8rem">
              Asset Management Best Practices
            </Typography>
            <Typography variant="body2" paragraph mb={1} fontSize="0.75rem">
              Regular audits of your asset inventory can help identify discrepancies and ensure accurate tracking.
              Consider implementing a quarterly review process for all assets, especially those nearing expiration.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              <Chip
                label="Regular Audits"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: "18px", fontSize: "0.65rem" }}
              />
              <Chip
                label="Timely Renewals"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: "18px", fontSize: "0.65rem" }}
              />
              <Chip
                label="Accurate Documentation"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: "18px", fontSize: "0.65rem" }}
              />
              <Chip
                label="Employee Onboarding"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: "18px", fontSize: "0.65rem" }}
              />
              <Chip
                label="Employee Offboarding"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: "18px", fontSize: "0.65rem" }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AssetManagement
