/* eslint-disable no-unused-vars */


//yeah new working available edit and delete >update if needed ✅ v1
import React, { useState, useContext } from "react";
import { 
  Button, 
  Avatar,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton,
  CircularProgress
} from "@mui/material";
import { 
  Add, 
  Info, 
  Close, 
  CloudUpload, 
  RequestQuote ,
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios"; 
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import UploadDocumentForEmployeeModal from "./UploadDocumentForEmployeeModal";
import DocPreviewModal from "./Modal";

const ViewEmployeeRecord = ({ employeeId }) => {
  const { organisationId } = useParams(); // Getting organisationId from URL params
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();

  // State for document preview
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // State for edit functionality
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] = useState(null);
  const [newFileForEdit, setNewFileForEdit] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // State for delete functionality
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // useQuery now listens for changes in employeeId and organisationId
  const { data: getRecordOneEmployee, isLoading } = useQuery(
    ["getRecordOneEmployee", employeeId, organisationId], // Dependency on employeeId to refetch on change
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!employeeId && !!organisationId, // Only run the query if employeeId exists
    }
  );

  // Function to upload to S3
  const uploadToS3 = async (file, folder = "EmployeeDocument") => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${folder}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });

    return url.split("?")[0]; // Return the uploaded file URL
  };

  // Document preview handlers
  const handleOpen = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  // Upload modal handlers
  const handleUploadModalOpen = () => {
    setUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setUploadModalOpen(false);
    // Refresh the document list after upload
    queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
  };

  // Edit modal handlers
  const handleEditModalOpen = (file) => {
    setSelectedFileForEdit({
      ...file,
      // For preview compatibility
      type: 'application/pdf',
      url: file.url
    });
    setEditModalOpen(true);
  };
  
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedFileForEdit(null);
    setNewFileForEdit(null);
  };

  // Handle file selection for editing
  const handleFileChange = (e) => {
    setNewFileForEdit(e.target.files[0]);
  };

  // Update file in S3 and backend
  const handleFileUpdate = async () => {
    if (newFileForEdit && selectedFileForEdit?._id) {
      console.log('Selected file for update:', {
        name: newFileForEdit.name,
        type: newFileForEdit.type,
        size: newFileForEdit.size
      });
      console.log('Current document being edited:', selectedFileForEdit);

      const newUrl = await uploadToS3(newFileForEdit); // Upload new file
      console.log('New URL after S3 upload:', newUrl);
      
      editMutation.mutate({ 
        fileId: selectedFileForEdit._id, 
        url: newUrl,
        fileName: newFileForEdit.name,
        selectedValue: selectedFileForEdit.selectedValue,
        fileType: newFileForEdit.type
      });
    }
    handleEditModalClose();
  };

  // Edit mutation
  const editMutation = useMutation(
    async (updateData) => {
      // First, get the current document data
      const currentDoc = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
  
      // Find the specific file in the array
      const fileIndex = currentDoc.data.data.files.findIndex(
        file => file._id === updateData.fileId
      );
  
      // Prepare the complete update payload
      const updatePayload = {
        url: updateData.url,
        fileName: updateData.fileName,
        selectedValue: updateData.selectedValue,
        fileType: updateData.fileType,
        fileIndex: fileIndex // Add file index to help backend identify which file to update
      };
  
      // Send update request
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/update-document/${updateData.fileId}`,
        updatePayload,
        {
          headers: { Authorization: authToken },
        }
      );
  
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
        handleAlert(true, "success", "Document updated successfully");
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to update document");
      }
    }
  );

  // Delete handlers
  const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
  const handleCloseConfirmation = () => setDeleteConfirmation(null);
  
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  // Delete mutation
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        // `${process.env.REACT_APP_API}/route/delete-update-document/${id}`,
        `${process.env.REACT_APP_API}/route/delete-document-for-employee/${id}?targetEmployeeId=${employeeId}&targetOrgId=${organisationId}`,
        {
          headers: { Authorization: authToken },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
        handleAlert(true, "success", "Document deleted successfully");
      },
      onError: (error) => {
        handleAlert(true, "error", error.response?.data?.message || "Failed to delete document");
      }
    }
  );
 
  return ( 
    <BoxComponent>
      {/* <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
        <div className="flex gap-2 w-full">
          <HeadingOneLineInfo heading={"Employee Records"}
          info={"View and manage documents uploaded for this employee."} />
        </div>
        {employeeId && (
          <div className="flex justify-end ">
            <Button
              className="!font-semibold flex "
              variant="outlined"
              onClick={handleUploadModalOpen}
            >
              Upload Document
            </Button>
          </div>
        )}
      </div> */}
      <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
  <div className="flex items-center gap-3">
    <Avatar className="text-white !bg-blue-500">
      <RequestQuote />
    </Avatar>
    <div>
      <h1 className="text-xl">Employee Records</h1>
      <p className="text-sm">
        View and manage documents uploaded for this employee.
      </p>
    </div>
  </div>
  {employeeId && (
    <div className="flex justify-end items-center">
      <Button
        className="!font-semibold flex"
        variant="outlined"
        onClick={handleUploadModalOpen}
      >
        Upload Document
      </Button>
    </div>
  )}
</div>


      {isLoading ? (
        <div className="p-4 text-center">Loading documents...</div>
      ) : getRecordOneEmployee?.files?.length > 0 ? (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                <th scope="col" className="px-6 py-3">File Name</th>
                <th scope="col" className="px-6 py-3">Document Name</th>
                <th scope="col" className="px-6 py-3">View</th>
                <th scope="col" className="px-6 py-3">Edit</th>
                <th scope="col" className="px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {getRecordOneEmployee.files.map((file, id) => (
                <tr className="!font-medium border-b" key={id}>
                  <td className="!text-left pl-8 py-3">{id + 1}</td>
                  <td className="!text-left pl-6 py-3">{file.fileName}</td>
                  <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
                  <td className="!text-left pl-6 py-3">
                    <Button 
                      size="small"
                      variant="text"
                      color="primary"
                      onClick={() => handleOpen(file)}
                    >
                      Preview
                    </Button>
                  </td>
                  <td className="!text-left pl-6 py-3">
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={() => handleEditModalOpen(file)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </td>
                  <td className="!text-left pl-6 py-3">
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() => handleDeleteConfirmation(file._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
          <article className="flex items-center mb-1 text-red-500 gap-2">
            <Info className="!text-2xl" />
            <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
          </article>
          <p>
            {employeeId 
              ? "No documents found for this employee. Use the 'Upload Document' button to add documents." 
              : "Please select an employee to view or upload documents."}
          </p>
        </section> 
      )}

      {/* Modal to preview the document */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Preview Document</DialogTitle>
        <DialogContent>
          {selectedFile && selectedFile.url ? (
            <div className="pdf-preview-container">
              <object
                data={selectedFile.url}
                type="application/pdf"
                width="100%"
                height="600px"
              >
                <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
              </object>
            </div>
          ) : (
            <p>No PDF file found.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Modal for Employee */}
      {employeeId && (
        <UploadDocumentForEmployeeModal
          open={uploadModalOpen}
          handleClose={handleUploadModalClose}
          employeeId={employeeId}
          organizationId={organisationId}
        />
      )}

      {/* Edit Document Modal */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span className="text-black">Edit Document</span>
            <IconButton onClick={handleEditModalClose} color="error" size="small">
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        
        <DialogContent>
          <div className="flex flex-col gap-4 py-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Current Document:</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedFileForEdit?.fileName}</span>
                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => setShowPreviewModal(true)}
                  startIcon={<Visibility />}
                >
                  View Current
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Upload New Version:</p>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="edit-file-input"
                />
                <label htmlFor="edit-file-input">
                  <Button
                    variant="contained"
                    component="span"
                    size="small"
                    startIcon={<CloudUpload />}
                  >
                    Choose File
                  </Button>
                </label>
                <span className="text-sm text-gray-600">
                  {newFileForEdit ? newFileForEdit.name : selectedFileForEdit?.fileName}
                </span>
              </div>
            </div>

            {newFileForEdit && (
                            <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => setShowPreviewModal(true)}
                            startIcon={<Visibility />}
                          >
                            Preview New File
                          </Button>
                        )}
                      </div>
                    </DialogContent>
            
                    <DialogActions className="p-4">
                      <Button
                        onClick={handleEditModalClose}
                        variant="outlined"
                        color="inherit"
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleFileUpdate}
                        color="primary"
                        size="small"
                        disabled={!newFileForEdit}
                      >
                        Update Document
                      </Button>
                    </DialogActions>
                  </Dialog>
            
                  {/* Delete Confirmation Dialog */}
                  <Dialog
                    open={deleteConfirmation !== null}
                    onClose={handleCloseConfirmation}
                  >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                      <p>
                        Please confirm your decision to delete this document, as this
                        action cannot be undone.
                      </p>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleCloseConfirmation}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDelete(deleteConfirmation)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
            
                  {/* Document Preview Modal */}
                  <DocPreviewModal
                    fileData={newFileForEdit || selectedFileForEdit}
                    openState={showPreviewModal}
                    setOpenState={setShowPreviewModal}
                  />
                </BoxComponent> 
              );
            };
            
export default ViewEmployeeRecord;
            


// //yeah new working available edit and delete >update if needed ✅ v1
// import React, { useState, useContext } from "react";
// import { 
//   Button, 
//   Dialog, 
//   DialogActions, 
//   DialogContent, 
//   DialogTitle, 
//   IconButton,
//   CircularProgress
// } from "@mui/material";
// import { 
//   Add, 
//   Info, 
//   Close, 
//   CloudUpload, 
//   Visibility,
//   Edit as EditIcon,
//   Delete as DeleteIcon
// } from "@mui/icons-material";
// import { useQuery, useQueryClient, useMutation } from "react-query";
// import axios from "axios"; 
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import UploadDocumentForEmployeeModal from "./UploadDocumentForEmployeeModal";
// import DocPreviewModal from "./Modal";

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams(); // Getting organisationId from URL params
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();

//   // State for document preview
//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
//   // State for edit functionality
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedFileForEdit, setSelectedFileForEdit] = useState(null);
//   const [newFileForEdit, setNewFileForEdit] = useState(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
  
//   // State for delete functionality
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);

//   // useQuery now listens for changes in employeeId and organisationId
//   const { data: getRecordOneEmployee, isLoading } = useQuery(
//     ["getRecordOneEmployee", employeeId, organisationId], // Dependency on employeeId to refetch on change
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       enabled: !!employeeId && !!organisationId, // Only run the query if employeeId exists
//     }
//   );

//   // Function to upload to S3
//   const uploadToS3 = async (file, folder = "EmployeeDocument") => {
//     const {
//       data: { url },
//     } = await axios.get(
//       `${process.env.REACT_APP_API}/route/s3createFile/${folder}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );

//     await axios.put(url, file, {
//       headers: { "Content-Type": file.type },
//     });

//     return url.split("?")[0]; // Return the uploaded file URL
//   };

//   // Document preview handlers
//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   // Upload modal handlers
//   const handleUploadModalOpen = () => {
//     setUploadModalOpen(true);
//   };

//   const handleUploadModalClose = () => {
//     setUploadModalOpen(false);
//     // Refresh the document list after upload
//     queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
//   };

//   // Edit modal handlers
//   const handleEditModalOpen = (file) => {
//     setSelectedFileForEdit({
//       ...file,
//       // For preview compatibility
//       type: 'application/pdf',
//       url: file.url
//     });
//     setEditModalOpen(true);
//   };
  
//   const handleEditModalClose = () => {
//     setEditModalOpen(false);
//     setSelectedFileForEdit(null);
//     setNewFileForEdit(null);
//   };

//   // Handle file selection for editing
//   const handleFileChange = (e) => {
//     setNewFileForEdit(e.target.files[0]);
//   };

//   // Update file in S3 and backend
//   const handleFileUpdate = async () => {
//     if (newFileForEdit && selectedFileForEdit?._id) {
//       console.log('Selected file for update:', {
//         name: newFileForEdit.name,
//         type: newFileForEdit.type,
//         size: newFileForEdit.size
//       });
//       console.log('Current document being edited:', selectedFileForEdit);

//       const newUrl = await uploadToS3(newFileForEdit); // Upload new file
//       console.log('New URL after S3 upload:', newUrl);
      
//       editMutation.mutate({ 
//         fileId: selectedFileForEdit._id, 
//         url: newUrl,
//         fileName: newFileForEdit.name,
//         selectedValue: selectedFileForEdit.selectedValue,
//         fileType: newFileForEdit.type
//       });
//     }
//     handleEditModalClose();
//   };

//   // Edit mutation
//   const editMutation = useMutation(
//     async (updateData) => {
//       // First, get the current document data
//       const currentDoc = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
  
//       // Find the specific file in the array
//       const fileIndex = currentDoc.data.data.files.findIndex(
//         file => file._id === updateData.fileId
//       );
  
//       // Prepare the complete update payload
//       const updatePayload = {
//         url: updateData.url,
//         fileName: updateData.fileName,
//         selectedValue: updateData.selectedValue,
//         fileType: updateData.fileType,
//         fileIndex: fileIndex // Add file index to help backend identify which file to update
//       };
  
//       // Send update request
//       const response = await axios.put(
//         `${process.env.REACT_APP_API}/route/update-document/${updateData.fileId}`,
//         updatePayload,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
  
//       return response;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
//         handleAlert(true, "success", "Document updated successfully");
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.response?.data?.message || "Failed to update document");
//       }
//     }
//   );

//   // Delete handlers
//   const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
//   const handleCloseConfirmation = () => setDeleteConfirmation(null);
  
//   const handleDelete = (id) => {
//     deleteMutation.mutate(id);
//     handleCloseConfirmation();
//   };

//   // Delete mutation
//   const deleteMutation = useMutation(
//     (id) =>
//       axios.delete(
//         // `${process.env.REACT_APP_API}/route/delete-update-document/${id}`,
//         `${process.env.REACT_APP_API}/route/delete-document-for-employee/${id}?targetEmployeeId=${employeeId}&targetOrgId=${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
//         handleAlert(true, "success", "Document deleted successfully");
//       },
//       onError: (error) => {
//         handleAlert(true, "error", error.response?.data?.message || "Failed to delete document");
//       }
//     }
//   );

//   return ( 
//     <BoxComponent>
//       <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
//         <div className="flex gap-2 w-full">
//           <HeadingOneLineInfo heading={"Employee Records"} info={"Here you will be able to view and manage the uploaded records of the employee."} />
//         </div>
//         {employeeId && (
//           <div className="flex justify-end ">
//             <Button
//               className="!font-semibold flex "
//               variant="outlined"
//               onClick={handleUploadModalOpen}
//             >
//               <Add />
//               Upload Document
//             </Button>
//           </div>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="p-4 text-center">Loading documents...</div>
//       ) : getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Document Name</th>
//                 <th scope="col" className="px-6 py-3">View</th>
//                 <th scope="col" className="px-6 py-3">Edit</th>
//                 <th scope="col" className="px-6 py-3">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <Button 
//                       size="small"
//                       variant="text"
//                       color="primary"
//                       onClick={() => handleOpen(file)}
//                     >
//                       Preview
//                     </Button>
//                   </td>
//                   <td className="!text-left pl-6 py-3">
//                     <IconButton
//                       color="primary"
//                       aria-label="edit"
//                       onClick={() => handleEditModalOpen(file)}
//                       size="small"
//                     >
//                       <EditIcon />
//                     </IconButton>
//                   </td>
//                   <td className="!text-left pl-6 py-3">
//                     <IconButton
//                       color="error"
//                       aria-label="delete"
//                       onClick={() => handleDeleteConfirmation(file._id)}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>
//             {employeeId 
//               ? "No documents found for this employee. Use the 'Upload Document' button to add documents." 
//               : "Please select an employee to view or upload documents."}
//           </p>
//         </section> 
//       )}

//       {/* Modal to preview the document */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <object
//                 data={selectedFile.url}
//                 type="application/pdf"
//                 width="100%"
//                 height="600px"
//               >
//                 <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
//               </object>
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload Document Modal for Employee */}
//       {employeeId && (
//         <UploadDocumentForEmployeeModal
//           open={uploadModalOpen}
//           handleClose={handleUploadModalClose}
//           employeeId={employeeId}
//           organizationId={organisationId}
//         />
//       )}

//       {/* Edit Document Modal */}
//       <Dialog open={editModalOpen} onClose={handleEditModalClose}>
//         <DialogTitle>
//           <div className="flex justify-between items-center">
//             <span className="text-black">Edit Document</span>
//             <IconButton onClick={handleEditModalClose} color="error" size="small">
//               <Close />
//             </IconButton>
//           </div>
//         </DialogTitle>
        
//         <DialogContent>
//           <div className="flex flex-col gap-4 py-4">
//             <div className="border rounded-lg p-4 bg-gray-50">
//               <p className="text-sm text-gray-600 mb-2">Current Document:</p>
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">{selectedFileForEdit?.fileName}</span>
//                 <Button
//                   variant="outlined"
//                   color="info"
//                   size="small"
//                   onClick={() => setShowPreviewModal(true)}
//                   startIcon={<Visibility />}
//                 >
//                   View Current
//                 </Button>
//               </div>
//             </div>

//             <div className="border rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-2">Upload New Version:</p>
//               <div className="flex items-center gap-3">
//                 <input 
//                   type="file" 
//                   onChange={handleFileChange}
//                   accept="application/pdf"
//                   style={{ display: 'none' }}
//                   id="edit-file-input"
//                 />
//                 <label htmlFor="edit-file-input">
//                   <Button
//                     variant="contained"
//                     component="span"
//                     size="small"
//                     startIcon={<CloudUpload />}
//                   >
//                     Choose File
//                   </Button>
//                 </label>
//                 <span className="text-sm text-gray-600">
//                   {newFileForEdit ? newFileForEdit.name : selectedFileForEdit?.fileName}
//                 </span>
//               </div>
//             </div>

//             {newFileForEdit && (
//                             <Button
//                             variant="outlined"
//                             color="info"
//                             size="small"
//                             onClick={() => setShowPreviewModal(true)}
//                             startIcon={<Visibility />}
//                           >
//                             Preview New File
//                           </Button>
//                         )}
//                       </div>
//                     </DialogContent>
            
//                     <DialogActions className="p-4">
//                       <Button
//                         onClick={handleEditModalClose}
//                         variant="outlined"
//                         color="inherit"
//                         size="small"
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         variant="contained"
//                         onClick={handleFileUpdate}
//                         color="primary"
//                         size="small"
//                         disabled={!newFileForEdit}
//                       >
//                         Update Document
//                       </Button>
//                     </DialogActions>
//                   </Dialog>
            
//                   {/* Delete Confirmation Dialog */}
//                   <Dialog
//                     open={deleteConfirmation !== null}
//                     onClose={handleCloseConfirmation}
//                   >
//                     <DialogTitle>Confirm Deletion</DialogTitle>
//                     <DialogContent>
//                       <p>
//                         Please confirm your decision to delete this document, as this
//                         action cannot be undone.
//                       </p>
//                     </DialogContent>
//                     <DialogActions>
//                       <Button
//                         onClick={handleCloseConfirmation}
//                         variant="outlined"
//                         color="primary"
//                         size="small"
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleDelete(deleteConfirmation)}
//                         color="error"
//                       >
//                         Delete
//                       </Button>
//                     </DialogActions>
//                   </Dialog>
            
//                   {/* Document Preview Modal */}
//                   <DocPreviewModal
//                     fileData={newFileForEdit || selectedFileForEdit}
//                     openState={showPreviewModal}
//                     setOpenState={setShowPreviewModal}
//                   />
//                 </BoxComponent> 
//               );
//             };
            
// export default ViewEmployeeRecord;
            


//yeah new working but not available edit and delete 
// import React, { useState, useContext } from "react";
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
// import { Add, Info } from "@mui/icons-material";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios"; 
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import UploadDocumentForEmployeeModal from "./UploadDocumentForEmployeeModal";

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams(); // Getting organisationId from URL params
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);
//   const authToken = cookies["aegis"];
//   const queryClient = useQueryClient();

//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadModalOpen, setUploadModalOpen] = useState(false);

//   // useQuery now listens for changes in employeeId and organisationId
//   const { data: getRecordOneEmployee, isLoading } = useQuery(
//     ["getRecordOneEmployee", employeeId, organisationId], // Dependency on employeeId to refetch on change
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       enabled: !!employeeId && !!organisationId, // Only run the query if employeeId exists
//     }
//   );

//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   const handleUploadModalOpen = () => {
//     setUploadModalOpen(true);
//   };

//   const handleUploadModalClose = () => {
//     setUploadModalOpen(false);
//     // Refresh the document list after upload
//     queryClient.invalidateQueries(["getRecordOneEmployee", employeeId, organisationId]);
//   };

//   return (  
//     <BoxComponent>
//       <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
//         <div className="flex gap-2 w-full">
//           <HeadingOneLineInfo heading={"Employee Records"} info={"Here you will be able to view and manage the uploaded records of the employee."} />
//         </div>
//         {employeeId && (
//           <div className="flex justify-end ">
//             <Button
//               className="!font-semibold flex "
//               variant="outlined"
//               onClick={handleUploadModalOpen}
//             >
//               <Add />
//               Upload Document
//             </Button>
//           </div>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="p-4 text-center">Loading documents...</div>
//       ) : getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Document Name</th>
//                 <th scope="col" className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
//                       Preview
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>
//             {employeeId 
//               ? "No documents found for this employee. Use the 'Upload Document' button to add documents." 
//               : "Please select an employee to view or upload documents."}
//           </p>
//         </section> 
//       )}

//       {/* Modal to preview the document */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <object
//                 data={selectedFile.url}
//                 type="application/pdf"
//                 width="100%"
//                 height="600px"
//               >
//                 <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
//               </object>
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload Document Modal for Employee */}
//       {employeeId && (
//         <UploadDocumentForEmployeeModal
//           open={uploadModalOpen}
//           handleClose={handleUploadModalClose}
//           employeeId={employeeId}
//           organizationId={organisationId}
//         />
//       )}
//     </BoxComponent> 
//   );
// };

// export default ViewEmployeeRecord;


//OLD WORKING
// import React, { useState, useContext } from "react";
// import {  Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { Info } from "@mui/icons-material";
// import { useQuery } from "react-query";
// import axios from "axios"; 
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../../State/UseState/UseContext";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";

// const ViewEmployeeRecord = ({ employeeId }) => {
//   const { organisationId } = useParams(); // Getting organisationId from URL params
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   const [open, setOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   // useQuery now listens for changes in employeeId and organisationId
//   const { data: getRecordOneEmployee } = useQuery(
//     ["getRecordOneEmployee", employeeId], // Dependency on employeeId to refetch on change
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       enabled: !!employeeId, // Only run the query if employeeId exists
//     }
//   );

//   const handleOpen = (file) => {
//     setSelectedFile(file);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedFile(null);
//   };

//   return ( 
  
//     <BoxComponent>
//       <HeadingOneLineInfo heading={"Employee Records"} info={" Here you will be able to view the uploaded record of the employee."} />

//       {getRecordOneEmployee?.files?.length > 0 ? (
//         <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//           <table className="min-w-full bg-white text-left !text-sm font-light">
//             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//               <tr className="font-semibold">
//                 <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
//                 <th scope="col" className="px-6 py-3">File Name</th>
//                 <th scope="col" className="px-6 py-3">Document Name</th>
//                 <th scope="col" className="px-6 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getRecordOneEmployee.files.map((file, id) => (
//                 <tr className="!font-medium border-b" key={id}>
//                   <td className="!text-left pl-8 py-3">{id + 1}</td>
//                   <td className="!text-left pl-6 py-3">{file.fileName}</td>
//                   <td className="!text-left pl-6 py-3">{file.selectedValue}</td>
//                   <td className="!text-left pl-6 py-3">
//                     <button className="text-blue-500 hover:underline" onClick={() => handleOpen(file)}>
//                       Preview
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
//           <article className="flex items-center mb-1 text-red-500 gap-2">
//             <Info className="!text-2xl" />
//             <h1 className="text-lg font-semibold">No Uploaded Document Found.</h1>
//           </article>
//           <p>Please ask the employee to upload the document.</p>
//         </section> 
//       )}

//       {/* Modal to preview the document */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
//         <DialogTitle>Preview Document</DialogTitle>
//         <DialogContent>
//           {selectedFile && selectedFile.url ? (
//             <div className="pdf-preview-container">
//               <object
//                 data={selectedFile.url}
//                 type="application/pdf"
//                 width="100%"
//                 height="600px"
//               >
//                 <p>Your browser does not support PDF viewing. Please download the PDF to view it: <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
//               </object>
//             </div>
//           ) : (
//             <p>No PDF file found.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
     
//       </BoxComponent> 
     
//   );
// };

// export default ViewEmployeeRecord;
