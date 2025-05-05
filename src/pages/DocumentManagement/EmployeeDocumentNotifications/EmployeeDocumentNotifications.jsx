import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { 
  Typography, 
  Tooltip, 
  Paper, 
  Divider, 
  Button,
  CircularProgress,
  Alert,
  AlertTitle
} from "@mui/material";
import { Visibility, CheckCircle } from "@mui/icons-material";
import useGetUser from "../../../hooks/Token/useUser";
import { useParams } from "react-router-dom";

const EmployeeDocumentNotifications = () => {
  const { authToken } = useGetUser();
  const { organisationId } = useParams();
  const queryClient = useQueryClient(); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clear success message after 3 seconds
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Fetch documents sent to the logged-in employee
  const { 
    data: documentData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    ["employeeDocuments", organisationId],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs/employee-notifications`,
          {
            headers: { Authorization: authToken },
          }
        );
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { documents: [] };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken && !!organisationId,
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || "Error fetching documents");
      }
    }
  );

  // Mutation to acknowledge receipt of a document
  const acknowledgeDocument = useMutation(
    async (docId) => {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
        { docId, newStatus: "Received" },
        { headers: { Authorization: authToken } }
      );
      return res.data;
    },
    {
      onMutate: async (docId) => {
        // Optimistically update the UI
        await queryClient.cancelQueries(["employeeDocuments", organisationId]);
        
        const previousDocs = queryClient.getQueryData(["employeeDocuments", organisationId]);
        
        queryClient.setQueryData(["employeeDocuments", organisationId], (oldData) => {
          if (!oldData || !oldData.documents) return oldData;
          
          const updatedDocs = oldData.documents.map((doc) =>
            doc._id === docId ? { ...doc, docstatus: "Received" } : doc
          );
          return { ...oldData, documents: updatedDocs };
        });
        
        return { previousDocs };
      },
      onError: (error, docId, context) => {
        // Revert to previous state on error
        queryClient.setQueryData(["employeeDocuments", organisationId], context.previousDocs);
        setErrorMessage(error.response?.data?.message || "Error acknowledging document");
      },
      onSuccess: () => {
        setSuccessMessage("Document successfully acknowledged!");
        
        // Refetch to ensure data is up to date
        setTimeout(() => {
          refetch();
          // Also invalidate any related notification counts
          queryClient.invalidateQueries(["notificationCounts"]);
        }, 500);
      }
    }
  );

  // Handle document acknowledgment
  const handleAcknowledge = (docId) => {
    acknowledgeDocument.mutate(docId);
  };

  // Handle viewing a document
  const handleViewDocument = (url) => {
    if (url) window.open(url, "_blank");
    else setErrorMessage("Document URL is not available");
  };

  // Function to determine status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Send":
        return { 
          backgroundColor: "#e3f2fd", 
          color: "#1565c0",
          borderColor: "#90caf9" 
        };
      case "Received":
        return { 
          backgroundColor: "#e8f5e9", 
          color: "#2e7d32",
          borderColor: "#a5d6a7" 
        };
      default:
        return { 
          backgroundColor: "#f5f5f5", 
          color: "#616161",
          borderColor: "#e0e0e0" 
        };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error && !documentData) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.response?.data?.message || "An error occurred while fetching documents"}
        </Alert>
      </div>
    );
  }

  const documents = documentData?.documents || [];
  const hasUnacknowledgedDocuments = documents.some(doc => doc.docstatus === "Send");

  return (
    <div className="p-4">
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" className="mb-4" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      <div className="mb-6"> 
        <Typography variant="h5" component="h1" className="font-bold mb-2">
          Document Notifications
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View and acknowledge documents that have been sent to you
        </Typography>
      </div>

      {documents.length === 0 ? (
        <Paper className="p-6 text-center">
          <Typography variant="h6" color="textSecondary">
            No documents have been sent to you
          </Typography>
        </Paper>
      ) : (
        <>
          {hasUnacknowledgedDocuments && (
            <Alert severity="info" className="mb-4">
              <AlertTitle>Action Required</AlertTitle>
              You have documents that need to be acknowledged
            </Alert>
          )}
          
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {documents.map((document) => {
              const status = document.docstatus || "Unknown";
              const statusStyle = getStatusStyle(status);
              
              return (
                <Paper 
                  key={document._id} 
                  className="p-4 border rounded-md transition-shadow hover:shadow-md"
                  elevation={2}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Typography variant="h6" className="font-bold">
                      {document.letterType || document.title}
                    </Typography>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium border"
                      style={{ 
                        backgroundColor: statusStyle.backgroundColor,
                        color: statusStyle.color,
                        borderColor: statusStyle.borderColor
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  <div className="mt-3 space-y-1">
                    <Typography variant="body2">
                      <span className="font-medium">Type:</span> {document.type}
                    </Typography>
                    <Typography variant="body2">
                      <span className="font-medium">Date:</span> {formatDate(document.applicableDate)}
                    </Typography>
                    {document.description && (
                      <Typography variant="body2">
                        <span className="font-medium">Description:</span> {document.description}
                      </Typography>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Tooltip title="View Document">
                      <Button
                        startIcon={<Visibility />}
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleViewDocument(document.url)}
                      >
                        View
                      </Button>
                    </Tooltip>
                    
                    {document.docstatus === "Send" && (
                      <Tooltip title="Acknowledge Receipt">
                        <Button
                          startIcon={<CheckCircle />}
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAcknowledge(document._id)}
                        >
                          Acknowledge
                        </Button>
                      </Tooltip>
                    )}
                    
                    {/* {document.docstatus === "Received" && (
                      <Typography variant="caption" className="text-green-600 italic">
                        Acknowledged on {formatDate(document.updatedAt)}
                      </Typography>
                    )} */}
                  </div>
                </Paper>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDocumentNotifications;
