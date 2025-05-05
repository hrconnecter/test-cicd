/* eslint-disable no-unused-vars */

import React, { useState, useCallback, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";

// Material-UI Icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import StarIcon from "@mui/icons-material/Star";
import { Tooltip } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Box,
  Button,
  Grid,
  Typography,
  Slider,
  TextField,
  Pagination,
} from "@mui/material";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// Context
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

// Custom Hook
import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#4f46e5" },
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "2px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1000,
    position: "absolute",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }),
};

const Reports = () => {
  // Context hooks
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // URL Params
  const { organisationId } = useParams();

  // Local state for filters
  const [skill, setSkill] = useState("");
  const [rating, setRating] = useState([0, 5]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingRange, setRatingRange] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // New state for analysis type
  const [analysisType, setAnalysisType] = useState("default");
  const [reportType, setReportType] = useState(null);
  const pageSize = 10;

  // Enhanced filters state
  const [filters, setFilters] = useState({
    department: "",
    setDepartment: "",
    dateRange: "30",
    location: "",
    search: "",
    categories: [],
    experienceLevels: [],
    certifications: false,
    activeProjects: false,
    mentorship: false,
  });

  // Use custom filter hook
  const {
    department: initialDepartment,
    setDepartment: setInitialDepartment,
    manager,
    setManager,
    locations,
    setLocations,
    Departmentoptions,
    managerOptions,
    locationOptions,
  } = useSkillMatrixFilter(organisationId);

  const [department, setDepartment] = useState({
    id: initialDepartment || "",
    name:
      Departmentoptions?.find((opt) => opt.value === initialDepartment)
        ?.label || "",
  });

  // Fetch skills data query
  const fetchSkillsData = useCallback(async () => {
    const currentReportType = reportType || "skillProficiency";

    // Parse rating range into min and max
    let minRating, maxRating;
    if (ratingRange) {
      const [min, max] = ratingRange.split("-");
      minRating = parseFloat(min);
      maxRating = parseFloat(max);
    }

    try {
      console.log("Fetching skills data with filters:", {
        reportType: currentReportType,
        skillName: skill,
        departmentId: department.id,
        managerId: manager,
        // city: locations,
        workLocationId: locations,
        ratingRange: ratingRange,
        analysisType: analysisType,
        page: currentPage,
        pageSize,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assessments/${organisationId}/generateSkillReports`,
        {
          headers: { Authorization: authToken },
          params: {
            reportType: currentReportType,
            analysisType,
            skillName: skill || undefined,
            // departmentId: department || undefined,
            departmentId: department.id || undefined, // Use department.id
            managerId: manager || undefined,
            workLocationId: locations || undefined,
            ratingRange: ratingRange || undefined,
            minRating: minRating || undefined,
            maxRating: maxRating || undefined,
            page: currentPage,
            pageSize,
            dateRange: "30days", // Optional, can be dynamic
          },
        }
      );

      console.log("Skill data response:", response.data);

      // ✅ Transform data if needed for skill gap analysis
      if (currentReportType === "skillGapAnalysis") {
        response.data.data = response.data.data.map((item) => ({
          ...item,
          employeesWithGap:
            item.gapCount || item.employeesWithGap || item.totalEmployees,
        }));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching skills data:", error);
      handleAlert(false, "error", "Failed to fetch skills data");
      throw error;
    }
  }, [
    reportType,
    skill,
    // filters,
    // department,
    department.id,
    manager,
    ratingRange,
    locations,
    currentPage,
    analysisType,
    organisationId,
    authToken,
    handleAlert,
  ]);

  // Use React Query for data fetching
  const { data, isLoading, error, refetch } = useQuery(
    [
      "reportsData",
      reportType,
      skill,
      // department,
      department.id,
      manager,
      locations,
      ratingRange,
      currentPage,
      analysisType,
    ],
    fetchSkillsData,
    {
      keepPreviousData: true,
      retry: 1,
      onError: (error) => {
        console.error("Query error:", error);
        handleAlert(false, "error", error.message || "An error occurred");
      },
    }
  );

  // Rating range label helper
  const getRatingRangeLabel = (range) => {
    switch (range) {
      case "0-2":
        return "Beginner (0-2)";
      case "2-4":
        return "Intermediate (2-4)";
      case "4-5":
        return "Expert (4-5)";
      default:
        return "";
    }
  };

  // Reset handler
  const handleReset = () => {
    setSkill("");
    setDepartment("");
    setManager("");
    setLocations("");
    setRatingRange(null);
    setAnalysisType("default");
    setCurrentPage(1);
    refetch();
  };

//   const handleExport = () => {
//     if (!data) {
//       handleAlert(false, "warning", "No data available");
//       return;
//     }

//     if (!data.success) {
//       handleAlert(false, "warning", "Data fetch was unsuccessful");
//       return;
//     }

//     if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (dataToConvert) => {
//       // Add a check here as well
//       if (!dataToConvert || !Array.isArray(dataToConvert)) {
//         console.error("Invalid data for CSV conversion", dataToConvert);
//         return "Error: Invalid data";
//       }

//       // Professional Report Header
//       const reportHeader = [
//         "AEGIS SKILL MATRIX REPORT",
//         `Generated on: ${new Date().toLocaleString()}`,
//         "-----------------------------------------------------------",
//       ];

//       // Detailed Filter Information
//       const filterDetails = [
//         "REPORT CONFIGURATION:",
//         `• Report Type       : ${
//           reportType === "skillProficiency"
//             ? "Skill Proficiency Overview"
//             : reportType === "topRatedSkills"
//             ? "Top Rated Skills Analysis"
//             : reportType === "skillGapAnalysis"
//             ? "Skill Competency Gap Report"
//             : "Location-based Skill Distribution"
//         }`,
//         `• Analysis Approach : ${
//           analysisType === "default"
//             ? "Comprehensive Skill Assessment"
//             : analysisType === "topSkills"
//             ? "Top Performing Skills Highlight"
//             : analysisType === "skillGap"
//             ? "Skill Competency Gap Analysis"
//             : "Organizational Skill Group Evaluation"
//         }`,
//         "-----------------------------------------------------------",
//         "APPLIED FILTERS:",
//         `• Department        : ${department.name || "All Departments"}`,
//         `• Manager           : ${
//           manager
//             ? managerOptions?.find((opt) => opt.value === manager)?.label
//             : "Not Specified"
//         }`,
//         `• Location          : ${
//           locations
//             ? locationOptions?.find((opt) => opt.value === locations)?.label
//             : "All Locations"
//         }`,
//         `• Skill Rating      : ${
//           ratingRange ? getRatingRangeLabel(ratingRange) : "Full Range"
//         }`,
//         `• Skill Search      : ${skill || "No Specific Skill"}`,
//         "-----------------------------------------------------------",
//         "SKILL PERFORMANCE DATA:",
//         "",
//       ];

//       // Professional Data Headers
//       const headers = [
//         "Skill Name",
//         "Avg Skill Rating",
//         "Department",
//         " Employees ",
//         "Performance Trend",
//       ];

//       // Enhanced Data Rows
//       // const csvRows = dataToConvert.map((item) => [
//       //   item.skillName || "N/A",
//       //   `${item.averageRating?.toFixed(2) || "N/A"}/5.00`,
//       //   // item.department || "Unassigned",
//       //   item.totalEmployees || item.totalPractitioners || "N/A",
//       //   item.averageRating > 3
//       //     ? "Excellent Performance"
//       //     : item.averageRating > 2
//       //     ? "Moderate Performance"
//       //     : "Needs Improvement",
//       // ]);
//       // Enhance the csvRows mapping to include all selected data
// const csvRows = dataToConvert
// .filter(item => selectedSkills.length === 0 || selectedSkills.includes(item.skillName))
// .map((item) => [
//   item.skillName || "N/A",
//   `${item.averageRating?.toFixed(2) || "N/A"}/5.00`,
//   item.department || "Unassigned", // Add department back in
//   item.totalEmployees || item.totalPractitioners || item.employeesWithGap || "N/A", // Handle all employee count cases
//   item.averageRating > 3
//     ? "Excellent Performance"
//     : item.averageRating > 2
//     ? "Moderate Performance" 
//     : "Needs Improvement",
// ]);


//       // Combine all sections
//       return [
//         ...reportHeader,
//         ...filterDetails,
//         headers.join("\t"), // Use tab for better readability
//         ...csvRows.map((row) => row.join("\t")),
//       ].join("\n");
//     };

//     try {
//       const csvData = convertToCSV(data.data);
//       const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `AEGIS_SkillMatrix_Report_${new Date()
//           .toISOString()
//           .replace(/:/g, "-")}.csv`
//       );
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       handleAlert(true, "success", " Skill Report Generated");
//     } catch (error) {
//       console.error("Export error:", error);
//       handleAlert(false, "error", "Failed to generate report");
//     }
//   };

const handleExport = () => {
  if (!data?.data?.length) {
    handleAlert(false, "warning", "No data to export");
    return;
  }

  const convertToCSV = (dataToConvert) => {
    // Title Section
    const title = [
      ['AEGIS SKILL MATRIX REPORT'],
      [''],
      [`Report Generated: ${new Date().toLocaleString()}`],
      ['']
    ];

    // Report Configuration
    const configuration = [
      ['REPORT CONFIGURATION'],
      ['Category', 'Details', 'Description'],
      ['Report Type', reportType === "skillProficiency" ? "Skill Proficiency Overview" : 
                     reportType === "topRatedSkills" ? "Top Rated Skills Analysis" : 
                     reportType === "skillGapAnalysis" ? "Skill Gap Analysis" : 
                     "Location Skill Distribution", ''],
      ['Analysis Type', analysisType === "default" ? "Comprehensive Assessment" :
                       analysisType === "topSkills" ? "Top Skills Focus" :
                       analysisType === "skillGap" ? "Gap Analysis" :
                       "Group Evaluation", ''],
      ['']
    ];

    // Filter Information
    const filters = [
      ['APPLIED FILTERS'],
      ['Filter Type', 'Selected Value', 'Notes'],
      ['Department', department.name || "All Departments", ''],
      ['Manager', manager ? managerOptions?.find(opt => opt.value === manager)?.label : "Not Specified", ''],
      ['Location', locations ? locationOptions?.find(opt => opt.value === locations)?.label : "All Locations", ''],
      ['Skill Rating', ratingRange ? getRatingRangeLabel(ratingRange) : "Full Range", ''],
      ['Skill Search', skill || "No Specific Skill", ''],
      ['']
    ];

    // Data Headers
    const headers = [
      ['SKILL MATRIX DATA'],
      [''],
      ['Skill Name', 'Rating (out of 5)', 'Department', 'Employee Count', 'Performance Level', 'Trend Analysis', 'Additional Notes']
    ];

    // Format Data Rows
    const dataRows = dataToConvert
      .filter(item => selectedSkills.length === 0 || selectedSkills.includes(item.skillName))
      .map(item => [
        item.skillName,
        `${item.averageRating?.toFixed(2)}/5.00`,
        item.department || "Unassigned",
        reportType === "skillGapAnalysis" 
          ? item.employeesWithGap || item.gapCount || "0"
          : item.totalEmployees || item.totalPractitioners || "0",
        item.averageRating > 4 ? "Outstanding" :
        item.averageRating > 3 ? "Excellent" :
        item.averageRating > 2 ? "Satisfactory" :
        "Needs Development",
        item.averageRating > 3 ? "↑ Positive Growth" :
        item.averageRating < 2 ? "↓ Requires Attention" :
        "→ Stable Performance",
        reportType === "skillGapAnalysis" ? "Gap Analysis Focus" : "Standard Assessment"
      ]);

    // Summary Section
    const summary = [
      [''],
      ['REPORT SUMMARY'],
      [`Total Skills Analyzed: ${dataRows.length}`],
      [`Selected Skills: ${selectedSkills.length}`],
      [`Report Generated By: AEGIS System`],
      [`Generation Date: ${new Date().toLocaleString()}`]
    ];

    // Combine all sections
    const allRows = [
      ...title,
      ...configuration,
      ...filters,
      ...headers,
      ...dataRows,
      ...summary
    ];

    // Convert to CSV format
    return allRows.map(row => 
      row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(',')
    ).join('\n');
  };

  try {
    const csvContent = convertToCSV(data.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AEGIS_SkillMatrix_Report_${new Date().toISOString().replace(/:/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleAlert(true, "success", "Skill Report Generated Successfully");
  } catch (error) {
    console.error("Export error:", error);
    handleAlert(false, "error", "Failed to generate report");
  }
};

// Add select all checkbox handler
const handleSelectAll = (checked) => {
  setSelectedSkills(checked ? data.data.map(item => item.skillName) : []);
};

// Individual checkbox handler
const handleSelectSkill = (skillName, checked) => {
  setSelectedSkills(prev => 
    checked 
      ? [...prev, skillName]
      : prev.filter(name => name !== skillName)
  );
};
  // Trend icon renderer
  const renderTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUpwardIcon className="w-5 h-5 text-green-500" />;
      case "down":
        return <ArrowDownwardIcon className="w-5 h-5 text-red-500" />;
      case "stable":
        return <RemoveIcon className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  // Add a function to generate a meaningful one-liner based on the current filters and report type
  const generateInsightSummary = () => {
    // Base summary based on report type
    const reportTypeSummaries = {
      skillProficiency:
        "Comprehensive overview of skill proficiency across the organization",
      topRatedSkills:
        "Highlighting the most exceptional skills in our talent pool",
      skillGapAnalysis:
        "Identifying critical skill gaps and development opportunities",
      locationWiseSkillDistribution:
        "Exploring skill distribution across different locations",
    };

    // Enhance with filter context
    const filterAddOns = [];

    if (department.id) {
      filterAddOns.push(`focused on ${department.name} department`);
    }

    if (manager) {
      const managerName = managerOptions?.find(
        (opt) => opt.value === manager
      )?.label;
      filterAddOns.push(`under ${managerName}'s leadership`);
    }

    if (locations) {
      const locationName = locationOptions?.find(
        (opt) => opt.value === locations
      )?.label;
      filterAddOns.push(`in ${locationName}`);
    }

    if (ratingRange) {
      const ratingLabel = getRatingRangeLabel(ratingRange);
      filterAddOns.push(`focusing on ${ratingLabel} skill levels`);
    }

    const baseSummary =
      reportTypeSummaries[reportType] || "Detailed skill matrix insights";

    return `${baseSummary} ${
      filterAddOns.length > 0 ? `- ${filterAddOns.join(", ")}` : ""
    }`;
  };

  // Enhanced trend description function
  const renderTrendDescription = (averageRating) => {
    if (averageRating > 4) {
      return {
        icon: "up",
        text: "Exceptional Growth: Skill is significantly outperforming expectations",
        color: "text-green-600",
      };
    } else if (averageRating > 3) {
      return {
        icon: "up",
        text: "Positive Trajectory: Skill showing strong potential and improvement",
        color: "text-green-500",
      };
    } else if (averageRating > 2) {
      return {
        icon: "stable",
        text: "Stable Performance: Consistent skill level with moderate competency",
        color: "text-yellow-600",
      };
    } else {
      return {
        icon: "down",
        text: "Development Needed: Skill requires focused improvement strategies",
        color: "text-red-500",
      };
    }
  };
  const tooltipContent = {
    skillProficiency:
      "View detailed breakdown of skill levels across the organization",
    topRatedSkills: "Discover the highest-rated and most proficient skills",
    skillGapAnalysis: "Identify areas where skill development is needed",
    locationWiseSkillDistribution:
      "See how skills are distributed across different locations",
  };

  return (
    <BoxComponent>
      <div className="flex flex-col  justify-between w-full md:ml-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={" Skills Report"}
            info={
              " Comprehensive analysis of organizational skills and competencies."
            }
          />
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <TuneIcon className="w-4 h-4" />
              Filters
            </button>

            {/* <Button
              className="flex items-center  px-2 py-2"
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export Data
            </Button> */}
            <Button
  disabled={selectedSkills.length === 0}
  onClick={handleExport}
  startIcon={<DownloadIcon />}
  variant="contained"
>
  Export {selectedSkills.length > 0 ? `Selected (${selectedSkills.length})` : 'All'} Skills
</Button>

          </div>
          {/* {isLoading && (
            <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
              <CircularProgress />
            </div>
          )} */}
        </div>

        <div className=" bg-gray-50 min-h-screen">
          {/* Header Section */}
          <div className=" flex justify-between items-center">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Skill Matrix Report
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive analysis of organizational skills and competencies
              </p>
            </div> */}
            {/* <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <TuneIcon className="w-4 h-4" />
                Filters
              </button>

              <Button
                className="flex items-center  px-2 py-2"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
              >
                Export Data
              </Button>
            </div> */}
          </div>

          {/* Analysis Type Selector */}
          {/* <div className="mb-6 flex space-x-4">
        {['default', 'topSkills', 'skillGap', 'groupAnalysis'].map((type) => (
          <button
            key={type}
            onClick={() => setAnalysisType(type)}
            className={`px-4 py-2 rounded-lg ${
              analysisType === type 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white text-gray-700 border'
            }`}
          >
            {type === 'default' ? 'All Skills' : 
             type === 'topSkills' ? 'Top Skills' : 
             type === 'skillGap' ? 'Skill Gaps' : 
             'Group Analysis'}
          </button>
        ))}
      </div> */}

          <div className="mb-6 flex space-x-4">
            {[
              "skillProficiency",
              "topRatedSkills",
              "skillGapAnalysis",
              // "locationWiseSkillDistribution",
            ].map((type) => (
              <Tooltip title={tooltipContent[type]} arrow placement="top">
                <button
                  key={type}
                  onClick={() => {
                    console.log(`Selecting report type: ${type}`);
                    setReportType(type);
                    // Force a refetch
                    refetch();
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    reportType === type
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {type === "skillProficiency"
                    ? "Skill Proficiency"
                    : type === "topRatedSkills"
                    ? "Top Rated Skills"
                    : type === "skillGapAnalysis"
                    ? "Skill Gap Analysis"
                    : "Location Skill Distribution"}
                </button>
              </Tooltip>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={skill}
              // placeholder="Search skills, departments, or employees..."
              placeholder="Search skills (eg.ReactJs, NodeJs)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FilterListIcon className="w-5 h-5" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <TuneIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Department Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {/* <Select
                options={Departmentoptions}
                value={
                  department
                    ? Departmentoptions?.find((opt) => opt.value === department)
                    : null
                }
                onChange={(selectedOption) => {
                  setDepartment(selectedOption ? selectedOption.value : "");
                }}
                styles={customSelectStyles}
                placeholder="Select Department"
              /> */}

                  <Select
                    options={Departmentoptions}
                    value={
                      department.id
                        ? Departmentoptions?.find(
                            (opt) => opt.value === department.id
                          )
                        : null
                    }
                    onChange={(selectedOption) => {
                      setDepartment({
                        id: selectedOption ? selectedOption.value : "",
                        name: selectedOption ? selectedOption.label : "",
                      });
                    }}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Department"
                  />
                </div>

                {/* Manager Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager
                  </label>
                  <Select
                    options={managerOptions}
                    value={
                      manager
                        ? managerOptions?.find((opt) => opt.value === manager)
                        : null
                    }
                    onChange={(selectedOption) => {
                      setManager(selectedOption ? selectedOption.value : "");
                    }}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Manager"
                  />
                </div>

                {/* Location Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Select
                    options={locationOptions}
                    value={
                      locations
                        ? locationOptions?.find(
                            (opt) => opt.value === locations
                          )
                        : null
                    }
                    onChange={(selectedOption) => {
                      setLocations(selectedOption ? selectedOption.value : "");
                    }}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Location"
                  />
                </div>

                {/* Rating Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Rating
                  </label>
                  {/* <Select
                    options={[
                      { value: "0-2", label: "Beginner (0-2)" },
                      { value: "2-4", label: "Intermediate (2-4)" },
                      { value: "4-5", label: "Expert (4-5)" },
                    ]}
                    value={
                      ratingRange
                        ? {
                            value: ratingRange,
                            label: getRatingRangeLabel(ratingRange),
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setRatingRange(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Rating Range"
                  /> */}
                  <Select
                    options={[
                      { value: "0-2", label: "Beginner (0-2)" },
                      { value: "2-4", label: "Intermediate (2-4)" },
                      { value: "4-5", label: "Expert (4-5)" },
                    ]}
                    value={
                      ratingRange
                        ? {
                            value: ratingRange,
                            label: getRatingRangeLabel(ratingRange),
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setRatingRange(selectedOption?.value || null);
                      refetch();
                    }}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Rating Range"
                  />
                </div>
              </div>

              {/* Action Buttons and Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-end space-x-2">
                  <Button
                    variant="outlined"
                    startIcon={<TuneIcon />}
                    onClick={handleReset}
                    disabled={isLoading}
                    sx={{ mt: 3 }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center">
              {error.message || "An error occurred"}
            </div>
          )}

          {/* Results Section */}

          {data && data.success && (
            <div className="p-2 mb-4">
              <p className="text-lg font-semibold mb-2">
                {generateInsightSummary()}
              </p>
            </div>
          )}

          {data && data.success && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600 rounded focus:ring-indigo-500"
                        checked={data.data.length > 0 && selectedSkills.length === data.data.length}
                        // onChange={(e) => {
                        //   setSelectedSkills(
                        //     e.target.checked
                        //       ? data.data.map((item) => item.skillName)
                        //       : []
                        //   );
                        // }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Skill Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Average Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((item, index) => {
                    // Determine rating color and performance level
                    const ratingColor =
                      item.averageRating > 4
                        ? "text-green-600"
                        : item.averageRating > 3
                        ? "text-green-500"
                        : item.averageRating > 2
                        ? "text-yellow-600"
                        : "text-red-500";

                    const performanceLevel =
                      item.averageRating > 4
                        ? "Exceptional"
                        : item.averageRating > 3
                        ? "Excellent"
                        : item.averageRating > 2
                        ? "Good"
                        : "Needs Improvement";

                    return (
                      <tr
                        key={index}
                        className={`
            ${selectedSkills.includes(item.skillName) ? "bg-indigo-50" : ""}
            hover:bg-gray-50 transition-colors duration-200
          `}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="form-checkbox text-indigo-600 rounded focus:ring-indigo-500"
                            // checked={selectedSkills.includes(item.skillName)}
                            checked={selectedSkills.includes(item.skillName)}
                            // onChange={(e) => {
                            //   setSelectedSkills((prev) =>
                            //     e.target.checked
                            //       ? [...prev, item.skillName]
                            //       : prev.filter((id) => id !== item.skillName)
                            //   );
                            // }}
                            onChange={(e) => handleSelectSkill(item.skillName, e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.skillName}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${ratingColor}`}
                        >
                          {/* <StarIcon sx={{ color: "gold", mr: 1 }} /> */}
                          {item.averageRating?.toFixed(2) || "N/A"}
                          <span className="text-xs text-gray-500 block">
                            {performanceLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                          {/* {item.totalEmployees ||
                            item.totalPractitioners ||
                            "N/A"} */}
                          {reportType === "skillGapAnalysis"
                            ? item.employeesWithGap || item.gapCount || "0" // ✅ Show gap-specific employee count
                            : item.totalEmployees ||
                              item.totalPractitioners ||
                              "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {renderTrendIcon(
                              item.averageRating > 3
                                ? "up"
                                : item.averageRating < 2
                                ? "down"
                                : "stable"
                            )}
                            <span className="ml-2 text-xs text-gray-500">
                              {item.averageRating > 3
                                ? "Improving"
                                : item.averageRating < 2
                                ? "Declining"
                                : "Stable"}
                            </span>
                          </div>
                        </td>

                        {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(() => {
                          const trendInfo = renderTrendDescription(
                            item.averageRating
                          );
                          return (
                            <>
                              {renderTrendIcon(trendInfo.icon)}
                              <span
                                className={`ml-2 text-xs ${trendInfo.color}`}
                              >
                                {trendInfo.text}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </BoxComponent>
  );
};

export default Reports;
//the problem is when i click on Skill GAp Analysis then data show properly but problem in employees <td> where employee N/A even they have skill gap anaylysis ..please check once
//backup___________________________________________________________________________
/* eslint-disable no-unused-vars */
// import React, { useState, useCallback, useContext } from "react";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Select from "react-select";

// // Material-UI Icons
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import RemoveIcon from "@mui/icons-material/Remove";
// import CircularProgress from "@mui/material/CircularProgress";
// import DownloadIcon from "@mui/icons-material/Download";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/Tune";
// import StarIcon from "@mui/icons-material/Star";
// import { Tooltip } from '@mui/material';

// import PeopleIcon from "@mui/icons-material/People";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import {
//   Box,
//   Button,
//   Grid,
//   Typography,
//   Slider,
//   TextField,
//   Pagination,
// } from "@mui/material";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// // Context
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";

// // Custom Hook
// import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";

// const customSelectStyles = {
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#d1d5db",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#4f46e5" },
//     backgroundColor: "#ffffff",
//     borderRadius: "8px",
//     padding: "2px",
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 1000,
//     position: "absolute",
//     borderRadius: "8px",
//     boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//   }),
// };

// const Reports = () => {
//   // Context hooks
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // URL Params
//   const { organisationId } = useParams();

//   // Local state for filters
//   const [skill, setSkill] = useState("");
//   const [rating, setRating] = useState([0, 5]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ratingRange, setRatingRange] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   // New state for analysis type
//   const [analysisType, setAnalysisType] = useState("default");
//   const [reportType, setReportType] = useState(null);
//   const pageSize = 10;

//   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     department: "",
//     setDepartment: "",
//     dateRange: "30",
//     location: "",
//     search: "",
//     categories: [],
//     experienceLevels: [],
//     certifications: false,
//     activeProjects: false,
//     mentorship: false,
//   });

//   // Use custom filter hook
//   const {
//     department: initialDepartment,
//     setDepartment: setInitialDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   const [department, setDepartment] = useState({
//     id: initialDepartment || "",
//     name:
//       Departmentoptions?.find((opt) => opt.value === initialDepartment)
//         ?.label || "",
//   });

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     const currentReportType = reportType || "skillProficiency";
//     try {
//       console.log("Fetching skills data with filters:", {
//         reportType: currentReportType,
//         skillName: skill,
//         departmentId: department.id,
//         managerId: manager,
//         city: locations,
//         ratingRange: ratingRange,
//         analysisType: analysisType,
//         page: currentPage,
//         pageSize,
//       });

//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/generateSkillReports`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             reportType: currentReportType,
//             analysisType,
//             skillName: skill || undefined,
//             // departmentId: department || undefined,
//             departmentId: department.id || undefined, // Use department.id
//             managerId: manager || undefined,
//             city: locations || undefined,
//             ratingRange: ratingRange || undefined,
//             page: currentPage,
//             pageSize,
//             dateRange: "30days", // Optional, can be dynamic
//           },
//         }
//       );

//       console.log("Skill data response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills data:", error);
//       handleAlert(false, "error", "Failed to fetch skills data");
//       throw error;
//     }
//   }, [
//     reportType,
//     skill,
//     // filters,
//     // department,
//     department.id,
//     manager,
//     ratingRange,
//     locations,
//     currentPage,
//     analysisType,
//     organisationId,
//     authToken,
//     handleAlert,
//   ]);

//   // Use React Query for data fetching
//   const { data, isLoading, error, refetch } = useQuery(
//     [
//       "reportsData",
//       reportType,
//       skill,
//       // department,
//       department.id,
//       manager,
//       locations,
//       ratingRange,
//       currentPage,
//       analysisType,
//     ],
//     fetchSkillsData,
//     {
//       keepPreviousData: true,
//       retry: 1,
//       onError: (error) => {
//         console.error("Query error:", error);
//         handleAlert(false, "error", error.message || "An error occurred");
//       },
//     }
//   );

//   // Rating range label helper
//   const getRatingRangeLabel = (range) => {
//     switch (range) {
//       case "0-2":
//         return "Beginner (0-2)";
//       case "2-4":
//         return "Intermediate (2-4)";
//       case "4-5":
//         return "Expert (4-5)";
//       default:
//         return "";
//     }
//   };

//   // Reset handler
//   const handleReset = () => {
//     setSkill("");
//     setDepartment("");
//     setManager("");
//     setLocations("");
//     setRatingRange(null);
//     setAnalysisType("default");
//     setCurrentPage(1);
//     refetch();
//   };

//   const handleExport = () => {

//     if (!data) {
//       handleAlert(false, "warning", "No data available");
//       return;
//     }

//     if (!data.success) {
//       handleAlert(false, "warning", "Data fetch was unsuccessful");
//       return;
//     }

//     if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (dataToConvert) => {
//       // Add a check here as well
//       if (!dataToConvert || !Array.isArray(dataToConvert)) {
//         console.error("Invalid data for CSV conversion", dataToConvert);
//         return "Error: Invalid data";
//       }

//       // Professional Report Header
//       const reportHeader = [
//         "AEGIS SKILL MATRIX REPORT",
//         `Generated on: ${new Date().toLocaleString()}`,
//         "-----------------------------------------------------------",
//       ];

//       // Detailed Filter Information
//       const filterDetails = [
//         "REPORT CONFIGURATION:",
//         `• Report Type       : ${
//           reportType === "skillProficiency"
//             ? "Skill Proficiency Overview"
//             : reportType === "topRatedSkills"
//             ? "Top Rated Skills Analysis"
//             : reportType === "skillGapAnalysis"
//             ? "Skill Competency Gap Report"
//             : "Location-based Skill Distribution"
//         }`,
//         `• Analysis Approach : ${
//           analysisType === "default"
//             ? "Comprehensive Skill Assessment"
//             : analysisType === "topSkills"
//             ? "Top Performing Skills Highlight"
//             : analysisType === "skillGap"
//             ? "Skill Competency Gap Analysis"
//             : "Organizational Skill Group Evaluation"
//         }`,
//         "-----------------------------------------------------------",
//         "APPLIED FILTERS:",
//         `• Department        : ${department.name || "All Departments"}`,
//         `• Manager           : ${
//           manager
//             ? managerOptions?.find((opt) => opt.value === manager)?.label
//             : "Not Specified"
//         }`,
//         `• Location          : ${
//           locations
//             ? locationOptions?.find((opt) => opt.value === locations)?.label
//             : "All Locations"
//         }`,
//         `• Skill Rating      : ${
//           ratingRange ? getRatingRangeLabel(ratingRange) : "Full Range"
//         }`,
//         `• Skill Search      : ${skill || "No Specific Skill"}`,
//         "-----------------------------------------------------------",
//         "SKILL PERFORMANCE DATA:",
//         "",
//       ];

//       // Professional Data Headers
//       const headers = [
//         "Skill Name",
//         "Avg Skill Rating",
//         "Department",
//         " Employees ",
//         "Performance Trend",
//       ];

//       // Enhanced Data Rows
//       const csvRows = dataToConvert.map((item) => [
//         item.skillName || "N/A",
//         `${item.averageRating?.toFixed(2) || "N/A"}/5.00`,
//         // item.department || "Unassigned",
//         item.totalEmployees || item.totalPractitioners || "N/A",
//         item.averageRating > 3
//           ? "Excellent Performance"
//           : item.averageRating > 2
//           ? "Moderate Performance"
//           : "Needs Improvement",
//       ]);

//       // Combine all sections
//       return [
//         ...reportHeader,
//         ...filterDetails,
//         headers.join("\t"), // Use tab for better readability
//         ...csvRows.map((row) => row.join("\t")),
//       ].join("\n");
//     };

//     try {
//       const csvData = convertToCSV(data.data);
//       const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `AEGIS_SkillMatrix_Report_${new Date()
//           .toISOString()
//           .replace(/:/g, "-")}.csv`
//       );
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       handleAlert(true, "success", " Skill Report Generated");
//     } catch (error) {
//       console.error("Export error:", error);
//       handleAlert(false, "error", "Failed to generate report");
//     }
//   };

//   // Trend icon renderer
//   const renderTrendIcon = (trend) => {
//     switch (trend) {
//       case "up":
//         return <ArrowUpwardIcon className="w-5 h-5 text-green-500" />;
//       case "down":
//         return <ArrowDownwardIcon className="w-5 h-5 text-red-500" />;
//       case "stable":
//         return <RemoveIcon className="w-5 h-5 text-gray-500" />;
//       default:
//         return null;
//     }
//   };

//   // Add a function to generate a meaningful one-liner based on the current filters and report type
//   const generateInsightSummary = () => {
//     // Base summary based on report type
//     const reportTypeSummaries = {
//       skillProficiency:
//         "Comprehensive overview of skill proficiency across the organization",
//       topRatedSkills:
//         "Highlighting the most exceptional skills in our talent pool",
//       skillGapAnalysis:
//         "Identifying critical skill gaps and development opportunities",
//       locationWiseSkillDistribution:
//         "Exploring skill distribution across different locations",
//     };

//     // Enhance with filter context
//     const filterAddOns = [];

//     if (department.id) {
//       filterAddOns.push(`focused on ${department.name} department`);
//     }

//     if (manager) {
//       const managerName = managerOptions?.find(
//         (opt) => opt.value === manager
//       )?.label;
//       filterAddOns.push(`under ${managerName}'s leadership`);
//     }

//     if (locations) {
//       const locationName = locationOptions?.find(
//         (opt) => opt.value === locations
//       )?.label;
//       filterAddOns.push(`in ${locationName}`);
//     }

//     if (ratingRange) {
//       const ratingLabel = getRatingRangeLabel(ratingRange);
//       filterAddOns.push(`focusing on ${ratingLabel} skill levels`);
//     }

//     const baseSummary =
//       reportTypeSummaries[reportType] || "Detailed skill matrix insights";

//     return `${baseSummary} ${
//       filterAddOns.length > 0 ? `- ${filterAddOns.join(", ")}` : ""
//     }`;
//   };

//   // Enhanced trend description function
//   const renderTrendDescription = (averageRating) => {
//     if (averageRating > 4) {
//       return {
//         icon: "up",
//         text: "Exceptional Growth: Skill is significantly outperforming expectations",
//         color: "text-green-600",
//       };
//     } else if (averageRating > 3) {
//       return {
//         icon: "up",
//         text: "Positive Trajectory: Skill showing strong potential and improvement",
//         color: "text-green-500",
//       };
//     } else if (averageRating > 2) {
//       return {
//         icon: "stable",
//         text: "Stable Performance: Consistent skill level with moderate competency",
//         color: "text-yellow-600",
//       };
//     } else {
//       return {
//         icon: "down",
//         text: "Development Needed: Skill requires focused improvement strategies",
//         color: "text-red-500",
//       };
//     }
//   };
//   const tooltipContent = {
//     skillProficiency: "View detailed breakdown of skill levels across the organization",
//     topRatedSkills: "Discover the highest-rated and most proficient skills",
//     skillGapAnalysis: "Identify areas where skill development is needed",
//     locationWiseSkillDistribution: "See how skills are distributed across different locations"
//   };

//   return (
//     <BoxComponent>
//       <div className="flex flex-col  justify-between w-full md:ml-4">
//         <div className="flex justify-between items-center">
//           <HeadingOneLineInfo
//             heading={" Skills Report"}
//             info={
//               " Comprehensive analysis of organizational skills and competencies."
//             }
//           />
//           <div className="flex gap-4">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//             >
//               <TuneIcon className="w-4 h-4" />
//               Filters
//             </button>

//             <Button
//               className="flex items-center  px-2 py-2"
//               variant="contained"
//               startIcon={<DownloadIcon />}
//               onClick={handleExport}
//             >
//               Export Data
//             </Button>
//           </div>
//           {isLoading && (
//             <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//               <CircularProgress />
//             </div>
//           )}
//         </div>

//         <div className=" bg-gray-50 min-h-screen">
//           {/* Header Section */}
//           <div className=" flex justify-between items-center">
//             {/* <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Skill Matrix Report
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Comprehensive analysis of organizational skills and competencies
//               </p>
//             </div> */}
//             {/* <div className="flex gap-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//               >
//                 <TuneIcon className="w-4 h-4" />
//                 Filters
//               </button>

//               <Button
//                 className="flex items-center  px-2 py-2"
//                 variant="contained"
//                 startIcon={<DownloadIcon />}
//                 onClick={handleExport}
//               >
//                 Export Data
//               </Button>
//             </div> */}
//           </div>

//           {/* Analysis Type Selector */}
//           {/* <div className="mb-6 flex space-x-4">
//         {['default', 'topSkills', 'skillGap', 'groupAnalysis'].map((type) => (
//           <button
//             key={type}
//             onClick={() => setAnalysisType(type)}
//             className={`px-4 py-2 rounded-lg ${
//               analysisType === type
//                 ? 'bg-indigo-500 text-white'
//                 : 'bg-white text-gray-700 border'
//             }`}
//           >
//             {type === 'default' ? 'All Skills' :
//              type === 'topSkills' ? 'Top Skills' :
//              type === 'skillGap' ? 'Skill Gaps' :
//              'Group Analysis'}
//           </button>
//         ))}
//       </div> */}

//           <div className="mb-6 flex space-x-4">
//             {[
//               "skillProficiency",
//               "topRatedSkills",
//               "skillGapAnalysis",
//               "locationWiseSkillDistribution",
//             ].map((type) => (

//               <Tooltip title={tooltipContent[type]} arrow placement="top">
//               <button
//                 key={type}
//                 onClick={() => {
//                   console.log(`Selecting report type: ${type}`);
//                   setReportType(type);
//                   // Force a refetch
//                   refetch();
//                 }}
//                 className={`px-4 py-2 rounded-lg ${
//                   reportType === type
//                     ? "bg-indigo-500 text-white"
//                     : "bg-white text-gray-700 border"
//                 }`}
//               >
//                 {type === "skillProficiency"
//                   ? "Skill Proficiency"
//                   : type === "topRatedSkills"
//                   ? "Top Rated Skills"
//                   : type === "skillGapAnalysis"
//                   ? "Skill Gap Analysis"
//                   : "Location Skill Distribution"}
//               </button>
//               </Tooltip>
//             ))}
//           </div>

//           {/* Search Bar */}
//           <div className="relative mb-6">
//             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               value={skill}
//               // placeholder="Search skills, departments, or employees..."
//               placeholder="Search skills (eg.ReactJs, NodeJs)"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               onChange={(e) => setSkill(e.target.value)}
//             />
//           </div>

//           {/* Advanced Filters Panel */}
//           {showFilters && (
//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold flex items-center gap-2">
//                   <FilterListIcon className="w-5 h-5" />
//                   Advanced Filters
//                 </h3>
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <TuneIcon className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Filters Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {/* Department Filter */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department
//                   </label>
//                   {/* <Select
//                 options={Departmentoptions}
//                 value={
//                   department
//                     ? Departmentoptions?.find((opt) => opt.value === department)
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   setDepartment(selectedOption ? selectedOption.value : "");
//                 }}
//                 styles={customSelectStyles}
//                 placeholder="Select Department"
//               /> */}

//                   <Select
//                     options={Departmentoptions}
//                     value={
//                       department.id
//                         ? Departmentoptions?.find(
//                             (opt) => opt.value === department.id
//                           )
//                         : null
//                     }
//                     onChange={(selectedOption) => {
//                       setDepartment({
//                         id: selectedOption ? selectedOption.value : "",
//                         name: selectedOption ? selectedOption.label : "",
//                       });
//                     }}
//                     styles={customSelectStyles}
//                     isClearable={true}
//                     placeholder="Select Department"
//                   />
//                 </div>

//                 {/* Manager Filter */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Manager
//                   </label>
//                   <Select
//                     options={managerOptions}
//                     value={
//                       manager
//                         ? managerOptions?.find((opt) => opt.value === manager)
//                         : null
//                     }
//                     onChange={(selectedOption) => {
//                       setManager(selectedOption ? selectedOption.value : "");
//                     }}
//                     styles={customSelectStyles}
//                     isClearable={true}
//                     placeholder="Select Manager"
//                   />
//                 </div>

//                 {/* Location Filter */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <Select
//                     options={locationOptions}
//                     value={
//                       locations
//                         ? locationOptions?.find(
//                             (opt) => opt.value === locations
//                           )
//                         : null
//                     }
//                     onChange={(selectedOption) => {
//                       setLocations(selectedOption ? selectedOption.value : "");
//                     }}
//                     styles={customSelectStyles}
//                     isClearable={true}
//                     placeholder="Select Location"
//                   />
//                 </div>

//                 {/* Rating Range Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Skill Rating
//                   </label>
//                   <Select
//                     options={[
//                       { value: "0-2", label: "Beginner (0-2)" },
//                       { value: "2-4", label: "Intermediate (2-4)" },
//                       { value: "4-5", label: "Expert (4-5)" },
//                     ]}
//                     value={
//                       ratingRange
//                         ? {
//                             value: ratingRange,
//                             label: getRatingRangeLabel(ratingRange),
//                           }
//                         : null
//                     }
//                     onChange={(selectedOption) => {
//                       setRatingRange(
//                         selectedOption ? selectedOption.value : null
//                       );
//                     }}
//                     styles={customSelectStyles}
//                     isClearable={true}
//                     placeholder="Select Rating Range"
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons and Additional Filters */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//                 <div className="flex items-end space-x-2">
//                   <Button
//                     variant="outlined"
//                     startIcon={<TuneIcon />}
//                     onClick={handleReset}
//                     disabled={isLoading}
//                     sx={{ mt: 3 }}
//                   >
//                     Reset Filters
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Loading and Error States */}
//           {isLoading && (
//             <div className="flex justify-center items-center">
//               <CircularProgress />
//             </div>
//           )}

//           {error && (
//             <div className="text-red-500 text-center">
//               {error.message || "An error occurred"}
//             </div>
//           )}

//           {/* Results Section */}

//           {data && data.success && (
//             <div className="p-2 mb-4">
//               <p className="text-lg font-semibold mb-2">
//                 {generateInsightSummary()}
//               </p>
//             </div>
//           )}

//           {data && data.success && (
//             <div className="bg-white shadow rounded-lg overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
//                 <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox text-indigo-600 rounded focus:ring-indigo-500"
//                         checked={selectedSkills.length === data.data.length}
//                         onChange={(e) => {
//                           setSelectedSkills(
//                             e.target.checked
//                               ? data.data.map((item) => item.skillName)
//                               : []
//                           );
//                         }}
//                       />
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Skill Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Average Rating
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Employees
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Trend
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {data.data.map((item, index) => {
//                     // Determine rating color and performance level
//                     const ratingColor =
//                       item.averageRating > 4
//                         ? "text-green-600"
//                         : item.averageRating > 3
//                         ? "text-green-500"
//                         : item.averageRating > 2
//                         ? "text-yellow-600"
//                         : "text-red-500";

//                     const performanceLevel =
//                       item.averageRating > 4
//                         ? "Exceptional"
//                         : item.averageRating > 3
//                         ? "Excellent"
//                         : item.averageRating > 2
//                         ? "Good"
//                         : "Needs Improvement";

//                     return (
//                       <tr
//                         key={index}
//                         className={`
//             ${selectedSkills.includes(item.skillName) ? "bg-indigo-50" : ""}
//             hover:bg-gray-50 transition-colors duration-200
//           `}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <input
//                             type="checkbox"
//                             className="form-checkbox text-indigo-600 rounded focus:ring-indigo-500"
//                             checked={selectedSkills.includes(item.skillName)}
//                             onChange={(e) => {
//                               setSelectedSkills((prev) =>
//                                 e.target.checked
//                                   ? [...prev, item.skillName]
//                                   : prev.filter((id) => id !== item.skillName)
//                               );
//                             }}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {item.skillName}
//                         </td>
//                         <td
//                           className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${ratingColor}`}
//                         >
//                           {/* <StarIcon sx={{ color: "gold", mr: 1 }} /> */}
//                           {item.averageRating?.toFixed(2) || "N/A"}
//                           <span className="text-xs text-gray-500 block">
//                             {performanceLevel}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
//                           {item.totalEmployees ||
//                             item.totalPractitioners ||
//                             "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {renderTrendIcon(
//                               item.averageRating > 3
//                                 ? "up"
//                                 : item.averageRating < 2
//                                 ? "down"
//                                 : "stable"
//                             )}
//                             <span className="ml-2 text-xs text-gray-500">
//                               {item.averageRating > 3
//                                 ? "Improving"
//                                 : item.averageRating < 2
//                                 ? "Declining"
//                                 : "Stable"}
//                             </span>
//                           </div>
//                         </td>

//                         {/* <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {(() => {
//                           const trendInfo = renderTrendDescription(
//                             item.averageRating
//                           );
//                           return (
//                             <>
//                               {renderTrendIcon(trendInfo.icon)}
//                               <span
//                                 className={`ml-2 text-xs ${trendInfo.color}`}
//                               >
//                                 {trendInfo.text}
//                               </span>
//                             </>
//                           );
//                         })()}
//                       </div>
//                     </td> */}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </BoxComponent>
//   );
// };

// export default Reports;
