/* eslint-disable no-unused-vars */
//original
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import * as XLSX from "xlsx";
import { FiBarChart, FiDownload } from "react-icons/fi";

const FetchEvaluateAssSkills = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [skillsData, setSkillsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const processEmployeeData = (data) => {
    console.log('Raw Data:', data);
    const employeeMap = {};

    data.forEach(item => {

      console.log('Processing Assessment:', {
        employeeName: item.employeeName,
        originalRating: item.overallRating
      });

      const employeeId = item.employeeId._id;
      if (!employeeMap[employeeId]) {
        employeeMap[employeeId] = {
          employeeId: employeeId,
          employeeName: item.employeeName,
          assessments: [],
          overallRating: 0,
          totalAssessments: 0
        };
      }
      if (item.overallRating !== null) {
        employeeMap[employeeId].assessments.push(item.overallRating);
        employeeMap[employeeId].totalAssessments += 1;
      }
    });

    Object.values(employeeMap).forEach(employee => {
      const validRatings = employee.assessments.filter(rating => rating != null);
      employee.overallRating = validRatings.length > 0
        ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length)
        : 0;

        console.log('Employee Calculated Rating:', {
          name: employee.employeeName,
          ratings: employee.assessments,
          averageRating: employee.overallRating,
          totalAssessments: employee.totalAssessments
        });
    });

    return Object.values(employeeMap)
      .filter(emp => emp.overallRating > 0)
      .sort((a, b) => b.overallRating - a.overallRating);
  };

  useEffect(() => {
    const fetchSkillsData = async () => {
      if (!organisationId) {
        setError("Organisation ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (response.data.data) {
          const processedData = processEmployeeData(response.data.data);
          const chartData = processedData.map(item => ({
            employeeId: item.employeeId,
            employeeName: item.employeeName,
            overallRating: Number(item.overallRating.toFixed(2)),
            totalAssessments: item.totalAssessments
          }));

          setSkillsData(chartData);
          setFilteredData(chartData);
        } else {
          setError(response.data.message || "No data found.");
        }
      } catch (err) {
        setError("Error fetching skills data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillsData();
  }, [organisationId, authToken]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(skillsData);
    } else {
      const filtered = skillsData.filter((item) =>
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, skillsData]);

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const exportData = filteredData.map(item => ({
      'Employee Name': item.employeeName,
      'Overall Rating': item.overallRating,
      'Total Assessments': item.totalAssessments
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Ratings");
    XLSX.writeFile(workbook, "Employee_Performance_Ratings.xlsx");
  };

  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.overallRating - a.overallRating;
      } else {
        return a.overallRating - b.overallRating;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // if (isLoading) return <p className="text-center text-gray-500">Loading data...</p>;
  // if (error) return <p className="text-center text-red-500">{error}</p>;

  const chartHeight = Math.max(400, filteredData.length * 50);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
      {/* <FiBarChart className="text-2xl text-blue-600" /> */}
        <h2 className="">
          <span className="text-2xl md:text-2xl font-extrabold text-gray-800">
            Employee Performance Overview
          </span>
          <span className="text-sm md:text-base font-light text-gray-600 block mt-2">
            Aggregated Ratings Across All Assessments
          </span>
        </h2>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search Employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 px-4 rounded-md border border-gray-300 shadow-sm w-30"
          />
          <button
            onClick={handleSort}
            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Sort by Rating {sortOrder === "desc" ? "↓" : "↑"}
          </button>
          <button
            onClick={handleDownloadExcel}
             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiDownload/>
            Generate Report
          </button>
        </div>
      </div>

      <div className="mt-8">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={filteredData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => `${tick.toFixed(1)}`}
              stroke="#6b7280"
            />
            <YAxis
              type="category"
              dataKey="employeeName"
              tick={{ fontSize: 12 }}
              interval={0}
              stroke="#6b7280"
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "10px",
              }}
              cursor={{ fill: "#f9fafb" }}
              formatter={(value, name) => [
                `Overallrating: ${value.toFixed(2)}`,
                // `Assessments: ${filteredData.find(item =>
                //   item.employeeName === name)?.totalAssessments || 0}`
              ]}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="overallRating"
              name="Overall Rating"
              fill="#afc7ed"
              barSize={30}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center mt-2 text-gray-700 text-sm">
          <p>Average Rating (Based on All Assessments)</p>
        </div>
      </div>
    </div>
  );
};

export default FetchEvaluateAssSkills;

// ______________________________________________________________

//previous backup
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import * as XLSX from "xlsx";

// const FetchEvaluateAssSkills = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [skillsData, setSkillsData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState("desc");

//   useEffect(() => {
//     const fetchSkillsData = async () => {
//       if (!organisationId) {
//         setError("Organisation ID is missing.");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );

//         if (response.data.data) {
//           const sortedData = response.data.data
//             .filter((item) => item.overallRating !== null)
//             .sort((a, b) => b.overallRating - a.overallRating);

//           const chartData = sortedData.map((item) => ({
//             employeeName: item.employeeName,
//             overallRating: item.overallRating,
//           }));

//           setSkillsData(chartData);
//           setFilteredData(chartData);
//         } else {
//           setError(response.data.message || "No data found.");
//         }
//       } catch (err) {
//         setError("Error fetching skills data: " + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSkillsData();
//   }, [organisationId, authToken]);

//   useEffect(() => {
//     if (searchQuery === "") {
//       setFilteredData(skillsData);
//     } else {
//       const filtered = skillsData.filter((item) =>
//         item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [searchQuery, skillsData]);

//   const handleDownloadExcel = () => {
//     if (filteredData.length === 0) {
//       alert("No data available to download.");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Ratings");
//     XLSX.writeFile(workbook, "Employee_Performance_Ratings.xlsx");
//   };

//   const handleSort = () => {
//     const sortedData = [...filteredData].sort((a, b) => {
//       if (sortOrder === "desc") {
//         return b.overallRating - a.overallRating;
//       } else {
//         return a.overallRating - b.overallRating;
//       }
//     });
//     setFilteredData(sortedData);
//     setSortOrder(sortOrder === "desc" ? "asc" : "desc");
//   };

//   if (isLoading)
//     return <p className="text-center text-gray-500">Loading data...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   const chartHeight = Math.max(400, filteredData.length * 50);

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto mt-10">
//       <div className="flex justify-between items-center mb-6">
//         {/* Left Side - Title */}
//          <h2 className="">
//            <span className="text-2xl md:text-2xl font-extrabold text-gray-800">
//              Top Employee Performance Ratings
//           </span>
//            <span className="text-sm md:text-base font-light text-gray-600 block mt-2">
//              Based on Skill Assessments and Manager Evaluations
//            </span>
//         </h2>

//         <div className="flex space-x-4">
//           <input
//             type="text"
//             placeholder="Search Employee"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="py-2 px-4 rounded-md border border-gray-300 shadow-sm w-30"
//           />
//           <button
//             onClick={handleSort}
//             className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
//           >
//             Sort by Rating {sortOrder === "desc" ? "↓" : "↑"}
//           </button>
//           <button
//             onClick={handleDownloadExcel}
//             className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
//           >
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="mt-8">
//         <ResponsiveContainer width="100%" height={chartHeight}>
//           <BarChart data={filteredData} layout="vertical">
//             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//             <XAxis
//               type="number"
//               domain={[0, 5]}
//               tick={{ fontSize: 12 }}
//               tickFormatter={(tick) => `${tick.toFixed(1)}`}
//               stroke="#6b7280"
//             />
//             <YAxis
//               type="category"
//               dataKey="employeeName"
//               tick={{ fontSize: 12 }}
//               interval={0}
//               stroke="#6b7280"
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#f3f4f6",
//                 borderRadius: "8px",
//                 border: "1px solid #d1d5db",
//                 padding: "10px",
//               }}
//               cursor={{ fill: "#f9fafb" }}
//             />
//             <Legend verticalAlign="top" height={36} />
//             <Bar
//               dataKey="overallRating"
//               fill="#afc7ed" // Light blue color
//               barSize={30}
//               radius={[10, 10, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>

//          <div className="flex justify-center mt-2 text-gray-700 text-sm">
//           <p>Rating</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FetchEvaluateAssSkills;

//make sure ,not show employee name redundaently only unique employee show in the graph also if one employee have multimple assessment then calculate their all assessment overallrating and show  finalcalculate overallrating , so we can easily identify most overall employee in the organization easily..
//i wanna make an dynamic api to fetch data into graph dynamically , i wanna show historical assessment data of particular employee, in initial phase show top employee data .. also add one functionallity of search ..particular selected employee ..historical assessment show ..in historical past assessment  ,including Growth in graphical representation if one employee have more than one assessment then it shows ,redudant employee name and details into td into Graph  (this is not user friendly interface ).. if similar employeeid  i mean same employee have have multiple assessment , ..make sure show only unique employee name , changes ui and functionallity accordingly ..make sure not affect on my existing  code
