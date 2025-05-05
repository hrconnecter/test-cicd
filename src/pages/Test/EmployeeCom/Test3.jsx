/* eslint-disable no-unused-vars */
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ContactMail } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material";
// import { React } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom"; 
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
// import BasicButton from "../../../components/BasicButton";

// const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
//   // define state, hook and other if needed
//   const organisationId = useParams("");
//   const { AdditionalListCall } = useEmpQuery(organisationId);
//   const { addtionalFields, addtionalLoading } = AdditionalListCall();
//   const { setStep3Data, data } = useEmpState();
//   const EmployeeSchema = z.object({}).catchall(z.any().optional());

//   // define the useForm
//   const { control, formState, handleSubmit } = useForm({
//     defaultValues: {
//       ...data,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });


//   // to define the onSubmit function
//   const onSubmit = (testData) => {
//     console.log("Test 3", testData);
//     setStep3Data(testData);
//     nextStep();
//   };

//   const { errors } = formState;
//   if (addtionalLoading) {
//     return (
//       <div className="flex h-[40vh] items-center justify-center">
//         <CircularProgress />
//       </div>
//     );
//   }
//   return (
//     <div className="w-full mt-4">
//       <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex  flex-1 flex-col"
//       >
//         {/* <div className="grid grid-cols-2 w-full gap-3"> */}
//         <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
//           {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
//             <>

//               {input.isActive && (
//                 <AuthInputFiled
//                   name={input.label}
//                   placeholder={input.label}
//                   label={input.placeholder}
//                   icon={ContactMail}
//                   control={control}
//                   type={input.inputType}
//                   errors={errors}
//                   error={errors.label}
//                   className="text-sm"
//                 />
//               )}
//             </>
//           ))} 
//         </div>

//         <div className="flex items-end w-full justify-between">
//           <BasicButton title="Prev" type="button"
//             onClick={() => {
//               prevStep();
//             }} />
//           <BasicButton type="submit"
//             disabled={isLastStep} title="Next" />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Test3;


// import { zodResolver } from "@hookform/resolvers/zod";
// import { ContactMail, Inventory } from "@mui/icons-material";
// import { CircularProgress, Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
// import { React, useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom"; 
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
// import BasicButton from "../../../components/BasicButton";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";

// const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
//   // define state, hook and other if needed
//   const organisationId = useParams("");
//   const { AdditionalListCall } = useEmpQuery(organisationId);
//   const { addtionalFields, addtionalLoading } = AdditionalListCall();
//   const { setStep3Data, data } = useEmpState();
//   const EmployeeSchema = z.object({}).catchall(z.any().optional());
  
//   // New states for asset management
//   const [isAssetManagementEnabled, setIsAssetManagementEnabled] = useState(false);
//   const [openAssetModal, setOpenAssetModal] = useState(false);
//   const [assetTypes, setAssetTypes] = useState([]);
//   const [selectedAssetType, setSelectedAssetType] = useState('');
//   const [assets, setAssets] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [assignedAssets, setAssignedAssets] = useState([]);
  
//   // Get auth token
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];

//   // Check if asset management is enabled
//   useEffect(() => {
//     const checkAssetManagement = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/settings/${organisationId.organisationId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         setIsAssetManagementEnabled(response.data.enableAssetManagement || true);
//         //abhi k liye true ke diya then false krna hai
//         // setIsAssetManagementEnabled(response.data.enableAssetManagement || false);
//       } catch (error) {
//         console.error("Error checking asset management status:", error);
//       }
//     };

//     checkAssetManagement();
//   }, [authToken, organisationId]);

//   // Fetch asset types when modal opens
//   useEffect(() => {
//     if (openAssetModal) {
//       const fetchAssetTypes = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/asset/types/${organisationId.organisationId}`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
//           setAssetTypes(response.data.assetTypes || []);
//         } catch (error) {
//           console.error("Error fetching asset types:", error);
//         }
//       };

//       fetchAssetTypes();
//     }
//   }, [openAssetModal, authToken, organisationId]);

//   // Fetch assets when asset type is selected
//   useEffect(() => {
//     if (selectedAssetType) {
//       const fetchAssets = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/assets/${organisationId.organisationId}?assetTypeId=${selectedAssetType}`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
//           setAssets(response.data.assets || []);
//         } catch (error) {
//           console.error("Error fetching assets:", error);
//         }
//       };

//       fetchAssets();
//     }
//   }, [selectedAssetType, authToken, organisationId]);

//   // Fetch serial number when asset is selected
//   useEffect(() => {
//     if (selectedAsset) {
//       const asset = assets.find(a => a._id === selectedAsset);
//       if (asset) {
//         setSerialNumber(asset.serialNumber || '');
//       }
//     }
//   }, [selectedAsset, assets]);

//   // define the useForm
//   const { control, formState, handleSubmit } = useForm({
//     defaultValues: {
//       ...data,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });

//   // Modal style
//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 500,
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2,
//   };

//   // Handle modal open/close
//   const handleOpenAssetModal = () => setOpenAssetModal(true);
//   const handleCloseAssetModal = () => setOpenAssetModal(false);

//   // Handle asset type selection
//   const handleAssetTypeChange = (event) => {
//     setSelectedAssetType(event.target.value);
//     setSelectedAsset('');
//     setSerialNumber('');
//   };

//   // Handle asset selection
//   const handleAssetChange = (event) => {
//     setSelectedAsset(event.target.value);
//   };

//   // Handle asset assignment
//   const handleAssignAsset = () => {
//     if (!selectedAsset || !assignedDate) {
//       handleAlert(true, "error", "Please select an asset and assignment date");
//       return;
//     }

//     const asset = assets.find(a => a._id === selectedAsset);
//     if (!asset) return;

//     const newAsset = {
//       assetId: selectedAsset,
//       assetName: asset.name,
//       assetType: assetTypes.find(t => t._id === selectedAssetType)?.name || '',
//       serialNumber,
//       assignedDate
//     };

//     setAssignedAssets([...assignedAssets, newAsset]);
    
//     // Reset form
//     setSelectedAssetType('');
//     setSelectedAsset('');
//     setSerialNumber('');
//     setAssignedDate(new Date().toISOString().split('T')[0]);
    
//     handleCloseAssetModal();
//   };

//   // Remove assigned asset
//   const handleRemoveAsset = (index) => {
//     const updatedAssets = [...assignedAssets];
//     updatedAssets.splice(index, 1);
//     setAssignedAssets(updatedAssets);
//   };

//   // to define the onSubmit function
//   const onSubmit = (testData) => {
//     console.log("Test 3", testData);
//     // Add assigned assets to the form data
//     const updatedData = {
//       ...testData,
//       assignedAssets: assignedAssets
//     };
//     setStep3Data(updatedData);
//     nextStep();
//   };

//   const { errors } = formState;
//   if (addtionalLoading) {
//     return (
//       <div className="flex h-[40vh] items-center justify-center">
//         <CircularProgress />
//       </div>
//     );
//   }
//   return (
//     <div className="w-full mt-4">
//       <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-1 flex-col"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
//             <>
//               {input.isActive && (
//                 <AuthInputFiled
//                   key={id}
//                   name={input.label}
//                   placeholder={input.label}
//                   label={input.placeholder}
//                   icon={ContactMail}
//                   control={control}
//                   type={input.inputType}
//                   errors={errors}
//                   error={errors.label}
//                   className="text-sm"
//                 />
//               )}
//             </>
//           ))} 
//         </div>

//         {/* Asset Management Section */}
//         {isAssetManagementEnabled && (
//           <div className="mt-6 border-t pt-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Asset Management</h2>
//               <BasicButton 
//                 title="Assign Asset" 
//                 type="button"
//                 onClick={handleOpenAssetModal}
//                 startIcon={<Inventory />}
//               />
//             </div>

//             {/* Display assigned assets */}
//             {assignedAssets.length > 0 ? (
//               <div className="border rounded-md p-4 mb-4">
//                 <h3 className="font-medium mb-2">Assigned Assets</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Type</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {assignedAssets.map((asset, index) => (
//                         <tr key={index}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetType}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetName}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serialNumber}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(asset.assignedDate).toLocaleDateString()}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveAsset(index)}
//                               className="text-red-600 hover:text-red-900"
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-gray-500 italic mb-4">No assets assigned yet</div>
//             )}
//           </div>
//         )}

//         <div className="flex items-end w-full justify-between mt-6">
//           <BasicButton 
//             title="Prev" 
//             type="button"
//             onClick={() => {
//               prevStep();
//             }} 
//           />
//           <BasicButton 
//             type="submit"
//             disabled={isLastStep} 
//             title="Next" 
//           />
//         </div>
//       </form>

//       {/* Asset Assignment Modal */}
//       <Modal
//         open={openAssetModal}
//         onClose={handleCloseAssetModal}
//         aria-labelledby="asset-assignment-modal"
//       >
//         <Box sx={modalStyle}>
//           <Typography id="asset-assignment-modal" variant="h6" component="h2" className="mb-4">
//             Assign Asset
//           </Typography>
          
//           <div className="space-y-4">
//             {/* Asset Type Selection */}
//             <FormControl fullWidth>
//               <InputLabel id="asset-type-label">Asset Type</InputLabel>
//               <Select
//                 labelId="asset-type-label"
//                 id="asset-type-select"
//                 value={selectedAssetType}
//                 label="Asset Type"
//                 onChange={handleAssetTypeChange}
//               >
//                 {assetTypes.map((type) => (
//                   <MenuItem key={type._id} value={type._id}>
//                     {type.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Asset Selection */}
//             <FormControl fullWidth disabled={!selectedAssetType}>
//               <InputLabel id="asset-label">Asset</InputLabel>
//               <Select
//                 labelId="asset-label"
//                 id="asset-select"
//                 value={selectedAsset}
//                 label="Asset"
//                 onChange={handleAssetChange}
//               >
//                 {assets.map((asset) => (
//                   <MenuItem key={asset._id} value={asset._id}>
//                     {asset.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Serial Number (Read-only) */}
//             <TextField
//               fullWidth
//               label="Serial Number"
//               value={serialNumber}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />

//             {/* Assignment Date */}
//             <TextField
//               fullWidth
//               label="Assignment Date"
//               type="date"
//               value={assignedDate}
//               onChange={(e) => setAssignedDate(e.target.value)}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />

//             <div className="flex justify-end space-x-2 pt-2">
//               <BasicButton 
//                 title="Cancel" 
//                 type="button" 
//                 onClick={handleCloseAssetModal} 
//               />
//               <BasicButton 
//                 title="Assign" 
//                 type="button" 
//                 onClick={handleAssignAsset} 
//               />
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default Test3;


import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail, Inventory } from "@mui/icons-material";
import { CircularProgress, Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { React, useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom"; 
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import BasicButton from "../../../components/BasicButton";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";

const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // define state, hook and other if needed
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data } = useEmpState();
  const EmployeeSchema = z.object({}).catchall(z.any().optional());
  
  // New states for asset management
  const [isAssetManagementEnabled, setIsAssetManagementEnabled] = useState(false);
  const [openAssetModal, setOpenAssetModal] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  
  // Get auth token
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];

  // Check if asset management is enabled
  useEffect(() => {
    const checkAssetManagement = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/settings/${organisationId.organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        // For development, set to true
        setIsAssetManagementEnabled(true);
        // In production, use this:
        // setIsAssetManagementEnabled(response.data.enableAssetManagement || false);
      } catch (error) {
        console.error("Error checking asset management status:", error);
      }
    };

    checkAssetManagement();
  }, [authToken, organisationId]);

  // Fetch all assets and extract unique asset types when modal opens
  useEffect(() => {
    if (openAssetModal) {
      const fetchAssets = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API}/route/assets`,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          
          const allAssets = response.data.assets || [];
          setAssets(allAssets);
          
          // Extract unique asset types from the assets
          const uniqueTypes = [...new Set(allAssets.map(asset => asset.type))];
          setAssetTypes(uniqueTypes.map(type => ({ name: type })));
        } catch (error) {
          console.error("Error fetching assets:", error);
          handleAlert(true, "error", "Failed to load assets");
        }
      };

      fetchAssets();
    }
  }, [openAssetModal, authToken, handleAlert]);

  // Filter assets when asset type is selected
  useEffect(() => {
    if (selectedAssetType && assets.length > 0) {
      const filtered = assets.filter(asset => asset.type === selectedAssetType);
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets([]);
    }
  }, [selectedAssetType, assets]);

  // Update serial number when asset is selected
  useEffect(() => {
    if (selectedAsset) {
      const asset = assets.find(a => a._id === selectedAsset);
      if (asset) {
        setSerialNumber(asset.serialNumber || '');
      }
    }
  }, [selectedAsset, assets]);

  // define the useForm
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Handle modal open/close
  const handleOpenAssetModal = () => setOpenAssetModal(true);
  const handleCloseAssetModal = () => setOpenAssetModal(false);

  // Handle asset type selection
  const handleAssetTypeChange = (event) => {
    setSelectedAssetType(event.target.value);
    setSelectedAsset('');
    setSerialNumber('');
  };

  // Handle asset selection
  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  // Handle asset assignment
  const handleAssignAsset = () => {
    if (!selectedAsset || !assignedDate) {
      handleAlert(true, "error", "Please select an asset and assignment date");
      return;
    }

    const asset = assets.find(a => a._id === selectedAsset);
    if (!asset) return;

    const newAsset = {
      assetId: selectedAsset,
      assetName: asset.name,
      assetType: asset.type,
      serialNumber: asset.serialNumber,
      assignedDate
    };

    setAssignedAssets([...assignedAssets, newAsset]);
    
    // Reset form
    setSelectedAssetType('');
    setSelectedAsset('');
    setSerialNumber('');
    setAssignedDate(new Date().toISOString().split('T')[0]);
    
    handleCloseAssetModal();
  };

  // Remove assigned asset
  const handleRemoveAsset = (index) => {
    const updatedAssets = [...assignedAssets];
    updatedAssets.splice(index, 1);
    setAssignedAssets(updatedAssets);
  };

  // to define the onSubmit function
  const onSubmit = (testData) => {
    console.log("Test 3", testData);


    const formattedAssets = assignedAssets.map(asset => ({
      assetId: asset.assetId,
      assetName: asset.assetName,
      assetType: asset.assetType,
      serialNumber: asset.serialNumber,
      assignedDate: asset.assignedDate
    }));
    
    // Add assigned assets to the form data
    const updatedData = {
      ...testData,
      assignedAssets: formattedAssets
    };
    setStep3Data(updatedData);
    nextStep();
  };

  const { errors } = formState;
  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-1 flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>
              {input.isActive && (
                <AuthInputFiled
                  key={id}
                  name={input.label}
                  placeholder={input.label}
                  label={input.placeholder}
                  icon={ContactMail}
                  control={control}
                  type={input.inputType}
                  errors={errors}
                  error={errors.label}
                  className="text-sm"
                />
              )}
            </>
          ))} 
        </div>

        {/* Asset Management Section */}
        {isAssetManagementEnabled && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Asset Management</h2>
              <BasicButton 
                title="Assign Asset" 
                type="button"
                onClick={handleOpenAssetModal}
                startIcon={<Inventory />}
              />
            </div>

            {/* Display assigned assets */}
            {assignedAssets.length > 0 ? (
              <div className="border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-2">Assigned Assets</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignedAssets.map((asset, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serialNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              type="button"
                              onClick={() => handleRemoveAsset(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic mb-4">No assets assigned yet</div>
            )}
          </div>
        )}

        <div className="flex items-end w-full justify-between mt-6">
          <BasicButton 
            title="Prev" 
            type="button"
            onClick={() => {
              prevStep();
            }} 
          />
          <BasicButton 
            type="submit"
            disabled={isLastStep} 
            title="Next" 
          />
        </div>
      </form>

      {/* Asset Assignment Modal */}
      <Modal
        open={openAssetModal}
        onClose={handleCloseAssetModal}
        aria-labelledby="asset-assignment-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="asset-assignment-modal" variant="h6" component="h2" className="mb-4">
            Assign Asset
          </Typography>
          
          <div className="space-y-4">
            {/* Asset Type Selection */}
            <FormControl fullWidth>
              <InputLabel id="asset-type-label">Asset Type</InputLabel>
              <Select
                labelId="asset-type-label"
                id="asset-type-select"
                value={selectedAssetType}
                label="Asset Type"
                onChange={handleAssetTypeChange}
              >
                {assetTypes.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Asset Selection */}
            <FormControl fullWidth disabled={!selectedAssetType}>
              <InputLabel id="asset-label">Asset</InputLabel>
              <Select
                labelId="asset-label"
                id="asset-select"
                value={selectedAsset}
                label="Asset"
                onChange={handleAssetChange}
              >
                {filteredAssets.map((asset) => (
                  <MenuItem key={asset._id} value={asset._id}>
                    {asset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Serial Number (Read-only) */}
            <TextField
              fullWidth
              label="Serial Number"
              value={serialNumber}
              InputProps={{
                readOnly: true,
              }}
            />

            {/* Assignment Date */}
            <TextField
              fullWidth
              label="Assignment Date"
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <BasicButton 
                title="Cancel" 
                type="button" 
                onClick={handleCloseAssetModal} 
              />
              <BasicButton 
                title="Assign" 
                type="button" 
                onClick={handleAssignAsset} 
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Test3;
