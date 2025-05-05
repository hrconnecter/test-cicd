/* eslint-disable no-unused-vars */
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  // Pagination,
  // PaginationItem,
  // Stack, // Importing TablePagination for paging
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useEmployeeStore from "./useEmployeeStore";
import {  useNavigate, useParams } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
 
const DataTable = ({setOption ,onSelectEmployee }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(""); // setSelectedOrganizationId state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [data1, setData1] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [managerArray, setManagerArray] = useState([]);
  const [initialEmployeeData, setInitialEmployeeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [documents, setDocuments] = useState([]);
  // const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedMDocId, setSelectedMDocId] = useState("");
  const [managerIds, setManagerIds] = useState([]);
  const [showManagerSelect, setShowManagerSelect] = useState(false); // State to track checkbox status
  const { setAppAlert } = useContext(UseContext);
  const organisationId = useParams().organisationId; // Get organisationId from URL params
  const { useGetCurrentRole } = UserProfile();
  const navigate = useNavigate();
  const role = useGetCurrentRole();

  const authToken = useGetUser().authToken;
  const {
    savedEmployees,
    savedManagers,
    addEmployee,
    removeEmployee,
     clearEmployees,
  } = useEmployeeStore();

  // Pagination state
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page (5 employees per page)

  useEffect(() => {
    console.log(selectedEmployeeIds);
    console.log(managerIds);
    // eslint-disable-next-line
  }, [selectedEmployeeIds]);

  console.log("useEmployeeStore", useEmployeeStore());

  const handleSaveEmployee = async () => {
    if (selectedEmployeeIds.length === 0) {
      setAppAlert({
        alert: true,
        type: "warning",
        msg: "No employee selected to save.",
      });
      return;
    }

    const selectedEmployeeId = selectedEmployeeIds[0];
    try {
      const managerIdResponse = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getManager/${selectedEmployeeId}`,
        {
          headers: { Authorization: authToken },
        }
      );

      const managerId = managerIdResponse.data.id;

      // Find employee details
      const employee = employeeData?.find((emp) => emp._id === selectedEmployeeId);

      // Add to Zustand store
      clearEmployees(); // Ensure only one employee exists in the store
      addEmployee(employee, managerId);
     
      // navigate(`/organisation/${organisationId}/org/docs/auth/hr`);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Employee Saved Successfully!",
      });
//sat v2
      if (onSelectEmployee) {
        onSelectEmployee(selectedEmployeeId);
      }
    
        // Call setOption("") to navigate back
        setOption("");   

    } catch (error) {
      console.error("Error fetching manager data:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to save employee. Try again.",
      });
    }
  };
    // // Add a function to handle employee selection
    // const handleSelectEmployee = (employeeId) => {
    //   if (onSelectEmployee) {
    //     onSelectEmployee(employeeId);
    //   }
    // };

  const handleEmployeeSelection = async (event, id) => {
    // Check if the current employee is already selected
    const isCurrentlySelected = selectedEmployeeIds.indexOf(id) !== -1;

    if (isCurrentlySelected) {
      // Deselecting the employee
      setSelectedEmployeeIds([]); // Clear the selection
      setManagerIds([]); // Clear the manager IDs
       removeEmployee(id); // Remove from Zustand store
      clearEmployees();
    } else {
      // Select only one employee
      setSelectedEmployeeIds([id]); // Set the new selection to this employee
      try {
        // Fetch manager ID for the selected employee
        const managerIdResponse = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getManager/${id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        // Now we define managerId from the response
        const managerId = managerIdResponse.data.id;
        console.log("✅ Manager ID for selected employee:", managerId);

        // Update manager IDs with the selected employee's manager
        setManagerIds([managerId]);

        // Handle employee selection in your Zustand store
        const employee = employeeData.find((emp) => emp._id === id);
        addEmployee(employee, [managerId]); // Pass the employee and manager ID to the store
      } catch (error) {
        console.error("Error fetching manager for employee", id, error);
      }
    }
  };
  const isSelected = (id) => selectedEmployeeIds.indexOf(id) !== -1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (role === "HR") {
          response = await axios.get(
            `${process.env.REACT_APP_API}/route/organization/getOneOrgHr`,
            {
              headers: { Authorization: authToken },
            }
          );
          setData1(response.data.orgData);
          setSelectedOrganizationId(response.data.orgData._id);
          return response;
        }
        response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/getall`,
          {
            headers: { Authorization: authToken },
          }
        );
        setData1(response.data.orgData);
      } catch (error) {
        console.error("Error fetching organizations: ", error);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [authToken]);

  // console.log("this is the data1", data1);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getmanagers`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("manager", resp.data.filteredManagers);
      setManagerArray(resp.data.filteredManagers);
    })();
    // eslint-disable-next-line
  }, []);

  const fetchEmployees = async (orgId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/letters1/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setEmployeeData(response.data.employees);
      setInitialEmployeeData(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  const fetchDepartments = async (orgId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/getall/${orgId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      setDepartments(response.data.getOrgs);
      console.log("Department List: ", response.data.getOrgs);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  useEffect(() => {
    if (organisationId) {
      setSelectedOrganizationId(organisationId); // Set the selected organization to the organisationId from URL
      fetchEmployees(organisationId);
      fetchDepartments(organisationId);
    }
    // eslint-disable-next-line
  }, [organisationId, authToken]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/org/getdocs`,
          {
            headers: { Authorization: authToken },
          }
        );
        setDocuments(response.data.doc);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, [authToken]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredEmployees = initialEmployeeData?.filter((employee) => {
      return (
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query)
      );
    });
    setEmployeeData(filteredEmployees);
  };

  const handleDepartmentChange = (event) => {
    const deptId = event?.target?.value;
    setSelectedDepartmentId(deptId);
    const filteredEmployees = initialEmployeeData?.filter((employee) => {
      return employee?.deptname?.[0] === deptId;
    });
    setEmployeeData(filteredEmployees);
  };

  const handleDocumentChange2 = (event) => {
    const mDocId = event?.target?.value;
    setSelectedMDocId(mDocId);
    console.log("Selected MDocument ID:", mDocId);
    setEmployeeData(managerArray[mDocId].reporteeIds);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated employees
  const paginatedEmployees = employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    // <BoxComponent>
    // <HeadingOneLineInfo heading={" Select Employee From List"} />
    // <div style={{ padding: "10px", backgroundColor: "#f4f6f9" }}>
    <div style={{ padding: "10px" }}>
    {/* Heading Section */}
    {/* <Box mb={3}>
      <Typography
        variant="h5"
        color="primary"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
          letterSpacing: "1px",
        }}
      >
        Select Employee From List
      </Typography>
    </Box> */}
  
    {/* Filter Section */}
    <Box mb={3}>
      {/* <Card sx={{ padding: "20px",  borderRadius: "12px" }}> */}
        <Grid container spacing={2} alignItems="center" >
          {/* Downcast Checkbox */}
          <Grid item >
            <FormControl size="small"  style={{ width: 220 } }>
              <FormControlLabel
                className="!text-xs"
                control={
                  <Checkbox
                    checked={showManagerSelect}
                    onChange={() => setShowManagerSelect(!showManagerSelect)}
                    color="primary"
                  />
                }
                label="Select Manager"
              />
            </FormControl>
          </Grid>
  
          {/* Select Department */}
          <Grid item>
            <FormControl size="small" style={{ width: 220 }}>
              <InputLabel id="department-label">Select Department</InputLabel>
              <Select
                label="Select department"
                name="type"
                onChange={handleDepartmentChange}
                value={selectedDepartmentId}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3f51b5',
                  },
                }}
              >
                {departments?.length === 0 ? (
                  <MenuItem value="">No Departments Found</MenuItem>
                ) : (
                  departments?.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept?.departmentName}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
  
          {/* Search Employee */}
          <Grid item>
            <TextField
              label="Search Employee"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: 220 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: "#ffffff",
                },
                '& .MuiInputLabel-root': {
                  color: '#3f51b5',
                },
              }}
            />
          </Grid>
  
          {/* Select Manager (only if showManagerSelect is true) */}
          {showManagerSelect && (
            <Grid item>
              <FormControl size="small" style={{ width: 220 }}>
                <InputLabel id="document-label">Select Manager</InputLabel>
                <Select
                  label="Select Manager"
                  name="document"
                  onChange={handleDocumentChange2}
                  value={selectedMDocId}
                  sx={{
                    borderRadius: "8px", 
                    backgroundColor: "#ffffff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ccc',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3f51b5',
                    },
                  }}
                >
                  {managerArray?.map((doc, idx) => (
                    <MenuItem key={doc._id} value={idx}>
                      {doc.managerId?.first_name &&
                        doc.managerId?.last_name &&
                        `${doc.managerId?.first_name} ${doc.managerId?.last_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      {/* </Card> */}
    </Box>
  
    {/* Table Section */}
    <Box sx={{ width: "100%", overflowY: "auto", maxHeight: "450px" }}>
      {paginatedEmployees?.length === 0 ? (
        <p className="text-center font-semibold">No employees available</p>
      ) : (
        <Card sx={{ boxShadow: 6 }}>
          <TableContainer>
            <Table className="min-w-full bg-white  text-left !text-sm font-light">
              <TableHead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell className="!font-semibold">Sr.No</TableCell>
                  <TableCell className="!font-semibold">First Name</TableCell>
                  <TableCell className="!font-semibold">Last Name</TableCell>
                  <TableCell className="!font-semibold">Email</TableCell>
                  <TableCell className="!font-semibold">Employee Id</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees?.map((employee, idx) => {
                  const isItemSelected = isSelected(employee._id);
                  return (
                    <TableRow
                      key={employee._id}
                      hover
                      onClick={(event) =>
                        handleEmployeeSelection(event, employee._id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          disabled={selectedEmployeeIds?.length > 0 && !isItemSelected}
                        />
                      </TableCell>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{employee?.first_name}</TableCell>
                      <TableCell>{employee?.last_name}</TableCell>
                      <TableCell>{employee?.email}</TableCell>
                      <TableCell>{employee?.empId}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  
    {/* Pagination Controls */}
    {employeeData?.length > 0 && (
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={employeeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    )}


{/* Pagination Controls */}
{/* {employeeData?.length > 0 && (
  <Stack
    direction={"row"}
    className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
  >
    <div>
      <Typography variant="body2">
        Showing page {page} of {Math.ceil(employeeData.length / rowsPerPage)} pages
      </Typography>
    </div>

    <Pagination
      count={Math.ceil(employeeData.length / rowsPerPage)}
      page={page}
      color="primary"
      shape="rounded"
      siblingCount={0}
      boundaryCount={0}
      hidePrevButton={page === 1}
      hideNextButton={page === Math.ceil(employeeData.length / rowsPerPage)}
      onChange={(event, value) => handleChangePage(event, value)}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          components={{
            previous: ArrowBackIcon,
            next: ArrowForwardIcon,
          }}
        />
      )}
    />
  </Stack>
)} */}


    {/* Save Button */}
    {employeeData?.length > 0 && (
      <div className="flex justify-center pt-1">
        <button
          className="px-10 py-1 rounded-lg shadow-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transform transition-all duration-200 hover:scale-105"
          onClick={handleSaveEmployee}
        >
          Save
        </button>
      </div>
    )}
  </div>
  
    // </BoxComponent>
  );
};

export default DataTable;




