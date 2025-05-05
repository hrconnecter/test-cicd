import React, { useContext, useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Add, Close, CloudUpload, Info, Visibility } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import UploadDocumentModal from "./components/UploadDocumentModal";
import ViewDocumentSkeleton from "./components/ViewDocumentSkeleton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import DocPreviewModal from "./components/Modal";

// Component
const DocManage = () => {
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user && user._id;
  const organizationId = user && user.organizationId;
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  // State for modals and file handling
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetching documents
  const { data: getRecordOfEmployee, isLoading } = useQuery(
    // ["getRecordOfEmployee"],
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

  // Function to upload to S3
  const uploadToS3 = async (file, folder = "EmployeeDocument") => {
    const {
      data: { url },
    } = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/${folder}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
    });

    return url.split("?")[0]; // Return the uploaded file URL
  };

  // Handle Create Modal Open/Close
  const handleCreateModalOpen = () => setCreateModalOpen(true);
  
  const handleCreateModalClose = () => setCreateModalOpen(false);

  // Handle Edit Modal Open/Close
  // const handleEditModalOpen = (file) => {
  //   setSelectedFileForEdit(file);
  //   setEditModalOpen(true);
  // };

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
    setSelectedFile(null);
  };

  // Handle file selection for editing
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Update file in S3 and backend
  const handleFileUpdate = async () => {
    if (selectedFile && selectedFileForEdit?._id) {
      console.log(' AP Selected file for update:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
      console.log(' AP Current document being edited:', selectedFileForEdit);

      const newUrl = await uploadToS3(selectedFile); // Upload new file
      console.log('AP New URL after S3 upload:', newUrl);
      // editMutation.mutate({ fileId: selectedFileForEdit._id, url: newUrl, fileName: selectedFile.name  });
      editMutation.mutate({ 
        fileId: selectedFileForEdit._id, 
        url: newUrl,
        fileName: selectedFile.name,
        selectedValue: selectedFileForEdit.selectedValue,
        fileType: selectedFile.type
      });
    }
    handleEditModalClose();
  };

  // const editMutation = useMutation(
  //   // async ({ fileId, url ,fileName}) => {
  //     async ({ fileId, url, fileName, selectedValue, fileType }) => {
  //     return axios.put(
  //       `${process.env.REACT_APP_API}/route/update-document/${fileId}`,
  //       { url: url ,
  //         fileName: fileName ,
  //         selectedValue: selectedValue,
  //         fileType: fileType
  //       },
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //   },
  //   {
  //     onSuccess: () => {
  //       // queryClient.invalidateQueries("getRecordOfEmployee");
  //       queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]);
  //       handleAlert(true, "success", "Document updated successfully");
  //     },
  //   }
  // );

  // Delete Document
 
  // const editMutation = useMutation(
  //   async (updateData) => {
  //     console.log('AP Sending update request with data:', updateData);
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_API}/route/update-document/${updateData.fileId}`,
  //       {
  //         url: updateData.url,
  //         fileName: updateData.fileName,
  //         selectedValue: updateData.selectedValue,
  //         fileType: updateData.fileType
  //       },
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     console.log('AP Update response:', response.data);
  //     return response;
  //   },
  //   {
  //     onSuccess: (data) => {
  //       console.log('AP Update successful, invalidating queries');
  //       queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]);
  //       handleAlert(true, "success", "Document updated successfully");
  //     },
  //     onError: (error) => {
  //       console.error('AP Update failed:', error);
  //     }
  //   }
  // );
  

  const editMutation = useMutation(
    async (updateData) => {
      // First, get the current document data
      const currentDoc = await axios.get(
        `${process.env.REACT_APP_API}/route/emp/get-document/${employeeId}/${organizationId}`,
        {
          headers: { Authorization: token },
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
          headers: { Authorization: token },
        }
      );
  
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]);
        handleAlert(true, "success", "Document updated successfully");
      }
    }
  );
  
 
 
   const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/delete-update-document/${id}`,
        {
          headers: { Authorization: token },
        }
      ),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries("getRecordOfEmployee");
        queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]);
        handleAlert(true, "success", "Document deleted successfully");
      },
    }
  );

  const handleDeleteConfirmation = (id) => setDeleteConfirmation(id);
  const handleCloseConfirmation = () => setDeleteConfirmation(null);
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };
 
  return (
    <>
      <BoxComponent> 
        <HeadingOneLineInfo
          heading={"Document Manage"}
          info={"Manage the document here."}
        />

        <section className="bg-gray-50 min-h-screen w-full">
          <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              {getRecordOfEmployee?.length > 0 && (
                <div className="flex gap-2 w-full">
                  <h1 className="text-lg">Your uploaded document</h1>
                </div>
              )}
              <div className="flex justify-end w-full">
                <Button
                  className="!font-semibold !bg-sky-500 flex gap-2"
                  variant="contained"
                  onClick={handleCreateModalOpen}
                >
                  <Add />
                  Upload Document
                </Button>
              </div>
            </div>

            {isLoading ? (
              <ViewDocumentSkeleton />
            ) : getRecordOfEmployee?.files?.length > 0 ? (
              <>
                <div className="flex w-full">
                  <div className="overflow-auto p-0 border border-gray-200 w-full">
                    <table className="min-w-full bg-white text-left text-sm font-light table-auto">
                      <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                        <tr className="font-semibold">
                          <th scope="col" className="text-left px-6 py-3 w-1/5">
                            Sr No
                          </th>
                          <th scope="col" className="px-6 py-3 w-1/5">
                            File Name
                          </th>
                          <th scope="col" className="px-6 py-3 w-1/5">
                            Document Type
                          </th>
                          <th scope="col" className="px-6 py-3 pr-2 w-1/5">
                            Edit
                          </th>
                          <th scope="col" className="px-6 py-3 w-1/5">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRecordOfEmployee &&
                          getRecordOfEmployee?.files?.map((data, id) => {
                            return (
                              <tr className="font-medium border-b" key={id}>
                                <td className="text-left pl-10 py-3 w-1/5">
                                  {id + 1}
                                </td>
                                <td className="py-3 pl-6 w-1/5">
                                  {data.fileName}
                                </td>
                                <td className="py-3 pl-6 w-1/5">
                                  {data.selectedValue}
                                </td>
                                <td className="whitespace-nowrap px-6 py-2 w-1/5">
                                  <IconButton
                                    color="primary"
                                    aria-label="edit"
                                    onClick={() => handleEditModalOpen(data)}
                                  >
                                    <EditOutlinedIcon />
                                  </IconButton>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-2 w-1/5">
                                  <IconButton
                                    color="error"
                                    aria-label="delete"
                                    onClick={() =>
                                      handleDeleteConfirmation(data?._id)
                                    }
                                  >
                                     <DeleteOutlineIcon />
                                  </IconButton>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">Upload Document</h1>
                </article>
                <p>No document found. Upload the document.</p>
              </section>
            )}
          </article>
        </section>

        {/* for create */}
        <UploadDocumentModal
          handleClose={handleCreateModalClose}
          open={createModalOpen}
        />

        {/* for delete */}
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

        {/* <Dialog open={editModalOpen} onClose={handleEditModalClose}>
          <DialogTitle>Edit Document</DialogTitle>
        
<DialogContent>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <input 
          type="file" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="edit-file-input"
        />
        <label htmlFor="edit-file-input">
          <Button
            variant="contained"
            component="span"
            size="small"
          >
            Choose File
          </Button>
        </label>
        <span className="text-sm">
          {selectedFile ? selectedFile.name : selectedFileForEdit?.fileName}
        </span>
      </div>
      
      <Button
        variant="contained"
        color="info"
        size="small"
        onClick={() => setShowPreviewModal(true)}
      >
        View Document
      </Button>
    </div>
  </DialogContent>

          <DialogActions>
            <Button
              onClick={handleEditModalClose}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleFileUpdate}
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog> */}

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
            {/* {selectedFile ? selectedFile.name : 'No file selected'} */}
             {selectedFile ? selectedFile.name : selectedFileForEdit?.fileName}
          </span>
        </div>
      </div>

      {selectedFile && (
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
      disabled={!selectedFile}
    >
      Update Document
    </Button>
  </DialogActions>
</Dialog>


{/* Document Preview Modal */}
<DocPreviewModal
  fileData={selectedFile || selectedFileForEdit}
  openState={showPreviewModal}
  setOpenState={setShowPreviewModal}
/>

      </BoxComponent>
    </>
  );
};

export default DocManage;
