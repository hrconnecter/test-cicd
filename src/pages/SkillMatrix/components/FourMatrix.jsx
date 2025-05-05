/* eslint-disable react-hooks/exhaustive-deps */
//
import React, { useState, useEffect, useContext } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Rectangle,
} from "recharts";
import Select from "react-select";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";

const SkillMatrixQuadrant = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const [skillData, setSkillData] = useState([]);
  const [assessmentType, setAssessmentType] = useState({
    value: "manager",
    label: "Manager Assessment",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const assessmentTypeOptions = [
    { value: "manager", label: "Manager Assessment" },
    { value: "self", label: "Self Assessment" },
  ];

  const quadrantColors = {
    HL: "#FF6B6B",
    HH: "#4ECB71", 
    LL: "#FFD93D",
    LH: "#6A5ACD",
  };

  const quadrantBackgrounds = {
    HL: "rgba(255, 107, 107, 0.15)",
    HH: "rgba(78, 203, 113, 0.15)",
    LL: "rgba(255, 217, 61, 0.15)",
    LH: "rgba(106, 90, 205, 0.15)",
  };

  const quadrantInsights = {
    HL: "Critical Skills - High expertise with limited team coverage",
    HH: "Core Strengths - Well-distributed high-level expertise",
    LL: "Development Areas - Skills requiring focused training",
    LH: "Training Priority - Widely used skills needing improvement",
  };

  const fetchSkillMatrixData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/skill-matrix-quadrant/${organisationId}`,
        {
          headers: { Authorization: cookies["aegis"] },
          params: { assessmentType: assessmentType.value, searchTerm },
        }
      );
      setSkillData(response.data.data.quadrantData);
    } catch (error) {
      handleAlert(false, "error", "Failed to fetch skill matrix data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillMatrixData();
  }, [assessmentType, searchTerm, organisationId]);

  const CustomBackground = ({ x, y, width, height, fill }) => {
    return <Rectangle x={x} y={y} width={width} height={height} fill={fill} />;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <h4 className="font-bold text-gray-800">{data.name}</h4>
          <div className="mt-2">
            <p>Employees: {data.x}</p>
            <p>Rating: {data.y.toFixed(1)}/5</p>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {quadrantInsights[data.quadrant]}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Skill Matrix Quadrant Analysis
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search Skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <Select
            options={assessmentTypeOptions}
            value={assessmentType}
            onChange={setAssessmentType}
            className="w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={600}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              
              <XAxis
                type="number"
                dataKey="x"
                name="Employees"
                domain={[0, 'dataMax + 1']}
                allowDecimals={false}
                tickCount={10}
                label={{ 
                  value: "Number of Employees",
                  position: "bottom",
                  offset: 5
                }}
              />
              
              <YAxis
                type="number"
                dataKey="y"
                name="Rating"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                label={{
                  value: "Skill Rating",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10
                }}
              />

              {Object.entries(quadrantBackgrounds).map(([quadrant, color], index) => (
                <CustomBackground
                  key={quadrant}
                  x={index % 2 === 0 ? "0%" : "50%"}
                  y={index < 2 ? "0%" : "50%"}
                  width="50%"
                  height="50%"
                  fill={color}
                />
              ))}

              <ReferenceLine y={2.5} stroke="#666" strokeDasharray="3 3" />
              <ReferenceLine x={5} stroke="#666" strokeDasharray="3 3" />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {Object.entries(quadrantColors).map(([quadrant, color]) => (
                <Scatter
                  key={quadrant}
                  name={quadrant}
                  data={skillData.filter((item) => item.quadrant === quadrant)}
                  fill={color}
                  shape="circle"
                  legendType="circle"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {Object.entries(quadrantInsights).map(([quadrant, insight]) => (
          <div
            key={quadrant}
            className="p-4 rounded-lg"
            style={{ backgroundColor: quadrantBackgrounds[quadrant] }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: quadrantColors[quadrant] }}
              />
              <h3 className="font-semibold">{quadrant}</h3>
            </div>
            <p className="text-sm text-gray-700">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMatrixQuadrant;


//working but old 
// import React, { useState, useEffect, useContext } from "react";
// import {
//   ScatterChart,
//   Scatter,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Select from "react-select";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// // Context
// import { UseContext } from "../../../State/UseState/UseContext";
// import { TestContext } from "../../../State/Function/Main";

// const SkillMatrixQuadrant = () => {
//   // Context hooks
//   const { cookies } = useContext(UseContext);
//   const { handleAlert } = useContext(TestContext);

//   // URL Params
//   const { organisationId } = useParams();

//   // State for skill data and filters
//   const [skillData, setSkillData] = useState([]);
//   const [assessmentType, setAssessmentType] = useState({
//     value: "manager",
//     label: "Manager Assessment",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Assessment type options
//   const assessmentTypeOptions = [
//     { value: "manager", label: "Manager Assessment" },
//     { value: "self", label: "Self Assessment" },
//   ];

//   // Color mapping for quadrants
//   const quadrantColors = {
//     HL: "#FF6B6B", // Red for High Skill, Low Employees
//     HH: "#4ECB71", // Green for High Skill, High Employees
//     LL: "#FFD93D", // Yellow for Low Skill, Low Employees
//     LH: "#6A5ACD", // Purple for Low Skill, High Employees
//   };

//   //   // Quadrant Insights
//   const quadrantInsights = {
//     HL: "High potential skills with limited adoption.",
//     HH: "Core competency skills with strong team expertise.",
//     LL: "Skills that may require immediate training and development.",
//     LH: "Skills with widespread usage but need significant skill improvement.",
//   };

//   // Fetch Skill Matrix Data
//   const fetchSkillMatrixData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/skill-matrix-quadrant/${organisationId}`,
//         {
//           headers: {
//             Authorization: cookies["aegis"],
//           },
//           params: {
//             assessmentType: assessmentType.value,
//             searchTerm,
//             // Optional additional filters can be added here
//             // minRating,
//             // maxRating,
//             // departmentId,
//             // workLocationId
//           },
//         }
//       );

//       // Update state with quadrant data
//       setSkillData(response.data.data.quadrantData);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching skill matrix data:", error);
//       handleAlert(false, "error", "Failed to fetch skill matrix data");
//       setIsLoading(false);
//     }
//   };

//   // Fetch data on component mount and when filters change
//   useEffect(() => {
//     fetchSkillMatrixData();
//   }, [assessmentType, searchTerm, organisationId]);

//   // Custom Tooltip
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white p-4 border rounded shadow-lg">
//           <p className="font-bold text-lg">{data.name}</p>
//           <p>Total Employees: {data.x}</p>
//           <p>Average Rating: {data.y.toFixed(2)}</p>
//           <p className="font-semibold">Quadrant: {data.quadrant}</p>
//           <p className="text-sm text-gray-600 mt-2">
//             {quadrantInsights[data.quadrant]}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

// //   return (
// //     <div className="p-6 bg-gray-50">
// //       {/* Quadrant Info */}
// //       {/* Quadrant Legend and Insights */}
   
// //   {/* Header Section with Animated Title */}
// //   <div className="mb-8 flex justify-between items-center">
// //           <h1 className="text-2xl font-extrabold tracking-tight ">
// //             Skill Matrix Quadrant Analysis
// //           </h1>
// //           <div className="flex items-center space-x-4">
// //             {/* Search Input with Advanced Styling */}
// //             <div className="relative">
// //               <input
// //                 type="text"
// //                 placeholder="Search Skills..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="pl-10 pr-4 py-2 w-64 border-2 border-blue-200 rounded-full 
// //                 focus:outline-none focus:ring-2 focus:ring-blue-400 
// //                 transition duration-300 ease-in-out 
// //                 hover:shadow-md"
// //               />
// //               <svg 
// //                 xmlns="http://www.w3.org/2000/svg" 
// //                 className="h-6 w-6 absolute left-3 top-2.5 text-blue-400" 
// //                 fill="none" 
// //                 viewBox="0 0 24 24" 
// //                 stroke="currentColor"
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //               </svg>
// //             </div>
  
// //             {/* Assessment Type Dropdown with Enhanced Styling */}
// //             <Select
// //               options={assessmentTypeOptions}
// //               value={assessmentType}
// //               onChange={setAssessmentType}
// //               className="w-64"
// //               classNamePrefix="select"
// //               styles={{
// //                 control: (base) => ({
// //                   ...base,
// //                   borderRadius: '9999px',
// //                   borderColor: '#93C5FD',
// //                   boxShadow: 'none',
// //                   '&:hover': {
// //                     borderColor: '#3B82F6'
// //                   }
// //                 }),
// //                 option: (base, state) => ({
// //                   ...base,
// //                   backgroundColor: state.isSelected ? '#3B82F6' : 'white',
// //                   color: state.isSelected ? 'white' : 'black',
// //                   '&:hover': {
// //                     backgroundColor: state.isSelected ? '#3B82F6' : '#E0F2FE'
// //                   }
// //                 })
// //               }}
// //             />
// //           </div>
// //         </div>
  
// //         {/* Quadrant Information Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
// //           {/* Quadrant Legend with Hover Effects */}
// //           <div className="bg-white rounded-xl p-6 ">
// //             <h3 className="text-xl font-bold text--800 mb-4 border-b pb-2">
// //               Quadrant Legend
// //             </h3>
// //             <div className="space-y-3">
// //               {Object.entries(quadrantColors).map(([quadrant, color]) => (
// //                 <div 
// //                   key={quadrant} 
// //                   className="flex items-center space-x-3 p-2 rounded-lg "
// //                 >
// //                   <div 
// //                     className="w-6 h-6 rounded-full shadow-md " 
// //                     style={{ backgroundColor: color }}
// //                   />
// //                   <span className="text-sm text-gray-700">
// //                     {quadrant === "HL" ? "High Skill, Low Employees" :
// //                      quadrant === "HH" ? "High Skill, High Employees" :
// //                      quadrant === "LL" ? "Low Skill, Low Employees" :
// //                      "Low Skill, High Employees"}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
  
// //           {/* Quadrant Insights with Animated Hover */}
// //           <div className="bg-white rounded-xl  p-6">
// //             <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
// //               Quadrant Insights
// //             </h3>
// //             <div className="space-y-3">
// //               {Object.entries(quadrantInsights).map(([quadrant, insight]) => (
// //                 <div 
// //                   key={quadrant} 
// //                   className="bg-blue-50 p-3 rounded-lg "
// //                 >
// //                   <p className="font-semibold text-sm text-blue-800">
// //                     {quadrant}: 
// //                     <span className="text-blue-600 font-normal ml-2">{insight}</span>
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //       {/* Loading State */}
// //       {isLoading && (
// //         <div className="flex justify-center items-center">
// //           <p>Loading skill matrix data...</p>
// //         </div>
// //       )}

// //       {/* Scatter Chart */}
// //       {!isLoading && (
// //         <ResponsiveContainer width="100%" height={500}>
// //           <ScatterChart>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis
// //               type="number"
// //               dataKey="x"
// //               name="Number of Employees"
              
// //               label={{
// //                 value: "Number of Employees",
// //                 position: "insideBottom",
// //                 offset: -10,
// //               }}
// //             />
// //             <YAxis
// //               type="number"
// //               dataKey="y"
// //               name={
// //                 assessmentType.value === "manager"
// //                   ? "Manager Skill Rating"
// //                   : "Self Skill Rating"
// //               }
// //               domain={[0, 5]}
// //               label={{
// //                 value:
// //                   assessmentType.value === "manager"
// //                     ? "Manager Skill Rating"
// //                     : "Self Skill Rating",
// //                 angle: -90,
// //                 position: "insideLeft",
// //               }}
// //             />
// //             <Tooltip content={<CustomTooltip />} />
// //             <Legend />
// //             abcc
// // <br />
// //             {Object.keys(quadrantColors).map((quadrant) => (
// //               <Scatter
// //                 key={quadrant}
// //                 name={
// //                   quadrant === "HL"
// //                     ? "High Skill, Low Employees"
// //                     : quadrant === "HH"
// //                     ? "High Skill, High Employees"
// //                     : quadrant === "LL"
// //                     ? "Low Skill, Low Employees"
// //                     : "Low Skill, High Employees"
// //                 }
// //                 data={skillData.filter((item) => item.quadrant === quadrant)}
// //                 fill={quadrantColors[quadrant]}
// //               />
// //             ))}
// //           </ScatterChart>
// //         </ResponsiveContainer>
// //       )}
// //     </div>

   
// //   );

// // Modified version with optimized spacing and layout
// return (
//   <div className="h-screen p-4 bg-gray-50">
//     {/* Compact Header */}
//     <div className="flex justify-between items-center mb-4">
//       <h1 className="text-xl font-bold">Skill Matrix Analysis</h1>
//       <div className="flex gap-2">
//         <div className="relative w-48">
//           <input
//             type="text"
//             placeholder="Search Skills..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-8 pr-2 py-1 border rounded-md"
//           />
//           <svg 
//             className="h-4 w-4 absolute left-2 top-2 text-gray-400" 
//             fill="none" 
//             viewBox="0 0 24 24" 
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
//         <Select
//           options={assessmentTypeOptions}
//           value={assessmentType}
//           onChange={setAssessmentType}
//           className="w-48"
//           classNamePrefix="select"
//         />
//       </div>
//     </div>

//     {/* Main Content Grid */}
//     <div className="grid grid-cols-4 gap-4 h-[calc(100vh-80px)]">
//       {/* Left Panel - Info Cards */}
//       <div className="col-span-1 space-y-4">
//         {/* Compact Legend Card */}
//         <div className="bg-white rounded-lg p-3 shadow-sm">
//           <h3 className="text-sm font-bold mb-2">Quadrant Legend</h3>
//           <div className="space-y-2">
//             {Object.entries(quadrantColors).map(([quadrant, color]) => (
//               <div key={quadrant} className="flex items-center gap-2 text-xs">
//                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
//                 <span>{quadrant === "HL" ? "High Skill, Low Emp" : 
//                        quadrant === "HH" ? "High Skill, High Emp" :
//                        quadrant === "LL" ? "Low Skill, Low Emp" :
//                        "Low Skill, High Emp"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Compact Insights Card */}
//         <div className="bg-white rounded-lg p-3 shadow-sm">
//           <h3 className="text-sm font-bold mb-2">Quick Insights</h3>
//           <div className="space-y-2">
//             {Object.entries(quadrantInsights).map(([quadrant, insight]) => (
//               <div key={quadrant} className="text-xs">
//                 <span className="font-semibold">{quadrant}:</span>
//                 <p className="text-gray-600">{insight}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Chart */}
//       <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
//         {isLoading ? (
//           <div className="flex h-full items-center justify-center">
//             <p>Loading data...</p>
//           </div>
//         ) : (
//           // <ResponsiveContainer width="100%" height="100%">
//           //   <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//           //     <CartesianGrid strokeDasharray="3 3" />
//           //     <XAxis type="number" dataKey="x" name="Employees" />
//           //     <YAxis type="number" dataKey="y" name="Rating" domain={[0, 5]} />
//           //     <Tooltip content={<CustomTooltip />} />
//           //     <Legend />
//           //     {Object.keys(quadrantColors).map((quadrant) => (
//           //       <Scatter
//           //         key={quadrant}
//           //         name={quadrant}
//           //         data={skillData.filter((item) => item.quadrant === quadrant)}
//           //         fill={quadrantColors[quadrant]}
//           //       />
//           //     ))}
//           //   </ScatterChart>
//           // </ResponsiveContainer>
//           <ResponsiveContainer width="100%" height="100%">
//   {/* <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
//    */}

// <ScatterChart 
//     margin={{ top: 30, right: 30, bottom: 70, left: 70 }} // Increased margins
//     padding={{ top: 20, right: 20, bottom: 20, left: 20 }} // Added padding
//   >

//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis
//       type="number"
//       dataKey="x"
//       name="Number of Employees"
//       label={{
//         value: "Number of Employees",
//         position: "insideBottom",
//       offset: -70  // Increased offset to move label further from axis
//       }}
//       padding={{ left: 20, right: 20 }} // Added axis padding
//       tickMargin={10} // Added space between ticks and labels

//     />
    
    
//     <YAxis
//       type="number"
//       dataKey="y"
//       name={assessmentType.value === "manager" ? "Manager Skill Rating" : "Self Skill Rating"}
//       domain={[0, 5]}
//       label={{
//         value: assessmentType.value === "manager" ? "Manager Skill Rating" : "Self Skill Rating",
//         angle: -90,
//         position: "insideLeft"
//       }}
//     />
//     <Tooltip content={<CustomTooltip />} />
//     <Legend />

//     {Object.keys(quadrantColors).map((quadrant) => (
//       <Scatter
//         key={quadrant}
//         name={quadrant}
//         // name={
//         //   quadrant === "HL"
//         //     ? "High Skill, Low Employees"
//         //     : quadrant === "HH"
//         //     ? "High Skill, High Employees"
//         //     : quadrant === "LL"
//         //     ? "Low Skill, Low Employees"
//         //     : "Low Skill, High Employees"
//         // }
//         data={skillData.filter((item) => item.quadrant === quadrant)}
//         fill={quadrantColors[quadrant]}
//       />
//     ))}
//   </ScatterChart>
// </ResponsiveContainer>

//         )}
//       </div>
//     </div>
//   </div>
// );

// };

// export default SkillMatrixQuadrant;


