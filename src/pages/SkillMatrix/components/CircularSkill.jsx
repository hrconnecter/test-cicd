/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import axios from "axios";
import Select from "react-select";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Tooltip from "@mui/material/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CircularProgress } from "@mui/material";
import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import PeopleIcon from "@mui/icons-material/People";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";

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

const CircularSkill = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();

  // States
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [department, setDepartment] = useState({ id: "", name: "" });
  const [manager, setManager] = useState("");
  const [locations, setLocations] = useState("");
  const [ratingRange, setRatingRange] = useState(null);
  const [reportType, setReportType] = useState("skillProficiency");
  const [skillFilter, setSkillFilter] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Custom hook for filters
  const { Departmentoptions, managerOptions, locationOptions } =
    useSkillMatrixFilter(organisationId);
  // Rendering functions
  const renderCircularRating = (rating) => {
    const segments = 5;
    const filledSegments = Math.min(rating, segments);

    return (
      <div className="relative w-8 h-8 transition-transform hover:scale-110">
        <svg viewBox="0 0 36 36" className="w-8 h-8">
          {[...Array(segments)].map((_, idx) => {
            const startAngle = idx * 72 - 90;
            const endAngle = startAngle + 72;
            const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

            return (
              <path
                key={idx}
                d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
                fill={idx < filledSegments ? "#4B5563" : "#E5E7EB"}
                className="transition-colors duration-200"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const getSkillDescription = (skillName) => {
    const descriptions = {
      React: "Frontend JavaScript library",
      Node: "Backend JavaScript runtime",
      Python: "General-purpose programming language",
      JavaScript: "Programming language for web development",
      TypeScript: "Typed superset of JavaScript",
      Angular: "Frontend web application framework",
      Vue: "Progressive JavaScript framework",
      Java: "Object-oriented programming language",
      "C#": ".NET programming language",
      PHP: "Server-side scripting language",
      SQL: "Database query language",
      MongoDB: "NoSQL database",
      AWS: "Cloud computing platform",
      Docker: "Containerization platform",
      Kubernetes: "Container orchestration",
      Git: "Version control system",
    };
    return descriptions[skillName] || "Skill description not available";
  };

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

  const getReportTypeTooltip = (type) => {
    const tooltips = {
      skillProficiency:
        "View detailed breakdown of skill levels across the organization",
      topRatedSkills: "Discover the highest-rated and most proficient skills",
      skillGapAnalysis: "Identify areas where skill development is needed",
    };
    return tooltips[type] || "";
  };

  // Data processing functions
  const getSortedSkills = (data) => {
    const skillMap = new Map();
    data.forEach((employee) => {
      employee.skillHistory?.forEach((skill) => {
        const currentMax = skillMap.get(skill.skillName) || 0;
        skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
      });
    });
    return Array.from(skillMap.entries())
      .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
      .map(([skillName]) => skillName);
  };

  const calculateSkillCounts = (data) => {
    const skillCounts = new Map();
    getSortedSkills(data).forEach((skillName) => {
      const count = data.reduce((acc, employee) => {
        return (
          acc +
          (employee.skillHistory?.some(
            (skill) => skill.skillName === skillName && skill.rating > 0
          )
            ? 1
            : 0)
        );
      }, 0);
      skillCounts.set(skillName, count);
    });
    return skillCounts;
  };
  // Data fetching and filtering
  const fetchHistoricalData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalCircularOrg`,
        {
          headers: { Authorization: authToken },
          params: {
            reportType,
            departmentId: department.id || undefined,
            managerId: manager || undefined,
            workLocationId: locations || undefined,
            ratingRange: ratingRange || undefined,
            search: searchTerm || undefined,
          },
        }
      );

      let filteredData = response.data.data;

      // Apply filters
      if (skillFilter !== "all") {
        filteredData = filteredData.filter((employee) => {
          return employee.skillHistory?.some((skill) => {
            switch (skillFilter) {
              case "high":
                return skill.rating >= 4;
              case "medium":
                return skill.rating >= 2 && skill.rating <= 3;
              case "low":
                return skill.rating <= 1;
              default:
                return true;
            }
          });
        });
      }

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter((employee) => {
          const matchEmployee = employee.employeeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchSkills = employee.skillHistory?.some((skill) =>
            skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return matchEmployee || matchSkills;
        });
      }

      setHistoricalData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setDepartment({ id: "", name: "" });
    setManager("");
    setLocations("");
    setRatingRange(null);
    setSearchTerm("");
    setReportType("skillProficiency");
    setSkillFilter("all");
    setSelectedSkills([]);
    fetchHistoricalData();
  };

  // Effect hooks
  useEffect(() => {
    fetchHistoricalData();
  }, [
    organisationId,
    authToken,
    department.id,
    manager,
    locations,
    ratingRange,
    reportType,
    searchTerm,
    skillFilter,
  ]);

  // Add this function inside the CircularSkill component
  const downloadExcelReport = () => {
    // Prepare headers
    const headers = [
      "Employee Name",
      ...getSortedSkills(historicalData),
      "Total Skills",
    ];

    // Prepare data rows
    const data = historicalData.map((employee) => {
      const skillMap = new Map(
        employee.skillHistory?.map((skill) => [skill.skillName, skill.rating])
      );

      return [
        employee.employeeName,
        ...getSortedSkills(historicalData).map(
          (skillName) => skillMap.get(skillName) || 0
        ),
        employee.skillHistory?.length || 0,
      ];
    });

    // Add team coverage row
    const teamCoverageRow = [
      "Team Coverage",
      ...getSortedSkills(historicalData).map((skillName) => {
        const counts = calculateSkillCounts(historicalData);
        return counts.get(skillName);
      }),
      historicalData.length,
    ];

    // Combine all rows
    const excelData = [headers, ...data, teamCoverageRow];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Skill Matrix");

    // Generate Excel file
    XLSX.writeFile(wb, "Skill_Matrix_Report.xlsx");
  };
  return (
    <BoxComponent>
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <HeadingOneLineInfo
            heading="Skill Analysis"
            info="View and analyze skill distribution across teams"
          />
          <div className="flex gap-4">
            <input
              type="search"
              value={searchTerm}
              placeholder="Search skills or employees..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <TuneIcon className="w-4 h-4" />
              Filters
            </button>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              className="border-gray-200  text-gray-700 bg-blue-500 hover:bg-gray-700"
              onClick={downloadExcelReport}
              disabled={isLoading || historicalData.length === 0}
            >
              Download Report
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="mb-6 flex space-x-4">
          {["skillProficiency", "topRatedSkills", "skillGapAnalysis"].map(
            (type) => (
              <Tooltip
                key={type}
                title={getReportTypeTooltip(type)}
                arrow
                placement="top"
              >
                <Button
                  variant="outlined"
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 rounded-lg ${
                    reportType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {type === "skillProficiency"
                    ? "Skill Proficiency"
                    : type === "topRatedSkills"
                    ? "Top Rated Skills"
                    : "Skill Gap Analysis"}
                </Button>
              </Tooltip>
            )
          )}
        </div>

        {/* Filters Panel */}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Department Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
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
                  onChange={(selectedOption) =>
                    setManager(selectedOption ? selectedOption.value : "")
                  }
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
                      ? locationOptions?.find((opt) => opt.value === locations)
                      : null
                  }
                  onChange={(selectedOption) =>
                    setLocations(selectedOption ? selectedOption.value : "")
                  }
                  styles={customSelectStyles}
                  isClearable={true}
                  placeholder="Select Location"
                />
              </div>

              {/* Rating Range Filter */}
              {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Rating
                  </label>
                  <Select
                    options={[
                      { value: "0-2", label: "Beginner (0-2)" },
                      { value: "2-4", label: "Intermediate (2-4)" },
                      { value: "4-5", label: "Expert (4-5)" },
                    ]}
                    value={ratingRange ? { value: ratingRange, label: getRatingRangeLabel(ratingRange) } : null}
                    onChange={(selectedOption) => setRatingRange(selectedOption ? selectedOption.value : null)}
                    styles={customSelectStyles}
                    isClearable={true}
                    placeholder="Select Rating Range"
                  />
                </div> */}

              {/* <div className="">
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset Filters
              </Button>
            </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reset All Filters
                </label>
                <Button
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full h-[42px] border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          // <div className="flex">
          //   <div className="flex-grow">
          //     <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          //       <table className="w-full text-sm border-collapse">
          //         <thead>
          //           <tr className="bg-gradient-to-r from-gray-700 to-gray-800">
          //             <th
          //               rowSpan={2}
          //               className="px-4 py-3 text-center font-semibold text-white sticky left-0 bg-gray-800 z-10 border-b border-r border-gray-600"
          //             >
          //               Employee
          //             </th>
          //             <th
          //               colSpan={getSortedSkills(historicalData).length}
          //               className="px-4 py-3 text-center font-semibold text-white z-10 border-b"
          //             >
          //               Skills Assessment Matrix
          //             </th>
          //             <th
          //               rowSpan={2}
          //               className="px-4 py-3 text-center font-semibold text-white sticky right-0 bg-gray-800 z-10 border-b border-l border-gray-600"
          //             >
          //               Total
          //             </th>
          //           </tr>
          //           <tr className="bg-gray-700">
          //             {getSortedSkills(historicalData).map((skillName) => (
          //               <Tooltip
          //                 key={skillName}
          //                 title={`${skillName} - ${getSkillDescription(skillName)}`}
          //                 arrow
          //               >
          //                 <th className="px-4 py-3 text-center text-white border-b cursor-help">
          //                   {skillName}
          //                 </th>
          //               </Tooltip>
          //             ))}
          //           </tr>
          //         </thead>
          //         <tbody>
          //           {historicalData.map((employee, index) => {
          //             const skillMap = new Map(
          //               employee.skillHistory?.map((skill) => [
          //                 skill.skillName,
          //                 skill.rating,
          //               ])
          //             );

          //             return (
          //               <tr
          //                 key={index}
          //                 className={`
          //                   ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          //                   hover:bg-blue-50 transition-all duration-150 ease-in-out
          //                 `}
          //               >
          //                 <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r border-gray-200">
          //                   {employee.employeeName}
          //                 </td>
          //                 {getSortedSkills(historicalData).map((skillName) => (
          //                   <td
          //                     key={skillName}
          //                     className="px-4 py-3 text-center"
          //                   >
          //                     {renderCircularRating(
          //                       skillMap.get(skillName) || 0
          //                     )}
          //                   </td>
          //                 ))}
          //                 <td className="px-4 py-3 text-center font-medium sticky right-0 bg-inherit z-10 border-l border-gray-200">
          //                   {employee.skillHistory?.length || 0}
          //                 </td>
          //               </tr>
          //             );
          //           })}
          //         </tbody>
          //         <tfoot>
          //           <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
          //             <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-300 bg-gray-100">
          //               <Tooltip
          //                 title="Number of team members proficient in each skill"
          //                 arrow
          //                 placement="top"
          //               >
          //                 <span className="cursor-help">Team Coverage</span>
          //               </Tooltip>
          //             </td>
          //             {getSortedSkills(historicalData).map((skillName) => {
          //               const counts = calculateSkillCounts(historicalData);
          //               const count = counts.get(skillName);
          //               return (
          //                 <td key={skillName} className="px-4 py-3 text-center">
          //                   <div className="text-lg font-bold text-gray-700">
          //                     {count}
          //                   </div>
          //                 </td>
          //               );
          //             })}
          //             <td className="px-4 py-3 text-center sticky right-0 font-semibold z-10 border-l border-gray-300 bg-gray-100">
          //               {historicalData.length}
          //             </td>
          //           </tr>
          //         </tfoot>
          //       </table>
          //     </div>
          //   </div>

          //   {/* Rating Guidelines */}
          //   <div className="w-72 ml-8">
          //     <div className="bg-white rounded-lg p-6 border border-gray-100">
          //       <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          //         <Tooltip
          //           title="Guidelines to understand skill proficiency levels"
          //           arrow
          //           placement="top"
          //         >
          //           <span className="cursor-help">Rating Guidelines</span>
          //         </Tooltip>
          //       </h3>
          //       <div className="space-y-4">
          //         {[
          //           { rating: 5, label: "Expert" },
          //           { rating: 4, label: "High Competence" },
          //           { rating: 3, label: "Some Competence" },
          //           { rating: 2, label: "Low Competence" },
          //           { rating: 1, label: "Beginner" },
          //           { rating: 0, label: "Not Rated" },
          //         ].map((item) => (
          //           <div
          //             key={item.rating}
          //             className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
          //           >
          //             {renderCircularRating(item.rating)}
          //             <span className="text-sm text-gray-600">
          //               {item.label}
          //             </span>
          //           </div>
          //         ))}
          //       </div>
          //     </div>
          //   </div>
          // </div>
          //  <div className="flex">
          //   <div className="flex-grow">
          //     <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          //       <table className="w-full text-sm border-collapse">
          //         <thead>
          //           <tr className="bg-gradient-to-r from-gray-200 to-gray-200">
          //             <th
          //               rowSpan={2}
          //               className="px-4 py-3 text-center font-semibold  sticky left-0 bg-gray-100 z-10 border-b border-r border-gray-300"
          //             >
          //               Employee
          //             </th>
          //             <th
          //               colSpan={getSortedSkills(historicalData).length}
          //               className="px-4 py-3 text-center font-semibold  z-10 border-gray-300"
          //             >
          //               Skills Assessment Matrix
          //             </th>
          //             <th
          //               rowSpan={2}
          //               className="px-4 py-3 text-center font-semibold  sticky right-0 bg-gray-100 z-10 border-b border-l border-gray-300"
          //             >
          //               Total
          //             </th>
          //           </tr>
          //           <tr className="bg-gray-200">
          //             {getSortedSkills(historicalData).map((skillName) => (
          //               <Tooltip
          //                 key={skillName}
          //                 title={`${skillName} - ${getSkillDescription(skillName)}`}
          //                 arrow
          //               >
          //                 <th className="px-4 py-3 text-center  border-b cursor-help">
          //                   {skillName}
          //                 </th>
          //               </Tooltip>
          //             ))}
          //           </tr>
          //         </thead>
          //         <tbody>
          //           {historicalData.map((employee, index) => {
          //             const skillMap = new Map(
          //               employee.skillHistory?.map((skill) => [
          //                 skill.skillName,
          //                 skill.rating,
          //               ])
          //             );

          //             return (
          //               <tr
          //                 key={index}
          //                 className={`
          //                   ${index % 2 === 0 ? "bg-white" : "bg-blue-50"}
          //                   hover:bg-blue-50 transition-all duration-150 ease-in-out
          //                 `}
          //               >
          //                 <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r border-gray-100">
          //                   {employee.employeeName}
          //                 </td>
          //                 {getSortedSkills(historicalData).map((skillName) => (
          //                   <td
          //                     key={skillName}
          //                     className="px-4 py-3 text-center items-center place-content-center"
          //                     // className="px-4 py-3 text-center font-medium sticky 0 border-l border-gray-100"
          //                   >
          //                     {renderCircularRating(
          //                       skillMap.get(skillName) || 0
          //                     )}
          //                   </td>
          //                 ))}
          //                 <td className="px-4 py-3 text-center font-medium sticky right-0 bg-inherit z-10 border-l border-gray-100">
          //                   {employee.skillHistory?.length || 0}
          //                 </td>
          //               </tr>
          //             );
          //           })}
          //         </tbody>
          //         <tfoot>
          //           <tr className="bg-gradient-to-r from-blue-50 to-blue-50">
          //             <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-blue-100 bg-blue-50">
          //               <Tooltip
          //                 title="Number of team members proficient in each skill"
          //                 arrow
          //                 placement="top"
          //               >
          //                 <span className="cursor-help text-gray-600">Team Coverage</span>
          //               </Tooltip>
          //             </td>
          //             {getSortedSkills(historicalData).map((skillName) => {
          //               const counts = calculateSkillCounts(historicalData);
          //               const count = counts.get(skillName);
          //               return (
          //                 <td key={skillName} className="px-4 py-3 text-center">
          //                   <div className="text-lg font-bold ">
          //                     {count}
          //                   </div>
          //                 </td>
          //               );
          //             })}
          //             <td className="px-4 py-3 text-center sticky right-0 font-semibold z-10 border-l border-blue-100 bg-blue-50">
          //               <span className="text-gray-600">{historicalData.length}</span>
          //             </td>
          //           </tr>
          //         </tfoot>
          //       </table>
          //     </div>
          //   </div>

          //   {/* Rating Guidelines */}
          //   <div className="w-72 ml-8">
          //     <div className="bg-white rounded-lg p-6 border border-blue-100">
          //       <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-blue-100 pb-2">
          //         <Tooltip
          //           title="Guidelines to understand skill proficiency levels"
          //           arrow
          //           placement="top"
          //         >
          //           <span className="cursor-help">Rating Guidelines</span>
          //         </Tooltip>
          //       </h3>
          //       <div className="space-y-4">
          //         {[
          //           { rating: 5, label: "Expert", color: "text-blue-700" },
          //           { rating: 4, label: "High Competence", color: "text-blue-600" },
          //           { rating: 3, label: "Some Competence", color: "text-blue-500" },
          //           { rating: 2, label: "Low Competence", color: "text-blue-400" },
          //           { rating: 1, label: "Beginner", color: "text-blue-300" },
          //           { rating: 0, label: "Not Rated", color: "text-gray-400" },
          //         ].map((item) => (
          //           <div
          //             key={item.rating}
          //             className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
          //           >
          //             {renderCircularRating(item.rating)}
          //             <span className={`text-sm ${item.color}`}>
          //               {item.label}
          //             </span>
          //           </div>
          //         ))}
          //       </div>
          //     </div>
          //   </div>
          // </div>

          <div className="flex">
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-blue-100">
                      <th
                        rowSpan={2}
                        className="px-4 py-3 text-center font-bold text-gray-800 text-lg sticky left-0 bg-gray-100 z-10 border-b border-r border-gray-200"
                      >
                        Employee
                      </th>
                      <th
                        colSpan={getSortedSkills(historicalData).length}
                        className="px-4 py-3 text-center font-bold text-gray-800 text-lg z-10 border-gray-200"
                      >
                        Skills Assessment Matrix
                      </th>
                      <th
                        rowSpan={2}
                        className="px-4 py-3 text-center font-   font-bold text-gray-800 text-lg sticky right-0 bg-gray-100 z-10 border-b border-l border-gray-200"
                      >
                        Total
                      </th>
                    </tr>
                    <tr className="bg-gray-50">
                      {getSortedSkills(historicalData).map((skillName) => (
                        // // <Tooltip
                        //   key={skillName}
                        //   title={`${skillName} - ${getSkillDescription(
                        //     skillName
                        //   )}`}
                        //   arrow
                        // >
                          <th className="px-4 py-3 text-center text-gray-600 border-b cursor-help">
                            {skillName}
                          </th>
                        // </Tooltip>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.map((employee, index) => {
                      const skillMap = new Map(
                        employee.skillHistory?.map((skill) => [
                          skill.skillName,
                          skill.rating,
                        ])
                      );

                      return (
                        <tr
                          key={index}
                          className={`
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  hover:bg-blue-50 transition-all duration-150 ease-in-out
                `}
                        >
                          <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r border-gray-100">
                            {employee.employeeName}
                          </td>
                          {getSortedSkills(historicalData).map((skillName) => (
                            // <td
                            //   key={skillName}
                            //   className="px-4 py-3 text-center items-center place-content-center"
                            // >
                            //   {renderCircularRating(
                            //     skillMap.get(skillName) || 0
                            //   )}
                            // </td>
                            <td
                              key={skillName}
                              className="px-4 py-3 text-center align-middle"
                            >
                              <div className="flex justify-center items-center">
                                {renderCircularRating(
                                  skillMap.get(skillName) || 0
                                )}
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-medium sticky right-0 bg-inherit z-10 border-l border-gray-100">
                            {employee.skillHistory?.length || 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-100 bg-gray-50">
                        <Tooltip
                          title="Number of team members proficient in each skill"
                          arrow
                          placement="top"
                        >
                          <span className="cursor-help text-gray-600">
                            Team Coverage
                          </span>
                        </Tooltip>
                      </td>
                      {getSortedSkills(historicalData).map((skillName) => {
                        const counts = calculateSkillCounts(historicalData);
                        const count = counts.get(skillName);
                        return (
                          <td key={skillName} className="px-4 py-3 text-center">
                            <div className="text-lg font-bold text-gray-600">
                              {count}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center sticky right-0 font-semibold z-10 border-l border-gray-100 bg-gray-50">
                        <span className="text-gray-600">
                          {historicalData.length}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Rating Guidelines */}
            <div className="w-72 ml-8">
              <div className="bg-white rounded-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-600 mb-4 border-b border-gray-100 pb-2">
                  <Tooltip
                    title="Guidelines to understand skill proficiency levels"
                    arrow
                    placement="top"
                  >
                    <span className="cursor-help">Rating Guidelines</span>
                  </Tooltip>
                </h3>
                <div className="space-y-4">
                  {[
                    { rating: 5, label: "Expert", color: "text-gray-500" },
                    {
                      rating: 4,
                      label: "High Competence",
                      color: "text-gray-500",
                    },
                    {
                      rating: 3,
                      label: "Some Competence",
                      color: "text-gray-500",
                    },
                    {
                      rating: 2,
                      label: "Low Competence",
                      color: "text-gray-500",
                    },
                    { rating: 1, label: "Beginner", color: "text-gray-500" },
                    { rating: 0, label: "Not Rated", color: "text-gray-500" },
                  ].map((item) => (
                    <div
                      key={item.rating}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                    >
                      {renderCircularRating(item.rating)}
                      <span className={`text-sm ${item.color}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BoxComponent>
  );
};

export default CircularSkill;

// _________________above here

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import Select from "react-select";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Tooltip from "@mui/material/Tooltip";
// import TuneIcon from "@mui/icons-material/Tune";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SearchIcon from "@mui/icons-material/Search";
// import { Button, CircularProgress } from "@mui/material";
// import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";

// const customSelectStyles = {
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#E2E8F0",
//     borderRadius: "0.5rem",
//     backgroundColor: "white",
//     boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
//     "&:hover": { borderColor: "#4F46E5" },
//     padding: "2px",
//     minHeight: "42px"
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "#4F46E5" : "white",
//     color: state.isSelected ? "white" : "#1F2937",
//     "&:hover": {
//       backgroundColor: state.isSelected ? "#4F46E5" : "#F3F4F6"
//     }
//   }),
//   menu: (provided) => ({
//     ...provided,
//     borderRadius: "0.5rem",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
//   })
// };

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();

//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [department, setDepartment] = useState({ id: "", name: "" });
//   const [manager, setManager] = useState("");
//   const [locations, setLocations] = useState("");
//   const [ratingRange, setRatingRange] = useState(null);
//   const [reportType, setReportType] = useState("skillProficiency");
//   const [skillFilter, setSkillFilter] = useState("all");

//   const {
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);
//     const colors = {
//       filled: "#4F46E5",
//       empty: "#E5E7EB",
//       hover: "#6366F1"
//     };

//     return (
//       <div className="relative w-10 h-10 transition-transform hover:scale-110">
//         <svg viewBox="0 0 36 36" className="w-10 h-10">
//           {[...Array(segments)].map((_, idx) => {
//             const startAngle = idx * 72 - 90;
//             const endAngle = startAngle + 72;
//             const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
//             const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
//             const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
//             const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

//             return (
//               <path
//                 key={idx}
//                 d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
//                 fill={idx < filledSegments ? colors.filled : colors.empty}
//                 className="transition-colors duration-200 hover:fill-current hover:text-blue-500"
//               />
//             );
//           })}
//         </svg>
//       </div>
//     );
//   };

//   const getSkillDescription = (skillName) => {
//     const descriptions = {
//       React: "Frontend JavaScript library",
//       Node: "Backend JavaScript runtime",
//       Python: "General-purpose programming language",
//       JavaScript: "Programming language for web development",
//       TypeScript: "Typed superset of JavaScript",
//       Angular: "Frontend web application framework",
//       Vue: "Progressive JavaScript framework",
//       Java: "Object-oriented programming language",
//       "C#": ".NET programming language",
//       PHP: "Server-side scripting language",
//       SQL: "Database query language",
//       MongoDB: "NoSQL database",
//       AWS: "Cloud computing platform",
//       Docker: "Containerization platform",
//       Kubernetes: "Container orchestration",
//       Git: "Version control system",
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
//     data.forEach((employee) => {
//       employee.skillHistory?.forEach((skill) => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });
//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
//   };

//   const calculateSkillCounts = (data) => {
//     const skillCounts = new Map();
//     getSortedSkills(data).forEach((skillName) => {
//       const count = data.reduce((acc, employee) => {
//         return acc + (employee.skillHistory?.some(
//           (skill) => skill.skillName === skillName && skill.rating > 0
//         ) ? 1 : 0);
//       }, 0);
//       skillCounts.set(skillName, count);
//     });
//     return skillCounts;
//   };

//   const fetchHistoricalData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalCircularOrg`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             reportType,
//             departmentId: department.id || undefined,
//             managerId: manager || undefined,
//             workLocationId: locations || undefined,
//             ratingRange: ratingRange || undefined,
//             search: searchTerm || undefined
//           }
//         }
//       );
//       setHistoricalData(response.data.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistoricalData();
//   }, [
//     organisationId,
//     authToken,
//     department.id,
//     manager,
//     locations,
//     ratingRange,
//     reportType,
//     searchTerm,
//     skillFilter
//   ]);

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-6 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <HeadingOneLineInfo
//             heading="Skill Matrix Analysis"
//             info="Comprehensive view of team skills and proficiency levels"
//           />
//           <div className="flex gap-4">
//             <div className="relative">
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="search"
//                 placeholder="Search skills or employees..."
//                 className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <Button
//               variant="outlined"
//               startIcon={<TuneIcon />}
//               className="border-gray-200 text-gray-700 hover:bg-gray-50"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               Filters
//             </Button>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Department
//                 </label>
//                 <Select
//                   options={Departmentoptions}
//                   value={department.id ? Departmentoptions?.find(opt => opt.value === department.id) : null}
//                   onChange={(selectedOption) => {
//                     setDepartment({
//                       id: selectedOption ? selectedOption.value : "",
//                       name: selectedOption ? selectedOption.label : "",
//                     });
//                   }}
//                   styles={customSelectStyles}
//                   isClearable
//                   placeholder="Select Department"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Manager
//                 </label>
//                 <Select
//                   options={managerOptions}
//                   value={manager ? managerOptions?.find(opt => opt.value === manager) : null}
//                   onChange={(selectedOption) => setManager(selectedOption ? selectedOption.value : "")}
//                   styles={customSelectStyles}
//                   isClearable
//                   placeholder="Select Manager"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Location
//                 </label>
//                 <Select
//                   options={locationOptions}
//                   value={locations ? locationOptions?.find(opt => opt.value === locations) : null}
//                   onChange={(selectedOption) => setLocations(selectedOption ? selectedOption.value : "")}
//                   styles={customSelectStyles}
//                   isClearable
//                   placeholder="Select Location"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rating Range
//                 </label>
//                 <Select
//                   options={[
//                     { value: "0-2", label: "Beginner (0-2)" },
//                     { value: "2-4", label: "Intermediate (2-4)" },
//                     { value: "4-5", label: "Expert (4-5)" },
//                   ]}
//                   value={ratingRange ? { value: ratingRange, label: ratingRange } : null}
//                   onChange={(selectedOption) => setRatingRange(selectedOption ? selectedOption.value : null)}
//                   styles={customSelectStyles}
//                   isClearable
//                   placeholder="Select Rating Range"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <CircularProgress className="text-blue-600" />
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-white">
//                       Employee
//                     </th>
//                     {getSortedSkills(historicalData).map((skillName) => (
//                       <th key={skillName} className="px-6 py-4 text-center text-sm font-semibold text-white">
//                         <Tooltip title={getSkillDescription(skillName)} arrow>
//                           <span className="cursor-help">{skillName}</span>
//                         </Tooltip>
//                       </th>
//                     ))}
//                     <th className="px-6 py-4 text-center text-sm font-semibold text-white">
//                       Total Skills
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {historicalData.map((employee, index) => {
//                     const skillMap = new Map(
//                       employee.skillHistory?.map((skill) => [
//                         skill.skillName,
//                         skill.rating,
//                       ])
//                     );

//                     return (
//                       <tr
//                         key={index}
//                         className={`
//                           ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                           hover:bg-blue-50 transition-colors duration-200
//                         `}
//                       >
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {employee.employeeName}
//                         </td>
//                         {getSortedSkills(historicalData).map((skillName) => (
//                           <td key={skillName} className="px-6 py-4 text-center">
//                             {renderCircularRating(skillMap.get(skillName) || 0)}
//                           </td>
//                         ))}
//                         <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
//                           {employee.skillHistory?.length || 0}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot>
//                   <tr className="bg-gray-50">
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       Team Coverage
//                     </td>
//                     {getSortedSkills(historicalData).map((skillName) => {
//                       const counts = calculateSkillCounts(historicalData);
//                       return (
//                         <td key={skillName} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
//                           {counts.get(skillName)}
//                         </td>
//                       );
//                     })}
//                     <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
//                       {historicalData.length}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         )}

//         <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">
//             Rating Guidelines
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             {[
//               { rating: 5, label: "Expert", desc: "Complete mastery" },
//               { rating: 4, label: "Advanced"},
//                 { rating: 4, label: "Advanced", desc: "High proficiency" },
//                 { rating: 3, label: "Intermediate", desc: "Good working knowledge" },
//                 { rating: 2, label: "Basic", desc: "Fundamental understanding" },
//                 { rating: 1, label: "Beginner", desc: "Limited experience" },
//                 { rating: 0, label: "Not Rated", desc: "No assessment" }
//               ].map((item) => (
//                 <div
//                   key={item.rating}
//                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   {renderCircularRating(item.rating)}
//                   <div>
//                     <div className="font-medium text-gray-900">{item.label}</div>
//                     <div className="text-sm text-gray-500">{item.desc}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </BoxComponent>
//     );
//   };

//   export default CircularSkill;

// _______________________________
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Tooltip from "@mui/material/Tooltip";

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skillFilter, setSkillFilter] = useState("all");

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8 transition-transform hover:scale-110">
//         <svg viewBox="0 0 36 36" className="w-8 h-8">
//           {[...Array(segments)].map((_, idx) => {
//             const startAngle = idx * 72 - 90;
//             const endAngle = startAngle + 72;
//             const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
//             const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
//             const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
//             const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

//             return (
//               <path
//                 key={idx}
//                 d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
//                 fill={idx < filledSegments ? "#4B5563" : "#E5E7EB"}
//                 className="transition-colors duration-200"
//               />
//             );
//           })}
//         </svg>
//       </div>
//     );
//   };

//   // Existing helper functions remain unchanged
//   const getSkillDescription = (skillName) => {
//     const descriptions = {
//       React: "Frontend JavaScript library",
//       Node: "Backend JavaScript runtime",
//       Python: "General-purpose programming language",
//       JavaScript: "Programming language for web development",
//       TypeScript: "Typed superset of JavaScript",
//       Angular: "Frontend web application framework",
//       Vue: "Progressive JavaScript framework",
//       Java: "Object-oriented programming language",
//       "C#": ".NET programming language",
//       PHP: "Server-side scripting language",
//       SQL: "Database query language",
//       MongoDB: "NoSQL database",
//       AWS: "Cloud computing platform",
//       Docker: "Containerization platform",
//       Kubernetes: "Container orchestration",
//       Git: "Version control system",
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
//     data.forEach((employee) => {
//       employee.skillHistory?.forEach((skill) => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });
//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
//   };

//   const calculateSkillCounts = (data) => {
//     const skillCounts = new Map();
//     getSortedSkills(data).forEach((skillName) => {
//       const count = data.reduce((acc, employee) => {
//         return (
//           acc +
//           (employee.skillHistory?.some(
//             (skill) => skill.skillName === skillName && skill.rating > 0
//           )
//             ? 1
//             : 0)
//         );
//       }, 0);
//       skillCounts.set(skillName, count);
//     });
//     return skillCounts;
//   };

//   const filterSkills = (data) => {
//     if (skillFilter === "all") return data;
//     return data.filter((employee) => {
//       return employee.skillHistory?.some((skill) => {
//         switch (skillFilter) {
//           case "high":
//             return skill.rating >= 4;
//           case "medium":
//             return skill.rating >= 2 && skill.rating <= 3;
//           case "low":
//             return skill.rating <= 1;
//           default:
//             return true;
//         }
//       });
//     });
//   };

//   const filteredData = filterSkills(historicalData).filter((employee) => {
//     const matchEmployee = employee.employeeName
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchSkills = employee.skillHistory?.some((skill) =>
//       skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     return matchEmployee || matchSkills;
//   });

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setHistoricalData(response.data.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchHistoricalData();
//   }, [organisationId, authToken]);

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center mb-8">
//           <HeadingOneLineInfo
//             heading="Skill Analysis"
//             info="View and analyze skill distribution across teams"
//           />
//           <input
//             type="search"
//             placeholder="Search skills or employees..."
//             className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-700 to-gray-800">
//                       <th
//                         rowSpan={2}
//                         className="px-4 py-3 text-center font-semibold text-white sticky left-0 bg-gray-800 z-10 border-b border-r border-gray-600"
//                       >
//                         Employee
//                       </th>
//                       <th
//                         colSpan={getSortedSkills(historicalData).length}
//                         className="px-4 py-3 text-center font-semibold text-white z-10 border-b"
//                       >
//                         Skills Assessment Matrix
//                       </th>
//                       <th
//                         rowSpan={2}
//                         className="px-4 py-3 text-center font-semibold text-white sticky right-0 bg-gray-800 z-10 border-b border-l border-gray-600"
//                       >
//                         Total
//                       </th>
//                     </tr>
//                     <tr className="bg-gray-700">
//                       {getSortedSkills(historicalData).map((skillName) => (
//                         <Tooltip
//                           key={skillName}
//                           title={`${skillName} - ${getSkillDescription(
//                             skillName
//                           )}`}
//                           arrow
//                         >
//                           <th className="px-4 py-3 text-center text-white border-b cursor-help">
//                             {skillName}
//                           </th>
//                         </Tooltip>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((employee, index) => {
//                       const skillMap = new Map(
//                         employee.skillHistory?.map((skill) => [
//                           skill.skillName,
//                           skill.rating,
//                         ])
//                       );

//                       return (
//                         <tr
//                           key={index}
//                           className={`
//                             ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                             hover:bg-blue-50 transition-all duration-150 ease-in-out
//                           `}
//                         >
//                           <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r border-gray-200">
//                             {employee.employeeName}
//                           </td>
//                           {getSortedSkills(historicalData).map((skillName) => (
//                             <td
//                               key={skillName}
//                               className="px-4 py-3 text-center"
//                             >
//                               {renderCircularRating(
//                                 skillMap.get(skillName) || 0
//                               )}
//                             </td>
//                           ))}
//                           <td className="px-4 py-3 text-center font-medium sticky right-0 bg-inherit z-10 border-l border-gray-200">
//                             {employee.skillHistory?.length || 0}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
//                       {/* <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-300 bg-gray-100">
//                         Team Coverage
//                       </td> */}
//                       <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-300 bg-gray-100">
//                         <Tooltip
//                           title="Number of team members proficient in each skill"
//                           arrow
//                           placement="top"
//                         >
//                           <span className="cursor-help">Team Coverage</span>
//                         </Tooltip>
//                       </td>

//                       {getSortedSkills(historicalData).map((skillName) => {
//                         const counts = calculateSkillCounts(historicalData);
//                         const count = counts.get(skillName);
//                         return (
//                           <td key={skillName} className="px-4 py-3 text-center">
//                             <div className="text-lg font-bold text-gray-700">
//                               {count}
//                             </div>
//                           </td>
//                         );
//                       })}
//                       <td className="px-4 py-3 text-center sticky right-0 font-semibold z-10 border-l border-gray-300 bg-gray-100">
//                         {historicalData.length}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>

//             <div className="w-72 ml-8">
//               <div className="bg-white rounded-lg -lg p-6 border border-gray-100">

//                 <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
//                   <Tooltip
//                     title="Guidelines to understand skill proficiency levels"
//                     arrow
//                     placement="top"
//                   >
//                     <span className="cursor-help">Rating Guidelines</span>
//                   </Tooltip>
//                 </h3>

//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "Beginner" },
//                     { rating: 0, label: "Not Rated" },
//                   ].map((item) => (
//                     <div
//                       key={item.rating}
//                       className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
//                     >
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">
//                         {item.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;

// _______________________________________
//Approve backup
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Tooltip from "@mui/material/Tooltip";

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skillFilter, setSkillFilter] = useState("all");

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8 transition-transform hover:scale-110">
//         <svg viewBox="0 0 36 36" className="w-8 h-8">
//           {[...Array(segments)].map((_, idx) => {
//             const startAngle = idx * 72 - 90;
//             const endAngle = startAngle + 72;
//             const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
//             const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
//             const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
//             const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

//             return (
//               <path
//                 key={idx}
//                 d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
//                 fill={idx < filledSegments ? "#4B5563" : "#E5E7EB"}
//                 className="transition-colors duration-200"
//               />
//             );
//           })}
//         </svg>
//       </div>
//     );
//   };

//   // Existing helper functions remain unchanged
//   const getSkillDescription = (skillName) => {
//     const descriptions = {
//       React: "Frontend JavaScript library",
//       Node: "Backend JavaScript runtime",
//       Python: "General-purpose programming language",
//       JavaScript: "Programming language for web development",
//       TypeScript: "Typed superset of JavaScript",
//       Angular: "Frontend web application framework",
//       Vue: "Progressive JavaScript framework",
//       Java: "Object-oriented programming language",
//       "C#": ".NET programming language",
//       PHP: "Server-side scripting language",
//       SQL: "Database query language",
//       MongoDB: "NoSQL database",
//       AWS: "Cloud computing platform",
//       Docker: "Containerization platform",
//       Kubernetes: "Container orchestration",
//       Git: "Version control system",
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
//     data.forEach((employee) => {
//       employee.skillHistory?.forEach((skill) => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });
//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
//   };

//   const calculateSkillCounts = (data) => {
//     const skillCounts = new Map();
//     getSortedSkills(data).forEach((skillName) => {
//       const count = data.reduce((acc, employee) => {
//         return (
//           acc +
//           (employee.skillHistory?.some(
//             (skill) => skill.skillName === skillName && skill.rating > 0
//           )
//             ? 1
//             : 0)
//         );
//       }, 0);
//       skillCounts.set(skillName, count);
//     });
//     return skillCounts;
//   };

//   const filterSkills = (data) => {
//     if (skillFilter === "all") return data;
//     return data.filter((employee) => {
//       return employee.skillHistory?.some((skill) => {
//         switch (skillFilter) {
//           case "high":
//             return skill.rating >= 4;
//           case "medium":
//             return skill.rating >= 2 && skill.rating <= 3;
//           case "low":
//             return skill.rating <= 1;
//           default:
//             return true;
//         }
//       });
//     });
//   };

//   const filteredData = filterSkills(historicalData).filter((employee) => {
//     const matchEmployee = employee.employeeName
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchSkills = employee.skillHistory?.some((skill) =>
//       skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     return matchEmployee || matchSkills;
//   });

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken },
//           }
//         );
//         setHistoricalData(response.data.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchHistoricalData();
//   }, [organisationId, authToken]);

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center mb-8">
//           <HeadingOneLineInfo
//             heading="Skill Analysis"
//             info="View and analyze skill distribution across teams"
//           />
//           <input
//             type="search"
//             placeholder="Search skills or employees..."
//             className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-700 to-gray-800">
//                       <th
//                         rowSpan={2}
//                         className="px-4 py-3 text-center font-semibold text-white sticky left-0 bg-gray-800 z-10 border-b border-r border-gray-600"
//                       >
//                         Employee
//                       </th>
//                       <th
//                         colSpan={getSortedSkills(historicalData).length}
//                         className="px-4 py-3 text-center font-semibold text-white z-10 border-b"
//                       >
//                         Skills Assessment Matrix
//                       </th>
//                       <th
//                         rowSpan={2}
//                         className="px-4 py-3 text-center font-semibold text-white sticky right-0 bg-gray-800 z-10 border-b border-l border-gray-600"
//                       >
//                         Total
//                       </th>
//                     </tr>
//                     <tr className="bg-gray-700">
//                       {getSortedSkills(historicalData).map((skillName) => (
//                         <Tooltip
//                           key={skillName}
//                           title={`${skillName} - ${getSkillDescription(
//                             skillName
//                           )}`}
//                           arrow
//                         >
//                           <th className="px-4 py-3 text-center text-white border-b cursor-help">
//                             {skillName}
//                           </th>
//                         </Tooltip>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((employee, index) => {
//                       const skillMap = new Map(
//                         employee.skillHistory?.map((skill) => [
//                           skill.skillName,
//                           skill.rating,
//                         ])
//                       );

//                       return (
//                         <tr
//                           key={index}
//                           className={`
//                             ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                             hover:bg-blue-50 transition-all duration-150 ease-in-out
//                           `}
//                         >
//                           <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r border-gray-200">
//                             {employee.employeeName}
//                           </td>
//                           {getSortedSkills(historicalData).map((skillName) => (
//                             <td
//                               key={skillName}
//                               className="px-4 py-3 text-center"
//                             >
//                               {renderCircularRating(
//                                 skillMap.get(skillName) || 0
//                               )}
//                             </td>
//                           ))}
//                           <td className="px-4 py-3 text-center font-medium sticky right-0 bg-inherit z-10 border-l border-gray-200">
//                             {employee.skillHistory?.length || 0}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
//                       {/* <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-300 bg-gray-100">
//                         Team Coverage
//                       </td> */}
//                       <td className="px-4 py-3 sticky left-0 font-semibold z-10 border-r border-gray-300 bg-gray-100">
//                         <Tooltip
//                           title="Number of team members proficient in each skill"
//                           arrow
//                           placement="top"
//                         >
//                           <span className="cursor-help">Team Coverage</span>
//                         </Tooltip>
//                       </td>

//                       {getSortedSkills(historicalData).map((skillName) => {
//                         const counts = calculateSkillCounts(historicalData);
//                         const count = counts.get(skillName);
//                         return (
//                           <td key={skillName} className="px-4 py-3 text-center">
//                             <div className="text-lg font-bold text-gray-700">
//                               {count}
//                             </div>
//                           </td>
//                         );
//                       })}
//                       <td className="px-4 py-3 text-center sticky right-0 font-semibold z-10 border-l border-gray-300 bg-gray-100">
//                         {historicalData.length}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>

//             <div className="w-72 ml-8">
//               <div className="bg-white rounded-lg -lg p-6 border border-gray-100">

//                 <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
//                   <Tooltip
//                     title="Guidelines to understand skill proficiency levels"
//                     arrow
//                     placement="top"
//                   >
//                     <span className="cursor-help">Rating Guidelines</span>
//                   </Tooltip>
//                 </h3>

//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "Beginner" },
//                     { rating: 0, label: "Not Rated" },
//                   ].map((item) => (
//                     <div
//                       key={item.rating}
//                       className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
//                     >
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">
//                         {item.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;
