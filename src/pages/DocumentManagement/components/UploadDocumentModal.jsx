/* eslint-disable no-unused-vars */
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import DocPreviewModal from "./Modal";
import UserProfile from "../../../hooks/UserData/useUser";
import CloseIcon from "@mui/icons-material/Close";
import { useQueryClient } from 'react-query';

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

// UploadDocumentModal Component
const UploadDocumentModal = ({ handleClose, open }) => {
  // User data and token
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;
  const organizationId = user?.organizationId;

  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { setAppAlert } = useContext(UseContext);
  const queryClient = useQueryClient();

  // State hooks
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedExistingDocs, setSelectedExistingDocs] = useState([]);
  const [documentFields, setDocumentFields] = useState([
    {
      selectedValue: "",
      uploadedFile: null,
      fileName: "No file selected",
      customDocumentName: "",
      loading: false,
    },
  ]);


  // Function to reset state and clear files
  const handleClearAndClose = () => {
    // Reset the document fields to initial state
    setDocumentFields([
      {
        selectedValue: "",
        uploadedFile: null,
        fileName: "No file selected",
        customDocumentName: "",
        loading: false,
      },
    ]);
    setTotalFileSize(0); // Reset total file size
    setUploadedFiles([]); // Clear uploaded files
    handleClose(); // Close the modal
  };


  // Get employee's uploaded document records
  useQuery(
    ["getRecordOfEmployee", employeeId, organizationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

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
    if (!allowedFileTypes.includes(file.type)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only PDFs are allowed for upload.",
      });
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
      setAppAlert({
        alert: true,
        type: "error",
        msg: `File "${file.name}" exceeds the size limit of 5 MB`,
      }); 
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

// Add this near the top of the component
const { data: existingDocuments } = useQuery(
  ["getRecordOfEmployee", employeeId, organizationId],
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data.data;
  }
);


  // Upload document to S3
  const uploadVendorDocument = async (file, selectedValue) => {
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
      selectedValue: selectedValue,
    };
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Check if total file size exceeds limit
      if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Total file size exceeds the limit of 5 MB",
        }); 
        return;
      }

      // Validate document fields
      const formData = { documents: [],
       };
      for (let i = 0; i < documentFields.length; i++) {
        const { selectedValue, uploadedFile, isCustom, customDocumentName } = documentFields[i];

        if ((!selectedValue && !isCustom) || (isCustom && !customDocumentName)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Please select a document and provide a custom name for all fields.",
          });
          return;
        }

        formData.documents.push({
          // selectedValue,
          selectedValue: isCustom ? customDocumentName : selectedValue,
          uploadedFile,
          isCustom,
          customDocumentName,
        });
      }

      // Upload documents to S3 and collect URLs
      const documentUrls = await Promise.allSettled(
        formData.documents.map((fileData) =>
          uploadVendorDocument(fileData.uploadedFile, fileData.selectedValue)
        )
      );
      

      const successfulUploads = documentUrls
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // // Combine successful uploads with user data
      // const updatedData = {
      //   documents: successfulUploads, 
      //   existingDocuments: selectedExistingDocs,
      //   fileName: successfulUploads.name,
      //   employeeId: employeeId,
      //   organizationId: organizationId

      // };

        // Combine existing documents with new uploads
    const updatedData = {
      documents: [
        ...successfulUploads,
        ...(existingDocuments?.files || []).map(doc => ({
          name: doc.fileName,
          url: doc.url,
          selectedValue: doc.selectedValue
        }))
      ],
      employeeId: employeeId,
      organizationId: organizationId
    };

 
      console.log(updatedData)
      // Submit data to backend
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/emp/add-document`,
        updatedData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {

        queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]); // Match the query key
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Documents submitted successfully.",
        });
        

         // Clear form after successful upload
    setDocumentFields([{
      selectedValue: "",
      uploadedFile: null,
      fileName: "No file selected",
      customDocumentName: "",
      loading: false,
    }]);
        handleClose();
        setIsSubmitting(false);
        // window.location.reload(); // Reload the page

      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setIsSubmitting(false);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An error occurred while uploading files.",
      });
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
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div>
          <div>
            <div className="md:w-[800px] w-[350px] m-auto mt-6 md:pl-6 pl-3 md:pr-6 pr-3 pt-3 pb-3 rounded-lg">
              <div
                style={{ borderBottom: "2px solid #b8b8b8" }}
                className="text-center mb-5 pb-3 w-full"
              >
                {/* Add a close button at the top-right corner */}
                <IconButton
                  aria-label="close"
                  onClick={handleClearAndClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "red", // Color for the cross icon
                  }}
                > 
                  <CloseIcon />
                </IconButton>
                <h1 className="text-center md:text-3xl text-2xl">
                  Upload Document
                </h1>
                <p className="text-gray-500  tracking-tight" >Here you can upload your documents</p>
                <p className="text-gray-500  tracking-tight">Select your document and click the "Upload" button to Upload your file and then Submit file.</p>

              </div>


              {/* // Add this section in the JSX before the document upload fields */}
{/* {existingDocuments?.files?.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-3">Previously Uploaded Documents</h2>
    <div className="bg-gray-50 p-4 rounded-lg">
      {existingDocuments.files.map((doc, index) => (
        <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded shadow-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium">{doc.selectedValue}</span>
            <span className="text-sm text-gray-500">{doc.fileName}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                setPreviewIndex(index);
                setShowPreviewModal(true);
                setUploadedFiles(prev => [...prev, { url: doc.url, type: 'application/pdf' }]);
              }}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)} */}


{existingDocuments?.files?.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-3">Previously Uploaded Documents</h2>
    <div className="bg-gray-50 p-4 rounded-lg">
      {existingDocuments.files.map((doc, index) => (
        <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded shadow-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium">{doc.selectedValue}</span>
            <span className="text-sm text-gray-500">{doc.fileName}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                setPreviewIndex(index);
                setShowModal(true);
                setUploadedFiles(prev => [...prev, { url: doc.url, type: 'application/pdf' }]);
              }}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
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
                                  backgroundColor: "#25E52E",
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
                  disabled={isSubmitting || !hasValidDocuments() }
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
                <span className="text-xs">Maximum Size Allowed :</span>
                <span className="text-xs text-red-600">
                  {remainingFileSizeKB >= 0
                    ? ` ${remainingFileSizeKB.toFixed(2)} KB`
                    : "Size limit exceeded"}
                </span>
              </div>
            </div>

            <DocPreviewModal
              fileData={uploadedFiles[previewIndex]}
              // openState={showPreviewModal} 
              // setOpenState={setShowPreviewModal}
              openState={showModal}
  setOpenState={setShowModal}

            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;
