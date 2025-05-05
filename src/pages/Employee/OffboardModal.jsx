/* eslint-disable react-hooks/exhaustive-deps */

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import * as z from "zod";
import { format, differenceInDays } from "date-fns";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../components/Modal/component";
import useAuthToken from "../../hooks/Token/useAuth";
import { TestContext } from "../../State/Function/Main";
import moment from "moment";
import { Box, Chip, CircularProgress, Typography, Button } from "@mui/material";
import { Inventory2 as Inventory2Icon } from "@mui/icons-material";

const schema = z.object({
  lastWorkingDay: z.object({
    startDate: z
      .any()
      .refine(
        (value) => value !== null && value !== undefined && value !== "",
        {
          message: "Required",
        }
      )
      .optional(),
    endDate: z.any().optional(),
  }),
});

const OffboardModal = ({ open, onClose, employee }) => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const [employeeAssets, setEmployeeAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assetNotificationSent, setAssetNotificationSent] = useState(false);
  const [assetReturnCompleted, setAssetReturnCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      lastWorkingDay: {
        startDate: "",
        endDate: "",
      },
    },
  });

  const watchedStartDate = watch("lastWorkingDay").startDate;

  useEffect(() => {
    if (employee?.lastDate) {
      setValue("lastWorkingDay.startDate", employee.lastDate);
      setValue("lastWorkingDay.endDate", employee.lastDate);
    }
  }, [employee, setValue, open]);

  // Fetch employee assets when the modal opens and employee data is available
  // useEffect(() => {
  //   if (open && employee?._id) {
  //     fetchEmployeeAssets();
  //     checkAssetReturnStatus();
  //   }
  // }, [open, employee]);

  // const fetchEmployeeAssets = async () => {
  //   if (!employee?._id) return;
    
  //   setLoadingAssets(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/assets/employee/${employee._id}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );
      
  //     setEmployeeAssets(response.data.assets || []);
      
  //     // If no assets, consider asset return as completed
  //     if (!response.data.assets || response.data.assets.length === 0) {
  //       setAssetReturnCompleted(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee assets:", error);
  //     // Don't show an alert here as it's not critical to the offboarding process
  //   } finally {
  //     setLoadingAssets(false);
  //   }
  // };

  // Fetch employee assets when the modal opens and employee data is available
useEffect(() => {
  if (open && employee?._id) {
    fetchEmployeeAssets();
    // Keep the asset status check separate from the asset fetching
    if (employee?._id) {
      checkAssetReturnStatus();
    }
  }
}, [open, employee]);

// const fetchEmployeeAssets = async () => {
//   if (!employee?._id) return;
  
//   setLoadingAssets(true);
//   try {
//     // Keep this exact API call as it was working correctly
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/assets/employee/${employee._id}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
    
//     // Make sure we're setting the assets correctly from the response
//     const assets = response.data.assets || [];
//     setEmployeeAssets(assets);
    
//     // If no assets, consider asset return as completed
//     if (assets.length === 0) {
//       setAssetReturnCompleted(true);
//     }
    
//     console.log("Fetched employee assets:", assets); // Add logging for debugging
//   } catch (error) {
//     console.error("Error fetching employee assets:", error);
//     // Don't show an alert here as it's not critical to the offboarding process
//   } finally {
//     setLoadingAssets(false);
//   }
// };


  // Check if asset return notification has been sent and/or completed
  // const fetchEmployeeAssets = async () => {
  //   if (!employee?._id) return;
    
  //   setLoadingAssets(true);
  //   try {
  //     // Try to fetch assets using the expected endpoint
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/assets/employee/${employee._id}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );
      
  //     // If successful, use the assets from the response
  //     setEmployeeAssets(response.data.assets || []);
      
  //     // If no assets, consider asset return as completed
  //     if (!response.data.assets || response.data.assets.length === 0) {
  //       setAssetReturnCompleted(true);
  //     }
      
  //     console.log("Fetched employee assets:", response.data.assets);
  //   } catch (error) {
  //     console.error("Error fetching employee assets:", error);
      
  //     // If the endpoint doesn't exist (404), try an alternative approach
  //     if (error.response && error.response.status === 404) {
  //       try {
  //         // Try to fetch all assets and filter by employee ID
  //         const allAssetsResponse = await axios.get(
  //           `${process.env.REACT_APP_API}/route/assets`,
  //           {
  //             headers: {
  //               Authorization: authToken,
  //             },
  //           }
  //         );
          
  //         // Filter assets by employee ID
  //         const employeeAssets = allAssetsResponse.data.assets.filter(
  //           asset => asset.employeeId === employee._id
  //         );
          
  //         setEmployeeAssets(employeeAssets || []);
          
  //         // If no assets, consider asset return as completed
  //         if (employeeAssets.length === 0) {
  //           setAssetReturnCompleted(true);
  //         }
          
  //         console.log("Fetched and filtered employee assets:", employeeAssets);
  //       } catch (fallbackError) {
  //         console.error("Error fetching all assets:", fallbackError);
  //         setEmployeeAssets([]);
  //         setAssetReturnCompleted(true);
  //       }
  //     } else {
  //       // For other errors, set empty assets
  //       setEmployeeAssets([]);
  //       setAssetReturnCompleted(true);
  //     }
  //   } finally {
  //     setLoadingAssets(false);
  //   }
  // };
  const fetchEmployeeAssets = async () => {
    if (!employee?._id) return;
    
    setLoadingAssets(true);
    try {
      // Try to fetch all assets first
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assets`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      
      // Filter assets by employee ID
      const filteredAssets = response.data.assets.filter(
        asset => asset.employeeId && 
        (asset.employeeId._id === employee._id || asset.employeeId === employee._id)
      );
      
      setEmployeeAssets(filteredAssets || []);
      console.log("Fetched employee assets:", filteredAssets);
    } catch (error) {
      console.error("Error fetching employee assets:", error);
      setEmployeeAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };
  
  
 
 
  const checkAssetReturnStatus = async () => {
    if (!employee?._id) return;
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/status/${employee._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      
      if (response.data && response.data.status) {
        setAssetNotificationSent(response.data.status.notificationSent);
        setAssetReturnCompleted(response.data.status.completed);
      }
    } catch (error) {
      console.error("Error checking asset return status:", error);
      // If API doesn't exist yet or fails, don't block the flow
      // Just assume no notification has been sent
    }
  };

  const createAssetReturnNotification = async (employeeId, assets, lastWorkingDay) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/create`,
        {
          employeeId,
          assets: assets.map(asset => ({
            assetId: asset._id,
            name: asset.name,
            type: asset.type,
            serialNumber: asset.serialNumber
          })),
          returnDate: lastWorkingDay
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      
      handleAlert(true, "success", "Asset return notification created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating asset return notification:", error);
      handleAlert(true, "error", error.response?.data?.message || "Failed to create asset return notification");
      return null;
    }
  };
  

  // Function to send asset return notification
  const sendAssetReturnNotification = async () => {
    if (!employee || !employee._id || !watchedStartDate) {
      handleAlert(true, "error", "Employee information or last working day is missing");
      return;
    }

    if (employeeAssets.length === 0) {
      handleAlert(true, "info", "No assets assigned to this employee");
      setAssetReturnCompleted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notification/asset-return/create`,
        {
          employeeId: employee._id,
          lastDate: watchedStartDate,
          assets: employeeAssets.map(asset => ({
            assetId: asset._id,
            name: asset.name,
            type: asset.type,
            serialNumber: asset.serialNumber
          }))
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data && response.data.success) {
        handleAlert(true, "success", "Asset return notification sent successfully");
        setAssetNotificationSent(true);
        
        // If offboarding date is in the past, consider asset return as completed
        const isFutureDate = differenceInDays(new Date(watchedStartDate), new Date()) > 0;
        if (!isFutureDate) {
          setAssetReturnCompleted(true);
        }
        
        // Refresh notifications
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("assetReturnNotifications");
      }
    } catch (error) {
      console.error("Error sending asset return notification:", error);
      handleAlert(true, "error", "Failed to send asset return notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = () => {
    handleFinalSubmit();
  };

  const handleFinalSubmit = () => {
    // Check if asset return is completed or not required
    if (!assetReturnCompleted && employeeAssets.length > 0) {
      handleAlert(true, "error", "Please complete the asset return process before offboarding");
      return;
    }

    if (employeeAssets && employeeAssets.length > 0) {
      createAssetReturnNotification(employee._id, employeeAssets, watchedStartDate);
    }

    setIsSubmitting(true);
    // Check if offboarding date is in the future
    const isFutureDate = watchedStartDate && differenceInDays(new Date(watchedStartDate), new Date()) > 0;
    
    axios
      .post(
        `${process.env.REACT_APP_API}/route/setup/setEmployeeOffboarded/${employee._id}`,
        {
          isOffboarded: true,
          question: [],
          lastDate: watchedStartDate,
          pendingAssetReturn: isFutureDate && employeeAssets.length > 0 && !assetReturnCompleted
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then(async () => {
        await queryClient.invalidateQueries("employees");
        handleAlert(true, "success", "Employee offboarded successfully");
        onClose();
      })
      .catch((error) => {
        handleAlert(true, "error", "Server error please try later");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const formatDuration = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const years = end.diff(start, 'years');
    start.add(years, 'years');
    const months = end.diff(start, 'months');
    return `${years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''}${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`.trim();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expired":
        return "error";
      case "Expiring Soon":
        return "warning";
      default:
        return "default";
    }
  };

  // Check if offboarding date is in the future
  const isFutureDate = watchedStartDate && differenceInDays(new Date(watchedStartDate), new Date()) > 0;
  
  // Determine if we should show the asset notification button
  const showAssetNotificationButton = employeeAssets.length > 0 && 
    !assetNotificationSent && 
    watchedStartDate;

  // Determine if final submit button should be enabled
  const enableFinalSubmit = !employeeAssets.length || assetReturnCompleted;

  if (!employee) {
    return null;
  }

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      heading="Offboarding Questions"
    >
      {
        <>
          <form className="space-y-2" onSubmit={handleSubmit(handleFormSubmit)}>
            <InputField
              label="Employee Name"
              content={`${employee?.first_name || ''} ${employee?.last_name || ''}`}
            />

            <InputField
              label="Employee Location"
              content={employee?.worklocation && employee.worklocation.length > 0 ? employee.worklocation[0]?.shortName : ''}
            />

            <InputField
              label="Employee Designation"
              content={employee?.designation && employee.designation.length > 0 ? employee.designation[0]?.designationName : ''}
            />
            
            <InputField
              label="Joining Date"
              content={
                employee?.joining_date
                  ? format(new Date(employee?.joining_date), "yyyy-MM-dd")
                  : ""
              }
            />

            {/* Assets section */}
            <Box className="space-y-1">
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" className="flex items-center">
                <Inventory2Icon fontSize="small" style={{ marginRight: '8px' }} />
                Assets Associated
              </Typography>
              
              <Box className="border border-gray-200 rounded-md p-3 bg-gray-50">
                {loadingAssets ? (
                  <Box className="flex justify-center items-center py-4">
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Loading assets...
                    </Typography>
                  </Box>
                ) : employeeAssets.length > 0 ? (
                  <Box>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {employeeAssets.map((asset) => (
                        <Box 
                          key={asset._id} 
                          className="border border-gray-200 rounded-md p-2 bg-white flex justify-between items-center"
                        >
                          <Box>
                          <Typography variant="body2" fontWeight={500}>
                              {asset.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {asset.type} • SN: {asset.serialNumber}
                            </Typography>
                          </Box>
                          <Chip
                            label={asset.status}
                            color={getStatusColor(asset.status)}
                            size="small"
                            sx={{ fontWeight: 500, borderRadius: '4px' }}
                          />
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Asset Return Status */}
                    <Box mt={2} p={2} bgcolor={assetReturnCompleted ? "#e8f5e9" : "#fff3e0"} borderRadius="4px">
                      {/* <Typography variant="body2" color={assetReturnCompleted ? "success.main" : "warning.main"} fontWeight={500}>
                        {assetReturnCompleted 
                          ? "✓ Asset return process completed" 
                          : assetNotificationSent
                            ? "⏳ Asset return in progress - waiting for confirmation"
                            : "⚠️ Asset return process required before offboarding"}
                      </Typography> */}
                      <Typography variant="body2" color={assetNotificationSent ? "warning.main" : "warning.main"} fontWeight={500}>
  {assetNotificationSent
    ? "⏳ Asset return in progress - waiting for confirmation"
    : "⚠️ Asset return process required before offboarding"}
</Typography>

                    </Box>
                    
                    {/* Asset Notification Button */}
                    {showAssetNotificationButton && (
                      <Box mt={2} display="flex" justifyContent="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={sendAssetReturnNotification}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <CircularProgress size={24} /> : "Send Asset Return Notification"}
                        </Button>
                      </Box>
                    )}
                    
                    
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      {assetReturnCompleted 
                        ? "Assets have been processed for return."
                        : isFutureDate
                          ? "These assets will need to be returned before the employee's last working day."
                          : "These assets will be automatically marked as available after offboarding."}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" className="py-2">
                    No assets assigned to this employee.
                  </Typography>
                )}
              </Box>
            </Box>

            <AuthInputFiled
              name="lastWorkingDay"
              type={"calender"}
              label="Last Working Day"
              control={control}
              min={new Date(employee?.joining_date)}
              popoverDirection="top"
              errors={errors}
              error={errors.lastWorkingDay}
            />

            {watchedStartDate && (
              <InputField
                label="Duration"
                content={formatDuration(employee?.joining_date, watchedStartDate)}
              />
            )}
          
            <div className="flex justify-end mt-4 space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  !enableFinalSubmit ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting || !enableFinalSubmit}
              >
                {isSubmitting ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </>
      }
    </ReusableModal>
  );
};

const InputField = ({ label, content }) => {
  return (
    <div className={`space-y-1 min-w-11 `}>
      <label htmlFor={label} className={` font-semibold text-gray-500 text-md`}>
        {label}
      </label>
      <div
        className={`outline-none border-gray-200 border-[.5px]
              flex  rounded-md items-center px-2    py-1 md:py-[6px] 
               !bg-gray-200
              `}
      >
        <input
          type={"text"}
          disabled={true}
          className={` border-none  w-full outline-none px-2   !bg-gray-200
          `}
          value={content}
        />
      </div>
    </div>
  );
};

export default OffboardModal;


//final
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import "react-datepicker/dist/react-datepicker.css";
// import { useForm } from "react-hook-form";
// import { useQueryClient } from "react-query";
// import * as z from "zod";
// import { format, differenceInDays } from "date-fns";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
// import ReusableModal from "../../components/Modal/component";
// import useAuthToken from "../../hooks/Token/useAuth";
// import { TestContext } from "../../State/Function/Main";
// import moment from "moment";
// import { Box, Chip, CircularProgress, Typography, Button } from "@mui/material";
// import { Inventory2 as Inventory2Icon } from "@mui/icons-material";

// const schema = z.object({
//   lastWorkingDay: z.object({
//     startDate: z
//       .any()
//       .refine(
//         (value) => value !== null && value !== undefined && value !== "",
//         {
//           message: "Required",
//         }
//       )
//       .optional(),
//     endDate: z.any().optional(),
//   }),
// });

// const OffboardModal = ({ open, onClose, employee }) => {
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();
//   const { handleAlert } = useContext(TestContext);
//   const [employeeAssets, setEmployeeAssets] = useState([]);
//   const [loadingAssets, setLoadingAssets] = useState(false);
//   const [assetNotificationSent, setAssetNotificationSent] = useState(false);
//   const [assetReturnCompleted, setAssetReturnCompleted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       lastWorkingDay: {
//         startDate: "",
//         endDate: "",
//       },
//     },
//   });

//   const watchedStartDate = watch("lastWorkingDay").startDate;

//   // Set initial values when employee data is available
//   useEffect(() => {
//     if (employee?.lastDate) {
//       setValue("lastWorkingDay.startDate", employee.lastDate);
//       setValue("lastWorkingDay.endDate", employee.lastDate);
//     }
//   }, [employee, setValue, open]);

//   // Fetch employee assets and check asset return status when modal opens
//   useEffect(() => {
//     if (open && employee?._id) {
//       fetchEmployeeAssets();
//       checkAssetReturnStatus();
//     }
//   }, [open, employee]);

//   // Fetch employee assets
//   const fetchEmployeeAssets = async () => {
//     if (!employee?._id) return;
    
//     setLoadingAssets(true);
//     try {
//       // Fetch all assets and filter by employee ID
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assets`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
      
//       // Filter assets by employee ID
//       const filteredAssets = response.data.assets.filter(
//         asset => asset.employeeId &&
//         (asset.employeeId._id === employee._id || asset.employeeId === employee._id)
//       );
      
//       setEmployeeAssets(filteredAssets || []);
//       console.log("Fetched employee assets:", filteredAssets);
      
//       // If no assets, consider asset return as completed
//       if (filteredAssets.length === 0) {
//         setAssetReturnCompleted(true);
//       }
//     } catch (error) {
//       console.error("Error fetching employee assets:", error);
//       setEmployeeAssets([]);
//       setAssetReturnCompleted(true);
//     } finally {
//       setLoadingAssets(false);
//     }
//   };

//   // Check if asset return notification has been sent and/or completed
//   const checkAssetReturnStatus = async () => {
//     if (!employee?._id) return;
    
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/status/${employee._id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
      
//       if (response.data && response.data.status) {
//         setAssetNotificationSent(response.data.status.notificationSent);
//         setAssetReturnCompleted(response.data.status.completed);
//       }
//     } catch (error) {
//       console.error("Error checking asset return status:", error);
//       // If API doesn't exist yet or fails, don't block the flow
//     }
//   };

//   // Send asset return notification
//   const sendAssetReturnNotification = async () => {
//     if (!employee || !employee._id || !watchedStartDate) {
//       handleAlert(true, "error", "Employee information or last working day is missing");
//       return;
//     }

//     if (employeeAssets.length === 0) {
//       handleAlert(true, "info", "No assets assigned to this employee");
//       setAssetReturnCompleted(true);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/notification/asset-return/create`,
//         {
//           employeeId: employee._id,
//           returnDate: watchedStartDate,
//           assets: employeeAssets.map(asset => ({
//             assetId: asset._id,
//             name: asset.name,
//             type: asset.type,
//             serialNumber: asset.serialNumber
//           }))
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );

//       if (response.data && response.data.success) {
//         handleAlert(true, "success", "Asset return notification sent successfully");
//         setAssetNotificationSent(true);
        
//         // If offboarding date is in the past, consider asset return as completed
//         const isFutureDate = differenceInDays(new Date(watchedStartDate), new Date()) > 0;
//         if (!isFutureDate) {
//           setAssetReturnCompleted(true);
//         }
        
//         // Refresh notifications
//         queryClient.invalidateQueries("notifications");
//         queryClient.invalidateQueries("assetReturnNotifications");
//       }
//     } catch (error) {
//       console.error("Error sending asset return notification:", error);
//       handleAlert(true, "error", error.response?.data?.message || "Failed to send asset return notification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle form submission
//   const handleFormSubmit = () => {
//     // Check if asset return is completed or not required
//     if (!assetReturnCompleted && employeeAssets.length > 0) {
//       handleAlert(true, "error", "Please complete the asset return process before offboarding");
//       return;
//     }

//     setIsSubmitting(true);
    
//     // Check if offboarding date is in the future
//     const isFutureDate = watchedStartDate && differenceInDays(new Date(watchedStartDate), new Date()) > 0;
    
//     axios
//       .post(
//         `${process.env.REACT_APP_API}/route/setup/setEmployeeOffboarded/${employee._id}`,
//         {
//           isOffboarded: true,
//           question: [],
//           lastDate: watchedStartDate,
//           pendingAssetReturn: isFutureDate && employeeAssets.length > 0 && !assetReturnCompleted
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       )
//       .then(async () => {
//         await queryClient.invalidateQueries("employees");
//         handleAlert(true, "success", "Employee offboarded successfully");
//         onClose();
//       })
//       .catch((error) => {
//         console.error("Error offboarding employee:", error);
//         handleAlert(true, "error", "Server error please try later");
//       })
//       .finally(() => {
//         setIsSubmitting(false);
//       });
//   };

//   const formatDuration = (startDate, endDate) => {
//     const start = moment(startDate);
//     const end = moment(endDate);
//     const years = end.diff(start, 'years');
//     start.add(years, 'years');
//     const months = end.diff(start, 'months');
//     return `${years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''}${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`.trim();
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "success";
//       case "Expired":
//         return "error";
//       case "Expiring Soon":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   // Check if offboarding date is in the future
//   const isFutureDate = watchedStartDate && differenceInDays(new Date(watchedStartDate), new Date()) > 0;
  
//   // Determine if we should show the asset notification button
//   const showAssetNotificationButton = employeeAssets.length > 0 &&
//     !assetNotificationSent &&
//     watchedStartDate;

//   // Determine if final submit button should be enabled
//   const enableFinalSubmit = !employeeAssets.length || assetReturnCompleted;

//   if (!employee) {
//     return null;
//   }

//   return (
//     <ReusableModal
//       open={open}
//       onClose={onClose}
//       heading="Offboarding Questions"
//     >
//       <form className="space-y-2" onSubmit={handleSubmit(handleFormSubmit)}>
//         <InputField
//           label="Employee Name"
//           content={`${employee?.first_name || ''} ${employee?.last_name || ''}`}
//         />

//         <InputField
//           label="Employee Location"
//           content={employee?.worklocation && employee.worklocation.length > 0 ? employee.worklocation[0]?.shortName : ''}
//         />

//         <InputField
//           label="Employee Designation"
//           content={employee?.designation && employee.designation.length > 0 ? employee.designation[0]?.designationName : ''}
//         />
        
//         <InputField
//           label="Joining Date"
//           content={
//             employee?.joining_date
//               ? format(new Date(employee?.joining_date), "yyyy-MM-dd")
//               : ""
//           }
//         />

//         {/* Assets section */}
//         <Box className="space-y-1">
//           <Typography variant="subtitle1" fontWeight={600} color="text.secondary" className="flex items-center">
//             <Inventory2Icon fontSize="small" style={{ marginRight: '8px' }} />
//             Assets Associated
//           </Typography>
          
//           <Box className="border border-gray-200 rounded-md p-3 bg-gray-50">
//             {loadingAssets ? (
//               <Box className="flex justify-center items-center py-4">
//                 <CircularProgress size={24} />
//                 <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//                   Loading assets...
//                 </Typography>
//               </Box>
//             ) : employeeAssets.length > 0 ? (
//               <Box>
//                 <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {employeeAssets.map((asset) => (
//                     <Box
//                       key={asset._id}
//                       className="border border-gray-200 rounded-md p-2 bg-white flex justify-between items-center"
//                     >
//                       <Box>
//                         <Typography variant="body2" fontWeight={500}>
//                           {asset.name}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {asset.type} • SN: {asset.serialNumber}
//                         </Typography>
//                       </Box>
//                       <Chip
//                         label={asset.status}
//                         color={getStatusColor(asset.status)}
//                         size="small"
//                         sx={{ fontWeight: 500, borderRadius: '4px' }}
//                       />
//                     </Box>
//                   ))}
//                 </Box>
                
//                 {/* Asset Return Status */}
//                 <Box mt={2} p={2} bgcolor={assetReturnCompleted ? "#e8f5e9" : "#fff3e0"} borderRadius="4px">
//                   <Typography variant="body2" color={assetReturnCompleted ? "success.main" : "warning.main"} fontWeight={500}>
//                     {assetReturnCompleted
//                       ? "✓ Asset return process completed"
//                       : assetNotificationSent
//                         ? "⏳ Asset return in progress - waiting for confirmation"
//                         : "⚠️ Asset return process required before offboarding"}
//                   </Typography>
//                 </Box>
                
//                 {/* Asset Notification Button */}
//                 {showAssetNotificationButton && (
//                   <Box mt={2} display="flex" justifyContent="center">
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       onClick={sendAssetReturnNotification}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? <CircularProgress size={24} /> : "Send Asset Return Notification"}
//                     </Button>
//                   </Box>
//                 )}
                
//                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
//                   {assetReturnCompleted
//                     ? "Assets have been processed for return."
//                     : isFutureDate
//                       ? "These assets will need to be returned before the employee's last working day."
//                       : "These assets will be automatically marked as available after offboarding."}
//                 </Typography>
//               </Box>
//             ) : (
//               <Typography variant="body2" color="text.secondary" className="py-2">
//                 No assets assigned to this employee.
//               </Typography>
//             )}
//           </Box>
//         </Box>

//         <AuthInputFiled
//           name="lastWorkingDay"
//           type={"calender"}
//           label="Last Working Day"
//           control={control}
//           min={new Date(employee?.joining_date)}
//           popoverDirection="top"
//           errors={errors}
//           error={errors.lastWorkingDay}
//         />

//         {watchedStartDate && (
//           <InputField
//             label="Duration"
//             content={formatDuration(employee?.joining_date, watchedStartDate)}
//           />
//         )}
      
//       <div className="flex justify-end mt-4 space-x-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className={`px-4 py-2 bg-blue-500 text-white rounded ${
//               !enableFinalSubmit ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isSubmitting || !enableFinalSubmit}
//           >
//             {isSubmitting ? "Processing..." : "Submit"}
//           </button>
//         </div>
//       </form>
//     </ReusableModal>
//   );
// };

// const InputField = ({ label, content }) => {
//   return (
//     <div className={`space-y-1 min-w-11 `}>
//       <label htmlFor={label} className={` font-semibold text-gray-500 text-md`}>
//         {label}
//       </label>
//       <div
//         className={`outline-none border-gray-200 border-[.5px]
//               flex  rounded-md items-center px-2    py-1 md:py-[6px] 
//                !bg-gray-200
//               `}
//       >
//         <input
//           type={"text"}
//           disabled={true}
//           className={` border-none  w-full outline-none px-2   !bg-gray-200
//           `}
//           value={content}
//         />
//       </div>
//     </div>
//   );
// };

// export default OffboardModal;


// i wanna modify > Assets Associated >after sendinf asset return notification to employee >if assets are acknowledege by emplployee and return by sa/hr then show the button "Asset Return Completed" and if not show "Asset Return Required" like functionallity in the above code
