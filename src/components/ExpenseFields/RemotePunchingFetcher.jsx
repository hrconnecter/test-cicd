/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, CircularProgress } from "@mui/material";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useFormContext } from "react-hook-form";

// const RemotePunchingFetcher = ({ authToken, employeeId, organisationId, allowanceAmount, currency }) => {
//   const [open, setOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [fetchingData, setFetchingData] = useState(false);
//   const [kmData, setKmData] = useState(null);
//   const { setValue } = useFormContext();

//   const handleOpen = () => {
//     setOpen(true);
//     setKmData(null);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const fetchKmData = async () => {
//     if (!selectedDate) return;
    
//     setFetchingData(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/punch/distance/${employeeId}?date=${selectedDate}`,
//         { headers: { Authorization: authToken } }
//       );
      
//       setKmData(response.data);
//     } catch (error) {
//       console.error("Error fetching KM data:", error);
//     } finally {
//       setFetchingData(false);
//     }
//   };

//   const applyAllowance = () => {
//     if (kmData && kmData.totalDistance) {
//       const calculatedAmount = kmData.totalDistance * allowanceAmount;
      
//       // Set the amount field and make it readonly
//       setValue("amount", calculatedAmount.toFixed(2), { shouldValidate: true });
//       setValue("isRemotePunchingAllowance", true); // Flag to make amount field readonly
//       setValue("remotePunchingDetails", {
//         date: selectedDate,
//         km: kmData.totalDistance,
//         allowancePerKm: allowanceAmount,
//         currency: currency
//       });
      
//       handleClose();
//     }
//   };

//   return (
//     <>
//       <Button 
//         variant="outlined" 
//         color="primary" 
//         onClick={handleOpen}
//         className="mb-4"
//         fullWidth
//       >
//         Fetch Remote Punching Allowance
//       </Button>

//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Remote Punching Allowance</DialogTitle>
//         <DialogContent>
//           <div className="space-y-4 py-2">
//             <Typography variant="body2">
//               Select the date to fetch remote punching distance data. The allowance will be calculated at {allowanceAmount} {currency} per KM.
//             </Typography>
            
//             <TextField
//               label="Select Date"
//               type="date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />
            
//             <Button 
//               variant="contained" 
//               color="primary" 
//               onClick={fetchKmData}
//               disabled={!selectedDate || fetchingData}
//               fullWidth
//             >
//               {fetchingData ? <CircularProgress size={24} /> : "Fetch KM Data"}
//             </Button>

//             {kmData && (
//               <div className="mt-4 p-4 bg-gray-50 rounded-md">
//                 <Typography variant="subtitle1">Distance Data for {selectedDate}</Typography>
//                 <Typography variant="body1">
//                   Total Distance: <strong>{kmData.totalDistance.toFixed(2)} KM</strong>
//                 </Typography>
//                 <Typography variant="body1">
//                   Calculated Allowance: <strong>{(kmData.totalDistance * allowanceAmount).toFixed(2)} {currency}</strong>
//                 </Typography>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button 
//             onClick={applyAllowance} 
//             color="primary" 
//             variant="contained"
//             disabled={!kmData || !kmData.totalDistance}
//           >
//             Apply Allowance
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default RemotePunchingFetcher;



import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { useFormContext } from "react-hook-form";

const RemotePunchingFetcher = ({ authToken, employeeId, organisationId, allowanceAmount, currency }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [kmData, setKmData] = useState(null);
  const { setValue } = useFormContext();

  const handleOpen = () => {
    setOpen(true);
    setKmData(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchKmData = async () => {
    if (!selectedDate) return;
    
    setFetchingData(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch/distance/${employeeId}?date=${selectedDate}`,
        { headers: { Authorization: authToken } }
      );
      
      setKmData(response.data);
    } catch (error) {
      console.error("Error fetching KM data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const applyAllowance = () => {
    if (kmData && kmData.totalDistance) {
      const calculatedAmount = kmData.totalDistance * allowanceAmount;
      
      // Set the amount field and make it readonly
      setValue("amount", calculatedAmount.toFixed(2), { shouldValidate: true });
      setValue("isRemotePunchingAllowance", true); // Flag to make amount field readonly
      
      // Also set the start date and end date to match the selected date
      setValue("startDate", selectedDate, { shouldValidate: true });
      setValue("endDate", selectedDate, { shouldValidate: true });
      
      setValue("remotePunchingDetails", {
        date: selectedDate,
        km: kmData.totalDistance,
        allowancePerKm: allowanceAmount,
        currency: currency
      });
      
      handleClose();
    }
  };

  return (
    <>
      <Button 
        variant="outlined" 
        size="small" 
        color="primary" 
        onClick={handleOpen}
      
        fullWidth
      >
        {/* Fetch Remote Punching Allowance */}
        Apply Allowance
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Remote Punching Allowance</DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-2">
            <Typography variant="body2">
              Select the date to fetch remote punching distance data. The allowance will be calculated at {allowanceAmount} {currency} per KM.
              This date will also be used for the expense start and end dates.
            </Typography>
            
            <TextField
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={fetchKmData}
              disabled={!selectedDate || fetchingData}
              fullWidth
            >
              {fetchingData ? <CircularProgress size={24} /> : "Fetch KM Data"}
            </Button>

            {kmData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <Typography variant="subtitle1">Distance Data for {selectedDate}</Typography>
                <Typography variant="body1">
                  Total Distance: <strong>{kmData.totalDistance.toFixed(2)} KM</strong>
                </Typography>
                <Typography variant="body1">
                  Calculated Allowance: <strong>{(kmData.totalDistance * allowanceAmount).toFixed(2)} {currency}</strong>
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={applyAllowance} 
            color="primary" 
            variant="contained"
            disabled={!kmData || !kmData.totalDistance}
          >
            Apply Allowance
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RemotePunchingFetcher;
