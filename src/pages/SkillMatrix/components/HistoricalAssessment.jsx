/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
  Scatter,
  ComposedChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import {
  FiSearch,
  FiDownload,
  FiFilter,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// Custom Components
const CustomDot = ({ cx, cy, payload, value }) => {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#fff"
      stroke={value > 3 ? "#10B981" : "#EF4444"}
      strokeWidth={2}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.5 }}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-800">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mt-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-sm">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

const HistoricalAssessment = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [historicalData, setHistoricalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedSkill, setSelectedSkill] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("chart");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
        {
          headers: { Authorization: authToken }, 
        }
      );
      console.log("API Response:", response.data);
      setHistoricalData(response.data.data);
      setFilteredData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [organisationId]);

  useEffect(() => {
    if (selectedEmployee) {
      const filtered = historicalData.filter(emp => emp.employeeId === selectedEmployee);
      setFilteredData(filtered);
    } else {
      // Show top 5 performers by default
      const topPerformers = [...historicalData]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 1);
      setFilteredData(topPerformers);
    }
  }, [selectedEmployee, historicalData]);
  

  const getAllSkills = () => {
    const skillSet = new Set();
    historicalData.forEach((employee) => {
      employee.skillHistory.forEach((skill) => {
        skillSet.add(skill.skillName);
      });
    });
    return Array.from(skillSet);
  };
   // Add this function to process top performers data
const getTopPerformersData = () => {
  const topPerformers = [...historicalData]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 5); //  //5 ..Get top 5 performers

  return {
    processedData: topPerformers.map(employee => ({
      name: employee.employeeName,
      rating: employee.averageRating,
      growth: employee.growthRate,
      skills: employee.skillHistory.length
    })),
    labels: topPerformers.map(emp => emp.employeeName)
  };
};


  const processChartData = (skillHistory) => {
    const sortedHistory = skillHistory.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const uniqueSkills = [
      ...new Set(sortedHistory.map((item) => item.skillName)),
    ];

    // Filter data based on selected time range
    const filteredHistory = sortedHistory.filter((item) => {
      if (selectedTimeRange === "all") return true;
      const date = new Date(item.date);
      const now = new Date();
      const monthsAgo = new Date();
      monthsAgo.setMonth(now.getMonth() - parseInt(selectedTimeRange));
      return date >= monthsAgo;
    });

    const processedData = filteredHistory.reduce((acc, curr) => {
      const existingDate = acc.find((item) => item.date === curr.date);
      if (existingDate) {
        existingDate[curr.skillName] = curr.rating;
        if (curr.managerRating) {
          existingDate[`${curr.skillName}_mgr`] = curr.managerRating;
        }
      } else {
        const newPoint = {
          date: curr.date,
          [curr.skillName]: curr.rating,
        };
        if (curr.managerRating) {
          newPoint[`${curr.skillName}_mgr`] = curr.managerRating;
        }
        acc.push(newPoint);
      }
      return acc;
    }, []);

    return { processedData, uniqueSkills };
  };

  const handleExportData = () => {
    const exportData = filteredData.map((employee) => ({
      "Employee Name": employee.employeeName,
      Department: employee.department || "Not Assigned",
      "Average Rating": employee.averageRating.toFixed(2),
      "Growth Rate": employee.growthRate.toFixed(1),
      Skills: employee.skillHistory
        .map((skill) => `${skill.skillName}: ${skill.rating}`)
        .join(", "),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historical Assessment");
    XLSX.writeFile(wb, "Historical_Assessment_Report.xlsx");
  };
  const renderSkillChart = (employee) => {
    const { processedData, uniqueSkills } = processChartData(
      employee.skillHistory
    );

    return (
      <motion.div
        className="bg-white rounded-xl  p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-sm font-medium text-blue-600">
              Average Rating
            </h4>
            <p className="text-2xl font-bold text-blue-700">
              {employee.averageRating.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-sm font-medium text-green-600">Growth Rate</h4>
            <p className="text-2xl font-bold text-green-700">
              {employee.growthRate.toFixed(1)}
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="text-sm font-medium text-purple-600">
              Total Skills
            </h4>
            <p className="text-2xl font-bold text-purple-700">
              {uniqueSkills.length}
            </p>
          </motion.div>
        </div>
        

        {/* Main Chart */}
        <div className="relative bg-white p-4 rounded-lg ">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={processedData}>
              <defs>
                {uniqueSkills.map((skill, index) => (
                  <linearGradient
                    key={`gradient-${skill}`}
                    id={`gradient-${skill}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`hsl(${index * 30}, 70%, 50%)`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`hsl(${index * 30}, 70%, 50%)`}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                opacity={0.5}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                padding={{ left: 20, right: 20 }}
              />

              <YAxis
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                ticks={[0, 1, 2, 3, 4, 5]}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm font-medium">{value}</span>
                )}
              />

              {uniqueSkills.map((skill, index) => (
                <React.Fragment key={skill}>
                  <Area
                    type="monotone"
                    dataKey={skill}
                    // name={`${skill} (Self)`}
                    stroke={`hsl(${index * 30}, 70%, 50%)`}
                    fill={`url(#gradient-${skill})`}
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 6, strokeWidth: 3 }}
                  />

                  {/* <Line
                    type="monotone"
                    dataKey={`${skill}_mgr`}
                    name={`${skill} (Manager)`}
                    stroke={`hsl(${index * 30}, 70%, 50%)`}
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 6, strokeWidth: 3 }}
                  /> */}
                </React.Fragment>
              ))}

              <ReferenceLine
                y={3}
                stroke="#9CA3AF"
                strokeDasharray="3 3"
                label={{
                  value: "Target Level",
                  position: "insideTopLeft",
                  fill: "#6B7280",
                  fontSize: 12,
                }}
              />
            </ComposedChart>
{/* 
            <ComposedChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="rating" 
          fill="#8884d8" 
          stroke="#8884d8" 
          name="Overall Rating"
        />
        <Line 
          type="monotone" 
          dataKey="growth" 
          stroke="#82ca9d" 
          name="Growth Rate"
        />
      </ComposedChart> */}
          </ResponsiveContainer>
        </div>

        {/* Skill Details Grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uniqueSkills.map((skill, index) => {
            const skillData = employee.skillHistory.filter(h => h.skillName === skill);
            const latest = skillData[skillData.length - 1];
            const progress = ((latest?.rating || 0) / 5) * 100;
            
            return (
              <motion.div 
                key={skill}
                className="p-4 rounded-lg bg-gray-50"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold text-gray-700">{skill}</h4>
                <div className="mt-2 space-y-2">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Self Rating
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {latest?.rating || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Manager Rating
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          {latest?.managerRating || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((latest?.managerRating || 0) / 5) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        
      </motion.div>
    );
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* <FiTrendingUp className="text-2xl text-blue-600" /> */}
            <h2 className="text-2xl font-bold text-gray-800">
              Historical Skill Analysis
            
              <span className="text-sm md:text-base font-light text-gray-600 block mt-2">
              Overview of past assessments and skill trends.
          </span>

            </h2>

            {/* <h2 className="">
          <span className="text-2xl md:text-2xl font-extrabold text-gray-800">
            Employee Performance Overview
          </span>
          <span className="text-sm md:text-base font-light text-gray-600 block mt-2">
            Aggregated Ratings Across All Assessments
          </span>
        </h2> */}


            
          </div>

          {/* Controls Section */}
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              {/* <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              /> */}
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="pl-4 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employee</option>
                {historicalData.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.employeeName}
                  </option>
                ))}
              </select>
            </div>

            {/* <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Skills</option>
              {getAllSkills().map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select> */}

            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
            </select>

           

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FiDownload />
              Export Data
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Data Display
          <AnimatePresence>
            <div className="space-y-8">
              {filteredData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-500"
                >
                  No matching records found
                </motion.div>
              ) : (
                filteredData.map((employee) => (
                  <motion.div
                    key={employee.employeeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {renderSkillChart(employee)}
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        )}

        {/* Summary Statistics */}
        {/* {!isLoading && filteredData.length > 0 && (
          <motion.div
            className="mt-8 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Summary Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredData.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Average Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {(
                    filteredData.reduce((acc, emp) => acc + emp.growthRate, 0) /
                    filteredData.length
                  ).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Total Skills Tracked</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getAllSkills().length}
                </p>
              </div>
            </div>
          </motion.div>
        )} */}
      </div>
    </div>
  );



  // return (
  //   <div className="container mx-auto px-4">
  //     <BoxComponent>
  //       {/* <HeadingOneLineInfo
  //         heading="Historical Skill Analysis"
  //         info="Track skill progression and development over time"
  //       /> */}

  //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //         {/* Analysis Controls Card */}
  //         <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
  //           <h3 className="text-xl font-bold pb-2">Analysis Controls</h3>
            
  //           <div className="space-y-4">
  //             <div>
  //               <label className="text-sm font-medium text-gray-700">Select Employee</label>
  //               <select
  //                 value={selectedEmployee}
  //                 onChange={(e) => setSelectedEmployee(e.target.value)}
  //                 className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
  //               >
  //                 <option value="">Select Employee</option>
  //                 {historicalData.map((emp) => (
  //                   <option key={emp.employeeId} value={emp.employeeId}>
  //                     {emp.employeeName}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>

  //             <div>
  //               <label className="text-sm font-medium text-gray-700">Time Range</label>
  //               <select
  //                 value={selectedTimeRange}
  //                 onChange={(e) => setSelectedTimeRange(e.target.value)}
  //                 className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
  //               >
  //                 <option value="all">All Time</option>
  //                 <option value="3">Last 3 Months</option>
  //                 <option value="6">Last 6 Months</option>
  //                 <option value="12">Last 12 Months</option>
  //               </select>
  //             </div>

  //             <button
  //               onClick={handleExportData}
  //               className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
  //             >
  //               <FiDownload className="mr-2" />
  //               Export Analysis
  //             </button>
  //           </div>

  //           {/* Quick Stats */}
  //           <div className="border-t pt-4">
  //             <h3 className="text-lg font-semibold mb-3">Quick Statistics</h3>
  //             <div className="space-y-2">
  //               <div className="bg-blue-50 p-4 rounded-lg">
  //                 <p className="text-sm text-gray-600">Total Assessments</p>
  //                 <p className="text-2xl font-bold text-blue-600">
  //                   {historicalData.length}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Main Chart Area */}
  //         <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
  //           <div className="mb-6">
  //             <h3 className="text-xl font-bold pb-2">Skill Progression</h3>
  //             {isLoading ? (
  //               <div className="flex justify-center items-center h-64">
  //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //               </div>
  //             ) : (
  //               <AnimatePresence>
  //                 {filteredData.map((employee) => renderSkillChart(employee))}
  //               </AnimatePresence>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </BoxComponent>
  //   </div>
  // );
};

export default HistoricalAssessment;

// this code show all detailed self ,mgr rating for all employee
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { FiSearch, FiDownload, FiFilter, FiBarChart2 } from "react-icons/fi";
// import * as XLSX from "xlsx";

// const HistoricalAssessment = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSkill, setSelectedSkill] = useState("all");
//   const [sortBy, setSortBy] = useState("name");
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState("chart");

//   const fetchHistoricalData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       console.log("API Response:", response.data);
//       setHistoricalData(response.data.data);
//       setFilteredData(response.data.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistoricalData();
//   }, [organisationId]);

//   const getAllSkills = () => {
//     const skillSet = new Set();
//     historicalData.forEach(employee => {
//       employee.skillHistory.forEach(skill => {
//         skillSet.add(skill.skillName);
//       });
//     });
//     return Array.from(skillSet);
//   };

//   const processChartData = (skillHistory) => {
//     const sortedHistory = skillHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
//     const uniqueSkills = [...new Set(sortedHistory.map(item => item.skillName))];

//     const processedData = sortedHistory.reduce((acc, curr) => {
//       const existingDate = acc.find(item => item.date === curr.date);
//       if (existingDate) {
//         existingDate[curr.skillName] = curr.rating;
//         if (curr.managerRating) {
//           existingDate[`${curr.skillName}_mgr`] = curr.managerRating;
//         }
//       } else {
//         const newPoint = {
//           date: curr.date,
//           [curr.skillName]: curr.rating
//         };
//         if (curr.managerRating) {
//           newPoint[`${curr.skillName}_mgr`] = curr.managerRating;
//         }
//         acc.push(newPoint);
//       }
//       return acc;
//     }, []);

//     return { processedData, uniqueSkills };
//   };

//   const handleExportData = () => {
//     const exportData = filteredData.map(employee => ({
//       'Employee Name': employee.employeeName,
//       'Department': employee.department || 'Not Assigned',
//       'Average Rating': employee.averageRating.toFixed(2),
//       'Growth Rate': employee.growthRate.toFixed(1),
//       'Skills': employee.skillHistory.map(skill =>
//         `${skill.skillName}: ${skill.rating}`
//       ).join(', ')
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Historical Assessment");
//     XLSX.writeFile(wb, "Historical_Assessment_Report.xlsx");
//   };

//   const renderSkillChart = (employee) => {
//     const { processedData, uniqueSkills } = processChartData(employee.skillHistory);

//     return (
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800">{employee.employeeName}</h3>
//             <p className="text-gray-600">Department: {employee.department || 'Not Assigned'}</p>
//           </div>
//           <div className="flex gap-4">
//             <div className="text-center">
//               <p className="text-sm text-gray-600">Average Rating</p>
//               <p className="text-lg font-bold text-blue-600">
//                 {employee.averageRating.toFixed(2)}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-600">Growth Rate</p>
//               <p className="text-lg font-bold text-green-600">
//                 {employee.growthRate.toFixed(1)}
//               </p>
//             </div>
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={processedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis
//               domain={[0, 5]}
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
//               }}
//             />
//             <Legend />
//             {uniqueSkills.map((skill, index) => (
//               <React.Fragment key={skill}>
//                 <Line
//                   type="monotone"
//                   dataKey={skill}
//                   name={`${skill} (Self)`}
//                   stroke={`hsl(${index * 30}, 70%, 50%)`}
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   connectNulls
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey={`${skill}_mgr`}
//                   name={`${skill} (Manager)`}
//                   stroke={`hsl(${index * 30}, 70%, 50%)`}
//                   strokeDasharray="5 5"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   connectNulls
//                 />
//               </React.Fragment>
//             ))}
//           </LineChart>
//         </ResponsiveContainer>

//         <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {uniqueSkills.map((skill, index) => {
//             const skillData = employee.skillHistory.filter(h => h.skillName === skill);
//             const latest = skillData[skillData.length - 1];

//             return (
//               <div
//                 key={skill}
//                 className="p-4 rounded-lg bg-gray-50"
//               >
//                 <h4 className="font-semibold text-gray-700">{skill}</h4>
//                 <div className="mt-2">
//                   <p className="text-sm">Self Rating: {latest?.rating || 'N/A'}</p>
//                   <p className="text-sm">Manager Rating: {latest?.managerRating || 'N/A'}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Historical Skill Assessment
//           </h2>
//           <div className="flex flex-wrap gap-4">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employee..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg"
//               />
//             </div>
//             <select
//               value={selectedSkill}
//               onChange={(e) => setSelectedSkill(e.target.value)}
//               className="border rounded-lg px-4 py-2"
//             >
//               <option value="all">All Skills</option>
//               {getAllSkills().map(skill => (
//                 <option key={skill} value={skill}>{skill}</option>
//               ))}
//             </select>
//             <button
//               onClick={handleExportData}
//               className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//             >
//               <FiDownload className="inline-block mr-2" />
//               Export Data
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {filteredData.map(employee => (
//               <div key={employee.employeeId}>
//                 {renderSkillChart(employee)}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoricalAssessment;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
//   Area,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import { FiSearch, FiDownload, FiFilter } from "react-icons/fi";

// const HistoricalAssessment = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSkill, setSelectedSkill] = useState("all");
//   const [sortBy, setSortBy] = useState("name");
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState("chart"); // chart or table

//   const fetchHistoricalData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       setHistoricalData(response.data.data);
//       setFilteredData(response.data.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error:", error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistoricalData();
//   }, [organisationId]);

//   // Get unique skills across all employees
//   const getAllSkills = () => {
//     const skillSet = new Set();
//     historicalData.forEach(employee => {
//       employee.skillHistory.forEach(skill => {
//         skillSet.add(skill.skillName);
//       });
//     });
//     return Array.from(skillSet);
//   };

//   // Enhanced search and filter functionality
//   useEffect(() => {
//     let filtered = [...historicalData];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(emp =>
//         emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Skill filter
//     if (selectedSkill !== "all") {
//       filtered = filtered.filter(emp =>
//         emp.skillHistory.some(skill => skill.skillName === selectedSkill)
//       );
//     }

//     // Sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "rating":
//           return b.averageRating - a.averageRating;
//         case "growth":
//           return b.growthRate - a.growthRate;
//         default:
//           return a.employeeName.localeCompare(b.employeeName);
//       }
//     });

//     setFilteredData(filtered);
//   }, [searchTerm, selectedSkill, sortBy, historicalData]);

//   const renderWaveChart = (employee) => {
//     const chartData = employee.skillHistory.reduce((acc, item) => {
//       const existingDate = acc.find(d => d.date === item.date);
//       if (existingDate) {
//         existingDate[item.skillName] = item.rating;
//       } else {
//         acc.push({
//           date: item.date,
//           [item.skillName]: item.rating
//         });
//       }
//       return acc;
//     }, []);

//     return (
//       <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h3 className="text-xl font-semibold">{employee.employeeName}</h3>
//             <p className="text-gray-600">
//               Department: {employee.department || 'Not Assigned'}
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-600">Average Rating</p>
//               <p className="text-lg font-semibold text-blue-600">
//                 {employee.averageRating.toFixed(2)}
//               </p>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg mt-2">
//               <p className="text-sm text-gray-600">Growth Rate</p>
//               <p className="text-lg font-semibold text-green-600">
//                 {employee.growthRate.toFixed(1)}
//               </p>
//             </div>
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={chartData}>
//             <defs>
//               {employee.skillHistory
//                 .map(skill => skill.skillName)
//                 .filter((value, index, self) => self.indexOf(value) === index)
//                 .map((skill, index) => (
//                   <linearGradient
//                     key={skill}
//                     id={`color${index}`}
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor={`hsl(${index * 30}, 70%, 50%)`}
//                       stopOpacity={0.8}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor={`hsl(${index * 30}, 70%, 50%)`}
//                       stopOpacity={0}
//                     />
//                   </linearGradient>
//                 ))}
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis domain={[0, 5]} />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "rgba(255, 255, 255, 0.9)",
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
//               }}
//             />
//             <Legend />
//             {employee.skillHistory
//               .map(skill => skill.skillName)
//               .filter((value, index, self) => self.indexOf(value) === index)
//               .map((skill, index) => (
//                 <Area
//                   key={skill}
//                   type="monotone"
//                   dataKey={skill}
//                   name={skill}
//                   stroke={`hsl(${index * 30}, 70%, 50%)`}
//                   fillOpacity={1}
//                   fill={`url(#color${index})`}
//                 />
//               ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Skill Growth Analysis
//           </h2>
//           <div className="flex flex-wrap gap-4">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employee..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <select
//               value={selectedSkill}
//               onChange={(e) => setSelectedSkill(e.target.value)}
//               className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Skills</option>
//               {getAllSkills().map(skill => (
//                 <option key={skill} value={skill}>{skill}</option>
//               ))}
//             </select>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="name">Sort by Name</option>
//               <option value="rating">Sort by Rating</option>
//               <option value="growth">Sort by Growth</option>
//             </select>
//             <button
//               onClick={() => setViewMode(viewMode === "chart" ? "table" : "chart")}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             >
//               {viewMode === "chart" ? "View Table" : "View Charts"}
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : viewMode === "chart" ? (
//           <div className="grid gap-8">
//             {filteredData.map(employee => (
//               <div key={employee.employeeId}>
//                 {renderWaveChart(employee)}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Department
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Average Rating
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Growth Rate
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredData.map(employee => (
//                   <tr key={employee.employeeId}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {employee.employeeName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {employee.department || 'Not Assigned'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {employee.averageRating.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {employee.growthRate.toFixed(1)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoricalAssessment;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const HistoricalAssessment = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchHistoricalData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       setHistoricalData(response.data.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error:", error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistoricalData();
//   }, [organisationId]);

//   const processChartData = (skillHistory) => {
//     // Group skills by date
//     const groupedByDate = skillHistory.reduce((acc, item) => {
//       const date = item.date;
//       if (!acc[date]) {
//         acc[date] = {
//           date,
//           skills: {}
//         };
//       }
//       acc[date].skills[item.skillName] = item.rating;
//       return acc;
//     }, {});

//     return Object.values(groupedByDate);
//   };

//   const renderEmployeeChart = (employee) => {
//     const chartData = processChartData(employee.skillHistory);
//     const uniqueSkills = [...new Set(employee.skillHistory.map(item => item.skillName))];

//     return (
//       <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h3 className="text-xl font-semibold">{employee.employeeName}</h3>
//             <p className="text-gray-600">Department: {employee.department || 'Not Assigned'}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Average Rating</p>
//             <p className="text-lg font-semibold text-blue-600">
//               {employee.averageRating.toFixed(2)}
//             </p>
//             <p className="text-sm text-gray-600">Growth Rate</p>
//             <p className="text-lg font-semibold text-green-600">
//               {employee.growthRate.toFixed(1)}
//             </p>
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis
//               domain={[0, 5]}
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#f3f4f6",
//                 borderRadius: "8px",
//                 border: "1px solid #d1d5db",
//                 padding: "10px"
//               }}
//             />
//             <Legend />
//             {uniqueSkills.map((skill, index) => (
//               <Line
//                 key={skill}
//                 type="monotone"
//                 dataKey={`skills.${skill}`}
//                 name={skill}
//                 stroke={`hsl(${index * 30}, 70%, 50%)`}
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Skill Growth Analysis
//         </h2>
//         <div className="flex gap-4">
//           <select
//             value={selectedEmployee || ''}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">All Employees</option>
//             {historicalData.map(emp => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <div className="grid gap-6">
//           {historicalData
//             .filter(emp => !selectedEmployee || emp.employeeId === selectedEmployee)
//             .map(employee => (
//               <div key={employee.employeeId}>
//                 {renderEmployeeChart(employee)}
//               </div>
//             ))
//           }
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoricalAssessment;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const FetchEvaluateAssSkills = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchHistoricalData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//         {
//           params: {
//             employeeId: selectedEmployee,
//             startDate: dateRange.startDate,
//             endDate: dateRange.endDate
//           },
//           headers: { Authorization: authToken }
//         }
//       );
//       setHistoricalData(response.data.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching historical data:", error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistoricalData();
//   }, [organisationId, selectedEmployee, dateRange]);

//   const renderGrowthChart = (employee) => {
//     if (!employee?.assessmentHistory?.length) {
//       return <div>No assessment history available</div>;
//     }

//     const chartData = employee.assessmentHistory.map(history => ({
//       date: history.date,
//       rating: history.overallRating,
//       ...history.skillAssessments.reduce((acc, skill) => ({
//         ...acc,
//         [skill.skillName]: skill.rating
//       }), {})
//     }));

//     if (!chartData?.length || !chartData[0]) {
//       return <div>No chart data available</div>;
//     }

//     return (
//       <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
//             <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="#6b7280" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#f3f4f6",
//                 borderRadius: "8px",
//                 border: "1px solid #d1d5db",
//                 padding: "10px"
//               }}
//             />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="rating"
//               stroke="#8884d8"
//               name="Overall Rating"
//               strokeWidth={2}
//             />
//             {Object.keys(chartData[0] || {})
//               .filter(key => key !== 'date' && key !== 'rating')
//               .map((skill, index) => (
//                 <Line
//                   key={skill}
//                   type="monotone"
//                   dataKey={skill}
//                   stroke={`hsl(${index * 30}, 70%, 50%)`}
//                   name={skill}
//                   strokeWidth={2}
//                 />
//               ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Historical Assessment Analysis
//         </h2>
//         <div className="flex gap-4">
//           <input
//             type="date"
//             value={dateRange.startDate}
//             onChange={(e) => setDateRange(prev => ({
//               ...prev,
//               startDate: e.target.value
//             }))}
//             className="border rounded px-3 py-2"
//           />
//           <input
//             type="date"
//             value={dateRange.endDate}
//             onChange={(e) => setDateRange(prev => ({
//               ...prev,
//               endDate: e.target.value
//             }))}
//             className="border rounded px-3 py-2"
//           />
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : historicalData?.length > 0 ? (
//         <div className="grid gap-6">
//           {historicalData.map(employee => (
//             <div key={employee.employeeId} className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-semibold">{employee.employeeName}</h3>
//                   <p className="text-gray-600">{employee.department}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-600">Growth Rate</p>
//                   <p className="text-lg font-semibold text-green-600">
//                     {(employee.growthRate * 100).toFixed(1)}%
//                   </p>
//                 </div>
//               </div>
//               {renderGrowthChart(employee)}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">No historical data available</div>
//       )}
//     </div>
//   );
// };

// export default FetchEvaluateAssSkills;