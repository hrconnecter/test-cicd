

//working
// import React, { useState, useContext, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
//   Grid,
//   Typography,
//   CircularProgress
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { TestContext } from "../../State/Function/Main";

// const AddAssetModal = ({ open, handleClose, employeeId, assetToEdit = null }) => {
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();
//   const isEditing = !!assetToEdit;

//   // Fetch asset types for dropdown
//   // const { data: assetTypes } = useQuery(
//   //   ["assetTypes"],
//   //   async () => {
//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API}/route/assets/types`,
//   //       {
//   //         headers: {
//   //           Authorization: authToken,
//   //         },
//   //       }
//   //     );
//   //     return response.data.types.map(type => type.name);
//   //   },
//   //   {
//   //     // Only fetch if modal is open
//   //     enabled: open
//   //   }
//   // );



//   const [assetData, setAssetData] = useState({
//     name: "",
//     type: "",
//     serialNumber: "",
//     recertificationRequired: false,
//     recertificationDate: null,
//     validityDate: null,
//   });

//     const assetTypes = [
//     "Laptop",
//     "Desktop",
//     "Mobile Phone",
//     "Tablet",
//     "Monitor",
//     "Keyboard",
//     "Mouse",
//     "Headset",
//     "Software License",
//     "Access Card",
//     "Other"
//   ];

//   // Initialize form with asset data when editing
//   useEffect(() => {
//     if (isEditing && assetToEdit) {
//       setAssetData({
//         name: assetToEdit.name || "",
//         type: assetToEdit.type || "",
//         serialNumber: assetToEdit.serialNumber || "",
//         recertificationRequired: assetToEdit.recertificationRequired || false,
//         recertificationDate: assetToEdit.recertificationDate ? new Date(assetToEdit.recertificationDate) : null,
//         validityDate: assetToEdit.validityDate ? new Date(assetToEdit.validityDate) : null,
//       });
//     } else {
//       // Reset form when not editing
//       setAssetData({
//         name: "",
//         type: "",
//         serialNumber: "",
//         recertificationRequired: false,
//         recertificationDate: null,
//         validityDate: null,
//       });
//     }
//   }, [isEditing, assetToEdit, open]);

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setAssetData({
//       ...assetData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleDateChange = (name, date) => {
//     setAssetData({
//       ...assetData,
//       [name]: date,
//     });
//   };

//   // Add/Edit asset mutation
//   const assetMutation = useMutation(
//     (data) => {
//       if (isEditing) {
//         return axios.put(
//           `${process.env.REACT_APP_API}/route/assets/${assetToEdit._id}`,
//           data,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//       } else {
//         return axios.post(
//           `${process.env.REACT_APP_API}/route/assets`,
//           data,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//       }
//     },
//     {
//       onSuccess: () => {
//         // Invalidate all relevant queries
//         queryClient.invalidateQueries("allAssets");
//         if (employeeId && employeeId !== 'undefined') {
//           queryClient.invalidateQueries(["employeeAssets", employeeId]);
//         }
//         queryClient.invalidateQueries("assetStats");
        
//         handleAlert(true, "success", `Asset ${isEditing ? "updated" : "added"} successfully`);
//         handleClose();
//       },
//       onError: (error) => {
//         console.error("Error saving asset:", error);
//         handleAlert(true, "error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "add"} asset`);
//       },
//     }
//   );

//   const handleSubmit = () => {
//     // Validate form
//     if (!assetData.name || !assetData.type || !assetData.serialNumber) {
//       handleAlert(true, "error", "Please fill all required fields");
//       return;
//     }

//     if (assetData.recertificationRequired && !assetData.recertificationDate) {
//       handleAlert(true, "error", "Please select a recertification date");
//       return;
//     }

//     if (!assetData.recertificationRequired && !assetData.validityDate) {
//       handleAlert(true, "error", "Please select a validity date");
//       return;
//     }

//     // Calculate status based on dates
//     const today = new Date();
//     const targetDate = assetData.recertificationRequired 
//       ? assetData.recertificationDate 
//       : assetData.validityDate;
    
//     let status = "Active";
//     if (targetDate) {
//       const diffTime = targetDate - today;
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       if (diffDays < 0) {
//         status = "Expired";
//       } else if (diffDays <= 30) {
//         status = "Expiring Soon";
//       }
//     }

//     // Prepare data for submission
//     const submissionData = {
//       ...assetData,
//       employeeId: employeeId === 'undefined' ? null : employeeId,
//       status,
//     };

//     assetMutation.mutate(submissionData);
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="name"
//               label="Asset Name"
//               value={assetData.name}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth required>
//               <InputLabel>Asset Type</InputLabel>
//               {/* <Select
//                 name="type"
//                 value={assetData.type}
//                 onChange={handleChange}
//                 label="Asset Type"
//               >
//                 {assetTypes ? (
//                   assetTypes.map((type) => (
//                     <MenuItem key={type} value={type}>
//                       {type}
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem value="">Loading...</MenuItem>
//                 )}
//               </Select> */}

// <Select
//                 name="type"
//                 value={assetData.type}
//                 onChange={handleChange}
//                 label="Asset Type"
//               >
//                 {assetTypes.map((type) => (
//                   <MenuItem key={type} value={type}>
//                     {type}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               name="serialNumber"
//               label="Serial Number"
//               value={assetData.serialNumber}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="recertificationRequired"
//                   checked={assetData.recertificationRequired}
//                   onChange={handleChange}
//                 />
//               }
//               label="Recertification Required?"
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//               {assetData.recertificationRequired 
//                 ? "Select Recertification Date" 
//                 : "Select Validity Date"}
//             </Typography>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 value={assetData.recertificationRequired 
//                   ? assetData.recertificationDate 
//                   : assetData.validityDate}
//                 onChange={(date) => handleDateChange(
//                   assetData.recertificationRequired ? "recertificationDate" : "validityDate", 
//                   date
//                 )}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//                 minDate={new Date()}
//               />
//             </LocalizationProvider>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           color="primary"
//           disabled={assetMutation.isLoading}
//         >
//           {assetMutation.isLoading ? (
//             <CircularProgress size={24} />
//           ) : (
//             isEditing ? "Update" : "Add"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddAssetModal;


//add asset type
// import React, { useState, useContext, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
//   Grid,
//   Typography,
//   CircularProgress,
//   Box
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { useMutation, useQueryClient, useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { TestContext } from "../../State/Function/Main";

// const AddAssetModal = ({ open, handleClose, employeeId, assetToEdit = null }) => {
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();
//   const isEditing = !!assetToEdit;

//   // State for custom asset type
//   const [showCustomTypeField, setShowCustomTypeField] = useState(false);
//   const [customAssetType, setCustomAssetType] = useState("");
//   const [isAddingCustomType, setIsAddingCustomType] = useState(false);

//   // Fetch asset types from API
//   const { data: fetchedAssetTypes, isLoading: typesLoading , refetch: refetchAssetTypes} = useQuery(
//     ["assetTypes"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assets/types`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       // return response.data.types.map(type => type.name);
//       return response.data.types || [];

//     },
//     {
//       enabled: open,
//       onError: (error) => {
//         console.error("Error fetching asset types:", error);
//         handleAlert(true, "error", "Failed to load asset types");
//       }
//     }
//   );

//   const [assetData, setAssetData] = useState({
//     name: "",
//     type: "",
//     serialNumber: "",
//     recertificationRequired: false,
//     recertificationDate: null,
//     validityDate: null,
//   });

//   // Default asset types plus "Other" option
//   const defaultAssetTypes = [
//     "Laptop",
//     "Desktop",
//     "Mobile Phone",
//     "Tablet",
//     "Monitor",
//     "Keyboard",
//     "Mouse",
//     "Headset",
//     "Software License",
//     "Access Card",
//     "Other"
//   ];

//  // Get all type names from fetched types
// const fetchedTypeNames = fetchedAssetTypes ? fetchedAssetTypes.map(type => type.name) : [];

// // Combine fetched types with default types, removing duplicates
// const combinedAssetTypes = fetchedAssetTypes 
//   ? [...new Set([...fetchedTypeNames, ...defaultAssetTypes])]
//   : defaultAssetTypes;

//   // Initialize form with asset data when editing
//   useEffect(() => {
//     if (isEditing && assetToEdit) {
//       setAssetData({
//         name: assetToEdit.name || "",
//         type: assetToEdit.type || "",
//         serialNumber: assetToEdit.serialNumber || "",
//         recertificationRequired: assetToEdit.recertificationRequired || false,
//         recertificationDate: assetToEdit.recertificationDate ? new Date(assetToEdit.recertificationDate) : null,
//         validityDate: assetToEdit.validityDate ? new Date(assetToEdit.validityDate) : null,
//       });
//     } else {
//       // Reset form when not editing
//       setAssetData({
//         name: "",
//         type: "",
//         serialNumber: "",
//         recertificationRequired: false,
//         recertificationDate: null,
//         validityDate: null,
//       });
//       setShowCustomTypeField(false);
//       setCustomAssetType("");
//     }
//   }, [isEditing, assetToEdit, open]);

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
    
//     if (name === "type" && value === "Other") {
//       setShowCustomTypeField(true);
//     } else if (name === "type") {
//       setShowCustomTypeField(false);
//     }
    
//     setAssetData({
//       ...assetData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleDateChange = (name, date) => {
//     setAssetData({
//       ...assetData,
//       [name]: date,
//     });
//   };

//   // Mutation for creating a new asset type
//   const createAssetTypeMutation = useMutation(
//     async (typeName) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/assets/types`,
//         { name: typeName },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: (data) => {
//         // queryClient.invalidateQueries("assetTypes");
//         refetchAssetTypes();

//         handleAlert(true, "success", "New asset type created successfully");
//         setAssetData({
//           ...assetData,
//           type: customAssetType
//         });
//         setShowCustomTypeField(false);
//         setIsAddingCustomType(false);
//       },
//       onError: (error) => {
//         console.error("Error creating asset type:", error);
//         handleAlert(true, "error", error.response?.data?.message || "Failed to create asset type");
//         setIsAddingCustomType(false);
//       }
//     }
//   );

//   const handleAddCustomType = () => {
//     if (!customAssetType.trim()) {
//       handleAlert(true, "error", "Please enter a valid asset type name");
//       return;
//     }
    
//     setIsAddingCustomType(true);
//     createAssetTypeMutation.mutate(customAssetType);
//   };

//   // Add/Edit asset mutation
//   const assetMutation = useMutation(
//     (data) => {
//       if (isEditing) {
//         return axios.put(
//           `${process.env.REACT_APP_API}/route/assets/${assetToEdit._id}`,
//           data,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//       } else {
//         return axios.post(
//           `${process.env.REACT_APP_API}/route/assets`,
//           data,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//       }
//     },
//     {
//       onSuccess: () => {
//         // Invalidate all relevant queries
//         queryClient.invalidateQueries("allAssets");
//         if (employeeId && employeeId !== 'undefined') {
//           queryClient.invalidateQueries(["employeeAssets", employeeId]);
//         }
//         queryClient.invalidateQueries("assetStats");
        
//         handleAlert(true, "success", `Asset ${isEditing ? "updated" : "added"} successfully`);
//         handleClose();
//       },
//       onError: (error) => {
//         console.error("Error saving asset:", error);
//         handleAlert(true, "error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "add"} asset`);
//       },
//     }
//   );

//   const handleSubmit = () => {
//     // Validate form
//     if (!assetData.name || !assetData.serialNumber) {
//       handleAlert(true, "error", "Please fill all required fields");
//       return;
//     }

//     // Check if we need to use the custom type
//     const assetType = showCustomTypeField && customAssetType ? customAssetType : assetData.type;
//     if (!assetType) {
//       handleAlert(true, "error", "Please select or enter an asset type");
//       return;
//     }

//     if (assetData.recertificationRequired && !assetData.recertificationDate) {
//       handleAlert(true, "error", "Please select a recertification date");
//       return;
//     }

//     if (!assetData.recertificationRequired && !assetData.validityDate) {
//       handleAlert(true, "error", "Please select a validity date");
//       return;
//     }

//     // Calculate status based on dates
//     const today = new Date();
//     const targetDate = assetData.recertificationRequired 
//       ? assetData.recertificationDate 
//       : assetData.validityDate;
    
//     let status = "Active";
//     if (targetDate) {
//       const diffTime = targetDate - today;
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       if (diffDays < 0) {
//         status = "Expired";
//       } else if (diffDays <= 30) {
//         status = "Expiring Soon";
//       }
//     }

//     // Prepare data for submission
//     const submissionData = {
//       ...assetData,
//       type: assetType,
//       employeeId: employeeId === 'undefined' ? null : employeeId,
//       status,
//     };

//     assetMutation.mutate(submissionData);
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="name"
//               label="Asset Name"
//               value={assetData.name}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <FormControl fullWidth required>
//               <InputLabel>Asset Type</InputLabel>
//               <Select
//                 name="type"
//                 value={assetData.type}
//                 onChange={handleChange}
//                 label="Asset Type"
//               >
//                 {typesLoading ? (
//                   <MenuItem value="">
//                     <CircularProgress size={20} /> Loading...
//                   </MenuItem>
//                 ) : (
//                   combinedAssetTypes.map((type) => (
//                     <MenuItem key={type} value={type}>
//                       {type}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//             </FormControl>
//           </Grid>
          
//           {/* Custom Asset Type Field */}
//           {showCustomTypeField && (
//             <Grid item xs={12}>
//               <Box display="flex" gap={2} alignItems="center">
//                 <TextField
//                   name="customAssetType"
//                   label="Enter New Asset Type"
//                   value={customAssetType}
//                   onChange={(e) => setCustomAssetType(e.target.value)}
//                   fullWidth
//                   required
//                 />
//                 <Button 
//                   variant="contained" 
//                   color="primary"
//                   onClick={handleAddCustomType}
//                   disabled={isAddingCustomType || !customAssetType.trim()}
//                 >
//                   {isAddingCustomType ? <CircularProgress size={24} /> : "Add"}
//                 </Button>
//               </Box>
//             </Grid>
//           )}
          
//           <Grid item xs={12}>
//             <TextField
//               name="serialNumber"
//               label="Serial Number"
//               value={assetData.serialNumber}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="recertificationRequired"
//                   checked={assetData.recertificationRequired}
//                   onChange={handleChange}
//                 />
//               }
//               label="Recertification Required?"
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//               {assetData.recertificationRequired 
//                 ? "Select Recertification Date" 
//                 : "Select Validity Date"}
//             </Typography>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 value={assetData.recertificationRequired 
//                   ? assetData.recertificationDate 
//                   : assetData.validityDate}
//                 onChange={(date) => handleDateChange(
//                   assetData.recertificationRequired ? "recertificationDate" : "validityDate", 
//                   date
//                 )}
//                 renderInput={(params) => <TextField {...params} fullWidth />}
//                 minDate={new Date()}
//               />
//             </LocalizationProvider>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           color="primary"
//           disabled={assetMutation.isLoading}
//         >
//           {assetMutation.isLoading ? (
//             <CircularProgress size={24} />
//           ) : (
//             isEditing ? "Update" : "Add"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddAssetModal;

//Modern
import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Divider,
  IconButton,
  Paper
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMutation, useQueryClient, useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { TestContext } from "../../State/Function/Main";
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from '@mui/icons-material/Category';
import QrCodeIcon from '@mui/icons-material/QrCode';

const AddAssetModal = ({ open, handleClose, employeeId, assetToEdit = null }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient(); 
  const isEditing = !!assetToEdit;

  // State for custom asset type
  const [showCustomTypeField, setShowCustomTypeField] = useState(false);
  const [customAssetType, setCustomAssetType] = useState("");
  const [isAddingCustomType, setIsAddingCustomType] = useState(false);

  // Fetch asset types from API
  const { data: fetchedAssetTypes, isLoading: typesLoading, refetch: refetchAssetTypes } = useQuery(
    ["assetTypes"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assets/types`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.types || [];
    },
    {
      enabled: open,
      onError: (error) => {
        console.error("Error fetching asset types:", error);
        handleAlert(true, "error", "Failed to load asset types");
      }
    }
  );

  const [assetData, setAssetData] = useState({
    name: "",
    type: "",
    serialNumber: "",
    recertificationRequired: false,
    recertificationDate: null,
    validityDate: null,
  });

  // Default asset types plus "Other" option
  const defaultAssetTypes = [
    "Laptop",
    "Desktop",
    "Mobile Phone",
    "Tablet",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headset",
    "Software License",
    "Access Card",
    "Other"
  ];

  // Get all type names from fetched types
  const fetchedTypeNames = fetchedAssetTypes ? fetchedAssetTypes.map(type => type.name) : [];

  // Combine fetched types with default types, removing duplicates
  const combinedAssetTypes = fetchedAssetTypes 
    ? [...new Set([...fetchedTypeNames, ...defaultAssetTypes])]
    : defaultAssetTypes;

  // Initialize form with asset data when editing
  // useEffect(() => {
  //   if (isEditing && assetToEdit) {
  //     setAssetData({
  //       name: assetToEdit.name || "",
  //       type: assetToEdit.type || "",
  //       serialNumber: assetToEdit.serialNumber || "",
  //       recertificationRequired: assetToEdit.recertificationRequired || false,
  //       recertificationDate: assetToEdit.recertificationDate ? new Date(assetToEdit.recertificationDate) : null,
  //       validityDate: assetToEdit.validityDate ? new Date(assetToEdit.validityDate) : null,
  //     });
  //   } else {
  //     // Reset form when not editing
  //     setAssetData({
  //       name: "",
  //       type: "",
  //       serialNumber: "",
  //       recertificationRequired: false,
  //       recertificationDate: null,
  //       validityDate: null,
  //     });
  //     setShowCustomTypeField(false);
  //     setCustomAssetType("");
  //   }
  // }, [isEditing, assetToEdit, open]);

  //temp
  useEffect(() => {
    if (isEditing && assetToEdit) {
      setAssetData({
        name: assetToEdit.name || "",
        type: assetToEdit.type || "",
        serialNumber: assetToEdit.serialNumber || "",
        recertificationRequired: assetToEdit.recertificationRequired || false,
        recertificationDate: assetToEdit.recertificationDate ? new Date(assetToEdit.recertificationDate) : null,
        validityDate: assetToEdit.validityDate ? new Date(assetToEdit.validityDate) : null,
        // Store the current status to preserve it
        currentStatus: assetToEdit.status || "Active",
      });
    } else {
      // Reset form when not editing
      setAssetData({
        name: "",
        type: "",
        serialNumber: "",
        recertificationRequired: false,
        recertificationDate: null,
        validityDate: null,
        currentStatus: null,
      });
    }
  }, [isEditing, assetToEdit, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === "type" && value === "Other") {
      setShowCustomTypeField(true);
    } else if (name === "type") {
      setShowCustomTypeField(false);
    }
    
    setAssetData({
      ...assetData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (name, date) => {
    setAssetData({
      ...assetData,
      [name]: date,
    });
  };

  // Mutation for creating a new asset type
  const createAssetTypeMutation = useMutation(
    async (typeName) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/assets/types`,
        { name: typeName },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        refetchAssetTypes();
        handleAlert(true, "success", "New asset type created successfully");
        setAssetData({
          ...assetData,
          type: customAssetType
        });
        setShowCustomTypeField(false);
        setIsAddingCustomType(false);
      },
      onError: (error) => {
        console.error("Error creating asset type:", error);
        handleAlert(true, "error", error.response?.data?.message || "Failed to create asset type");
        setIsAddingCustomType(false);
      }
    }
  );

  const handleAddCustomType = () => {
    if (!customAssetType.trim()) {
      handleAlert(true, "error", "Please enter a valid asset type name");
      return;
    }
    
    setIsAddingCustomType(true);
    createAssetTypeMutation.mutate(customAssetType);
  };

  // Add/Edit asset mutation
  const assetMutation = useMutation(
    (data) => {
      if (isEditing) {
        return axios.put(
          `${process.env.REACT_APP_API}/route/assets/${assetToEdit._id}`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      } else {
        return axios.post(
          `${process.env.REACT_APP_API}/route/assets`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      }
    },
    {
      onSuccess: () => {
        // Invalidate all relevant queries
        queryClient.invalidateQueries("allAssets");
        if (employeeId && employeeId !== 'undefined') {
          queryClient.invalidateQueries(["employeeAssets", employeeId]);
        }
        queryClient.invalidateQueries("assetStats");
        
        handleAlert(true, "success", `Asset ${isEditing ? "updated" : "added"} successfully`);
        handleClose();
      },
      onError: (error) => {
        console.error("Error saving asset:", error);
        handleAlert(true, "error", error.response?.data?.message || `Failed to ${isEditing ? "update" : "add"} asset`);
      },
    }
  );

  // const handleSubmit = () => {
  //   // Validate form
  //   if (!assetData.name || !assetData.serialNumber) {
  //     handleAlert(true, "error", "Please fill all required fields");
  //     return;
  //   }

  //   // Check if we need to use the custom type
  //   const assetType = showCustomTypeField && customAssetType ? customAssetType : assetData.type;
  //   if (!assetType) {
  //     handleAlert(true, "error", "Please select or enter an asset type");
  //     return;
  //   }

  //   if (assetData.recertificationRequired && !assetData.recertificationDate) {
  //     handleAlert(true, "error", "Please select a recertification date");
  //     return;
  //   }

  //   if (!assetData.recertificationRequired && !assetData.validityDate) {
  //     handleAlert(true, "error", "Please select a validity date");
  //     return;
  //   }

  //   // Calculate status based on dates
  //   const today = new Date();
  //   const targetDate = assetData.recertificationRequired 
  //     ? assetData.recertificationDate 
  //     : assetData.validityDate;
    
  //   let status = "Active";
  //   if (targetDate) {
  //     const diffTime = targetDate - today;
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
  //     if (diffDays < 0) {
  //       status = "Expired";
  //     } else if (diffDays <= 30) {
  //       status = "Expiring Soon";
  //     }
  //   }
  //   const isAssigned = employeeId && employeeId !== 'undefined';
  //   const assignmentStatus = isAssigned ? "Assigned" : "Unassigned";


  //   // Prepare data for submission
  //   const submissionData = {
  //     ...assetData,
  //     type: assetType,
  //     employeeId: employeeId === 'undefined' ? null : employeeId,
  //     // employeeId: isAssigned ? employeeId : null,
  //     status,
  //     assignmentStatus,
  //   };

  //   assetMutation.mutate(submissionData);
  // };

  //temp
  const handleSubmit = () => {
    // Validate form
    if (!assetData.name || !assetData.serialNumber) {
      handleAlert(true, "error", "Please fill all required fields");
      return;
    }
  
    // Check if we need to use the custom type
    const assetType = showCustomTypeField && customAssetType ? customAssetType : assetData.type;
    if (!assetType) {
      handleAlert(true, "error", "Please select or enter an asset type");
      return;
    }
  
    if (assetData.recertificationRequired && !assetData.recertificationDate) {
      handleAlert(true, "error", "Please select a recertification date");
      return;
    }
  
    if (!assetData.recertificationRequired && !assetData.validityDate) {
      handleAlert(true, "error", "Please select a validity date");
      return;
    }
  
    // Calculate status based on dates (validity status)
    const today = new Date();
    const targetDate = assetData.recertificationRequired 
      ? assetData.recertificationDate 
      : assetData.validityDate;
    
    let status;
    
    // If editing, check if dates have changed before recalculating status
    if (isEditing && assetToEdit) {
      const oldTargetDate = assetToEdit.recertificationRequired 
        ? assetToEdit.recertificationDate 
        : assetToEdit.validityDate;
      
      const hasDateChanged = 
        (targetDate && !oldTargetDate) || 
        (!targetDate && oldTargetDate) || 
        (targetDate && oldTargetDate && new Date(targetDate).getTime() !== new Date(oldTargetDate).getTime());
      
      // If dates haven't changed, preserve the existing status
      if (!hasDateChanged && assetToEdit.status && 
          ["Active", "Expired", "Expiring Soon"].includes(assetToEdit.status)) {
        status = assetToEdit.status;
      } else {
        // Calculate new status based on dates
        status = "Active";
        if (targetDate) {
          const diffTime = targetDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) {
            status = "Expired";
          } else if (diffDays <= 30) {
            status = "Expiring Soon";
          }
        }
      }
    } else {
      // For new assets, calculate status based on dates
      status = "Active";
      if (targetDate) {
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          status = "Expired";
        } else if (diffDays <= 30) {
          status = "Expiring Soon";
        }
      }
    }
  
    // Determine assignment status based on employeeId
    const isAssigned = employeeId && employeeId !== 'undefined';
    const assignmentStatus = isAssigned ? "Assigned" : "Unassigned";
  
    // Prepare data for submission
    const submissionData = {
      ...assetData,
      type: assetType,
      employeeId: employeeId === 'undefined' ? null : employeeId,
      status, // Use the calculated or preserved status
      assignmentStatus,
    };
  
    // Remove the temporary currentStatus field before submission
    delete submissionData.currentStatus;
  
    assetMutation.mutate(submissionData);
  };
  
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 3,
        backgroundColor: '#f8f9fa'
      }}>
        <Box>
          <Typography variant="h5" component="div" fontWeight={600} color="">
            {isEditing ? "Update Asset Information" : "Register New Asset"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isEditing 
              ? "Modify the asset details and save your changes" 
              : "Fill in the details to add a new asset to the inventory"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              backgroundColor: 'rgba(25, 118, 210, 0.05)', 
              borderRadius: '8px',
              border: '1px solid rgba(25, 118, 210, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <InfoOutlinedIcon color="primary" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
                  Asset Management Guidelines
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All assets must have a unique serial number. Assets requiring recertification will be 
                  flagged for renewal before expiry. Please ensure all information is accurate.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon fontSize="small" color="primary" />
              Basic Asset Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label="Asset Name"
              value={assetData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Enter asset name"
              helperText="Provide a descriptive name for the asset"
              InputProps={{
                sx: { borderRadius: '8px' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Asset Type</InputLabel>
              <Select
                name="type"
                value={assetData.type}
                onChange={handleChange}
                label="Asset Type"
                sx={{ borderRadius: '8px' }}
              >
                {typesLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} /> Loading...
                  </MenuItem>
                ) : (
                  combinedAssetTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Custom Asset Type Field */}
          {showCustomTypeField && (
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                  Add New Asset Type
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    name="customAssetType"
                    label="New Asset Type Name"
                    value={customAssetType}
                    onChange={(e) => setCustomAssetType(e.target.value)}
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleAddCustomType}
                    disabled={isAddingCustomType || !customAssetType.trim()}
                    startIcon={isAddingCustomType ? <CircularProgress size={20} /> : <AddCircleOutlineIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {isAddingCustomType ? "Adding..." : "Add Type"}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              name="serialNumber"
              label="Serial Number"
              value={assetData.serialNumber}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              placeholder="Enter unique serial number"
              helperText="Must be unique for each asset"
              InputProps={{
                startAdornment: <QrCodeIcon color="action" sx={{ mr: 1 }} />,
                sx: { borderRadius: '8px' }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventNoteIcon fontSize="small" color="primary" />
              Validity & Recertification
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: assetData.recertificationRequired ? 'rgba(25, 118, 210, 0.05)' : '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid',
                borderColor: assetData.recertificationRequired ? 'rgba(25, 118, 210, 0.2)' : '#e0e0e0',
                transition: 'all 0.3s ease'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="recertificationRequired"
                    checked={assetData.recertificationRequired}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Recertification Required
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check this if the asset requires periodic recertification or renewal
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                {assetData.recertificationRequired 
                  ? "Recertification Date" 
                  : "Validity Date"}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {assetData.recertificationRequired 
                  ? "Select the date when this asset will need to be recertified" 
                  : "Select the date until which this asset will remain valid"}
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={assetData.recertificationRequired 
                    ? assetData.recertificationDate 
                    : assetData.validityDate}
                  onChange={(date) => handleDateChange(
                    assetData.recertificationRequired ? "recertificationDate" : "validityDate", 
                    date
                  )}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px'
                        }
                      }}
                    />
                  )}
                  minDate={new Date()}
                />
              </LocalizationProvider>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Assets with dates within 30 days will be marked as "Expiring Soon"
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={assetMutation.isLoading}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            minWidth: '120px'
          }}
        >
          {assetMutation.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            isEditing ? "Update Asset" : "Add Asset"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAssetModal;
