//this file is no Longer used for REPORT TAB > used sat.jsx file (updated and modified verion for Report.jsx)

/* eslint-disable react-hooks/exhaustive-deps */
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
import BarChartIcon from "@mui/icons-material/BarChart";
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
  const [analysisType, setAnalysisType] = useState("default");
  // const [reportType, setReportType] = useState('default');
  // const [reportType, setReportType] = useState('skillGalocationWiseSkillDistributionpAnalysis');
  const [reportType, setReportType] = useState(null);
  const pageSize = 10;

  // Enhanced filters state
  const [filters, setFilters] = useState({
    department: "",
    skillLevel: "",
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
    department,
    setDepartment,
    manager,
    setManager,
    locations,
    setLocations,
    Departmentoptions,
    managerOptions,
    locationOptions,
  } = useSkillMatrixFilter(organisationId);

  // Fetch skills data query
  // const fetchSkillsData = useCallback(async () => {
  //   try {
  //     console.log("Fetching skills reports with filters:", {
  //       reportType: analysisType,
  //       skillName: skill,
  //       departmentId: department,
  //       managerId: manager,
  //       workLocationId: locations,
  //       ratingRange: ratingRange,
  //     });

  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/route/reports/${organisationId}/generateSkillReports`,
  //       {
  //         headers: { Authorization: authToken },
  //         params: {
  //           reportType: analysisType || 'default',
  //           skillName: skill || undefined,
  //           departmentId: department || undefined,
  //           managerId: manager || undefined,
  //           workLocationId: locations || undefined,
  //           minRating: ratingRange ? ratingRange.split('-')[0] : undefined,
  //           maxRating: ratingRange ? ratingRange.split('-')[1] : undefined,
  //         },
  //       }
  //     );

  //     console.log("Skill Reports Response:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching skills data:", error);
  //     handleAlert(false, "error", "Failed to fetch skills data");
  //     throw error;
  //   }
  // }, [
  //   skill,
  //   department,
  //   manager,
  //   locations,
  //   ratingRange,
  //   analysisType,
  //   organisationId,
  //   authToken,
  //   handleAlert,
  // ]);
  // Modify the state initialization

  // Modify the fetchSkillReports function
  // Update your state to match backend report types

  // Modify fetchSkillsData to include reportType
  const fetchSkillsData = useCallback(async () => {
    const currentReportType = reportType || "skillProficiency";
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assessments/${organisationId}/generateSkillReports`,
        {
          headers: { Authorization: authToken },
          params: {
            // reportType,
            reportType: currentReportType,
            skillName: filters.skillName || undefined,
            departmentId: filters.department || undefined,
            managerId: filters.manager || undefined,
            workLocationId: filters.location || undefined,
            minRating: filters.ratingRange ? filters.ratingRange[0] : undefined,
            maxRating: filters.ratingRange ? filters.ratingRange[1] : undefined,
            dateRange: "30days", // Optional, can be dynamic
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skill reports:", error);
      handleAlert(false, "error", "Failed to fetch skill reports");
      throw error;
    }
  }, [
    reportType,
    filters,
    organisationId,
    authToken,
    handleAlert,
    department,
    manager,
    skill,
    ratingRange,
    locations,
  ]);

  <div className="mb-6 flex space-x-4">
    {[
      "skillProficiency",
      "topRatedSkills",
      "skillGapAnalysis",
      "locationWiseSkillDistribution",
    ].map((type, index) => (
      <button
        key={type}
        onClick={() => {
          setReportType(type);
          // Trigger data refetch when report type changes
          refetch();
        }}
        className={`px-4 py-2 rounded-lg ${
          // Automatically select the first option if no report type is selected
          reportType === type || (index === 0 && !reportType)
            ? "bg-indigo-500 text-white"
            : "bg-white text-gray-700 border"
        }`}
      >
        {type === "skillProficiency"
          ? "Skill Proficiency"
          : type === "topRatedSkills"
          ? "Top Skills"
          : type === "skillGapAnalysis"
          ? "Skill Gaps"
          : "Location Skills"}
      </button>
    ))}
  </div>;

  // Use React Query for data fetching
  const { data, isLoading, error, refetch } = useQuery(
    [
      "reportsData",
      skill,
      department,
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

  // Export handler
  // const handleExport = () => {
  //   if (!data || !data.success) {
  //     handleAlert(false, "warning", "No data to export");
  //     return;
  //   }

  const handleExport = () => {
    const currentReportType = reportType || "skillProficiency";
    if (!data || !data.success) {
      handleAlert(false, "warning", "No data to export");
      return;
    }
    const convertToCSV = (reportData) => {
      let headers, csvRows;

      switch (currentReportType) {
        case "skillProficiency":
          headers = ["Skill Name", "Average Rating", "Total Employees"];
          csvRows = data.data.map(
            (item) =>
              `${item.skillName},${item.averageRating.toFixed(2)},${
                item.totalEmployees
              }`
          );
          break;

        case "topRatedSkills":
          headers = ["Skill Name", "Average Rating", "Total Practitioners"];
          csvRows = data.data.map(
            (item) =>
              `${item.skillName},${item.averageRating.toFixed(2)},${
                item.totalPractitioners
              }`
          );
          break;

        case "skillGapAnalysis":
          headers = [
            "Skill Name",
            "Average Rating",
            "Skill Gap %",
            "Departments Affected",
          ];
          csvRows = data.data.map(
            (item) =>
              `${item.skillName},${item.averageRating.toFixed(
                2
              )},${item.skillGapPercentage.toFixed(
                2
              )},${item.departmentsAffected.join("|")}`
          );
          break;

        case "locationWiseSkillDistribution":
          headers = ["Location", "Average Skill Rating", "Skills"];
          csvRows = data.data.map(
            (item) =>
              `${item.locationName},${item.averageLocationSkillRating.toFixed(
                2
              )},${item.skills.map((s) => s.skillName).join("|")}`
          );
          break;

        default:
          headers = ["Skill Name", "Average Rating"];
          csvRows = data.data.map(
            (item) => `${item.skillName},${item.averageRating.toFixed(2)}`
          );
      }

      return [headers.join(","), ...csvRows].join("\n");
    };

    const csvContent = convertToCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <BoxComponent>
      <div className="flex flex-col  justify-between w-full md:ml-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Vendor Onboarding"}
            info={" Welcome your Vendors by creating their profiles here."}
          />

          {isLoading && (
            <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
              <CircularProgress />
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Skill Matrix Report
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive analysis of organizational skills and competencies
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <TuneIcon className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <DownloadIcon className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Analysis Type Selector
      <div className="mb-6 flex space-x-4">
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

          {/* // Update the report type selector */}
          <div className="mb-6 flex space-x-4">
            {[
              "skillProficiency",
              "topRatedSkills",
              "skillGapAnalysis",
              "locationWiseSkillDistribution",
            ].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
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
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={skill}
              placeholder="Search skills, departments, or employees..."
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
                  <Select
                    options={Departmentoptions}
                    value={
                      department
                        ? Departmentoptions?.find(
                            (opt) => opt.value === department
                          )
                        : null
                    }
                    onChange={(selectedOption) => {
                      setDepartment(selectedOption ? selectedOption.value : "");
                    }}
                    styles={customSelectStyles}
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
                    placeholder="Select Location"
                  />
                </div>

                {/* Rating Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Rating
                  </label>
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
                      setRatingRange(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    styles={customSelectStyles}
                    placeholder="Select Rating Range"
                  />
                </div>
              </div>

              {/* Action Buttons and Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-end space-x-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-// Continuing from the previous code snippet
                white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset Filters
                  </button>
                </div>

                {/* Additional Filters */}
                <div className="space-y-2">
                  {[
                    "Top Skills",
                    "Overall Rating",
                    "Employee Assessment Details",
                    "Skills Distribution",
                    "Skill Gap",
                  ].map((label, index) => (
                    <label key={index} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={
                          filters[label.toLowerCase().replace(/\s+/g, "")]
                        }
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [label.toLowerCase().replace(/\s+/g, "")]:
                              e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">{label}</span>
                    </label>
                  ))}
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
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedSkills.length === data.data.length}
                        onChange={(e) => {
                          setSelectedSkills(
                            e.target.checked
                              ? data.data.map((item) => item.skillName)
                              : []
                          );
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        selectedSkills.includes(item.skillName)
                          ? "bg-indigo-50"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedSkills.includes(item.skillName)}
                          onChange={(e) => {
                            setSelectedSkills((prev) =>
                              e.target.checked
                                ? [...prev, item.skillName]
                                : prev.filter((id) => id !== item.skillName)
                            );
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.skillName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.averageRating?.toFixed(2) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalEmployees ||
                          item.totalPractitioners ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderTrendIcon(
                          item.averageRating > 3
                            ? "up"
                            : item.averageRating < 2
                            ? "down"
                            : "stable"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Metadata Section */}
          {/* {data && data.metadata && (
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Insights Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Skills Analyzed</p>
              <p className="text-xl font-bold">{data.metadata.totalSkillsAnalyzed}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Avg Overall Rating</p>
              <p className="text-xl font-bold">
                {data.metadata.averageOverallRating?.toFixed(2) || 'N/A'}
              </p>
            </div>
            {data.metadata.skillGapInsights && (
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Low Rated Skills</p>
                <p className="text-xl font-bold">
                  {data.metadata.skillGapInsights.lowRatedSkillsCount}
                </p>
              </div>
            )}
          </div>
        </div>
      )} */}

          {data && data.metadata && (
            <div className="mt-4 bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Report Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-xl font-bold">
                    {data.metadata.totalRecords}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Generated At</p>
                  <p className="text-xl font-bold">
                    {new Date(data.metadata.generatedAt).toLocaleString()}
                  </p>
                </div>
                {reportType === "skillGapAnalysis" &&
                  data.metadata.insights && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Critical Skill Gaps
                      </p>
                      <p className="text-xl font-bold">
                        {data.metadata.insights.criticalSkillGaps.length}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </BoxComponent>
  );
};

export default Reports;

//old report part
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
// import BarChartIcon from "@mui/icons-material/BarChart";

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
//   const [analysisType, setAnalysisType] = useState('default');

//   const pageSize = 10;

//   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     department: "",
//     skillLevel: "",
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
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       console.log("Fetching skills data with filters:", {
//         skillName: skill,
//         departmentId: department,
//         managerId: manager,
//         city: locations,
//         ratingRange: ratingRange,
//         analysisType: analysisType,
//         page: currentPage,
//         pageSize,
//       });

//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             analysisType,
//             skillName: skill || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             city: locations || undefined,
//             ratingRange: ratingRange || undefined,
//             page: currentPage,
//             pageSize,
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
//     skill,
//     department,
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
//       skill,
//       department,
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
//     setAnalysisType('default');
//     setCurrentPage(1);
//     refetch();
//   };

//   // Export handler
//   const handleExport = () => {
//     if (!data || !data.success) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (data) => {
//       const headers = ["Skill", "Department", "Employees", "Rating"];
//       const csvRows = data.map(
//         (item) =>
//           `${item.skillName},${item.department || 'N/A'},${item.count || 'N/A'},${
//             item.averageRating || "N/A"
//           }`
//       );
//       return [headers.join(","), ...csvRows].join("\n");
//     };

//     const csvData = convertToCSV(data.data);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", "skills_insights.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
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

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Skill Matrix Report
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Comprehensive analysis of organizational skills and competencies
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <TuneIcon className="w-4 h-4" />
//             Filters
//           </button>
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <DownloadIcon className="w-4 h-4" />
//             Export Report
//           </button>
//         </div>
//       </div>

//       {/* Analysis Type Selector */}
//       <div className="mb-6 flex space-x-4">
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
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           value={skill}
//           placeholder="Search skills, departments, or employees..."
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           onChange={(e) => setSkill(e.target.value)}
//         />
//       </div>

//       {/* Advanced Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <FilterListIcon className="w-5 h-5" />
//               Advanced Filters
//             </h3>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <TuneIcon className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Filters Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Department Filter */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department
//               </label>
//               <Select
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
//               />
//             </div>

//             {/* Manager Filter */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Manager
//               </label>
//               <Select
//                 options={managerOptions}
//                 value={
//                   manager
//                     ? managerOptions?.find((opt) => opt.value === manager)
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   setManager(selectedOption ? selectedOption.value : "");
//                 }}
//                 styles={customSelectStyles}
//                 placeholder="Select Manager"
//               />
//             </div>

//             {/* Location Filter */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location
//               </label>
//               <Select
//                 options={locationOptions}
//                 value={
//                   locations
//                     ? locationOptions?.find((opt) => opt.value === locations)
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   setLocations(selectedOption ? selectedOption.value : "");
//                 }}
//                 styles={customSelectStyles}
//                 placeholder="Select Location"
//               />
//             </div>

//             {/* Rating Range Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Skill Rating
//               </label>
//               <Select
//                 options={[
//                   { value: "0-2", label: "Beginner (0-2)" },
//                   { value: "2-4", label: "Intermediate (2-4)" },
//                   { value: "4-5", label: "Expert (4-5)" },
//                 ]}
//                 value={
//                   ratingRange
//                     ? {
//                         value: ratingRange,
//                         label: getRatingRangeLabel(ratingRange),
//                       }
//                     : null
//                 }
//                 onChange={(selectedOption) => {
//                   setRatingRange(
//                     selectedOption ? selectedOption.value : null
//                   );
//                 }}
//                 styles={customSelectStyles}
//                 placeholder="Select Rating Range"
//               />
//             </div>
//           </div>

//           {/* Action Buttons and Additional Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//             <div className="flex items-end space-x-2">
//               <button
//                 onClick={handleReset}
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Reset Filters
//               </button>
//             </div>

//             {/* Additional Filters */}
//             <div className="space-y-2">
//               {[
//                 "Top Skills",
//                 "Overall Rating",
//                 "Employee Assessment Details",
//                 "Skills Distribution",
//                 "Skill Gap",
//               ].map((label, index) => (
//                 <label key={index} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox"
//                     checked={
//                       filters[label.toLowerCase().replace(/\s+/g, "")]
//                     }
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         [label.toLowerCase().replace(/\s+/g, "")]:
//                           e.target.checked,
//                       }))
//                     }
//                     />
//                     <span className="ml-2">{label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading and Error States */}
//         {isLoading && (
//           <div className="flex justify-center items-center">
//             <CircularProgress />
//           </div>
//         )}

//         {error && (
//           <div className="text-red-500 text-center">
//             {error.message || "An error occurred"}
//           </div>
//         )}

//         {/* Results Section */}
//         {data && data.success && (
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox"
//                       checked={selectedSkills.length === data.data.length}
//                       onChange={(e) => {
//                         setSelectedSkills(
//                           e.target.checked
//                             ? data.data.map((item) => item.skillName)
//                             : []
//                         );
//                       }}
//                     />
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Skill Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Department
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employees
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Trend
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {data.data.map((item) => (
//                   <tr
//                     key={item.skillName}
//                     className={
//                       selectedSkills.includes(item.skillName)
//                         ? "bg-indigo-50"
//                         : ""
//                     }
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox"
//                         checked={selectedSkills.includes(item.skillName)}
//                         onChange={(e) => {
//                           setSelectedSkills((prev) =>
//                             e.target.checked
//                               ? [...prev, item.skillName]
//                               : prev.filter((id) => id !== item.skillName)
//                           );
//                         }}
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.skillName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.department}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.count}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {renderTrendIcon(item.trend)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Metadata Section */}
//         {data && data.metadata && (
//           <div className="mt-4 bg-white shadow rounded-lg p-4">
//             <h3 className="text-lg font-semibold mb-2">Insights Summary</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Total Skills Analyzed</p>
//                 <p className="text-xl font-bold">{data.metadata.totalSkillsAnalyzed}</p>
//               </div>
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Avg Overall Rating</p>
//                 <p className="text-xl font-bold">
//                   {data.metadata.averageOverallRating?.toFixed(2) || 'N/A'}
//                 </p>
//               </div>
//               {data.metadata.skillGapInsights && (
//                 <div className="bg-gray-100 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600">Low Rated Skills</p>
//                   <p className="text-xl font-bold">
//                     {data.metadata.skillGapInsights.lowRatedSkillsCount}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default Reports;

// ___________
//5 incomplete
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
// import BarChartIcon from "@mui/icons-material/BarChart";

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
//   // Context and hooks
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   // State management
//   const [skill, setSkill] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ratingRange, setRatingRange] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [analysisType, setAnalysisType] = useState('default');

//   const pageSize = 10;

//   // Filters state
//   const [filters, setFilters] = useState({
//     department: "",
//     skillLevel: "",
//     dateRange: "30",
//     location: "",
//     search: "",
//   });

//   // Custom filter hook
//   const {
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getSkillsInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             analysisType,
//             skillName: skill || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             ratingRange: ratingRange || undefined,
//             page: currentPage,
//             pageSize,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       handleAlert(false, "error", "Failed to fetch skills insights");
//       throw error;
//     }
//   }, [
//     analysisType,
//     skill,
//     department,
//     manager,
//     ratingRange,
//     currentPage,
//     organisationId,
//     authToken,
//     handleAlert,
//   ]);

//   // React Query for data fetching
//   const { data, isLoading, error, refetch } = useQuery(
//     [
//       "skillsInsightsData",
//       analysisType,
//       skill,
//       department,
//       manager,
//       ratingRange,
//       currentPage,
//     ],
//     fetchSkillsData,
//     {
//       keepPreviousData: true,
//       retry: 1,
//     }
//   );

//   // Helper functions
//   const getRatingRangeLabel = (range) => {
//     const labels = {
//       "0-2": "Beginner (0-2)",
//       "2-4": "Intermediate (2-4)",
//       "4-5": "Expert (4-5)",
//     };
//     return labels[range] || "";
//   };

//   const handleReset = () => {
//     setSkill("");
//     setDepartment("");
//     setManager("");
//     setLocations("");
//     setRatingRange(null);
//     setAnalysisType('default');
//     setCurrentPage(1);
//     refetch();
//   };

//   const handleExport = () => {
//     if (!data || !data.success) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (data) => {
//       const headers = ["Skill Name", "Average Rating", "Count", "Category"];
//       const csvRows = data.map(
//         (item) =>
//           `${item.skillName},${item.averageRating || 'N/A'},${item.count || 'N/A'},${item.category || 'N/A'}`
//       );
//       return [headers.join(","), ...csvRows].join("\n");
//     };

//     const csvData = convertToCSV(data.data);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", "skills_insights.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Render method
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Skills Insights
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Comprehensive analysis of organizational skills and competencies
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <TuneIcon className="w-4 h-4" />
//             Filters
//           </button>
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <DownloadIcon className="w-4 h-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Analysis Type Selector */}
//       <div className="mb-6 flex space-x-4">
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
//       </div>

//       {/* Advanced Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           {/* Existing filter components */}
//           {/* ... (keep existing filter UI) */}
//         </div>
//       )}

//       {/* Loading and Error States */}
//       {isLoading && (
//         <div className="flex justify-center items-center">
//           <CircularProgress />
//         </div>
//       )}

//       {error && (
//         <div className="text-red-500 text-center">
//           {error.message || "An error occurred"}
//         </div>
//       )}

//       {/* Results Section */}
//       {data && data.success && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Skill Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Average Rating
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Count
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Group/Category
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data.data.map((item) => (
//                 <tr key={item.skillName}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {item.skillName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {item.averageRating?.toFixed(2) || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {item.count}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {item.groupName || item.category || 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Metadata Section */}
//       {data && data.metadata && (
//         <div className="mt-4 bg-white shadow rounded-lg p-4">
//           <h3 className="text-lg font-semibold mb-2">Insights Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-gray-100 p-3 rounded-lg">
//               <p className="text-sm text-gray-600">Total Skills Analyzed</p>
//               <p className="text-xl font-bold">{data.metadata.totalSkillsAnalyzed}</p>
//             </div>
//             <div className="bg-gray-100 p-3 rounded-lg">
//               <p className="text-sm text-gray-600">Avg Overall Rating</p>
//               <p className="text-xl font-bold">
//                 {data.metadata.averageOverallRating?.toFixed(2) || 'N/A'}
//               </p>
//             </div>
//             {/* Additional metadata based on analysis type */}
//             {data.metadata.skillGapInsights && (
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Low Rated Skills</p>
//                 <p className="text-xl font-bold">
//                   {data.metadata.skillGapInsights.lowRatedSkillsCount}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reports;

//4
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
//   // Add this to your existing state declarations
// const [selectedSkills, setSelectedSkills] = useState([]);

//   const pageSize = 10;

//   //   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     department: "",
//     skillLevel: "",
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
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       console.log("Fetching skills data with filters:", {
//         skillName: skill,
//         departmentId: department,
//         managerId: manager,
//         city: locations,
//         ratingRange: ratingRange,
//         page: currentPage,
//         pageSize,
//       });

//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             skillName: skill || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             city: locations || undefined,
//             ratingRange: ratingRange || undefined,
//             page: currentPage,
//             pageSize,
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
//     skill,
//     department,
//     manager,
//     ratingRange,
//     locations,
//     currentPage,
//     organisationId,
//     authToken,
//     handleAlert,
//   ]);

//   // Use React Query for data fetching
//   const { data, isLoading, error, refetch } = useQuery(
//     [
//       "reportsData",
//       skill,
//       department,
//       manager,
//       locations,
//       ratingRange,
//       currentPage,
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
//     setCurrentPage(1);
//     refetch();
//   };

//   // Export handler
//   const handleExport = () => {
//     if (!data || !data.success) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (data) => {
//       const headers = ["Skill", "Department", "Employees", "Rating"];
//       const csvRows = data.map(
//         (item) =>
//           `${item.skillName},${item.department},${item.count},${
//             item.proficiencyLevel || "N/A"
//           }`
//       );
//       return [headers.join(","), ...csvRows].join("\n");
//     };

//     const csvData = convertToCSV(data.data);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", "skill_report.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
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

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <>
//         {/* Header Section */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Skill Matrix Report
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Comprehensive analysis of organizational skills and competencies
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//             >
//               <TuneIcon className="w-4 h-4" />
//               Filters
//             </button>

//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//             >
//               <DownloadIcon className="w-4 h-4" />
//               Export Report
//             </button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-6">
//           <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             value={skill}
//             placeholder="Search skills, departments, or employees..."
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             onChange={(e) => setSkill(e.target.value)}
//           />
//         </div>

//         {/* Advanced Filters Panel */}
//         {showFilters && (
//           <>
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

//               {/* Department Filter */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Department
//                   </label>
//                   <Select
//                     options={Departmentoptions}
//                     value={
//                       department
//                         ? Departmentoptions?.find(
//                             (opt) => opt.value === department
//                           )
//                         : null
//                     }
//                     onChange={(selectedOption) => {
//                       setDepartment(selectedOption ? selectedOption.value : "");
//                     }}
//                     styles={customSelectStyles}
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
//                     placeholder="Select Rating Range"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//                 {/* Action Buttons */}
//                 <div className="flex items-end space-x-2">
//                   <button
//                     onClick={handleReset}
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>

//                 {/* Additional Filters */}
//                 <div className="space-y-2">
//                   {[
//                     "Top Skills",
//                     "Overall Rating",
//                     "Employee Assessment Details",
//                     "Skills Distribution",
//                     "Skill Gap",
//                   ].map((label, index) => (
//                     <label key={index} className="inline-flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox"
//                         checked={
//                           filters[label.toLowerCase().replace(/\s+/g, "")]
//                         }
//                         onChange={(e) =>
//                           setFilters((prev) => ({
//                             ...prev,
//                             [label.toLowerCase().replace(/\s+/g, "")]:
//                               e.target.checked,
//                           }))
//                         }
//                       />
//                       <span className="ml-2">{label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Loading and Error States */}
//         {isLoading && (
//           <div className="flex justify-center items-center">
//             <CircularProgress />
//           </div>
//         )}

//         {error && (
//           <div className="text-red-500 text-center">
//             {error.message || "An error occurred"}
//           </div>
//         )}

//         {/* Results Section */}
//         {data && data.success && (
//   <div className="bg-white shadow rounded-lg overflow-hidden">
//     <table className="min-w-full divide-y divide-gray-200">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             <input
//               type="checkbox"
//               className="form-checkbox"
//               checked={selectedSkills.length === data.data.length}
//               onChange={(e) => {
//                 setSelectedSkills(
//                   e.target.checked
//                     ? data.data.map((item) => item.skillName)
//                     : []
//                 );
//               }}
//             />
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Skill Name
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Department
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Employees
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Trend
//           </th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {data.data.map((item) => (
//           <tr
//             key={item.skillName}
//             className={
//               selectedSkills.includes(item.skillName)
//                 ? "bg-indigo-50"
//                 : ""
//             }
//           >
//             <td className="px-6 py-4 whitespace-nowrap">
//               <input
//                 type="checkbox"
//                 className="form-checkbox"
//                 checked={selectedSkills.includes(item.skillName)}
//                 onChange={(e) => {
//                   setSelectedSkills((prev) =>
//                     e.target.checked
//                       ? [...prev, item.skillName]
//                       : prev.filter((id) => id !== item.skillName)
//                   );
//                 }}
//               />
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               {item.skillName}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//               {item.department}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//               {item.count}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//               {renderTrendIcon(item.trend)}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}

//       </>
//     </div>
//     //     <div className="p-6 bg-gray-50 min-h-screen">

//     //       {/* Header Section */}
//     //       <div className="mb-8 flex justify-between items-center">
//     //         <div>
//     //           <h1 className="text-3xl font-bold text-gray-900">Skill Matrix Report</h1>
//     //           <p className="text-gray-600 mt-2">
//     //             Comprehensive analysis of organizational skills and competencies
//     //           </p>
//     //         </div>
//     //         <div className="flex gap-4">
//     //         <button
//     //             onClick={() => setShowFilters(!showFilters)}
//     //             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//     //           >
//     //             <TuneIcon className="w-4 h-4" />
//     //             Filters
//     //           </button>

//     //           <button
//     //             onClick={handleExport}
//     //             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//     //           >
//     //             <DownloadIcon className="w-4 h-4" />
//     //             Export Report
//     //           </button>
//     //         </div>
//     //       </div>

//     //       {/* Search Bar */}
//     //       <div className="relative mb-6">
//     //          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//     //         <input
//     //           value={skill}
//     //           placeholder="Search skills, departments, or employees..."
//     //           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//     //           value={filters.search}
//     //           // onChange={(e) =>
//     //           //   setFilters((prev) => ({ ...prev, search: e.target.value }))
//     //           // }
//     //           onChange={(e) => setSkill(e.target.value)}
//     //         />
//     //         {/* Skill Filter */}
//     //           {/* <div>
//     //             <label className="block text-sm font-medium text-gray-700 mb-2">
//     //               Skill
//     //             </label>
//     //             <input
//     //               type="text"
//     //               value={skill}
//     //               onChange={(e) => setSkill(e.target.value)}
//     //               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//     //               placeholder="Search skills"
//     //             />
//     //           </div> */}
//     //       </div>

//     //   {/* Advanced Filters Panel */}
//     //          {showFilters && (
//     //         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//     //           <div className="flex justify-between items-center mb-4">
//     //             <h3 className="text-lg font-semibold flex items-center gap-2">
//     //               <FilterListIcon className="w-5 h-5" />
//     //               Advanced Filters
//     //             </h3>
//     //             <button
//     //               onClick={() => setShowFilters(false)}
//     //               className="text-gray-400 hover:text-gray-600"
//     //             >
//     //               <TuneIcon className="w-5 h-5" />
//     //             </button>
//     //           </div>

//     //           {/* Department Filter */}
//     //           <div>
//     //             <label className="block text-sm font-medium text-gray-700 mb-2">
//     //               Department
//     //             </label>
//     //             <Select
//     //               options={Departmentoptions}
//     //               value={
//     //                 department
//     //                   ? Departmentoptions?.find((opt) => opt.value === department)
//     //                   : null
//     //               }
//     //               onChange={(selectedOption) => {
//     //                 setDepartment(selectedOption ? selectedOption.value : "");
//     //               }}
//     //               styles={customSelectStyles}
//     //               placeholder="Select Department"
//     //             />
//     //           </div>

//     //           {/* Manager Filter */}
//     //           <div>
//     //             <label className="block text-sm font-medium text-gray-700 mb-2">
//     //               Manager
//     //             </label>
//     //             <Select
//     //               options={managerOptions}
//     //               value={
//     //                 manager
//     //                   ? managerOptions?.find((opt) => opt.value === manager)
//     //                   : null
//     //               }
//     //               onChange={(selectedOption) => {
//     //                 setManager(selectedOption ? selectedOption.value : "");
//     //               }}
//     //               styles={customSelectStyles}
//     //               placeholder="Select Manager"
//     //             />
//     //           </div>

//     //           {/* Location Filter */}
//     //           <div>
//     //             <label className="block text-sm font-medium text-gray-700 mb-2">
//     //               Location
//     //             </label>
//     //             <Select
//     //               options={locationOptions}
//     //               value={
//     //                 locations
//     //                   ? locationOptions?.find((opt) => opt.value === locations)
//     //                   : null
//     //               }
//     //               onChange={(selectedOption) => {
//     //                 setLocations(selectedOption ? selectedOption.value : "");
//     //               }}
//     //               styles={customSelectStyles}
//     //               placeholder="Select Location"
//     //             />
//     //           </div>
//     //         </div>

//     //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//     //           {/* Rating Range Filter */}
//     //           <div>
//     //             <label className="block text-sm font-medium text-gray-700 mb-2">
//     //               Skill Rating
//     //             </label>
//     //             <Select
//     //               options={[
//     //                 { value: "0-2", label: "Beginner (0-2)" },
//     //                 { value: "2-4", label: "Intermediate (2-4)" },
//     //                 { value: "4-5", label: "Expert (4-5)" },
//     //               ]}
//     //               value={
//     //                 ratingRange
//     //                   ? {
//     //                       value: ratingRange,
//     //                       label: getRatingRangeLabel(ratingRange),
//     //                     }
//     //                   : null
//     //               }
//     //               onChange={(selectedOption) => {
//     //                 setRatingRange(selectedOption ? selectedOption.value : null);
//     //               }}
//     //               styles={customSelectStyles}
//     //               placeholder="Select Rating Range"
//     //             />
//     //           </div>

//     //           {/* Action Buttons */}
//     //           <div className="flex items-end space-x-2">
//     //             <button
//     //               onClick={handleReset}
//     //               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//     //             >
//     //               Reset Filters
//     //             </button>
//     //           </div>

//     //  {/* Additional Filters */}
//     //             <div className="space-y-2">
//     //               <label className="inline-flex items-center">
//     //                 <input
//     //                   type="checkbox"
//     //                   className="form-checkbox"
//     //                   checked={filters.certifications}
//     //                   onChange={(e) =>
//     //                     setFilters((prev) => ({
//     //                       ...prev,
//     //                       certifications: e.target.checked,
//     //                     }))
//     //                   }
//     //                 />
//     //                 <span className="ml-2">Top Skills</span>
//     //               </label>

//     //               <label className="inline-flex items-center">
//     //                 <input
//     //                   type="checkbox"
//     //                   className="form-checkbox"
//     //                   checked={filters.activeProjects}
//     //                   onChange={(e) =>
//     //                     setFilters((prev) => ({
//     //                       ...prev,
//     //                       activeProjects: e.target.checked,
//     //                     }))
//     //                   }
//     //                 />
//     //                 <span className="ml-2">Overall Rating</span>
//     //               </label>

//     //               <label className="inline-flex items-center">
//     //                 <input
//     //                   type="checkbox"
//     //                   className="form-checkbox"
//     //                   checked={filters.activeProjects}
//     //                   onChange={(e) =>
//     //                     setFilters((prev) => ({
//     //                       ...prev,
//     //                       activeProjects: e.target.checked,
//     //                     }))
//     //                   }
//     //                 />
//     //                 <span className="ml-2"> Employee Assessment Details</span>
//     //               </label>

//     //               <label className="inline-flex items-center">
//     //                 <input
//     //                   type="checkbox"
//     //                   className="form-checkbox"
//     //                   checked={filters.activeProjects}
//     //                   onChange={(e) =>
//     //                     setFilters((prev) => ({
//     //                       ...prev,
//     //                       activeProjects: e.target.checked,
//     //                     }))
//     //                   }
//     //                 />
//     //                 <span className="ml-2">Skills Distribution </span>
//     //               </label>

//     //               <label className="inline-flex items-center">
//     //                 <input
//     //                   type="checkbox"
//     //                   className="form-checkbox"
//     //                   checked={filters.activeProjects}
//     //                   onChange={(e) =>
//     //                     setFilters((prev) => ({
//     //                       ...prev,
//     //                       activeProjects: e.target.checked,
//     //                     }))
//     //                   }
//     //                 />
//     //                 <span className="ml-2">Skill Gap </span>
//     //               </label>
//     //             </div>
//     //           </div>

//     //       )}

//     //      {/* </div> */}

//     //       {/* Loading and Error States */}
//     //       {isLoading && (
//     //         <div className="flex justify-center items-center">
//     //           <CircularProgress />
//     //         </div>
//     //       )}

//     //       {error && (
//     //         <div className="text-red-500 text-center">
//     //           {error.message || "An error occurred"}
//     //         </div>
//     //       )}

//     //       {/* Results Section */}
//     //       {data && data.success && (
//     //         <div className="bg-white shadow rounded-lg overflow-hidden">
//     //           <table className="min-w-full divide-y divide-gray-200">
//     //             <thead className="bg-gray-50">
//     //               <tr>
//     //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//     //                   Skill Name
//     //                 </th>
//     //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//     //                   Department
//     //                 </th>
//     //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//     //                   Employees
//     //                 </th>
//     //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//     //                   Trend
//     //                 </th>
//     //               </tr>
//     //             </thead>
//     //             <tbody className="bg-white divide-y divide-gray-200">
//     //               {data.data.map((item) => (
//     //                 <tr key={item.skillName} hover>
//     //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//     //                     {item.skillName}
//     //                   </td>
//     //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//     //                     {item.department}
//     //                   </td>
//     //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//     //                     {item.count}
//     //                   </td>
//     //                   <td className="px-6 py-4 whitespace-nowrap">
//     //                     {renderTrendIcon(item.trend)}
//     //                   </td>
//     //                 </tr>
//     //               ))}
//     //             </tbody>
//     //           </table>
//     //         </div>
//     //       )}
//     //     </div>
//   );
// };

// export default Reports;

//3
// import React, { useState, useMemo, useCallback, useContext } from 'react';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import Select from 'react-select';

// // Material-UI Icons
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import RemoveIcon from '@mui/icons-material/Remove';
// import CircularProgress from '@mui/material/CircularProgress';
// import DownloadIcon from '@mui/icons-material/Download';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import CloseIcon from '@mui/icons-material/Close';
// import SearchIcon from '@mui/icons-material/Search';
// import TuneIcon from '@mui/icons-material/Tune';

// // Context
// import { TestContext } from '../../../State/Function/Main';
// import { UseContext } from '../../../State/UseState/UseContext';

// // Custom Hook
// import useSkillMatrixFilter from '../../../hooks/SkillMatrix/useSkillMatrixFilter';

// // Mock data (to be replaced with actual API data)
// const mockSkillsData = [
//   {
//     id: "1",
//     name: "React",
//     department: "Engineering",
//     proficiencyLevel: "Advanced",
//     employeeCount: 25,
//     trend: "up"
//   },
//   {
//     id: "2",
//     name: "Python",
//     department: "Engineering",
//     proficiencyLevel: "Intermediate",
//     employeeCount: 20,
//     trend: "stable"
//   }
// ];

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

// const SkillReport = () => {
//   // Context hooks
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // URL Params
//   const { organisationId } = useParams();

//   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     department: '',
//     skillLevel: '',
//     dateRange: '30',
//     location: '',
//     search: '',
//     categories: [],
//     experienceLevels: [],
//     certifications: false,
//     activeProjects: false,
//     mentorship: false,
//   });

//   // Filter panel visibility
//   const [showFilters, setShowFilters] = useState(false);

//   // Selected skills for report generation
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   // Use custom filter hook
//   const {
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Fetch skills data
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             skillName: filters.search || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             city: locations || undefined,
//             skillLevel: filters.skillLevel || undefined,
//             page: 1,
//             pageSize: 10,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching skill data:', error);
//       handleAlert(false, "error", "Failed to fetch skills data");
//       throw error;
//     }
//   }, [
//     filters.search,
//     department,
//     manager,
//     locations,
//     filters.skillLevel,
//     organisationId,
//     authToken,
//     handleAlert
//   ]);

//   // Simulated API call using react-query
//   const {
//     data: skillData,
//     isLoading,
//     error
//   } = useQuery('skillReport', fetchSkillsData, {
//     placeholderData: {
//       skills: mockSkillsData,
//     }
//   });

//   // Filter skills based on all criteria
//   const filteredSkills = useMemo(() => {
//     if (!skillData?.skills) return [];

//     return skillData.skills.filter(skill => {
//       const searchMatch = filters.search
//         ? skill.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//           skill.department.toLowerCase().includes(filters.search.toLowerCase())
//         : true;

//       const departmentMatch = filters.department
//         ? skill.department === filters.department
//         : true;

//       const levelMatch = filters.skillLevel
//         ? skill.proficiencyLevel === filters.skillLevel
//         : true;

//       return searchMatch && departmentMatch && levelMatch;
//     });
//   }, [skillData?.skills, filters]);

//   // Generate and download report
//   const generateReport = () => {
//     const selectedData = filteredSkills.filter(skill =>
//       selectedSkills.includes(skill.id)
//     );

//     // Create CSV content
//     const headers = ['Skill Name', 'Department', 'Proficiency Level', 'Employees', 'Trend'];
//     const csvContent = [
//       headers.join(','),
//       ...selectedData.map(skill =>
//         [
//           skill.name,
//           skill.department,
//           skill.proficiencyLevel,
//           skill.employeeCount,
//           skill.trend
//         ].join(',')
//       )
//     ].join('\n');

//     // Create and trigger download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `skill-report-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   // Loading and Error States
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <CircularProgress className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Skill Matrix Report
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Comprehensive analysis of organizational skills and competencies
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <TuneIcon className="w-4 h-4" />
//             Filters
//           </button>
//           <button
//             onClick={generateReport}
//             disabled={selectedSkills.length === 0}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
//               ${
//                 selectedSkills.length === 0
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700"
//               }`}
//           >
//             <DownloadIcon className="w-4 h-4" />
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search skills, departments, or employees..."
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           value={filters.search}
//           onChange={(e) =>
//             setFilters((prev) => ({ ...prev, search: e.target.value }))
//           }
//         />
//       </div>

//       {/* Advanced Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           {/* Existing filter implementation */}

//         </div>
//       )}

//       {/* Skills Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Existing table implementation */}
//       </div>
//     </div>
//   );
// };

// export default SkillReport;

//2

// import React, { useState, useMemo, useCallback, useContext } from 'react';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import Select from 'react-select';
// import { useParams } from 'react-router-dom';

// // Material-UI Icons
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import RemoveIcon from '@mui/icons-material/Remove';
// import CircularProgress from '@mui/material/CircularProgress';
// import DownloadIcon from '@mui/icons-material/Download';
// import SearchIcon from '@mui/icons-material/Search';
// import TuneIcon from '@mui/icons-material/Tune';

// // Context
// import { TestContext } from '../../../State/Function/Main';
// import { UseContext } from '../../../State/UseState/UseContext';

// // Custom Hook
// import useSkillMatrixFilter from '../../../hooks/SkillMatrix/useSkillMatrixFilter';

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
//   const pageSize = 10;

//   // Use custom filter hook
//   const {
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       console.log("Fetching skills data with filters:", {
//         skillName: skill,
//         departmentId: department,
//         managerId: manager,
//         city: locations,
//         ratingRange: ratingRange,
//         page: currentPage,
//         pageSize,
//       });

//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             skillName: skill || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             city: locations || undefined,
//             ratingRange: ratingRange || undefined,
//             page: currentPage,
//             pageSize,
//             includeDetails: true,
//             groupBy: locations ? 'city' :
//                      department ? 'department' :
//                      manager ? 'manager' : 'skill'
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
//     skill,
//     department,
//     manager,
//     ratingRange,
//     locations,
//     currentPage,
//     organisationId,
//     authToken,
//     handleAlert,
//   ]);

//   // Use React Query for data fetching
//   const {
//     data,
//     isLoading,
//     error,
//     refetch
//   } = useQuery(
//     [
//       "reportsData",
//       skill,
//       department,
//       manager,
//       locations,
//       ratingRange,
//       currentPage
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
//       case "0-2": return "Beginner (0-2)";
//       case "2-4": return "Intermediate (2-4)";
//       case "4-5": return "Expert (4-5)";
//       default: return "";
//     }
//   };

//   // Reset handler
//   const handleReset = () => {
//     setSkill("");
//     setDepartment("");
//     setManager("");
//     setLocations("");
//     setRatingRange(null);
//     setCurrentPage(1);
//     refetch();
//   };

//   // Export handler
//   const handleExport = () => {
//     if (!data || !data.success) {
//       handleAlert(false, "warning", "No data to export");
//       return;
//     }

//     const convertToCSV = (data) => {
//       const headers = ["Skill", "Employees", "Average Rating"];
//       const csvRows = data.map(
//         (item) =>
//           `${item.skillName},${item.count},${
//             item.averageRating ? item.averageRating.toFixed(2) : "N/A"
//           }`
//       );
//       return [headers.join(","), ...csvRows].join("\n");
//     };

//     const csvData = convertToCSV(data.data);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", "reports_insights.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Comprehensive skill and employee insights
//           </p>
//         </div>
//         <div className="flex space-x-4">
//           <button
//             onClick={handleExport}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <DownloadIcon className="mr-2 -ml-1 h-5 w-5" />
//             Export Data
//           </button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white shadow rounded-lg p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Skill Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Skill
//             </label>
//             <input
//               type="text"
//               value={skill}
//               onChange={(e) => setSkill(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               placeholder="Search skills"
//             />
//           </div>

//           {/* Department Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Department
//             </label>
//             <Select
//               options={Departmentoptions}
//               value={
//                 department
//                   ? Departmentoptions?.find((opt) => opt.value === department)
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 setDepartment(selectedOption ? selectedOption.value : "");
//               }}
//               styles={customSelectStyles}
//               placeholder="Select Department"
//             />
//           </div>

//           {/* Manager Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Manager
//             </label>
//             <Select
//               options={managerOptions}
//               value={
//                 manager
//                   ? managerOptions?.find((opt) => opt.value === manager)
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 setManager(selectedOption ? selectedOption.value : "");
//               }}
//               styles={customSelectStyles}
//               placeholder="Select Manager"
//             />
//           </div>

//           {/* Location Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Location
//             </label>
//             <Select
//               options={locationOptions}
//               value={
//                 locations
//                   ? locationOptions?.find((opt) => opt.value === locations)
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 setLocations(selectedOption ? selectedOption.value : "");
//               }}
//               styles={customSelectStyles}
//               placeholder="Select Location"
//             />
//           </div>
//         </div>

//         {/* Additional Filters Row */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//           {/* Rating Range Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Skill Rating
//             </label>
//             <Select
//               options={[
//                 { value: "0-2", label: "Beginner (0-2)" },
//                 { value: "2-4", label: "Intermediate (2-4)" },
//                 { value: "4-5", label: "Expert (4-5)" },
//               ]}
//               value={
//                 ratingRange
//                   ? {
//                       value: ratingRange,
//                       label: getRatingRangeLabel(ratingRange),
//                     }
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 setRatingRange(selectedOption ? selectedOption.value : null);
//               }}
//               styles={customSelectStyles}
//               placeholder="Select Rating Range"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-end space-x-2">
//             <button
//               onClick={handleReset}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading and Error States */}
//       {isLoading && (
//         <div className="flex justify-center items-center">
//           <CircularProgress />
//         </div>
//       )}

//       {error && (
//         <div className="text-red-500 text-center">
//           {error.message || "An error occurred"}
//         </div>
//       )}

//       {/* Results Section */}
//       {data && data.success && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {/* Table or Results Rendering Logic */}
//           {/* You can customize this based on your specific requirements */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reports;
///old is gold
// import React, { useState, useMemo } from "react";
// import { useQuery } from "react-query";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import RemoveIcon from "@mui/icons-material/Remove";
// import CircularProgress from "@mui/material/CircularProgress";
// import DownloadIcon from "@mui/icons-material/Download";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/Tune";
// import axios from "axios";

// // Mock data (replace with actual API call)
// const mockSkillMetrics = {
//   totalSkills: 150,
//   growthRate: 12,
//   averageSkillLevel: 3.7,
//   topSkills: 45,
//   skillGaps: 15,
// };

// const mockDepartmentSkills = [
//   { name: "Engineering", value: 60 },
//   { name: "Design", value: 30 },
//   { name: "Marketing", value: 25 },
//   { name: "Sales", value: 20 },
// ];

// const mockSkillLevels = [
//   { name: "Beginner", value: 40 },
//   { name: "Intermediate", value: 35 },
//   { name: "Advanced", value: 20 },
//   { name: "Expert", value: 5 },
// ];

// const mockSkillsData = [
//   {
//     id: "1",
//     name: "React",
//     department: "Engineering",
//     proficiencyLevel: "Advanced",
//     employeeCount: 25,
//     trend: "up",
//   },
//   {
//     id: "2",
//     name: "Python",
//     department: "Engineering",
//     proficiencyLevel: "Intermediate",
//     employeeCount: 20,
//     trend: "stable",
//   },
// ];

// const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

// const SKILL_CATEGORIES = [
//   "Technical Skills",
//   "Soft Skills",
//   "Leadership",
//   "Project Management",
//   "Communication",
//   "Problem Solving",
//   "Team Collaboration",
//   "Innovation",
// ];

// const EXPERIENCE_LEVELS = [
//   "0-1 years",
//   "1-3 years",
//   "3-5 years",
//   "5-10 years",
//   "10+ years",
// ];

// const SkillReport = () => {
//   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     department: "",
//     skillLevel: "",
//     dateRange: "30",
//     location: "",
//     search: "",
//     categories: [],
//     experienceLevels: [],
//     certifications: false,
//     activeProjects: false,
//     mentorship: false,
//   });

//   // Filter panel visibility
//   const [showFilters, setShowFilters] = useState(false);

//   // Selected skills for report generation
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   // Fetch skills data
//   const fetchSkillsData = async () => {
//     try {
//       const response = await axios.get("/api/skill-reports", {
//         params: {
//           ...filters,
//           selectedSkills,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skill data:", error);
//       throw error;
//     }
//   };

//   // Simulated API call using react-query
//   const {
//     data: skillData,
//     isLoading,
//     error,
//   } = useQuery("skillReport", fetchSkillsData, {
//     // Fallback to mock data if API fails
//     placeholderData: {
//       metrics: mockSkillMetrics,
//       departmentSkills: mockDepartmentSkills,
//       skillLevels: mockSkillLevels,
//       skills: mockSkillsData,
//     },
//   });

//   // Filter skills based on all criteria
//   const filteredSkills = useMemo(() => {
//     if (!skillData?.skills) return [];

//     return skillData.skills.filter((skill) => {
//       const searchMatch = filters.search
//         ? skill.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//           skill.department.toLowerCase().includes(filters.search.toLowerCase())
//         : true;

//       const departmentMatch = filters.department
//         ? skill.department === filters.department
//         : true;

//       const levelMatch = filters.skillLevel
//         ? skill.proficiencyLevel === filters.skillLevel
//         : true;

//       return searchMatch && departmentMatch && levelMatch;
//     });
//   }, [skillData?.skills, filters]);

//   // Generate and download report
//   const generateReport = () => {
//     const selectedData = filteredSkills.filter((skill) =>
//       selectedSkills.includes(skill.id)
//     );

//     // Create CSV content
//     const headers = [
//       "Skill Name",
//       "Department",
//       "Proficiency Level",
//       "Employees",
//       "Trend",
//     ];
//     const csvContent = [
//       headers.join(","),
//       ...selectedData.map((skill) =>
//         [
//           skill.name,
//           skill.department,
//           skill.proficiencyLevel,
//           skill.employeeCount,
//           skill.trend,
//         ].join(",")
//       ),
//     ].join("\n");

//     // Create and trigger download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `skill-report-${new Date().toISOString().split("T")[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   // Loading and Error States
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <CircularProgress className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Skill Matrix Report
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Comprehensive analysis of organizational skills and competencies
//           </p>
//         </div>

//         <div className="flex gap-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
//           >
//             <TuneIcon className="w-4 h-4" />
//             Filters
//           </button>
//           <button
//             onClick={generateReport}
//             disabled={selectedSkills.length === 0}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
//               ${
//                 selectedSkills.length === 0
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700"
//               }`}
//           >
//             <DownloadIcon className="w-4 h-4" />
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search skills, departments, or employees..."
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           value={filters.search}
//           onChange={(e) =>
//             setFilters((prev) => ({ ...prev, search: e.target.value }))
//           }
//         />
//       </div>

//       {/* Advanced Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <FilterListIcon className="w-5 h-5" />
//               Advanced Filters
//             </h3>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <TuneIcon className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Department Filter */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={filters.department}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     department: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">All Departments</option>
//                 {["Engineering", "Design", "Marketing", "Sales"].map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Manager Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//               Manager
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={filters.department}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     department: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">All Managers</option>
//                 {["Engineering", "Design", "Marketing", "Sales"].map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>
//              {/* Location Filter */}
//              <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//               Location
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={filters.department}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     department: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">All Locations</option>
//                 {["Engineering", "Design", "Marketing", "Sales"].map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Skill Level Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Skill Level
//               </label>
//               <select
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 value={filters.skillLevel}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     skillLevel: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">All Levels</option>
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//                 <option value="Expert">Expert</option>
//               </select>
//             </div>

//             {/* Additional Filters */}
//             <div className="space-y-2">
//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={filters.certifications}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       certifications: e.target.checked,
//                     }))
//                   }
//                 />
//                 <span className="ml-2">Top Skills</span>
//               </label>

//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={filters.activeProjects}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       activeProjects: e.target.checked,
//                     }))
//                   }
//                 />
//                 <span className="ml-2">Overall Rating</span>
//               </label>

//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={filters.activeProjects}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       activeProjects: e.target.checked,
//                     }))
//                   }
//                 />
//                 <span className="ml-2"> Employee Assessment Details</span>
//               </label>

//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={filters.activeProjects}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       activeProjects: e.target.checked,
//                     }))
//                   }
//                 />
//                 <span className="ml-2">Skills Distribution </span>
//               </label>

//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={filters.activeProjects}
//                   onChange={(e) =>
//                     setFilters((prev) => ({
//                       ...prev,
//                       activeProjects: e.target.checked,
//                     }))
//                   }
//                 />
//                 <span className="ml-2">Skill Gap </span>
//               </label>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Skills Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox"
//                   checked={selectedSkills.length === filteredSkills.length}
//                   onChange={(e) => {
//                     setSelectedSkills(
//                       e.target.checked
//                         ? filteredSkills.map((skill) => skill.id)
//                         : []
//                     );
//                   }}
//                 />
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Skill Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Department
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Proficiency Level
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Employees
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Trend
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredSkills.map((skill) => (
//               <tr
//                 key={skill.id}
//                 className={`hover:bg-gray-50 ${
//                   selectedSkills.includes(skill.id) ? "bg-indigo-50" : ""
//                 }`}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox"
//                     checked={selectedSkills.includes(skill.id)}
//                     onChange={(e) => {
//                       setSelectedSkills((prev) =>
//                         e.target.checked
//                           ? [...prev, skill.id]
//                           : prev.filter((id) => id !== skill.id)
//                       );
//                     }}
//                   />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {skill.name}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">
//                     {skill.department}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       skill.proficiencyLevel === "Expert"
//                         ? "bg-green-100 text-green-800"
//                         : skill.proficiencyLevel === "Advanced"
//                         ? "bg-blue-100 text-blue-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {skill.proficiencyLevel}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {skill.employeeCount}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {skill.trend === "up" && (
//                     <ArrowUpwardIcon className="w-5 h-5 text-green-500" />
//                   )}
//                   {skill.trend === "down" && (
//                     <ArrowDownwardIcon className="w-5 h-5 text-red-500" />
//                   )}
//                   {skill.trend === "stable" && (
//                     <RemoveIcon className="w-5 h-5 text-gray-500" />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SkillReport;
