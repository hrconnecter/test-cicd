/* eslint-disable no-unused-vars */

//WED 2 working
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Divider,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField
// } from '@mui/material';
// import { format } from 'date-fns';
// import axios from 'axios';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { TestContext } from '../../../State/Function/Main';
// import useAuthToken from '../../../hooks/Token/useAuth';
// import { useParams } from 'react-router-dom';

// const AssetReturnApprovalModal = () => {
//   const { handleAlert } = useContext(TestContext);
//   const authToken = useAuthToken();
//   const { organisationId } = useParams();
//   const queryClient = useQueryClient();

//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
//   const [returnNotes, setReturnNotes] = useState('');

//   // Fetch asset return notifications
//   const { data, isLoading, error } = useQuery(
//     ['assetReturnNotificationsForManager'],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/manager/notifications`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: !!authToken,
//       refetchInterval: 30000
//     }
//   );

//   // Approve asset return mutation
//   const approveMutation = useMutation(
//     async (notificationId) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/manager/approve/${notificationId}`,
//         {},
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         handleAlert(true, 'success', 'Asset return approved successfully');
//         queryClient.invalidateQueries('assetReturnNotificationsForManager');
//       },
//       onError: (error) => {
//         handleAlert(true, 'error', error.response?.data?.message || 'Failed to approve asset return');
//       }
//     }
//   );

//   // Mark assets as returned mutation
//   const completeMutation = useMutation(
//     async ({ notificationId, returnNotes }) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/manager/complete/${notificationId}`,
//         { returnNotes },
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         handleAlert(true, 'success', 'Assets marked as returned successfully');
//         setCompleteDialogOpen(false);
//         setSelectedNotification(null);
//         setReturnNotes('');
//         queryClient.invalidateQueries('assetReturnNotificationsForManager');
//       },
//       onError: (error) => {
//         handleAlert(true, 'error', error.response?.data?.message || 'Failed to mark assets as returned');
//       }
//     }
//   );

//   // Mark notification as read
//   useEffect(() => {
//     const markAsRead = async (notificationId) => {
//       try {
//         await axios.put(
//           `${process.env.REACT_APP_API}/route/notification/asset-return/manager/read/${notificationId}`,
//           {},
//           {
//             headers: { Authorization: authToken }
//           }
//         );
//       } catch (error) {
//         console.error('Error marking notification as read:', error);
//       }
//     };

//     if (data?.notifications && data.notifications.length > 0) {
//       data.notifications.forEach(notification => {
//         if (!notification.managerRead) {
//           markAsRead(notification._id);
//         }
//       });
//     }
//   }, [data, authToken]);

//   const handleApprove = (notification) => {
//     approveMutation.mutate(notification._id);
//   };

//   const handleOpenCompleteDialog = (notification) => {
//     setSelectedNotification(notification);
//     setCompleteDialogOpen(true);
//   };

//   const handleCompleteReturn = () => {
//     if (selectedNotification) {
//       completeMutation.mutate({
//         notificationId: selectedNotification._id,
//         returnNotes
//       });
//     }
//   };

//   const formatDate = (dateString) => {
//     return format(new Date(dateString), 'MMMM dd, yyyy');
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography color="error">
//           Error loading asset return notifications: {error.message}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!data?.notifications || data.notifications.length === 0) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography>No asset return notifications found.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Asset Return Approvals
//       </Typography>

//       <TableContainer component={Paper} sx={{ mb: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Employee</TableCell>
//               <TableCell>Assets</TableCell>
//               <TableCell>Return Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.notifications.map((notification) => (
//               <TableRow key={notification._id}>
//                 <TableCell>
//                   {notification.employeeId ?
//                     `${notification.employeeId.first_name} ${notification.employeeId.last_name}` :
//                     'Unknown Employee'}
//                 </TableCell>
//                 <TableCell>
//                   {notification.assets.length} asset(s)
//                 </TableCell>
//                 <TableCell>
//                   {formatDate(notification.returnDate)}
//                 </TableCell>
//                 <TableCell>
//                   <Chip
//                     label={notification.status}
//                     color={
//                       notification.status === "Pending" ? "warning" :
//                       notification.status === "Approved" ? "success" :
//                       "default"
//                     }
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   {notification.status === "Pending" && (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       size="small"
//                       onClick={() => handleApprove(notification)}
//                       disabled={approveMutation.isLoading}
//                       sx={{ mr: 1 }}
//                     >
//                       {approveMutation.isLoading ? <CircularProgress size={24} /> : "Approve"}
//                     </Button>
//                   )}
//                   {notification.status === "Approved" && (
//                     <Button
//                       variant="contained"
//                       color="success"
//                       size="small"
//                       onClick={() => handleOpenCompleteDialog(notification)}
//                       disabled={completeMutation.isLoading}
//                     >
//                       {completeMutation.isLoading ? <CircularProgress size={24} /> : "Mark as Returned"}
//                     </Button>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Asset Details Dialog */}
//       <Dialog open={!!selectedNotification} onClose={() => setSelectedNotification(null)}>
//         <DialogTitle>Asset Details</DialogTitle>
//         <DialogContent>
//           {selectedNotification && (
//             <Box>
//               <Typography variant="subtitle1">
//                 Employee: {selectedNotification.employeeId ?
//                   `${selectedNotification.employeeId.first_name} ${selectedNotification.employeeId.last_name}` :
//                   'Unknown Employee'}
//               </Typography>
//               <Typography variant="subtitle2" sx={{ mt: 1 }}>
//                 Return Date: {formatDate(selectedNotification.returnDate)}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="subtitle2">Assets:</Typography>
//               <TableContainer component={Paper} sx={{ mt: 1 }}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Type</TableCell>
//                       <TableCell>Serial Number</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedNotification.assets.map((asset, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{asset.name}</TableCell>
//                         <TableCell>{asset.type}</TableCell>
//                         <TableCell>{asset.serialNumber}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedNotification(null)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Complete Return Dialog */}
//       <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)}>
//         <DialogTitle>Mark Assets as Returned</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Confirm that the assets have been physically returned.
//           </Typography>
//           <TextField
//             label="Return Notes"
//             multiline
//             rows={4}
//             fullWidth
//             value={returnNotes}
//             onChange={(e) => setReturnNotes(e.target.value)}
//             placeholder="Optional notes about the condition of returned assets"
//             variant="outlined"
//             sx={{ mt: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={handleCompleteReturn}
//             variant="contained"
//             color="success"
//             disabled={completeMutation.isLoading}
//           >
//             {completeMutation.isLoading ? <CircularProgress size={24} /> : "Confirm Return"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AssetReturnApprovalModal;

//wed 3 final
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";
import { useParams } from "react-router-dom";

const AssetReturnApprovalModal = () => {
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [notificationToApprove, setNotificationToApprove] = useState(null);
  const [returnNotes, setReturnNotes] = useState("");

  // Fetch asset return notifications
  const { data, isLoading, error } = useQuery(
    ["assetReturnNotificationsForManager"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/notifications`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      enabled: !!authToken,
      refetchInterval: 30000,
      onError: (error) => {
        console.error("Error fetching asset return notifications:", error);
        handleAlert(true, "error", "Failed to load asset return notifications");
      },
    }
  );

  // Approve asset return mutation
  const approveMutation = useMutation(
    async (notificationId) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/approve/${notificationId}`,
        {},
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Asset return approved successfully");
        queryClient.invalidateQueries("assetReturnNotificationsForManager");
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Failed to approve asset return"
        );
      },
    }
  );

  // Mark assets as returned mutation
  const completeMutation = useMutation(
    async ({ notificationId, returnNotes }) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/complete/${notificationId}`,
        { returnNotes },
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Assets marked as returned successfully");
        setCompleteDialogOpen(false);
        setSelectedNotification(null);
        setReturnNotes("");
        queryClient.invalidateQueries("assetReturnNotificationsForManager");
      },
      onError: (error) => {
        handleAlert(
          true,
          "error",
          error.response?.data?.message || "Failed to mark assets as returned"
        );
      },
    }
  );

  // Mark notification as read
  useEffect(() => {
    const markAsRead = async (notificationId) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_API}/route/notification/asset-return/manager/read/${notificationId}`,
          {},
          {
            headers: { Authorization: authToken },
          }
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    if (data?.notifications && data.notifications.length > 0) {
      data.notifications.forEach((notification) => {
        if (!notification.managerRead) {
          markAsRead(notification._id);
        }
      });
    }
  }, [data, authToken]);

  const handleOpenApproveDialog = (notification) => {
    setNotificationToApprove(notification);
    setApproveDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (notificationToApprove) {
      approveMutation.mutate(notificationToApprove._id);
      setApproveDialogOpen(false);
      setNotificationToApprove(null);
    }
  };

  const handleOpenCompleteDialog = (notification) => {
    setSelectedNotification(notification);
    setCompleteDialogOpen(true);
  };

  const handleCompleteReturn = () => {
    if (selectedNotification) {
      completeMutation.mutate({
        notificationId: selectedNotification._id,
        // returnNotes,
        returnNotes: "",
      });
    }
  };

  // Function to fetch employees with pending asset returns
  const fetchEmployeesWithAssetReturns = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/employees`,
        { headers: { Authorization: authToken } }
      );
      return response.data.employees;
    } catch (error) {
      console.error("Error fetching employees with asset returns:", error);
      handleAlert(true, "error", "Failed to load employees with asset returns");
      return [];
    }
  };

  // Function to fetch asset return notifications for a specific employee
  const fetchEmployeeAssetReturns = async (employeeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/employee/${employeeId}/pending`,
        { headers: { Authorization: authToken } }
      );
      return response.data.notifications;
    } catch (error) {
      console.error("Error fetching employee asset returns:", error);
      handleAlert(true, "error", "Failed to load asset return notifications");
      return [];
    }
  };

  // Function to mark notifications as read for an employee
  const markNotificationsAsRead = async (employeeId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/notification/asset-return/manager/read/${employeeId}`,
        {},
        { headers: { Authorization: authToken } }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading asset return notifications: {error.message}
        </Typography>
      </Box>
    );
  }

  if (!data?.notifications || data.notifications.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No asset return notifications found.</Typography>
      </Box>
    );
  }

  return (
    // <Box sx={{ p: 2 }}>
    //   <Typography variant="h6" sx={{ mb: 2 }}>
    //     Asset Return Approvals
    //   </Typography>
    <Box sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold">
        {" "}
        Asset return approvals
      </Typography>
      <Typography variant="body2">
        Review assigned assets and approve employee returns{" "}
      </Typography>
      {/* </Box> */}

      <TableContainer component={Paper} sx={{ mb: 3, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assets</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.notifications.map((notification) => (
              <TableRow key={notification._id}>
                <TableCell>
                  {notification.employeeId &&
                  typeof notification.employeeId === "object"
                    ? `${notification.employeeId.first_name || ""} ${
                        notification.employeeId.last_name || ""
                      }`
                    : "Unknown Employee"}
                </TableCell>
                <TableCell>{notification.assets.length} asset(s)</TableCell>
                <TableCell>{formatDate(notification.returnDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={notification.status}
                    color={
                      notification.status === "Pending"
                        ? "warning"
                        : notification.status === "Approved"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedNotification(notification)}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>

                  {notification.status === "Pending" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenApproveDialog(notification)}
                      disabled={
                        approveMutation.isLoading &&
                        approveMutation.variables === notification._id
                      }
                      sx={{ mr: 1 }}
                    >
                      {approveMutation.isLoading &&
                      approveMutation.variables === notification._id ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  )}

                  {notification.status === "Approved" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenCompleteDialog(notification)}
                      disabled={
                        completeMutation.isLoading &&
                        completeMutation.variables?.notificationId ===
                          notification._id
                      }
                    >
                      {completeMutation.isLoading &&
                      completeMutation.variables?.notificationId ===
                        notification._id ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Mark as Returned"
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Asset Details Dialog */}
      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        {/* <DialogTitle>Asset Details</DialogTitle> */}
        <DialogTitle style={{ fontWeight: "bold" }}>Asset Details</DialogTitle>

        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="subtitle1">
                Employee:{" "}
                {selectedNotification.employeeId &&
                typeof selectedNotification.employeeId === "object"
                  ? `${selectedNotification.employeeId.first_name || ""} ${
                      selectedNotification.employeeId.last_name || ""
                    }`
                  : "Unknown Employee"}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Return Date: {formatDate(selectedNotification.returnDate)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {/* <Typography variant="subtitle2">Assets:</Typography> */}
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    {/* <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Serial Number</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Serial Number</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedNotification.assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNotification(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve this asset return request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="primary"
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Return Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>Mark Assets as Returned</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Confirm that the assets have been physically returned.
          </Typography>
          {/* <TextField
            label="Return Notes"
            multiline
            rows={4}
            fullWidth
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            placeholder="Optional notes about the condition of returned assets"
            variant="outlined"
            sx={{ mt: 1 }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCompleteReturn}
            variant="contained"
            color="success"
            disabled={completeMutation.isLoading}
          >
            {completeMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm Return"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetReturnApprovalModal;
