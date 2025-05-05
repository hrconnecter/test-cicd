/* eslint-disable no-unused-vars */
//working v2 with addition of employees
import React, { useState, useContext } from "react";
import { Search, RequestQuote, FilterList } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import ViewEmployeeRecord from "./components/ViewEmployeeRecord";
import UserProfile from "../../hooks/UserData/useUser";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import { UseContext } from "../../State/UseState/UseContext";
import useRecordHook from "../../hooks/record-hook/record-hook";

const DocManageToHr = () => {
  // User data and authentication
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organizationId = user.organizationId;
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // State for search, employee selection, and view mode
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("withDocuments"); // "withDocuments" or "allEmployees"

  // Get employees with documents using the existing hook
  const { getRecordOfEmployee } = useRecordHook();

  // Fetch all employees in the organization
  const { data: allEmployees, isLoading: isLoadingAllEmployees } = useQuery(
    ["allOrganizationEmployees", organizationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get-by-organization/${organizationId}`,
          {
            headers: { Authorization: authToken },
          }
        );

        // Check response structure and extract employee array
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          return response.data.data;
        } else if (
          response.data &&
          response.data.employees &&
          Array.isArray(response.data.employees)
        ) {
          return response.data.employees;
        } else {
          console.error("Unexpected response format:", response.data);
          return [];
        }
      } catch (error) {
        console.error("Error fetching all employees:", error);
        return [];
      }
    }
  );

  // Filter employees with documents based on search query
  const filteredEmployeesWithDocuments =
    getRecordOfEmployee && Array.isArray(getRecordOfEmployee)
      ? getRecordOfEmployee.filter(
          (employee) =>
            employee.employeeId?.organizationId === organizationId &&
            (employee.employeeId?.first_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              employee.employeeId?.last_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
      : [];

  // Filter all employees based on search query
  const filteredAllEmployees =
    allEmployees && Array.isArray(allEmployees)
      ? allEmployees.filter(
          (employee) =>
            employee?.first_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            employee?.last_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : [];

  // Handle employee selection
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Get the employee ID based on the view mode
  const employeeId =
    selectedEmployee &&
    (viewMode === "withDocuments"
      ? selectedEmployee?.employeeId?._id
      : selectedEmployee?._id);

  return (
    <Box>
      <BoxComponent>
        <section className="min-h-[90vh] flex">
          {/* Employee List Sidebar */}
          <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
            <div className="p-2 my-2 !py-2">
              {/* View Mode Toggle */}
              <div className="mb-3">
                {/* <Tabs
                  value={viewMode}
                  onChange={(e, newValue) => {
                    setViewMode(newValue);
                    setSelectedEmployee(null); // Clear selection when changing view
                  }}
                  variant="fullWidth"
                  // sx={{ mb: 2 }}
                  sx={{ 
                    mb: 2,
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1976d2',
                      height: 3,
                    },
                    '& .Mui-selected': {
                      color: '#1976d2',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderRadius: '4px 4px 0 0',
                    },
                  }}
                >
                  <Tooltip
                    title={
                      "Quick access to employees with existing documents - view, manage or add more documents"
                    }
                    arrow
                  >
                    <Tab
                      value="withDocuments"
                      label="With Documents"
                      // sx={{ fontSize: "0.75rem" }}
                      sx={{ 
                        fontSize: "0.75rem",
                        '&.Mui-selected': {
                          transition: 'all 0.2s ease',
                        }
                      }}
                    />
                  </Tooltip>

                  <Tooltip
                    title={
                      "Complete employee directory - find any employee to view their documents or upload new ones"
                    }
                    arrow
                  >
                    <Tab
                      value="allEmployees"
                      label="All Employees"
                      // sx={{ fontSize: "0.75rem" }}
                      sx={{ 
                        fontSize: "0.75rem",
                        '&.Mui-selected': {
                          transition: 'all 0.2s ease',
                        }
                      }}
                    />
                  </Tooltip>
                </Tabs> */}
                {/* <Tabs
  value={viewMode}
  onChange={(e, newValue) => {
    setViewMode(newValue);
    setSelectedEmployee(null); // Clear selection when changing view
  }}
  variant="fullWidth"
  sx={{ 
    mb: 2,
    '& .MuiTabs-indicator': {
      backgroundColor: '#1976d2', // Primary blue color for the indicator
      height: 3,
    },
    '& .Mui-selected': {
      color: '#1976d2', // Primary blue color for the text
      fontWeight: 'bold',
      backgroundColor: 'rgba(25, 118, 210, 0.08)', // Light blue background
    },
  }}
>
  <Tooltip
    title={
      "Quick access to employees with existing documents - view, manage or add more documents"
    }
    arrow
  >
    <Tab
      value="withDocuments"
      label="With Documents"
      sx={{ 
        fontSize: "0.75rem",
        '&.Mui-selected': {
          color: 'primary.main', // Using MUI's primary color
          transition: 'all 0.2s ease',
        }
      }}
    />
  </Tooltip>

  <Tooltip
    title={
      "Complete employee directory - find any employee to view their documents or upload new ones"
    }
    arrow
  >
    <Tab
      value="allEmployees"
      label="All Employees"
      sx={{ 
        fontSize: "0.75rem",
        '&.Mui-selected': {
          color: 'primary.main', // Using MUI's primary color
          transition: 'all 0.2s ease',
        }
      }}
    />
  </Tooltip>
</Tabs> */}
<Tabs
  value={viewMode}
  onChange={(e, newValue) => {
    setViewMode(newValue);
    setSelectedEmployee(null); // Clear selection when changing view
  }}
  variant="fullWidth"
  sx={{ 
    mb: 2,
    '& .MuiTabs-indicator': {
      backgroundColor: '#1976d2', // Primary blue color for the indicator
      height: 3,
    },
  }}
>
  <Tooltip
    title="Quick access to employees with existing documents - view, manage or add more documents"
    arrow
  >
    <Tab
      value="withDocuments"
      label="With Documents"
      sx={{ 
        fontSize: "0.75rem",
        color: viewMode === 'withDocuments' ? '#1976d2' : 'text.primary',
        fontWeight: viewMode === 'withDocuments' ? 'bold' : 'normal',
        backgroundColor: viewMode === 'withDocuments' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        borderRadius: 1,
        transition: 'all 0.2s ease',
      }}
    />
  </Tooltip>

  <Tooltip
    title="Complete employee directory - find any employee to view their documents or upload new ones"
    arrow
  >
    <Tab
      value="allEmployees"
      label="All Employees"
      sx={{ 
        fontSize: "0.75rem",
        color: viewMode === 'allEmployees' ? '#1976d2' : 'text.primary',
        fontWeight: viewMode === 'allEmployees' ? 'bold' : 'normal',
        backgroundColor: viewMode === 'allEmployees' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        borderRadius: 1,
        transition: 'all 0.2s ease',
      }}
    />
  </Tooltip>
</Tabs>

              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                  <Search className="text-gray-700 md:text-lg !text-[1em]" />
                  <input
                    type="text"
                    placeholder="Search Employee"
                    className="border-none bg-white w-full outline-none px-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Employee List - With Documents View */}
            {viewMode === "withDocuments" && (
              <>
                {filteredEmployeesWithDocuments.length > 0 ? (
                  <div>
                    {filteredEmployeesWithDocuments.map((employee) => (
                      <div
                        className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 cursor-pointer ${
                          employee?.employeeId?._id === employeeId &&
                          "bg-blue-500 text-white hover:!bg-blue-300"
                        }`}
                        key={employee?.employeeId?._id}
                        onClick={() => handleEmployeeClick(employee)}
                      >
                        <Avatar src={employee?.avatarSrc} />
                        <div>
                          <h1 className="text-[1.2rem]">
                            {employee?.employeeId?.first_name}{" "}
                            {employee?.employeeId?.last_name}
                          </h1>
                          <h1 className="text-sm text-gray-500">
                            {employee.employeeId?.email}
                          </h1>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No employees with documents found
                  </div>
                )}
              </>
            )}

            {/* Employee List - All Employees View */}
            {viewMode === "allEmployees" && (
              <>
                {isLoadingAllEmployees ? (
                  <div className="flex justify-center items-center h-20">
                    <CircularProgress size={24} />
                  </div>
                ) : filteredAllEmployees.length > 0 ? (
                  <div>
                    {filteredAllEmployees.map((employee) => (
                      <div
                        className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 cursor-pointer ${
                          employee?._id === employeeId &&
                          "bg-blue-500 text-white hover:!bg-blue-300"
                        }`}
                        key={employee?._id}
                        onClick={() => handleEmployeeClick(employee)}
                      >
                        <Avatar src={employee?.profileImage} />
                        <div>
                          <h1 className="text-[1.2rem]">
                            {employee?.first_name} {employee?.last_name}
                          </h1>
                          <h1 className="text-sm text-gray-500">
                            {employee?.email}
                          </h1>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No employees found
                  </div>
                )}
              </>
            )}
          </article>

          {/* Document Management Section */}
          <div className="w-[80%]">
            {selectedEmployee ? (
              <ViewEmployeeRecord employeeId={employeeId} />
            ) : (
              <div className="p-4 space-y-1 flex items-center gap-3">
                <Avatar className="text-white !bg-blue-500">
                  <RequestQuote />
                </Avatar>
                <div>
                  <h1 className="text-xl">Employee Records </h1>
                  <p className="text-sm">
                    {viewMode === "withDocuments"
                      ? "Select an employee from the list to view or manage their documents"
                      : "Select an employee to view or upload documents for them"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </BoxComponent>
    </Box>
  );
};

export default DocManageToHr;
