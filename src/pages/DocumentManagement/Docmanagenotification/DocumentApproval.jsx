/* eslint-disable no-unused-vars */


//above update
import React, { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Avatar, IconButton, Box, Tabs, Tab, CircularProgress } from "@mui/material"; 
import { useParams } from "react-router-dom";
import { Visibility, Info, Search } from "@mui/icons-material";
import useAuthToken from "../../../hooks/Token/useAuth";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const DocumentApproval = () => { 
  const queryClient = useQueryClient();
  const authToken = useAuthToken();
  const { organisationId } = useParams();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("documentRequests");
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fetch employees whose documents are pending approval by the logged-in manager
  // const { data: employeeData, error: employeeError, refetch: refetchEmployees } = useQuery(
  //   ["employeesForManager", organisationId],
  //   async () => {
  //     try {
  //       const res = await axios.get(`${process.env.REACT_APP_API}/route/org/getdocs/manageraprove`, {
  //         headers: { Authorization: authToken },
  //       });
        
  //       // Handle case where API returns documents but no employees
  //       if (res.data.documents && (!res.data.employees || res.data.employees.length === 0)) {
  //         // Create a placeholder employee to display documents
  //         return {
  //           employees: [{ 
  //             _id: "documents-only", 
  //             name: "Pending Documents", 
  //             email: "No employee information available" 
  //           }],
  //           documentsOnly: res.data.documents // Store documents separately
  //         };
  //       }
        
  //       return res.data;
  //     } catch (error) {
  //       // If 404 error (no documents found), return empty array but don't set error message
  //       if (error.response?.status === 404) {
  //         return { employees: [], documents: [] };
  //       }
  //       throw error;
  //     }
  //   },
  //   {
  //     enabled: !!authToken && !!organisationId, // Fetch only if authToken & organisationId exist
  //     onError: (error) => {
  //       // Only set error message for non-404 errors
  //       if (error.response?.status !== 404) {
  //         setErrorMessage(error.response?.data?.message || "Error fetching employee data");
  //       }
  //     }
  //   }
  // );

  //ap
  // Fetch employees whose documents are pending approval OR have archived documents
const { data: employeeData, error: employeeError, refetch: refetchEmployees } = useQuery(
  ["employeesForManager", organisationId],
  async () => {
    try {
      // Use a modified endpoint that returns all employees with any documents
      const res = await axios.get(`${process.env.REACT_APP_API}/route/org/getdocs/manageraprove/all`, {
        headers: { Authorization: authToken },
      });
      
      // Handle case where API returns documents but no employees
      if (res.data.documents && (!res.data.employees || res.data.employees.length === 0)) {
        // Create a placeholder employee to display documents
        return {
          employees: [{ 
            _id: "documents-only", 
            name: "Pending Documents", 
            email: "No employee information available" 
          }],
          documentsOnly: res.data.documents // Store documents separately
        };
      }
      
      return res.data;
    } catch (error) {
      // If 404 error (no documents found), return empty array but don't set error message
      if (error.response?.status === 404) {
        return { employees: [], documents: [] };
      }
      throw error;
    }
  },
  {
    enabled: !!authToken && !!organisationId, // Fetch only if authToken & organisationId exist
    onError: (error) => {
      // Only set error message for non-404 errors
      if (error.response?.status !== 404) {
        setErrorMessage(error.response?.data?.message || "Error fetching employee data");
      }
    }
  }
);


  // Mutation to update notification count
  const updateNotificationCount = useMutation(
    ({ employeeId }) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/org/getdocs/manageraprove/updatenotification/${employeeId}`,
        { notificationCount: 0 },
        { headers: { Authorization: authToken } }
      ),
    {
      onSuccess: () => {
        // Refetch the document notifications after updating notification count
        queryClient.invalidateQueries("employeesForManager");
        queryClient.invalidateQueries("employeesForManagerCount");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
        setErrorMessage(error.response?.data?.message || "Error updating notification count");
      },
    }
  );

  // Get particular employee documents for Document Requests tab
  const { data: employeeDocuments, isLoading: empDataLoading } = useQuery({
    queryKey: ["employeeDocuments", selectedEmployeeId, "requests"],
    queryFn: async () => {
      try {
        if (!selectedEmployeeId) return { documents: [] };
        if (selectedEmployeeId === "documents-only") {
          return { documents: employeeData?.documentsOnly || [] };
        }
        
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs/employee/${selectedEmployeeId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching employee documents:", error);
        if (error.response?.status === 404) { 
          return { documents: [] };
        }
        throw error;
      }
    },
    enabled: Boolean(selectedEmployeeId) && activeTab === "documentRequests",
  });

  // Get particular employee archived documents for Archive tab
  const { data: archivedDocuments, isLoading: archiveLoading } = useQuery({
    queryKey: ["employeeDocuments", selectedEmployeeId, "archived"],
    queryFn: async () => {
      try {
        if (!selectedEmployeeId) return { documents: [] };
        if (selectedEmployeeId === "documents-only") {
          return { documents: [] };
        }
        
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs/employee/${selectedEmployeeId}/archived`,
          {
            headers: { Authorization: authToken },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching archived documents:", error);
        if (error.response?.status === 404) {
          return { documents: [] };
        }
        throw error;
      }
    },
    enabled: Boolean(selectedEmployeeId) && activeTab === "archive",
  });

  // Function to handle employee click and set employeeId
  const handleEmployeeClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    // Reset notification count when employee is clicked
    if (employeeId !== "documents-only") {
      updateNotificationCount.mutate({ employeeId });
    }
  };

  // Handle employee search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filter employees based on search
  // const filteredEmployees = useMemo(() => {
  //   if (!employeeData?.employees) return [];
    
  //   return employeeData.employees.filter(
  //     (employee) =>
  //       employee?.name?.toLowerCase().includes(searchTerm) ||
  //       employee?.email?.toLowerCase().includes(searchTerm)
  //   );
  // }, [employeeData, searchTerm]);

  //ap
  // Filter employees based on search
const filteredEmployees = useMemo(() => {
  if (!employeeData?.employees) return [];
  
  // First filter by search term
  const filtered = employeeData.employees.filter(
    (employee) =>
      employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Then sort: employees with pending documents first, then by name
  return filtered.sort((a, b) => {
    // Check if employee has pending documents (notificationCount > 0)
    if (a.notificationCount > 0 && b.notificationCount === 0) {
      return -1; // a comes before b
    }
    if (a.notificationCount === 0 && b.notificationCount > 0) {
      return 1; // b comes before a
    }
    
    // If both have same notification status, sort alphabetically by name
    const nameA = a.first_name ? `${a.first_name} ${a.last_name || ''}` : a.name || '';
    const nameB = b.first_name ? `${b.first_name} ${b.last_name || ''}` : b.name || '';
    return nameA.localeCompare(nameB);
  });
}, [employeeData, searchTerm]);


  // Mutation to update document status (approve/reject)
  const updateDocumentStatus = useMutation(
    async ({ docId, status }) => {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/adddocuments/updatedocstatus`,
        { docId, newStatus: status },
        { headers: { Authorization: authToken } }
      );
      return res.data;
    },
    {
      onSuccess: (data, variables) => {
        // Show success message based on the action
        const action = variables.status === "Accepted" ? "approved" : "rejected";
        setSuccessMessage(`Document successfully ${action}!`);
        
        // Refetch data after a short delay to ensure backend has updated
        setTimeout(() => {
          queryClient.invalidateQueries(["employeeDocuments", selectedEmployeeId, "requests"]);
          queryClient.invalidateQueries(["employeeDocuments", selectedEmployeeId, "archived"]);
          queryClient.invalidateQueries(["employeesForManager"]);
          queryClient.invalidateQueries(["employeesForManagerCount"]);
        }, 500);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || "Error updating document status");
      }
    }
  );

  // Mutation to send document to employee
  const sendToEmployee = useMutation(
    async ({ docId }) => {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        { docstatus: "Send" },
        { headers: { Authorization: authToken } }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        setSuccessMessage("Document successfully sent to employee!");
        
        // Refetch data after a short delay
        setTimeout(() => {
          queryClient.invalidateQueries(["employeeDocuments", selectedEmployeeId, "requests"]);
          queryClient.invalidateQueries(["employeeDocuments", selectedEmployeeId, "archived"]);
          queryClient.invalidateQueries(["employeesForManager"]);
        }, 500);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.message || "Error sending document to employee");
      }
    }
  );

  // Handle document approval/rejection
  const handleDocumentAction = (docId, status) => {
    updateDocumentStatus.mutate({ docId, status });
  };

  // Handle sending document to employee
  const handleSendToEmployee = (docId) => {
    sendToEmployee.mutate({ docId });
  };

  // Function to get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Send":
        return "bg-blue-100 text-blue-800";
      case "Received":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Determine if we're loading based on the active tab
  const isLoading = activeTab === "documentRequests" ? empDataLoading : archiveLoading;
  
  // Determine which documents to display based on the active tab
  const documentsToDisplay = activeTab === "documentRequests" 
    ? employeeDocuments?.documents || []
    : archivedDocuments?.documents || [];

  return (
    <Box>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
          <button 
            className="float-right font-bold"
            onClick={() => setSuccessMessage("")}
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
          <button 
            className="float-right font-bold"
            onClick={() => setErrorMessage("")}
          >
            &times;
          </button>
        </div>
      )}
      
      <section className="min-h-[90vh] flex">
        {/* Employee List Sidebar */}
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2">
            <div className="space-y-2">
              <div className="flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  className="border-none bg-white w-full outline-none px-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          
          {filteredEmployees.length === 0 ? (
            <div className="px-6 my-1 mx-3 py-2">
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            filteredEmployees.map((employee, idx) => (
              employee !== null && (
                <div
                  onClick={() => handleEmployeeClick(employee._id)}
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-blue-500 hover:text-white
                  ${employee._id === selectedEmployeeId ? "bg-gray-50 text-black" : ""}`}
                  key={idx}
                >
                  <Avatar />
                  <div>
                    {/* <h1 className="md:text-[1.2rem] text-sm">{employee.name}</h1> */}
                    {employee.first_name ? `${employee.first_name} ${employee.last_name || ''}` : employee.name || 'Unknown Name'}
                    <h1 className="md:text-sm text-xs text-gray-500">{employee.email}</h1>


                    {/* {employee.notificationCount > 0 && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        {employee.notificationCount}
                      </span>
                    )} */}
                  </div>
                </div>
              )
            ))
          )}
        </article>

        {/* Document Approval Content */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Document Approval"}
              info={"Approve or reject documents submitted by employees"}
            />
          </div>

          <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
            <Tab label="Document Requests" value="documentRequests" />
            <Tab label="Archive" value="archive" />
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center h-full py-8">
              <CircularProgress />
            </div>
          ) : !selectedEmployeeId ? (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their documents
              </h1>
            </div>
                  ) : documentsToDisplay.length === 0 ? (
                    <div className="flex px-4 w-full items-center my-4">
                      <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                        <Info /> 
                        {activeTab === "documentRequests" 
                          ? "No pending document requests found for this employee" 
                          : "No archived documents found for this employee"}
                      </h1>
                    </div>
                  ) : (
                    <div>
                      {activeTab === "documentRequests" && (
                        documentsToDisplay.map((document, index) => (
                          <div key={index} className="p-4 border m-4 rounded-md bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                              <h2 className="text-xl font-bold">{document.letterType || document.title}</h2>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(document.docstatus)}`}>
                                {document.docstatus}
                              </span>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-sm"><span className="font-medium">Type:</span> {document.type}</p>
                              <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(document.applicableDate)}</p>
                              {document.updatedAt && (
                                <p className="text-sm"><span className="font-medium">Last Updated:</span> {formatDate(document.updatedAt)}</p>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              <span className="text-sm">View Letter:</span>
                              <IconButton
                                onClick={() => window.open(document.url, "_blank")}
                                color="primary"
                                aria-label="View letter"
                              >
                                <Visibility />
                              </IconButton>
                            </div>
                            
                            {document.docstatus === "Pending" && (
                              <div className="flex gap-4 mt-2">
                                <button
                                  onClick={() => handleDocumentAction(document._id, "Accepted")}
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDocumentAction(document._id, "Rejected")}
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            
                            {document.docstatus === "Accepted" && (
                              <div className="flex gap-4 mt-2">
                                <button
                                  onClick={() => handleSendToEmployee(document._id)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                  Send to Employee
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
        
                      {activeTab === "archive" && (
                        documentsToDisplay.map((document, index) => (
                          <div key={index} className="p-4 border m-4 rounded-md bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                              <h2 className="text-xl font-bold">{document.letterType || document.title}</h2>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(document.docstatus)}`}>
                                {document.docstatus}
                              </span>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-sm"><span className="font-medium">Type:</span> {document.type}</p>
                              <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(document.applicableDate)}</p>
                              {document.updatedAt && (
                                <p className="text-sm"><span className="font-medium">Last Updated:</span> {formatDate(document.updatedAt)}</p>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              <span className="text-sm">View Letter:</span>
                              <IconButton
                                onClick={() => window.open(document.url, "_blank")}
                                color="primary"
                                aria-label="View letter"
                              >
                                <Visibility />
                              </IconButton>
                            </div>
                            
                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <p className="text-sm text-gray-600">
                                {document.docstatus === "Rejected" && (
                                  <span>This document was rejected on {formatDate(document.updatedAt || document.applicableDate)}.</span>
                                )}
                                {document.docstatus === "Send" && (
                                  <span>This document was sent to employee on {formatDate(document.updatedAt || document.applicableDate)}.</span>
                                )}
                                {document.docstatus === "Received" && (
                                  <span>Employee acknowledged receipt on {formatDate(document.updatedAt || document.applicableDate)}.</span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </article>
              </section>
            </Box>
          );
        };
        
        export default DocumentApproval;
        
