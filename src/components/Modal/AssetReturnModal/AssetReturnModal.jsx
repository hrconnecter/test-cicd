/* eslint-disable no-unused-vars */
//working 
// import React, { useState, useContext, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Divider,
//   Chip,
//   List,
//   ListItem,
//   ListItemText,
//   FormControlLabel,
//   Checkbox,
//   TextField
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { format, addDays } from "date-fns";
// import axios from "axios";
// import { TestContext } from "../../../State/Function/Main";
// import { useQueryClient, useQuery } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { Info, CheckCircle } from "@mui/icons-material";
// import { Avatar } from "@mui/material";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// const AssetReturnModal = ({ onClose }) => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const queryClient = useQueryClient();
  
//   const [loading, setLoading] = useState(false);
//   const [returnDate, setReturnDate] = useState(addDays(new Date(), 7)); // Default to 7 days from now
//   const [acknowledged, setAcknowledged] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // Clear success message after 3 seconds
//   useEffect(() => {
//     let timer;
//     if (successMessage) {
//       timer = setTimeout(() => {
//         setSuccessMessage("");
//         if (onClose) onClose();
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [successMessage, onClose]);

//   // Fetch employee's asset return notifications
//   const { data, isLoading, error } = useQuery(
//     ["employeeAssetReturnNotifications"],
//     async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API}/route/notification/asset-return/employee/notifications`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         return res.data;
//       } catch (error) {
//         if (error.response?.status === 404) {
//           return { notifications: [] };
//         }
//         throw error;
//       }
//     },
//     {
//       enabled: !!authToken,
//       onSuccess: (data) => {
//         // If there's only one notification, select it automatically
//         if (data?.notifications?.length === 1) {
//           setSelectedNotification(data.notifications[0]);
//           setReturnDate(new Date(data.notifications[0].returnDate));
//         }
//       },
//       onError: (error) => {
//         setErrorMessage(error.response?.data?.message || "Error fetching asset return notifications");
//       }
//     }
//   );

//   // Function to handle notification selection
//   const handleSelectNotification = (notification) => {
//     setSelectedNotification(notification);
//     setReturnDate(new Date(notification.returnDate));
//   };

//   // Function to handle asset return confirmation
//   const handleConfirmReturn = async () => {
//     if (!selectedNotification) {
//       setErrorMessage("Please select a notification");
//       return;
//     }

//     if (!acknowledged) {
//       setErrorMessage("Please acknowledge that you will return the assets on the selected date");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/employee/confirm/${selectedNotification._id}`,
//         {
//           returnDate,
//           acknowledged
//         },
//         { headers: { Authorization: authToken } }
//       );
      
//       setSuccessMessage("Asset return confirmed successfully!");
      
//       // Invalidate queries to refresh data
//       queryClient.invalidateQueries("employeeAssetReturnNotifications");
//       queryClient.invalidateQueries("assetReturnNotificationCount");
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Error confirming asset return");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get status badge style
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "warning";
//       case "Approved":
//         return "success";
//       case "Completed":
//         return "info";
//       default:
//         return "default";
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return format(new Date(dateString), "MMMM dd, yyyy");
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography color="error">
//           Error loading asset return notifications: {error.message}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!data?.notifications || data.notifications.length === 0) {
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <Info sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
//         <Typography variant="h6">No pending asset return requests</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{  }}>
//       {/* Success Message */}
//       {successMessage && (
//         <Box sx={{ 
//           p: 2, 
//           mb: 3, 
//           bgcolor: "success.light", 
//           color: "success.dark",
//           borderRadius: 1,
//           display: "flex",
//           alignItems: "center"
//         }}>
//           <CheckCircle sx={{ mr: 1 }} />
//           <Typography>{successMessage}</Typography>
//         </Box>
//       )}
      
//       {/* Error Message */}
//       {errorMessage && (
//         <Box sx={{ 
//           p: 2, 
//           mb: 3, 
//           bgcolor: "error.light", 
//           color: "error.dark",
//           borderRadius: 1
//         }}>
//           <Typography>{errorMessage}</Typography>
//           <Button 
//             size="small" 
//             sx={{ mt: 1 }}
//             onClick={() => setErrorMessage("")}
//           >
//             Dismiss
//           </Button>
//         </Box>
//       )}
      
     
//        <div className="p-4 space-y-1 flex items-center gap-3  shadow-md bg-white border-b border-gray-300">
//                       <Avatar className="text-white !bg-blue-500">
//                         <AssignmentTurnedInIcon />
//                       </Avatar>
//                       <div>
//                         <h1 className="md:text-xl text-lg  font-bold  "> Asset Return Request</h1>
//                         <p className="text-sm font-extralight">
//                         View and acknowledge assets that have been assign to you
//                         </p>
//                       </div>
//                     </div>

//       {data.notifications.length > 1 && (
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="subtitle2" gutterBottom>
//             Select a notification:
//           </Typography>
//           <List>
//             {data.notifications.map((notification) => (
//               <ListItem 
//                 key={notification._id}
//                 button
//                 selected={selectedNotification?._id === notification._id}
//                 onClick={() => handleSelectNotification(notification)}
//                 sx={{ 
//                   border: '1px solid',
//                   borderColor: selectedNotification?._id === notification._id ? 'primary.main' : 'divider',
//                   borderRadius: 1,
//                   mb: 1
//                 }}
//               >
//                 <ListItemText
//                   primary={
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography variant="body1">
//                         {notification.assets.length} Asset{notification.assets.length > 1 ? 's' : ''} to Return
//                       </Typography>
//                       <Chip
//                         label={notification.status}
//                         color={getStatusColor(notification.status)}
//                         size="small"
//                       />
//                     </Box>
//                   }
//                   secondary={`Return by: ${formatDate(notification.returnDate)}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       )}
      
//       {selectedNotification && (
//         <>
//           {/* <Divider sx={{ my: 2 }} /> */}
          
//           <Typography variant="subtitle1" gutterBottom>
//             Assets to be returned:
//           </Typography>
//           <List>
//             {selectedNotification.assets.map((asset, index) => (
//               <ListItem key={asset.assetId || index}>
//                 <ListItemText
//                   primary={`${index + 1}. ${asset.name} (${asset.type})`}
//                   secondary={`Serial Number: ${asset.serialNumber}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
          
//           <Divider sx={{ my: 2 }} />
          
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Select Return Date:
//             </Typography>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Return Date"
//                 value={returnDate}
//                 onChange={(newDate) => setReturnDate(newDate)}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//                 minDate={new Date()} // Can't select dates in the past
//               />
//             </LocalizationProvider>
//           </Box>
          
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={acknowledged}
//                 onChange={(e) => setAcknowledged(e.target.checked)}
//                 name="acknowledged"
//               />
//             }
//             label="I confirm that I will return the assets on the selected date"
//           />
          
//           <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               variant="outlined"
//               onClick={onClose}
//               sx={{ mr: 1 }}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleConfirmReturn}
//               disabled={loading || !acknowledged}
//             >
//               {loading ? <CircularProgress size={24} /> : "Confirm Return"}
//             </Button>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default AssetReturnModal;


//working modified ui
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, addDays } from "date-fns";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
import { useQueryClient, useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Info, CheckCircle, WarningAmber, AccessTime } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const AssetReturnModal = ({ onClose }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  
  const [loading, setLoading] = useState(false);
  const [returnDate, setReturnDate] = useState(addDays(new Date(), 7)); // Default to 7 days from now
  const [acknowledged, setAcknowledged] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clear success message after 3 seconds
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
        if (onClose) onClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, onClose]);

  // Fetch employee's asset return notifications
  const { data, isLoading, error } = useQuery(
    ["employeeAssetReturnNotifications"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/notification/asset-return/employee/notifications`,
          {
            headers: { Authorization: authToken },
          }
        );
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { notifications: [] };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken,
      onSuccess: (data) => {
        // If there's only one notification, select it automatically
        if (data?.notifications?.length === 1) {
          setSelectedNotification(data.notifications[0]);
          setReturnDate(new Date(data.notifications[0].returnDate));
        }
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || "Error fetching asset return notifications");
      }
    }
  );

  // Function to handle notification selection
  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    setReturnDate(new Date(notification.returnDate));
  };

  // Function to handle asset return confirmation
  const handleConfirmReturn = async () => {
    if (!selectedNotification) {
      setErrorMessage("Please select a notification");
      return;
    }

    if (!acknowledged) {
      setErrorMessage("Please acknowledge that you will return the assets on the selected date");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/employee/confirm/${selectedNotification._id}`,
        {
          returnDate,
          acknowledged
        },
        { headers: { Authorization: authToken } }
      );
      
      setSuccessMessage("Asset return confirmed successfully!");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries("employeeAssetReturnNotifications");
      queryClient.invalidateQueries("assetReturnNotificationCount");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error confirming asset return");
    } finally {
      setLoading(false);
    }
  };

  // Function to get status badge style
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Completed":
        return "info";
      case "Confirmed":
        return "primary";
      default:
        return "default";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  // Check if notification is already confirmed by employee
  const isAlreadyConfirmed = (notification) => {
    return notification.status === "Confirmed" || notification.employeeConfirmed;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <WarningAmber sx={{ color: "error.main", mr: 1, fontSize: 28 }} />
          <Typography variant="h6" color="error.main">Error</Typography>
        </Box>
        <Typography>
          Error loading asset return notifications: {error.message}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }} 
          onClick={onClose}
        >
          Close
        </Button>
      </Paper>
    );
  }

  if (!data?.notifications || data.notifications.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Info sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6">No pending asset return requests</Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 3 }} 
          onClick={onClose}
        >
          Close
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
      {/* Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          // bgcolor: "primary.light",
          // color: "primary.contrastText",
          borderRadius: "8px 8px 0 0"
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <AssignmentTurnedInIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">Asset Return Request</Typography>
          <Typography variant="body2">
            View and acknowledge assets that have been assigned to you
          </Typography>
        </Box>
      </Paper>
      
      {/* Success Message */}
      {successMessage && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: "success.light", 
            color: "success.dark",
            borderRadius: 2,
            display: "flex",
            alignItems: "center"
          }}
        >
          <CheckCircle sx={{ mr: 1 }} />
          <Typography>{successMessage}</Typography>
        </Paper>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: "error.light", 
            color: "error.dark",
            borderRadius: 2,
            display: "flex",
            alignItems: "center"
          }}
        >
          <WarningAmber sx={{ mr: 1 }} />
          <Typography>{errorMessage}</Typography>
          <Button 
            size="small" 
            sx={{ ml: 'auto' }}
            onClick={() => setErrorMessage("")}
          >
            Dismiss
          </Button>
        </Paper>
      )}
      
      {/* Notification Selection */}
      {data.notifications.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Select a notification:
          </Typography>
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {data.notifications.map((notification) => (
              <ListItem 
                key={notification._id}
                button
                selected={selectedNotification?._id === notification._id}
                onClick={() => handleSelectNotification(notification)}
                sx={{ 
                  border: '1px solid',
                  borderColor: selectedNotification?._id === notification._id ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {notification.assets.length} Asset{notification.assets.length > 1 ? 's' : ''} to Return
                      </Typography>
                      <Chip
                        label={notification.status}
                        color={getStatusColor(notification.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2">Return by: {formatDate(notification.returnDate)}</Typography>
                      {isAlreadyConfirmed(notification) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'info.main' }} />
                          <Typography variant="body2" color="info.main">
                            Already confirmed. Waiting for manager/HR confirmation.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {selectedNotification && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          {/* Assets List */}
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Assets to be returned:
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 3 }}>
            {selectedNotification.assets.map((asset, index) => (
              <ListItem key={asset.assetId || index} sx={{ borderBottom: index < selectedNotification.assets.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <ListItemText
                  primary={
                    <Typography fontWeight="medium">
                      {index + 1}. {asset.name} ({asset.type})
                    </Typography>
                  }
                  secondary={`Serial Number: ${asset.serialNumber || 'N/A'}`}
                />
              </ListItem>
            ))}
          </List>
          
          {/* Already Confirmed Message */}
          {isAlreadyConfirmed(selectedNotification) ? (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              color: 'info.dark', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography>
                You have already confirmed to return these assets. Waiting for manager/HR confirmation.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Return Date Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Select Return Date:
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Return Date"
                    value={returnDate}
                    onChange={(newDate) => setReturnDate(newDate)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={new Date()} // Can't select dates in the past
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Box>
              
              {/* Acknowledgment */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    name="acknowledged"
                    color="primary"
                  />
                }
                label="I confirm that I will return the assets on the selected date"
                sx={{ mb: 2 }}
              />
            </>
          )}
          
          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Cancel
            </Button>
            
            {!isAlreadyConfirmed(selectedNotification) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmReturn}
                disabled={loading || !acknowledged}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Processing..." : "Confirm Return"}
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AssetReturnModal;
