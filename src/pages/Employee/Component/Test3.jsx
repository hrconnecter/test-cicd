/* eslint-disable no-unused-vars */
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ContactMail } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import { React, useContext } from "react";
// import { useForm } from "react-hook-form"; 
// import { useQuery } from "react-query"; 
// import { useParams } from "react-router-dom";
// import { z } from "zod";
// import { UseContext } from "../../../State/UseState/UseContext";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";
// import BasicButton from "../../../components/BasicButton";

// const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
//   // to define the state, import funciton and hook  
//   const organisationId = useParams("");
//   const { employeeId } = useParams("");
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { AdditionalListCall } = useEmpQuery(organisationId);
//   const { addtionalFields, addtionalLoading } = AdditionalListCall();
//   const { setStep3Data, data } = useEmployeeState();

//   const EmployeeSchema = z.object({}).catchall(z.any().optional());

//   const { control, formState, handleSubmit, setValue } = useForm({
//     defaultValues: {
//       ...data,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });


//   // // for getting the data existing employee and set the value
//   const { isLoading } = useQuery(
//     ["employeeId", employeeId],
//     async () => {
//       if (employeeId !== null && employeeId !== undefined) {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );

//         return response.data;
//       }
//     },
//     {
//       onSuccess: (data) => {
//         if (data && data.employee && data.employee.additionalInfo) {
//           const { additionalInfo } = data.employee;
//           Object.keys(additionalInfo).forEach((key) => {
//             setValue(key, additionalInfo[key]);
//           });
//         }
//       },
//     }
//   );
//   const onSubmit = (testData) => {
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
//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         <>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="w-full flex  flex-1 flex-col"
//           >
//             <div className="grid grid-cols-2 w-full gap-3">
//               {addtionalFields?.inputField?.inputDetail?.filter(a => a.isActive)?.map((input, id) => (
//                 <div key={id}>
                  
//                     <AuthInputFiled
//                       name={input.label}
//                       placeholder={input.label}
//                       label={input.placeholder} 
//                       icon={ContactMail}
//                       control={control}
//                       type={input.inputType}
//                       errors={errors}
//                       error={errors.label}
//                     />

//                 </div>
//               ))}
//             </div>

//             <div className="flex items-end w-full justify-between">
//               <BasicButton type="button"
//                 onClick={() => {
//                   prevStep();
//                 }} title="Prev" />
//               <BasicButton type="submit" disabled={isLastStep} title="Next" />
//             </div>
//           </form>
//         </>
//       )}
//     </div>
//   );
// };

// export default Test3;


// import { zodResolver } from "@hookform/resolvers/zod";
// import { ContactMail, Inventory } from "@mui/icons-material";
// import { CircularProgress, Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
// import axios from "axios";
// import { React, useContext, useState, useEffect } from "react";
// import { useForm } from "react-hook-form"; 
// import { useQuery } from "react-query"; 
// import { useParams } from "react-router-dom";
// import { z } from "zod";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
// import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";
// import BasicButton from "../../../components/BasicButton";

// const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
//   // to define the state, import function and hook 
//   const organisationId = useParams("");
//   const { employeeId } = useParams("");
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const { AdditionalListCall } = useEmpQuery(organisationId);
//   const { addtionalFields, addtionalLoading } = AdditionalListCall();
//   const { setStep3Data, data } = useEmployeeState();

//   // New states for asset management
//   const [isAssetManagementEnabled, setIsAssetManagementEnabled] = useState(false);
//   const [openAssetModal, setOpenAssetModal] = useState(false);
//   const [assetTypes, setAssetTypes] = useState([]);
//   const [selectedAssetType, setSelectedAssetType] = useState('');
//   const [assets, setAssets] = useState([]);
//   const [filteredAssets, setFilteredAssets] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [assignedAssets, setAssignedAssets] = useState([]);

//   const EmployeeSchema = z.object({}).catchall(z.any().optional());

//   const { control, formState, handleSubmit, setValue } = useForm({
//     defaultValues: {
//       ...data,
//     },
//     resolver: zodResolver(EmployeeSchema),
//   });

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
//         // setIsAssetManagementEnabled(response.data.settings?.enableAssetManagement || false);
//         setIsAssetManagementEnabled(response.data.settings?.enableAssetManagement || true);
//       } catch (error) {
//         console.error("Error checking asset management status:", error);
//       }
//     };

//     checkAssetManagement();
//   }, [authToken, organisationId]);

//   // Fetch all assets and extract unique asset types when modal opens
//   useEffect(() => {
//     if (openAssetModal) {
//       const fetchAssets = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API}/route/assets`,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
          
//           const allAssets = response.data.assets || [];
//           setAssets(allAssets);
          
//           // Extract unique asset types from the assets
//           const uniqueTypes = [...new Set(allAssets.map(asset => asset.type))];
//           setAssetTypes(uniqueTypes.map(type => ({ name: type })));
//         } catch (error) {
//           console.error("Error fetching assets:", error);
//           handleAlert(true, "error", "Failed to load assets");
//         }
//       };

//       fetchAssets();
//     }
//   }, [openAssetModal, authToken, handleAlert]);

//   // Filter assets when asset type is selected
//   useEffect(() => {
//     if (selectedAssetType && assets.length > 0) {
//       const filtered = assets.filter(asset => 
//         asset.type === selectedAssetType && 
//         // Only show unassigned assets or assets assigned to this employee
//         (!asset.employeeId || asset.employeeId === employeeId)
//       );
//       setFilteredAssets(filtered);
//     } else {
//       setFilteredAssets([]);
//     }
//   }, [selectedAssetType, assets, employeeId]);

//   // Update serial number when asset is selected
//   useEffect(() => {
//     if (selectedAsset) {
//       const asset = assets.find(a => a._id === selectedAsset);
//       if (asset) {
//         setSerialNumber(asset.serialNumber || '');
//       }
//     }
//   }, [selectedAsset, assets]);

//   // // for getting the data existing employee and set the value
//   const { isLoading } = useQuery(
//     ["employeeId", employeeId],
//     async () => {
//       if (employeeId !== null && employeeId !== undefined) {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );

//         return response.data;
//       }
//     },
//     {
//       onSuccess: (data) => {
//         if (data && data.employee) {
//           // Set additional info fields
//           if (data.employee.additionalInfo) {
//             const { additionalInfo } = data.employee;
//             Object.keys(additionalInfo).forEach((key) => {
//               setValue(key, additionalInfo[key]);
//             });
//           }
          
//           // Set assigned assets
//           if (data.employee.assignedAssets && data.employee.assignedAssets.length > 0) {
//             // We need to fetch the full asset details for each assigned asset
//             const fetchAssetDetails = async () => {
//               try {
//                 // Get all assets
//                 const assetsResponse = await axios.get(
//                   `${process.env.REACT_APP_API}/route/assets`,
//                   {
//                     headers: {
//                       Authorization: authToken,
//                     },
//                   }
//                 );
                
//                 const allAssets = assetsResponse.data.assets || [];
                
//                 // Map the assigned assets with full details
//                 const detailedAssets = data.employee.assignedAssets.map(assignedAsset => {
//                   const assetDetails = allAssets.find(a => a._id === assignedAsset.assetId);
//                   if (assetDetails) {
//                     return {
//                       assetId: assignedAsset.assetId,
//                       assetName: assetDetails.name,
//                       assetType: assetDetails.type,
//                       serialNumber: assetDetails.serialNumber,
//                       assignedDate: assignedAsset.assignedDate
//                     };
//                   }
//                   return null;
//                 }).filter(Boolean);
                
//                 setAssignedAssets(detailedAssets);
//               } catch (error) {
//                 console.error("Error fetching asset details:", error);
//               }
//             };
            
//             fetchAssetDetails();
//           }
//         }
//       },
//     }
//   );

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

//     // Check if this asset is already assigned to this employee
//     const isAlreadyAssigned = assignedAssets.some(a => a.assetId === selectedAsset);
//     if (isAlreadyAssigned) {
//       handleAlert(true, "error", "This asset is already assigned to this employee");
//       return;
//     }

//     const newAsset = {
//       assetId: selectedAsset,
//       assetName: asset.name,
//       assetType: asset.type,
//       serialNumber: asset.serialNumber,
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

//   const onSubmit = (testData) => {
//     // Format assigned assets for API
//     const formattedAssets = assignedAssets.map(asset => ({
//       assetId: asset.assetId,
//       assignedDate: asset.assignedDate
//     }));

//     // Add assigned assets to the form data
//     const updatedData = {
//       ...testData,
//       assignedAssets: formattedAssets
//     };
    
//     setStep3Data(updatedData);
//     nextStep();
//   };

//   const { errors } = formState;

//   if (addtionalLoading || isLoading) {
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
//         <div className="grid grid-cols-2 w-full gap-3">
//           {addtionalFields?.inputField?.inputDetail?.filter(a => a.isActive)?.map((input, id) => (
//             <div key={id}>
//               <AuthInputFiled
//                 name={input.label}
//                 placeholder={input.label}
//                 label={input.placeholder} 
//                 icon={ContactMail}
//                 control={control}
//                 type={input.inputType}
//                 errors={errors}
//                 error={errors.label}
//               />
//             </div>
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
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(asset.assignedDate).toLocaleDateString()}
//                           </td>
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

// <div className="flex items-end w-full justify-between">
//           <BasicButton type="button"
//             onClick={() => {
//               prevStep();
//             }} title="Prev" />
//           <BasicButton type="submit" disabled={isLastStep} title="Next" />
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
//                 {assetTypes.map((type, index) => (
//                   <MenuItem key={index} value={type.name}>
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
//                 {filteredAssets.map((asset) => (
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
import { ContactMail, Inventory, Edit as EditIcon ,Warning } from "@mui/icons-material";
import { CircularProgress, Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField,Alert  } from "@mui/material";
import axios from "axios";
import { React, useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import { useQuery } from "react-query"; 
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";
import BasicButton from "../../../components/BasicButton";

const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  // to define the state, import function and hook 
  const organisationId = useParams("");
  const { employeeId } = useParams("");
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data } = useEmployeeState();

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssetIndex, setEditingAssetIndex] = useState(null);
  const [assetExpirationWarning, setAssetExpirationWarning] = useState("");

  const EmployeeSchema = z.object({}).catchall(z.any().optional());

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(EmployeeSchema),
  });

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
        // setIsAssetManagementEnabled(response.data.settings?.enableAssetManagement || false);
        setIsAssetManagementEnabled(response.data.settings?.enableAssetManagement || true);
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
      const filtered = assets.filter(asset => 
        asset.type === selectedAssetType && 
        // For edit mode, include the currently edited asset
        (isEditMode ? 
          (!asset.employeeId || asset.employeeId === employeeId || 
           (editingAssetIndex !== null && asset._id === assignedAssets[editingAssetIndex].assetId)) :
          // For add mode, only show unassigned assets or assets assigned to this employee
          (!asset.employeeId || asset.employeeId === employeeId)
        )
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets([]);
    }
  }, [selectedAssetType, assets, employeeId, isEditMode, editingAssetIndex, assignedAssets]);

  // Update serial number when asset is selected
  useEffect(() => {
    if (selectedAsset) {
      const asset = assets.find(a => a._id === selectedAsset);
      if (asset) {
        setSerialNumber(asset.serialNumber || '');
      }
    }
  }, [selectedAsset, assets]);

  // // for getting the data existing employee and set the value
  const { isLoading } = useQuery(
    ["employeeId", employeeId],
    async () => {
      if (employeeId !== null && employeeId !== undefined) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        if (data && data.employee) {
          // Set additional info fields
          if (data.employee.additionalInfo) {
            const { additionalInfo } = data.employee;
            Object.keys(additionalInfo).forEach((key) => {
              setValue(key, additionalInfo[key]);
            });
          }
          
          // Set assigned assets
          if (data.employee.assignedAssets && data.employee.assignedAssets.length > 0) {
            // We need to fetch the full asset details for each assigned asset
            const fetchAssetDetails = async () => {
              try {
                // Get all assets
                const assetsResponse = await axios.get(
                  `${process.env.REACT_APP_API}/route/assets`,
                  {
                    headers: {
                      Authorization: authToken,
                    },
                  }
                );
                
                const allAssets = assetsResponse.data.assets || [];
                
                // Map the assigned assets with full details
                const detailedAssets = data.employee.assignedAssets.map(assignedAsset => {
                  const assetDetails = allAssets.find(a => a._id === assignedAsset.assetId);
                  if (assetDetails) {
                    return {
                      assetId: assignedAsset.assetId,
                      assetName: assetDetails.name,
                      assetType: assetDetails.type,
                      serialNumber: assetDetails.serialNumber,
                      assignedDate: assignedAsset.assignedDate
                    };
                  }
                  return null;
                }).filter(Boolean);
                
                setAssignedAssets(detailedAssets);
              } catch (error) {
                console.error("Error fetching asset details:", error);
              }
            };
            
            fetchAssetDetails();
          }
        }
      },
    }
  );

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
  const handleOpenAssetModal = (isEdit = false, index = null) => {
    setIsEditMode(isEdit);
    setEditingAssetIndex(index);
    
    if (isEdit && index !== null) {
      // Pre-fill form with the asset being edited
      const asset = assignedAssets[index];
      setSelectedAssetType(asset.assetType);
      setSelectedAsset(asset.assetId);
      setSerialNumber(asset.serialNumber);
      setAssignedDate(new Date(asset.assignedDate).toISOString().split('T')[0]);
    } else {
      // Reset form for new asset
      setSelectedAssetType('');
      setSelectedAsset('');
      setSerialNumber('');
      setAssignedDate(new Date().toISOString().split('T')[0]);
    }
    
    setOpenAssetModal(true);
  };

  const handleCloseAssetModal = () => {
    setOpenAssetModal(false);
    setIsEditMode(false);
    setEditingAssetIndex(null);
  };

  // Handle asset type selection
  const handleAssetTypeChange = (event) => {
    setSelectedAssetType(event.target.value);
    setSelectedAsset('');
    setSerialNumber('');
  };

  // Handle asset selection
  // const handleAssetChange = (event) => {
  //   setSelectedAsset(event.target.value);
  // };

  //U1
  const handleAssetChange = (event) => {
    const assetId = event.target.value;
    setSelectedAsset(assetId);
    
    // Check if the selected asset is expired
    const asset = assets.find(a => a._id === assetId);
    if (asset) {
      // Check if the asset has an expiration date and if it's expired
      if (asset.expirationDate && new Date(asset.expirationDate) < new Date()) {
        setAssetExpirationWarning("This asset is expired, needs recertification.");
      } else {
        setAssetExpirationWarning("");
      }
    }
  };



  // Handle asset assignment
  const handleAssignAsset = () => {
    if (!selectedAsset || !assignedDate) {
      handleAlert(true, "error", "Please select an asset and assignment date");
      return;
    }
  

    const asset = assets.find(a => a._id === selectedAsset);
    if (!asset) return;
    // U1
    if (asset.status === "Expired") {
      handleAlert(true, "error", "This asset is expired, needs recertification.");
      return;
    }

       // Check if the asset is expired
      //  if (assetExpirationWarning) {
      //   handleAlert(true, "error", assetExpirationWarning);
      //   return;
      // }

    if (isEditMode && editingAssetIndex !== null) {
      // Update existing asset
      const updatedAssets = [...assignedAssets];
      updatedAssets[editingAssetIndex] = {
        assetId: selectedAsset,
        assetName: asset.name,
        assetType: asset.type,
        serialNumber: asset.serialNumber,
        assignedDate
      };
      setAssignedAssets(updatedAssets);
    } else {
      // Check if this asset is already assigned to this employee
      const isAlreadyAssigned = assignedAssets.some(a => a.assetId === selectedAsset);
      if (isAlreadyAssigned) {
        handleAlert(true, "error", "This asset is already assigned to this employee");
        return;
      }

      // Add new asset
      const newAsset = {
        assetId: selectedAsset,
        assetName: asset.name,
        assetType: asset.type,
        serialNumber: asset.serialNumber,
        assignedDate
      };
      setAssignedAssets([...assignedAssets, newAsset]);
    }
    
    handleCloseAssetModal();
  };

  // Remove assigned asset
  const handleRemoveAsset = (index) => {
    const updatedAssets = [...assignedAssets];
    updatedAssets.splice(index, 1);
    setAssignedAssets(updatedAssets);
  };

  const onSubmit = (testData) => {
    // Format assigned assets for API
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

  if (addtionalLoading || isLoading) {
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
        <div className="grid grid-cols-2 w-full gap-3">
          {addtionalFields?.inputField?.inputDetail?.filter(a => a.isActive)?.map((input, id) => (
            <div key={id}>
              <AuthInputFiled
                name={input.label}
                placeholder={input.label}
                label={input.placeholder} 
                icon={ContactMail}
                control={control}
                type={input.inputType}
                errors={errors}
                error={errors.label}
              />
            </div>
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
                onClick={() => handleOpenAssetModal(false)}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignedAssets.map((asset, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assetName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serialNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(asset.assignedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenAssetModal(true, index)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {/* <EditIcon fontSize="small" /> */} Edit
                            </button>
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

        <div className="flex items-end w-full justify-between">
          <BasicButton type="button"
            onClick={() => {
              prevStep();
            }} title="Prev" />
          <BasicButton type="submit" disabled={isLastStep} title="Next" />
        </div>
      </form>

      {/* Asset Assignment Modal */}
      <Modal
        open={openAssetModal}
        onClose={handleCloseAssetModal}
        aria-labelledby="asset-assignment-modal"
      >
        <Box sx={modalStyle}>
          {/* <Typography id="asset-assignment-modal" variant="h6" component="h2" className="mb-4">
            {isEditMode ? "Edit Asset Assignment" : "Assign Asset"}
          </Typography> */}
          <Typography
  id="asset-assignment-modal"
  variant="h6"
  component="h2"
  className="mb-4 mt-4 font-bold"
>
  {isEditMode ? "Edit Asset Assignment" : "Assign Asset"}
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
                    {/* {asset.name} */}
                    {asset.name} {asset.status === "Expired" && " (Expired)"}
                  </MenuItem>
                  
                ))}
              </Select>
            </FormControl>


              {/* Display warning for expired assets */}
          {assetExpirationWarning && (
            <Alert severity="warning" icon={<Warning />}>
              {assetExpirationWarning}
            </Alert>
          )}

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
                title={isEditMode ? "Update" : "Assign"} 
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