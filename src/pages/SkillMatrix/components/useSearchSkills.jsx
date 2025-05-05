import { useState, useContext, useCallback } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import useDebounce from "../../../hooks/QueryHook/Training/hook/useDebounce"; // Ensure this path is correct

const useSearchSkills = (organisationId) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // Search states
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  
  // Debounced search values
  const debouncedNameSearch = useDebounce(nameSearch, 500);
  const debouncedDeptSearch = useDebounce(deptSearch, 500);
  const debouncedLocationSearch = useDebounce(locationSearch, 500);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Skills and employees state
  const [skills, setSkills] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  // Fetch employees with search functionality
  const fetchAvailableEmployees = useCallback(async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${currentPage}&nameSearch=${debouncedNameSearch}&deptSearch=${debouncedDeptSearch}&locationSearch=${debouncedLocationSearch}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });

      setAvailableEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
      
      return response.data.employees;
    } catch (error) {
      console.error("Error fetching employee data:", error);
      return [];
    }
  }, [
    organisationId, 
    authToken, 
    currentPage, 
    debouncedNameSearch, 
    debouncedDeptSearch, 
    debouncedLocationSearch
  ]);

  // Handle search input changes
  const handleSearchChange = (field, value) => {
    setCurrentPage(1); // Reset to the first page when search changes
    switch(field) {
      case "name":
        setNameSearch(value);
        break;
      case "department":
        setDeptSearch(value);
        break;
      case "location":
        setLocationSearch(value);
        break;
      default:
        break;
    }
  };

  // Function to add new skills
  const addSkills = (newSkills) => {
    setSkills((prevSkills) => [...prevSkills, ...newSkills]);
  };

  // Function to clear skills (e.g., after submission)
  const clearSkills = () => {
    setSkills([]);
  };

  return { 
    skills, 
    addSkills, 
    clearSkills, 
    availableEmployees,
    fetchAvailableEmployees,
    handleSearchChange,
    nameSearch,
    locationSearch,
    deptSearch,
    currentPage,
    setCurrentPage,
    totalPages
  };
};

export default useSearchSkills;
