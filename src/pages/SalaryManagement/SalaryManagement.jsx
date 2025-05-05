/* eslint-disable no-unused-vars */
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  // Tooltip,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MdOutlineCalculate } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import CreateSalaryModel from "../../components/Modal/CreateSalaryModel/CreateSalaryModel";
import DeleteSalaryModal from "../../components/Modal/CreateSalaryModel/DeleteSalaryModal";
import useDebounce from "../../hooks/QueryHook/Training/hook/useDebounce";
import ChallanModal from "./components/ChallanModal";
import Select from "react-select";

import SwapVertIcon from "@mui/icons-material/SwapVert";

const SalaryManagement = () => {
  const navigate = useNavigate();
  // state

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { organisationId } = useParams();
  const [incomeValues, setIncomeValues] = useState([]);
  const [fixedValues, setFixedValues] = useState([]);
  const [deductionsValues, setDeductionsValues] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const debouncedNameSearch = useDebounce(nameSearch, 500); // Debounce with a 500ms delay
  const debouncedDeptSearch = useDebounce(deptSearch, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);
  const [status, setStatus] = useState({ value: "false", label: "Active" });
  // const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState(""); // 'name' or 'location'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  // get query for fetch the employee
  const { data, isLoading, isFetching } = useQuery(
    [
      "availableEmployee",
      organisationId,
      debouncedNameSearch,
      debouncedDeptSearch,
      debouncedLocationSearch,
      sortBy,
      sortOrder,
      status,
      currentPage,
    ],
    async () => {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${currentPage}&nameSearch=${debouncedNameSearch}&deptSearch=${debouncedDeptSearch}&locationSearch=${debouncedLocationSearch}&sortBy=${sortBy}&sortOrder=${sortOrder}&isOffboarded=${status.value}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    },
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data) {
      setAvailableEmployee(data.employees);
      setTotalPages(data.totalPages || 1);
    }
  }, [data]);

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

  // modal for create salary
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const handleCreateModalOpen = (id) => {
    setCreateModalOpen(true);
    setEmployeeId(id);
  };

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

  const handleCalculateSalary = (id) => {
    console.log("aaaaaa", id);
    navigate(`/organisation/${organisationId}/salary-calculate/${id}`);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setEmployeeId(null);
    setIncomeValues([]);
    setDeductionsValues([]);
  };

  // modal for delete salary component
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = (id) => {
    setDeleteModalOpen(true);
    setEmployeeId(id);
  };
  const handlDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setEmployeeId(null);
  };

  const [openChallanModal, setOpenChallanModal] = useState(false);
  const handleChallanModalClose = () => {
    setOpenChallanModal(false);
  };
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(id); // Store the clicked employee ID
  };

  const handleCloseIcon = () => {
    setAnchorEl(null);
    setSelectedEmployeeId(null); // Clear the selected employee ID
  };

  //total income
  const empId = selectedEmployeeId;
  const { data: salaryComponent } = useQuery(
    ["salary-component", empId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${empId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  const income = salaryComponent?.income?.reduce((a, c) => {
    return a + (parseInt(c.value) || 0);
  }, 0);

  return (
    <>
      <BoxComponent>
        <Box className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Salary Management"}
            info={" Create and calculate the salary of your employee here"}
          />

          {isLoading ||
            (isFetching && (
              <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
                <CircularProgress />
              </div>
            ))}

          {/* <Button
            onClick={() => setOpenChallanModal(true)}
            variant="contained"
          >
            Generate Challan
          </Button> */}
          <BasicButton
            title={"Generate Challan"}
            onClick={() => setOpenChallanModal(true)}
          />
          <ChallanModal
            open={openChallanModal}
            handleClose={handleChallanModalClose}
            id={organisationId}
          />
        </Box>

        <div className=" flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300 mb-2">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <TextField
              onChange={(e) => handleSearchChange("name", e.target.value)}
              placeholder="Search Employee"
              variant="outlined"
              size="small"
              sx={{ width: 300, bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <TextField
              onChange={(e) => handleSearchChange("department", e.target.value)}
              placeholder="Search Department"
              variant="outlined"
              size="small"
              sx={{ width: 300, bgcolor: "white" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <TextField
              onChange={(e) => handleSearchChange("location", e.target.value)}
              placeholder="Search Location"
              variant="outlined"
              size="small"
              sx={{ width: 300, bgcolor: "white" }}
            />
          </div>
          
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
        </div>

        <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
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
                  Name
                  {sortBy === "first_name" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                {/* <th scope="col" className="!text-left pl-8 py-3">
                  Last Name
                </th> */}
                <th
                  scope="col"
                  className="!text-left pl-8 py-3"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortBy === "email" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3"
                  onClick={() => handleSort("empId")}
                >
                  Employee Id
                  {sortBy === "empId" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th
                  scope="col"
                  className="!text-left pl-8 py-3"
                  onClick={() => handleSort("location")}
                >
                  Location
                  {sortBy === "location" &&
                    (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)}
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Department
                </th>
                <th scope="col" className="!text-left pl-8 py-3">
                  Salary Template
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableEmployee.length > 0 &&
                availableEmployee?.map((item, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3">{id + 1}</td>
                    <td className="py-3 pl-8">
                      {item?.first_name} {item?.last_name}
                    </td>
                    <td className="py-3 pl-8">{item?.email}</td>
                    <td className="py-3 pl-8">{item?.empId}</td>
                    <td className="py-3 pl-8">
                      {item?.worklocation?.map((location, index) => (
                        <span key={index}>{location?.city}</span>
                      ))}
                    </td>
                    <td className="py-3 pl-9">
                      {item?.deptname?.map((dept, index) => {
                        return <span key={index}>{dept?.departmentName}</span>;
                      })}
                    </td>
                    <td className="py-3 pl-9">{item?.salarystructure?.name}</td>
                    {/* <td className="py-3 pl-4">
                        <button
                          type="submit"
                          onClick={() => handleCreateModalOpen(item._id)}
                          className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                        >
                          Manage Salary
                        </button>
                      </td> */}
                    {/* <td className="py-3 pl-4">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleDeleteModalOpen(item._id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </td> */}
                    <td className="!text-left pl-8 py-3">
                      <IconButton onClick={(e) => handleClick(e, item?._id)}>
                        <MoreVert className="cursor-pointer" />
                      </IconButton>
                      <Menu
                        elevation={2}
                        onClose={handleCloseIcon}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                      >
                        {/* <Tooltip title="Manage Salary"> */}
                        <MenuItem
                          onClick={() => {
                            handleCloseIcon(); // Close the menu after the selection
                            handleCreateModalOpen(selectedEmployeeId); // Pass the selected employee ID
                          }}
                        >
                          <TbMoneybag
                            color="primary"
                            aria-label="Manage Salary"
                            style={{
                              color: "grey",
                              marginRight: "10px",
                            }}
                          />
                          Manage Salary
                        </MenuItem>
                        {/* </Tooltip> */}
                        {income > 0 ? (
                          // <Tooltip title="Calculate Salary">
                          <MenuItem
                            onClick={() => {
                              handleCloseIcon();
                              handleCalculateSalary(selectedEmployeeId);
                            }}
                          >
                            <MdOutlineCalculate
                              color="primary"
                              aria-label="Calculate Salary"
                              style={{
                                color: "grey",
                                marginRight: "10px",
                              }}
                            />
                            Calculate Salary
                          </MenuItem>
                        ) : // </Tooltip>
                        null}
                        {/* <Tooltip title="Delete"> */}
                        <MenuItem
                          onClick={() => {
                            handleCloseIcon(); // Close the menu after the selection
                            handleDeleteModalOpen(selectedEmployeeId); // Pass the selected employee ID
                          }}
                        >
                          <DeleteOutlineIcon
                            color="primary"
                            aria-label="Delete"
                            style={{
                              color: "#f50057",
                              marginRight: "10px",
                            }}
                          />
                          Delete
                        </MenuItem>
                        {/* </Tooltip> */}
                      </Menu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Pagination */}
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
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Stack>
        </div>

        {/* for create the salary modal */}
        <CreateSalaryModel
          id={organisationId}
          open={createModalOpen}
          handleClose={handleClose}
          empId={employeeId}
          incomeValues={incomeValues}
          setIncomeValues={setIncomeValues}
          fixedValues={fixedValues}
          setFixedValues={setFixedValues}
          deductionsValues={deductionsValues}
          setDeductionsValues={setDeductionsValues}
        />

        {/* delete salary modal */}
        <DeleteSalaryModal
          id={organisationId}
          open={deleteModalOpen}
          handleClose={handlDeleteModalClose}
          empId={employeeId}
        />
      </BoxComponent>
    </>
  );
};

export default SalaryManagement;
