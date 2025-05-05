import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CSVLink } from "react-csv";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Card from "../peformance/components/Card";

import { Person, PersonOff } from "@mui/icons-material";
import { LuUpload } from "react-icons/lu";
import Select from "react-select";
import ReusableModal from "../../components/Modal/component"; // Import ReusableModal
import useDebounce from "../../hooks/QueryHook/Training/hook/useDebounce";
import UserProfile from "../../hooks/UserData/useUser";
import OffboardModal from "./OffboardModal"; // Import the new modal component

const EmployeeListToRole = ({ organisationId }) => {
  const csvTemplateData = [
    { empId: "", first_name: "", last_name: "", email: "", password: "" },
  ];

  const csvHeaders = [
    { label: "empId", key: "empId" },
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
    { label: "password", key: "password" },
    { label: "date_of_birth", key: "date_of_birth" },
    { label: "phone_number", key: "phone_number" },
    { label: "address", key: "address" },
    { label: "gender", key: "gender" },
    { label: "adhar_card_number", key: "adhar_card_number" },
    { label: "pan_card_number", key: "pan_card_number" },
    { label: "bank_account_no", key: "bank_account_no" },
    { label: "citizenship", key: "citizenship" },
  ];
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const orgId = useParams().organisationId;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);
  const [availableEmployee1, setAvailableEmployee1] = useState([]);
  const [org, setOrg] = useState();
  //  const [ setMembers] = useState();
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [excelConfirmation, setExcelConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedNameSearch = useDebounce(nameSearch, 500); // Debounce with a 500ms delay
  const debouncedDeptSearch = useDebounce(deptSearch, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);
  const [sortBy, setSortBy] = useState(""); // 'name' or 'location'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false); // State for Offboard modal
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee
  const [status, setStatus] = useState({ value: "false", label: "Active" });
  // const [viewQuestions, setViewQuestions] = useState([]); // State for viewing questions
  const [isVisible, setIsVisible] = useState(true); // State for visibility
  const [reOnboardConfirmation, setReOnboardConfirmation] = useState(null); // State for re-onboard confirmation

  const [employeeNames, setEmployeeNames] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null); // State for selected department
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      setOrg(resp.data.organizations);
    })();
  }, [orgId]);

  useEffect(() => {
    if (availableEmployee1.length > 0) {
      const names = [
        ...new Set(availableEmployee1.map((emp) => emp.first_name)),
      ];
      // const depts = [
      //   ...new Set(
      //     availableEmployee1.map((emp) => emp.department).filter(Boolean)
      //   ),
      // ]; // Filter out undefined
      // const locs = [
      //   ...new Set(
      //     availableEmployee1.map((emp) => emp.location).filter(Boolean)
      //   ),
      // ]; // Filter out undefined

      setEmployeeNames(names);
    } 
  }, [availableEmployee1]);

  const { data: departmentData, isLoading: isDepartmentsLoading } = useQuery(
    ["departments", orgId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${orgId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.departments.map((dept) => ({
        label: dept.departmentName,
        value: dept._id,
      }));
    },
    {
      enabled: !!orgId, // Only fetch if orgId is available
    }
  );

  const { data: locationData, isLoading: isLocationsLoading } = useQuery(
    ["locations", orgId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${orgId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response.data.locationsData.map((loc) => ({
          label: loc.shortName,
          value: loc._id,
        }));
      
    },
    {
      enabled: !!orgId, // Only fetch if orgId is available
    }
  );

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
    setDeptSearch(selectedOption ? selectedOption.value : ""); // Update search query
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    setLocationSearch(selectedOption ? selectedOption.value : ""); // Update search query
  };

  // useEffect(() => {
  //   (async () => {
  //     const resp = await axios.get(
  //       `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
  //     );
  //     // setMembers(resp.data.members);
  //   })();
  // }, [orgId]);

  const fetchAvailableEmployee = useCallback(
    async (organisationId, authToken, page) => {
      try {
        setIsLoading(true);
        const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${debouncedNameSearch}&deptSearch=${debouncedDeptSearch}&locationSearch=${debouncedLocationSearch}&sortBy=${sortBy}&sortOrder=${sortOrder}&isOffboarded=${status.value}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: authToken,
          },
        });
        setAvailableEmployee1(response.data.employees);
        console.log("totalemployees", response.data.totalEmployees);
        setTotalPages(response.data.totalPages);
        setTotalEmployees(response.data.totalEmployees);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      debouncedNameSearch,
      debouncedDeptSearch,
      debouncedLocationSearch,
      sortBy,
      sortOrder,
      status.value,
    ]
  );

  useEffect(() => {
    fetchAvailableEmployee(organisationId, authToken, currentPage);
  }, [currentPage, organisationId, authToken, fetchAvailableEmployee]);

  // Use React Query to fetch employee data
  useQuery(
    [
      "employees",
      organisationId,
      currentPage,
      debouncedNameSearch,
      debouncedDeptSearch,
      debouncedLocationSearch,
    ],
    () => fetchAvailableEmployee(organisationId, authToken, currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      // Set new sort field and default to ascending order
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  //   // Handle search input changes
  const handleSearchChange = (field, value) => {
    setCurrentPage(1); // Reset to the first page when search changes
    if (field === "name") {
      setNameSearch(value);
    } else if (field === "department") {
      setDeptSearch(value);
    } else if (field === "location") {
      setLocationSearch(value);
    }
  };

  // const totalPages = data?.totalPages || 1;
  // const availableEmployee1 = data?.employees || [];

  // to navigate to other component
  const handleEditClick = (empId) => {
    navigate(`/organisation/${organisationId}/edit-employee/${empId}`);
  };

  const handleAddEmployee = () => {
    navigate(`/organisation/${organisationId}/employee-onboarding`);
  };

  // const handleDeleteConfirmation = (id) => {
  //   setDeleteConfirmation(id);
  // };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/employee/delete/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employees");
        handleAlert(true, "success", "Employee deleted succesfully");
      },
    }
  );

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    queryClient.invalidateQueries("employee");
    setDeleteConfirmation(null);
  };

  const handleExcelConfirmation = () => {
    setExcelConfirmation();
  };

  const handleExcelCloseConfirmation = () => {
    setExcelConfirmation(null);
  };
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "No file selected",
      });
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only Excel or CSV files are allowed",
      });
      return;
    }

    setUploadedFileName(selectedFile.name);
    setFile(selectedFile);
    console.log(`🚀 ~ selectedFile:`, selectedFile);
  };

  const handleSubmit = async () => {
    // Check if file is selected
    if (!file) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "No file selected",
      });
      return;
    }

    console.log("File:", file);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Set column widths (optional)
        worksheet["!cols"] = [
          { wch: 30 },
          { wch: 40 },
          { wch: 30 },
          { wch: 30 },
          { wch: 30 },
        ];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        console.log("JSON Data:", jsonData);

        // Process data for final upload
        const finalData = jsonData.map((data) => {
          const isoDate = convertToISOFormat(data.date_of_birth);
          console.log(
            "Original Date:",
            data.date_of_birth,
            "Converted ISO Date:",
            isoDate
          );

          return {
            empId: data.empId,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            organizationId: orgId, // Assuming orgId is globally available
            date_of_birth: isoDate,
            phone_number: data.phone_number,
            address: data.address,
            gender: data.gender,
            adhar_card_number: data.adhar_card_number,
            pan_card_number: data.pan_card_number,
            bank_account_no: data.bank_account_no,
            citizenship: data.citizenship,
          };
        });

        console.log("Final Data:", finalData);

        setIsLoading(true);
        const validEmployees = [];

        // Validate employee data before submission
        for (const employee of finalData) {
          if (!employee.empId || !employee.first_name || !employee.last_name) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: `Employee data is incomplete. Missing required fields for employee ${employee.empId}.`,
            });
            continue; // Skip invalid employee data
          }

          // Add valid employee data
          validEmployees.push(employee);
        }

        // If no valid employees, stop the process
        if (validEmployees.length === 0) {
          setAppAlert({
            alert: true,
            type: "warning",
            msg: "No valid employees to submit.",
          });
          setIsLoading(false);
          return;
        }

        // Proceed with the API call
        if (validEmployees.length > 0 && validEmployees.length <= 50) {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API}/route/employee/add-employee-excel`, // Adjusted endpoint
              validEmployees,
              {
                headers: {
                  Authorization: authToken, // Assuming authToken is available globally
                },
              }
            );
            console.log(`${response.data.message}`);

            setIsLoading(false);
            handleExcelCloseConfirmation(); // Assuming this function exists to close the modal

            // Initial onboarding success message
            setAppAlert({
              alert: true,
              type: "success",
              msg: "Onboarding Process Completed",
            });

            // Delay for the next message (e.g., 2 seconds)
            setTimeout(() => {
              setAppAlert({
                alert: true,
                type: "success",
                msg: `${response.data.errors}`, // Show the errors message
              });

              // Further delay before showing the final success message (e.g., 2 seconds)
              setTimeout(() => {
                setAppAlert({
                  alert: true,
                  type: "success",
                  msg: `${response.data.message} $`, // Final success message
                });
              }, 2000); // 2000ms (2 seconds) delay before showing the last alert
            }, 2000); // 2000ms (2 seconds) delay before showing the second alert
          } catch (error) {
            setIsLoading(false);
            console.error("Error posting employees:", error);
            setAppAlert({
              alert: true,
              type: "error",
              msg:
                error.response?.data?.message ||
                "An error occurred while posting employees.",
            });
          }
        } else {
          setAppAlert({
            alert: true,
            type: "warning",
            msg: "Only 50 employees can be onboarded at a time, or no valid employees to submit.",
          });
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error processing file:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error processing the file. Please check the file format.",
        });
      } finally {
        // Clear file input after processing
        fileInputRef.current.value = null;
      }
    };

    // Start reading the file
    reader.readAsBinaryString(file);
  };

  // Function to convert Excel serial date to ISO format
  const convertExcelSerialDateToISO = (serialDate) => {
    // Excel uses a base date of December 30, 1899
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
    // Excel serial dates count days from this base date
    const date = new Date(
      excelBaseDate.getTime() + serialDate * 24 * 60 * 60 * 1000
    );
    // Ensure that the date is in the correct format without time component
    return date.toISOString().split("T")[0];
  };

  // Function to convert date to ISO format
  const convertToISOFormat = (dateStr) => {
    if (!dateStr) return null; // Return null if the date is empty
    if (!isNaN(dateStr)) {
      return convertExcelSerialDateToISO(Number(dateStr));
    }

    const dateStrString = String(dateStr).trim();
    const match = dateStrString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const [, month, day, year] = match.map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return date.toISOString().split("T")[0];
    } else {
      console.error("Invalid date format:", dateStr);
      return null; // Or handle with alert if needed
    }
  };

  //   useEffect(() => {
  //   fetchAvailableEmployee(organisationId, authToken, currentPage);
  // }, [currentPage, debouncedNameSearch, debouncedDeptSearch, debouncedLocationSearch, organisationId, authToken]);

  // Example validation functions (uncomment if needed)
  // const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
  // const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

  const handleOffboardClick = (employee) => {
    setSelectedEmployee(employee);
    setIsOffboardModalOpen(true);
  };

  const handleOffboardModalClose = () => {
    setIsOffboardModalOpen(false);

    setSelectedEmployee(null);
  };

  const handleViewClick = (employee) => {
    navigate(`/organisation/${organisationId}/view-exit-interview/${employee._id}`);
  };

  const handleReOnboardConfirmation = (employee) => {
    setSelectedEmployee(employee);
    setReOnboardConfirmation(employee._id);
  };

  const handleReOnboard = async (id) => {

    navigate(`/organisation/${organisationId}/edit-employee/${id}`);


    // try {
    //   await axios.post(
    //     `${process.env.REACT_APP_API}/route/setup/setEmployeeOffboarded/${id}`,
    //     { isOffboarded: false, question: [] },
    //     {
    //       headers: {
    //         Authorization: authToken,
    //       },
    //     }
    //   );
    //   queryClient.invalidateQueries("employees");
    //   // handleAlert(true, "success", "Employee re-onboarded successfully");
    // } catch (error) {
    //   console.error("Error re-onboarding employee:", error);
    //   handleAlert(true, "error", "Server error, please try later");
    // } finally {
    //   setReOnboardConfirmation(null);
    // }
  };

  return (
    <>
      <BoxComponent>
        {isLoading && (
          <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
            <CircularProgress />
          </div>
        )}

        <HeadingOneLineInfo
          heading="Employees"
          info={
            role === "Employee" ||
            role === "Department-Admin" ||
            role === "Delegate-Department-Admin" ||
            role === "Accountant" ||
            role === "Delegate-Accountant" ||
            role === "Manager" ||
            role === "Teacher"
              ? "Here you can see employee list"
              : // : "Select and Manage Your Employee list"
                "Select and manage your employee list here"
          }
        />
        {role === "Employee" ||
        role === "Department-Admin" ||
        role === "Delegate-Department-Admin" ||
        role === "Accountant" ||
        role === "Delegate-Accountant" ||
        role === "Manager" ||
        role === "Teacher" ? null : (
          <div className="flex gap-8">
            <Card title={"Onboarding Limit"} data={org?.memberCount} />
            <Card title={"Current Employee"} data={totalEmployees} />
            <Card title={"Vacancy"} data={org?.memberCount - totalEmployees} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 my-4">
          <Autocomplete
            freeSolo
            options={employeeNames}
            onInputChange={(event, newValue) =>
              handleSearchChange("name", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Employee"
                variant="outlined"
                size="small"
                sx={{ bgcolor: "white", width: "200px" }}
              />
            )}
          />
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            options={departmentData}
            isClearable
            placeholder="Select Department"
            isLoading={isDepartmentsLoading} // Show loading state
            styles={{
              container: (provided) => ({ ...provided, width: "200px" }),
            }}
          />
          <Select
            value={selectedLocation}
            onChange={handleLocationChange}
            options={locationData}
            isClearable
            placeholder="Select Location"
            isLoading={isLocationsLoading} // Show loading state
            styles={{
              container: (provided) => ({ ...provided, width: "200px" }),
            }}
          />
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: false, label: "Active" },
              { value: true, label: "Offboard" },
            ]}
            styles={{
              container: (provided) => ({ ...provided, width: "200px" }),
            }}
          />
          {role !== "Super-Admin" &&
          role !== "HR" &&
          role !== "Delegate-Super-Admin" 
          ? null : (
            <div className="flex items-end gap-2">
              <BasicButton
                title={"Excel Onboarding"}
                onClick={handleExcelConfirmation}
                color={"success"}
              />
              <BasicButton title={"Add Employee"} onClick={handleAddEmployee} />
            </div>
          )}
        </div>

        <Box>
          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            {isLoading && (
              <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
                <CircularProgress />
              </div>
            )}
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th
                    scope="col"
                    className="!text-left pl-8 py-3"
                    onClick={() => handleSort("first_name")}
                  >
                    First Name
                    {sortBy === "first_name" &&
                      (sortOrder === "asc" ? (
                        <SwapVertIcon />
                      ) : (
                        <SwapVertIcon />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="!text-left pl-8 py-3"
                    onClick={() => handleSort("last_name")}
                  >
                    Last Name
                    {sortBy === "last_name" &&
                      (sortOrder === "asc" ? (
                        <SwapVertIcon />
                      ) : (
                        <SwapVertIcon />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="!text-left pl-8 py-3"
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortBy === "email" &&
                      (sortOrder === "asc" ? (
                        <SwapVertIcon />
                      ) : (
                        <SwapVertIcon />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="!text-left pl-8 py-3"
                    onClick={() => handleSort("empId")}
                  >
                    Employee Id
                    {sortBy === "empId" &&
                      (sortOrder === "asc" ? (
                        <SwapVertIcon />
                      ) : (
                        <SwapVertIcon />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="!text-left pl-8 py-3"
                    onClick={() => handleSort("location")}
                  >
                    Location
                    {sortBy === "location" &&
                      (sortOrder === "asc" ? (
                        <SwapVertIcon />
                      ) : (
                        <SwapVertIcon />
                      ))}
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>

                  {role !== "Super-Admin" &&
          role !== "HR" &&
          role !== "Delegate-Super-Admin" ? null : (
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {availableEmployee1.length > 0 &&
                  availableEmployee1.map((item, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">{id + 1}</td>
                      <td className="py-3 pl-8">{item?.first_name}</td>
                      <td className="py-3 pl-8">{item?.last_name}</td>
                      <td className="py-3 pl-8">{item?.email}</td>
                      <td className="py-3 pl-8">{item?.empId}</td>
                      <td className="py-3 pl-8">
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location?.shortName}</span>
                        ))}
                      </td>
                      <td className="py-1 pl-8 ">
                        {item?.deptname?.map((dept, index) => (
                          <span key={index}>{dept?.departmentName}</span>
                        ))}
                      </td>
                      {role !== "Super-Admin" &&
          role !== "HR" &&
          role !== "Delegate-Super-Admin"  ? null : (
                        <td className="whitespace-nowrap px-6 py-1">
                          {item.isOffboarded ? (
                            <>
                              <IconButton
                                color="primary"
                                aria-label="view"
                                onClick={() => {
                                  handleViewClick(item);
                                  setIsVisible(false); // Toggle visibility state
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                color="primary"
                                aria-label="reonboard"
                                onClick={() =>
                                  handleReOnboardConfirmation(item)
                                }
                              >
                                <Person color="primary" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                color="primary"
                                aria-label="edit"
                                onClick={() => {
                                  handleEditClick(item._id);
                                  handleOffboardClick();
                                }}
                              >
                                <EditOutlinedIcon />
                              </IconButton>

                              <IconButton
                                color="error"
                                aria-label="offboard"
                                onClick={() => {
                                  handleOffboardClick(item);
                                  setIsVisible(true); // Toggle visibil
                                }}
                              >
                                <PersonOff color="error" />
                              </IconButton>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
            >
              <div>
                <Typography variant="body2">
                  Showing page {currentPage} of {totalPages} pages
                </Typography>
              </div>

              <Pagination
                count={totalPages}
                page={currentPage}
                color="primary"
                shape="rounded"
                siblingCount={0}
                boundaryCount={0}
                hidePrevButton={currentPage === 1}
                hideNextButton={currentPage === totalPages}
                onChange={(event, value) => setCurrentPage(value)}
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
          </div>
        </Box>
      </BoxComponent>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be undone.
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

      {/* excel */}

      <Dialog
        open={excelConfirmation !== null}
        onClose={handleExcelCloseConfirmation}
      >
        <DialogContent>
          <h1 className="text-[1.5rem]  text-gray-700   font-semibold  tracking-tight">
            Excel Onboarding
          </h1>
          <p className="text-gray-500  leading-tight tracking-tight ">
            You can onboard employees efficiently by downloading the template,
            filling in the employee data, and uploading the completed Excel
            sheet below.
          </p>

          <br />
          {/* <Typography variant="p" sx={{ fontWeight: "600", mb: 2 }}>
            Upload Excel file to generate employee
          </Typography> */}

          {/* Input field directly visible for file upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "20px",
              width: "100%",
              boxSizing: "border-box",
              display: "none", // Hide the file input
            }}
          />
          {/* CSV Download Button */}
          <div className="pb-5-">
            <CSVLink
              data={csvTemplateData}
              headers={csvHeaders}
              filename="employee_onboard_template.csv"
              style={{ textDecoration: "underline", margin: "10px 0" }}
            >
              Click to Download CSV Template
            </CSVLink>
          </div>

          <div className={`space-y-1  `}>
            <label className={`font-semibold text-gray-500 text-md`}>
              {" "}
              Upload Excel file to generate employee
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              className={`outline-none cursor-pointer border-gray-200 border-[.5px]
            } flex  rounded-md items-center justify-center px-2  gap-4  bg-white py-2`}
            >
              <LuUpload className="text-xl text-gray-600" />
              <h1 className="text-lg text-gray-600">
                Click to upload the file
              </h1>
            </div>
          </div>

          {/* Show uploaded file name */}
          {uploadedFileName && (
            <Typography className="text-center text-sm text-gray-600">
              Uploaded File: {uploadedFileName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <BasicButton
            onClick={handleExcelCloseConfirmation}
            variant="outline"
            color="danger"
            title="Cancel"
          />
          <BasicButton
            title={"Submit"}
            color={"primary"}
            onClick={handleSubmit}
          />
        </DialogActions>
      </Dialog>

      <ReusableModal
        open={reOnboardConfirmation !== null}
        onClose={() => setReOnboardConfirmation(null)}
        heading="Confirm Re-Onboarding"
      >
        <p>
          Are you sure you want to re-onboard this employee? This action will
          set the employee's status to active.
        </p>
        <div className="flex justify-end mt-4 space-x-4">
          <Button
            onClick={() => setReOnboardConfirmation(null)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              
               handleReOnboard(reOnboardConfirmation)
            }}
            color="primary"
          >
            Confirm
          </Button>
        </div>
      </ReusableModal>

      {/* Offboard Modal */}
      <OffboardModal
        open={isOffboardModalOpen}
        onClose={handleOffboardModalClose}
        employee={selectedEmployee}
        isVisible={isVisible} // Pass the visibility state
      />
    </>
  );
};

export default EmployeeListToRole; 
 