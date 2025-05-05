/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import DocPreviewModal from "./Modal";

// Constants
const options = [
  "Aadhar Card",
  "Pan Card",
  "SSC Certificate",
  "HSC Certificate",
  "Passport",
  "Voter Id Card",
  "Custom",
];
const MAX_TOTAL_FILE_SIZE = 5120 * 1024; // 5 MB

const UploadDocumentForEmployeeModal = ({ handleClose, open, employeeId, organizationId }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const token = cookies["aegis"];
  const queryClient = useQueryClient();

  // State hooks
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [documentFields, setDocumentFields] = useState([
    {
      selectedValue: "",
      uploadedFile: null,
      fileName: "No file selected",
      customDocumentName: "",
      loading: false,
      isCustom: false,
    },
  ]);

  // Function to reset state and clear files
  const handleClearAndClose = () => {
    setDocumentFields([
      {
        selectedValue: "",
        uploadedFile: null,
        fileName: "No file selected",
        customDocumentName: "",
        loading: false,
        isCustom: false,
      },
    ]);
    setTotalFileSize(0);
    setUploadedFiles([]);
    handleClose();
  };

  // File size check
  useEffect(() => {
    let totalSize = 0;
    documentFields.forEach((field) => {
      if (field.uploadedFile) {
        totalSize += field.uploadedFile.size;
      }
    });
    setTotalFileSize(totalSize);
  }, [documentFields]);

  // Handle document select change
  const handleSelect = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].selectedValue = value;

    if (value === "Custom") {
      updatedDocumentFields[index].isCustom = true;
    } else {
      updatedDocumentFields[index].isCustom = false;
    }
    setDocumentFields(updatedDocumentFields);
  };

  // Handle custom document name change
  const handleCustomNameChange = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].customDocumentName = value;
    setDocumentFields(updatedDocumentFields);
  };

  // Handle file upload
  const handleFileUpload = (index, event) => {
    const allowedFileTypes = ["application/pdf"];
    const files = event.target.files;
    const file = files[0];
    
    if (!file) return;
    
    if (!allowedFileTypes.includes(file.type)) {
      handleAlert(true, "error", "Only PDFs are allowed for upload.");
      event.target.value = null;
      return;
    }

    const tempDocumentFields = [...documentFields];
    tempDocumentFields[index].uploadedFile = file;
    const tempTotalFileSize = tempDocumentFields.reduce(
      (totalSize, field) =>
        totalSize + (field.uploadedFile ? field.uploadedFile.size : 0),
      0
    );

    if (tempTotalFileSize > MAX_TOTAL_FILE_SIZE) {
      handleAlert(true, "error", `File "${file.name}" exceeds the size limit of 5 MB`);
      event.target.value = null;
      tempDocumentFields[index].uploadedFile = null;
      tempDocumentFields[index].fileName = "No file selected";
      setDocumentFields(tempDocumentFields);
      return;
    }

    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].uploadedFile = file;
    updatedDocumentFields[index].fileName = file ? file.name : "No file selected";
    setDocumentFields(updatedDocumentFields);
  };

  // Add more document fields
  const handleAddMore = () => {
    setDocumentFields((prevState) => [
      ...prevState,
      {
        selectedValue: "",
        uploadedFile: null,
        fileName: "No file selected",
        customDocumentName: "",
        loading: false,
        isCustom: false,
      },
    ]);
  };

  // Discard document field
  const handleDiscardRow = (index) => {
    setDocumentFields((prevState) => prevState.filter((_, i) => i !== index));
  };

  // Remaining file size
  const remainingFileSizeKB = (MAX_TOTAL_FILE_SIZE - totalFileSize) / 1024;

  // Open document preview modal
  const openModal = (index) => {
    setPreviewIndex(index);
    setUploadedFiles((prevFiles) => [
      ...prevFiles.slice(0, index),
      documentFields[index].uploadedFile,
      ...prevFiles.slice(index + 1),
    ]);
    setShowModal(true);
  };

  // Upload document to S3
  const uploadVendorDocument = async (file, selectedValue, isCustom, customDocumentName) => {
    const { data: { url } } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/EmployeeDocument`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    // Upload file to S3
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return {
      name: file.name,
      url: url.split("?")[0], // Clean URL
      selectedValue: isCustom ? customDocumentName : selectedValue,
      isCustom: isCustom || false,
      customDocumentName: customDocumentName || "",
    };
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate employeeId and organizationId
      if (!employeeId || !organizationId) {
        handleAlert(true, "error", "Employee information is missing. Please select an employee first.");
        setIsSubmitting(false);
        return;
      }
      
      // Check if total file size exceeds limit
      if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
        handleAlert(true, "error", "Total file size exceeds the limit of 5 MB");
        setIsSubmitting(false);
        return;
      }

      // Validate document fields
      const formData = { documents: [] };
      for (let i = 0; i < documentFields.length; i++) {
        const { selectedValue, uploadedFile, isCustom, customDocumentName } = documentFields[i];

        if ((!selectedValue && !isCustom) || (isCustom && !customDocumentName) || !uploadedFile) {
          handleAlert(true, "error", "Please select a document type, provide a custom name if needed, and upload a file for all fields.");
          setIsSubmitting(false);
          return;
        }

        formData.documents.push({
          selectedValue,
          uploadedFile,
          isCustom,
          customDocumentName,
        });
      }

      // Upload documents to S3 and collect URLs
      const documentUrls = await Promise.allSettled(
        formData.documents.map((fileData) =>
          uploadVendorDocument(
            fileData.uploadedFile, 
            fileData.selectedValue, 
            fileData.isCustom, 
            fileData.customDocumentName
          )
        )
      );
      
      const successfulUploads = documentUrls
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // Prepare data for the new endpoint
      const updatedData = {
        documents: successfulUploads,
        employeeId: employeeId,
        organizationId: organizationId
      };

      console.log("Uploading documents for employee:", employeeId);
      console.log("Organization ID:", organizationId);
      console.log("Document data:", updatedData);

      // Use the new endpoint specifically for uploading documents for other employees
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/emp/add-document-for-employee`,
        updatedData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Invalidate both queries to ensure data is refreshed
        queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organizationId]);
        queryClient.invalidateQueries(["getRecordOfEmployee"]);
        
        handleAlert(true, "success", "Documents uploaded successfully for the employee.");
        
        // Clear form after successful upload
        setDocumentFields([{
          selectedValue: "",
          uploadedFile: null,
          fileName: "No file selected",
          customDocumentName: "",
          loading: false,
          isCustom: false,
        }]);
        handleClose();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      handleAlert(
        true, 
        "error", 
        error.response?.data?.message || "An error occurred while uploading files."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidDocuments = () => {
    return documentFields.some(field => 
      field.uploadedFile && 
      (field.selectedValue || (field.isCustom && field.customDocumentName))
    );
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "95vh!important",
          overflowY: "auto"
        },
      }}
      open={open}
      onClose={handleClearAndClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
        <div>
          <div>
            <div className="md:w-[800px] w-[350px] m-auto mt-6 md:pl-6 pl-3 md:pr-6 pr-3 pt-3 pb-3 rounded-lg">
              <div
                style={{ borderBottom: "2px solid #b8b8b8" }}
                className="text-center mb-5 pb-3 w-full"
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClearAndClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "red",
                  }}
                > 
                  <CloseIcon />
                </IconButton>
                <h1 className="text-center md:text-3xl text-2xl">
                  Upload Document for Employee
                </h1>
                <p className="text-gray-500 tracking-tight">Upload documents for this employee</p>
                <p className="text-gray-500 tracking-tight">Select document type and click the "Upload" button to upload the file, then Submit.</p>
              </div>

              {documentFields &&
                documentFields?.map((field, index) => (
                  <div
                    key={index}
                    style={{
                      boxShadow:
                        "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
                    }}
                    className="w-full h-auto md:h-[8vh] md:flex md:items-center md:justify-between pl-3 pt-3 md:pt-0 pr-3 mb-4 rounded-lg"
                  >
                    {field.isCustom ? (
                      <TextField
                        label="Custom Document Name"
                        size="small"
                        sx={{ width: "23%" }}
                        variant="outlined"
                        value={field.customDocumentName}
                        onChange={(e) =>
                          handleCustomNameChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <FormControl className="md:w-[170px] w-full" size="small">
                        <InputLabel id={`select-doc-label-${index}`}>
                          Select Document
                        </InputLabel>
                        <Select
                          labelId={`select-doc-label-${index}`}
                          label="Select Document"
                          value={field.selectedValue}
                          size="small"
                          onChange={(e) => handleSelect(index, e.target.value)}
                        >
                          {options.map(
                            (option, optionIndex) =>
                              // Prevent selecting the same document again
                              !documentFields
                                .slice(0, index)
                                .map((field) => field.selectedValue)
                                .includes(option) && (
                                <MenuItem key={optionIndex} value={option}>
                                  {option}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      </FormControl>
                    )}
                    <div
                      className="md:justify-normal justify-between md:mt-0 mt-3 pb-3 md:pb-0"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <>
                        <input
                          id={`file-upload-${index}`}
                          type="file"
                          style={{ display: "none" }}
                          disabled={!field.selectedValue && !field.isCustom}
                          onChange={(e) => handleFileUpload(index, e)}
                        />
                        <div className="w-8 h-8 flex justify-center items-center rounded-full mr-2">
                          {field.loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            field.uploadedFile && (
                              <CheckIcon
                                style={{
                                  color: "#FFF",
                                  borderRadius: "50%",
                                }}
                              />
                            )
                          )}
                        </div>

                        <label htmlFor={`file-upload-${index}`}>
                          <div className="md:w-28">
                            <Button
                              size="small"
                              variant="contained"
                              component="span"
                              disabled={!field.selectedValue && !field.isCustom}
                            >
                              Upload
                            </Button>
                          </div>
                        </label>
                        <span className="md:w-28 mr-3 ml-3 text-xs">
                          {field.fileName}
                        </span>
                        <Button
                          size="small"
                          color="info"
                          disabled={!field.uploadedFile}
                          variant="contained"
                          onClick={() => openModal(index)}
                        >
                          View Doc
                        </Button>
                      </>
                      {documentFields.length > 1 && (
                        <div
                          className="h-6 w-6 flex justify-center items-center rounded-full ml-2 cursor-pointer"
                          onClick={() => handleDiscardRow(index)}
                        >
                          <IconButton color="error" aria-label="delete">
                            <DeleteOutlineIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div className="w-full flex justify-center mt-6 gap-4 mb-2">
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleAddMore}
                >
                  Add More
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasValidDocuments()}
                >
                  {isSubmitting ? ( 
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Uploading...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>

              <div className="flex justify-center gap-2">
                <span className="text-xs">Maximum Size Allowed:</span>
                <span className="text-xs text-red-600">
                  {remainingFileSizeKB >= 0
                    ? ` ${remainingFileSizeKB.toFixed(2)} KB`
                    : "Size limit exceeded"}
                </span>
              </div>
            </div>

            <DocPreviewModal
              fileData={uploadedFiles[previewIndex]}
              openState={showModal}
              setOpenState={setShowModal}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentForEmployeeModal;




// import React, { useContext, useState, useEffect } from "react";
// import {
//   Button,
//   CircularProgress,
//   FormControl,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import { useQueryClient } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import DocPreviewModal from "./Modal";

// // Constants
// const options = [
//   "Aadhar Card",
//   "Pan Card",
//   "SSC Certificate",
//   "HSC Certificate",
//   "Passport",
//   "Voter Id Card",
//   "Custom",
// ];
// const MAX_TOTAL_FILE_SIZE = 5120 * 1024; // 5 MB

// const UploadDocumentForEmployeeModal = ({ handleClose, open, employeeId, organizationId }) => {
//   const { cookies, setAppAlert } = useContext(UseContext);
//   const token = cookies["aegis"];
//   const queryClient = useQueryClient();

//   // State hooks
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [previewIndex, setPreviewIndex] = useState(null);
//   const [totalFileSize, setTotalFileSize] = useState(0);
//   const [documentFields, setDocumentFields] = useState([
//     {
//       selectedValue: "",
//       uploadedFile: null,
//       fileName: "No file selected",
//       customDocumentName: "",
//       loading: false,
//       isCustom: false,
//     },
//   ]);

//   // Function to reset state and clear files
//   const handleClearAndClose = () => {
//     setDocumentFields([
//       {
//         selectedValue: "",
//         uploadedFile: null,
//         fileName: "No file selected",
//         customDocumentName: "",
//         loading: false,
//         isCustom: false,
//       },
//     ]);
//     setTotalFileSize(0);
//     setUploadedFiles([]);
//     handleClose();
//   };

//   // File size check
//   useEffect(() => {
//     let totalSize = 0;
//     documentFields.forEach((field) => {
//       if (field.uploadedFile) {
//         totalSize += field.uploadedFile.size;
//       }
//     });
//     setTotalFileSize(totalSize);
//   }, [documentFields]);

//   // Handle document select change
//   const handleSelect = (index, value) => {
//     const updatedDocumentFields = [...documentFields];
//     updatedDocumentFields[index].selectedValue = value;

//     if (value === "Custom") {
//       updatedDocumentFields[index].isCustom = true;
//     } else {
//       updatedDocumentFields[index].isCustom = false;
//     }
//     setDocumentFields(updatedDocumentFields);
//   };

//   // Handle custom document name change
//   const handleCustomNameChange = (index, value) => {
//     const updatedDocumentFields = [...documentFields];
//     updatedDocumentFields[index].customDocumentName = value;
//     setDocumentFields(updatedDocumentFields);
//   };

//   // Handle file upload
//   const handleFileUpload = (index, event) => {
//     const allowedFileTypes = ["application/pdf"];
//     const files = event.target.files;
//     const file = files[0];
    
//     if (!file) return;
    
//     if (!allowedFileTypes.includes(file.type)) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Only PDFs are allowed for upload.",
//       });
//       event.target.value = null;
//       return;
//     }

//     const tempDocumentFields = [...documentFields];
//     tempDocumentFields[index].uploadedFile = file;
//     const tempTotalFileSize = tempDocumentFields.reduce(
//       (totalSize, field) =>
//         totalSize + (field.uploadedFile ? field.uploadedFile.size : 0),
//       0
//     );

//     if (tempTotalFileSize > MAX_TOTAL_FILE_SIZE) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: `File "${file.name}" exceeds the size limit of 5 MB`,
//       }); 
//       event.target.value = null;
//       tempDocumentFields[index].uploadedFile = null;
//       tempDocumentFields[index].fileName = "No file selected";
//       setDocumentFields(tempDocumentFields);
//       return;
//     }

//     const updatedDocumentFields = [...documentFields];
//     updatedDocumentFields[index].uploadedFile = file;
//     updatedDocumentFields[index].fileName = file ? file.name : "No file selected";
//     setDocumentFields(updatedDocumentFields);
//   };

//   // Add more document fields
//   const handleAddMore = () => {
//     setDocumentFields((prevState) => [
//       ...prevState,
//       {
//         selectedValue: "",
//         uploadedFile: null,
//         fileName: "No file selected",
//         customDocumentName: "",
//         loading: false,
//         isCustom: false,
//       },
//     ]);
//   };

//   // Discard document field
//   const handleDiscardRow = (index) => {
//     setDocumentFields((prevState) => prevState.filter((_, i) => i !== index));
//   };

//   // Remaining file size
//   const remainingFileSizeKB = (MAX_TOTAL_FILE_SIZE - totalFileSize) / 1024;

//   // Open document preview modal
//   const openModal = (index) => {
//     setPreviewIndex(index);
//     setUploadedFiles((prevFiles) => [
//       ...prevFiles.slice(0, index),
//       documentFields[index].uploadedFile,
//       ...prevFiles.slice(index + 1),
//     ]);
//     setShowModal(true);
//   };

//   // Upload document to S3
//   const uploadVendorDocument = async (file, selectedValue) => {
//     const { data: { url } } = await axios.get(
//       `${process.env.REACT_APP_API}/route/s3createFile/EmployeeDocument`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       }
//     );

//     // Upload file to S3
//     await axios.put(url, file, {
//       headers: {
//         "Content-Type": file.type,
//       },
//     });

//     return {
//       name: file.name,
//       url: url.split("?")[0], // Clean URL
//       selectedValue: selectedValue,
//     };
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     try {
//       setIsSubmitting(true);
//       // Check if total file size exceeds limit
//       if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
//         setAppAlert({
//           alert: true,
//           type: "error",
//           msg: "Total file size exceeds the limit of 5 MB",
//         }); 
//         setIsSubmitting(false);
//         return;
//       }

//       // Validate document fields
//       const formData = { documents: [] };
//       for (let i = 0; i < documentFields.length; i++) {
//         const { selectedValue, uploadedFile, isCustom, customDocumentName } = documentFields[i];

//         if ((!selectedValue && !isCustom) || (isCustom && !customDocumentName) || !uploadedFile) {
//           setAppAlert({
//             alert: true,
//             type: "error",
//             msg: "Please select a document type, provide a custom name if needed, and upload a file for all fields.",
//           });
//           setIsSubmitting(false);
//           return;
//         }

//         formData.documents.push({
//           selectedValue: isCustom ? customDocumentName : selectedValue,
//           uploadedFile,
//           isCustom,
//           customDocumentName,
//         });
//       }

// // Upload documents to S3 and collect URLs
//       const documentUrls = await Promise.allSettled(
//         formData.documents.map((fileData) =>
//           uploadVendorDocument(fileData.uploadedFile, fileData.selectedValue)
//         )
//       );
      
//       const successfulUploads = documentUrls
//         .filter((result) => result.status === "fulfilled")
//         .map((result) => result.value);

//       // Get existing documents for this employee
//       let existingDocuments = [];
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
//           {
//             headers: { Authorization: token },
//           }
//         );
//         existingDocuments = response.data.data?.files || [];
//       } catch (error) {
//         console.error("Error fetching existing documents:", error);
//       }

//       // Combine existing documents with new uploads
//       const updatedData = {
//         documents: [
//           ...successfulUploads,
//           ...existingDocuments.map(doc => ({
//             name: doc.fileName,
//             url: doc.url,
//             selectedValue: doc.selectedValue
//           }))
//         ],
//         employeeId: employeeId,
//         organizationId: organizationId
//       };

//       // Submit data to backend
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/emp/add-document`,
//         updatedData,
//         {
//           headers: { Authorization: token },
//         }
//       );

//       if (response.status === 200) {
//         queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organizationId]);
//         setAppAlert({
//           alert: true,
//           type: "success",
//           msg: "Documents uploaded successfully for the employee.",
//         });
        
//         // Clear form after successful upload
//         setDocumentFields([{
//           selectedValue: "",
//           uploadedFile: null,
//           fileName: "No file selected",
//           customDocumentName: "",
//           loading: false,
//           isCustom: false,
//         }]);
//         handleClose();
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "An error occurred while uploading files.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hasValidDocuments = () => {
//     return documentFields.some(field => 
//       field.uploadedFile && 
//       (field.selectedValue || (field.isCustom && field.customDocumentName))
//     );
//   };

//   return (
//     <Dialog
//       PaperProps={{
//         sx: {
//           width: "100%",
//           maxWidth: "800px!important",
//           height: "100%",
//           maxHeight: "95vh!important",
//           overflowY: "auto"
//         },
//       }}
//       open={open}
//       onClose={handleClearAndClose}
//       className="w-full"
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
//         <div>
//           <div>
//             <div className="md:w-[800px] w-[350px] m-auto mt-6 md:pl-6 pl-3 md:pr-6 pr-3 pt-3 pb-3 rounded-lg">
//               <div
//                 style={{ borderBottom: "2px solid #b8b8b8" }}
//                 className="text-center mb-5 pb-3 w-full"
//               >
//                 <IconButton
//                   aria-label="close"
//                   onClick={handleClearAndClose}
//                   sx={{
//                     position: "absolute",
//                     right: 8,
//                     top: 8,
//                     color: "red",
//                   }}
//                 > 
//                   <CloseIcon />
//                 </IconButton>
//                 <h1 className="text-center md:text-3xl text-2xl">
//                   Upload Document for Employee
//                 </h1>
//                 <p className="text-gray-500 tracking-tight">Upload documents for this employee</p>
//                 <p className="text-gray-500 tracking-tight">Select document type and click the "Upload" button to upload the file, then Submit.</p>
//               </div>

//               {documentFields &&
//                 documentFields?.map((field, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       boxShadow:
//                         "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
//                     }}
//                     className="w-full h-auto md:h-[8vh] md:flex md:items-center md:justify-between pl-3 pt-3 md:pt-0 pr-3 mb-4 rounded-lg"
//                   >
//                     {field.isCustom ? (
//                       <TextField
//                         label="Custom Document Name"
//                         size="small"
//                         sx={{ width: "23%" }}
//                         variant="outlined"
//                         value={field.customDocumentName}
//                         onChange={(e) =>
//                           handleCustomNameChange(index, e.target.value)
//                         }
//                       />
//                     ) : (
//                       <FormControl className="md:w-[170px] w-full" size="small">
//                         <InputLabel id={`select-doc-label-${index}`}>
//                           Select Document
//                         </InputLabel>
//                         <Select
//                           labelId={`select-doc-label-${index}`}
//                           label="Select Document"
//                           value={field.selectedValue}
//                           size="small"
//                           onChange={(e) => handleSelect(index, e.target.value)}
//                         >
//                           {options.map(
//                             (option, optionIndex) =>
//                               // Prevent selecting the same document again
//                               !documentFields
//                                 .slice(0, index)
//                                 .map((field) => field.selectedValue)
//                                 .includes(option) && (
//                                 <MenuItem key={optionIndex} value={option}>
//                                   {option}
//                                 </MenuItem>
//                               )
//                           )}
//                         </Select>
//                       </FormControl>
//                     )}
//                     <div
//                       className="md:justify-normal justify-between md:mt-0 mt-3 pb-3 md:pb-0"
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       <>
//                         <input
//                           id={`file-upload-${index}`}
//                           type="file"
//                           style={{ display: "none" }}
//                           disabled={!field.selectedValue && !field.isCustom}
//                           onChange={(e) => handleFileUpload(index, e)}
//                         />
//                         <div className="w-8 h-8 flex justify-center items-center rounded-full mr-2">
//                           {field.loading ? (
//                             <CircularProgress size={24} />
//                           ) : (
//                             field.uploadedFile && (
//                               <CheckIcon
//                                 style={{
//                                   color: "#FFF",
//                                   backgroundColor: "#25E52E",
//                                   borderRadius: "50%",
//                                 }}
//                               />
//                             )
//                           )}
//                         </div>

//                         <label htmlFor={`file-upload-${index}`}>
//                           <div className="md:w-28">
//                             <Button
//                               size="small"
//                               variant="contained"
//                               component="span"
//                               disabled={!field.selectedValue && !field.isCustom}
//                             >
//                               Upload
//                             </Button>
//                           </div>
//                         </label>
//                         <span className="md:w-28 mr-3 ml-3 text-xs">
//                           {field.fileName}
//                         </span>
//                         <Button
//                           size="small"
//                           color="info"
//                           disabled={!field.uploadedFile}
//                           variant="contained"
//                           onClick={() => openModal(index)}
//                         >
//                           View Doc
//                         </Button>
//                       </>
//                       {documentFields.length > 1 && (
//                         <div
//                           className="h-6 w-6 flex justify-center items-center rounded-full ml-2 cursor-pointer"
//                           onClick={() => handleDiscardRow(index)}
//                         >
//                           <IconButton color="error" aria-label="delete">
//                             <DeleteOutlineIcon />
//                           </IconButton>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               <div className="w-full flex justify-center mt-6 gap-4 mb-2">
//                 <Button
//                   size="small"
//                   variant="contained"
//                   color="error"
//                   onClick={handleAddMore}
//                 >
//                   Add More
//                 </Button>
//                 <Button
//                   size="small"
//                   color="primary"
//                   variant="contained"
//                   onClick={handleSubmit}
//                   disabled={isSubmitting || !hasValidDocuments()}
//                 >
//                   {isSubmitting ? ( 
//                     <>
//                       <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
//                       Uploading...
//                     </>
//                   ) : (
//                     'Submit'
//                   )}
//                 </Button>
//               </div>

//               <div className="flex justify-center gap-2">
//                 <span className="text-xs">Maximum Size Allowed:</span>
//                 <span className="text-xs text-red-600">
//                   {remainingFileSizeKB >= 0
//                     ? ` ${remainingFileSizeKB.toFixed(2)} KB`
//                     : "Size limit exceeded"}
//                 </span>
//               </div>
//             </div>

//             <DocPreviewModal
//               fileData={uploadedFiles[previewIndex]}
//               openState={showModal}
//               setOpenState={setShowModal}
//             />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UploadDocumentForEmployeeModal;
