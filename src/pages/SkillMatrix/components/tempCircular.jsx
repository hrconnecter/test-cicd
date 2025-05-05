// import React from "react";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CircularSkill = () => {
//   // Helper function to render circular ratings
//   const renderCircularRating = (rating) => {
//     const segments = 5; // Total number of segments in the circle
//     const filledSegments = Math.min(rating, segments); // Ensure the rating doesn't exceed max

//     return (
//       <div className="relative w-8 h-8">
//         <svg viewBox="0 0 36 36" className="w-8 h-8">
//           {[...Array(segments)].map((_, idx) => {
//             const startAngle = idx * 72 - 90; // Start angle of the segment (-90 for rotation offset)
//             const endAngle = startAngle + 72; // Each segment is 72 degrees

//             const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
//             const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
//             const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
//             const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

//             return (
//               <path
//                 key={idx}
//                 d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
//                 fill={idx < filledSegments ? "##616161" : "#eee"} // Dark for filled, light for unfilled
//               />
//             );
//           })}
//         </svg>
//         {/* <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span> */}
//       </div>
//     );
//   };

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         {/* Filter Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Report Type
//               </label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department
//               </label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Team
//               </label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         <div className="flex">
//           {/* Main table section */}
//           <div className="flex-grow">
//             {/* Skills Matrix Table */}
//             <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-medium text-gray-700">
//                       Employee
//                     </th>
//                     <th className="px-4 py-3 text-center">React</th>
//                     <th className="px-4 py-3 text-center">Node.js</th>
//                     <th className="px-4 py-3 text-center">Python</th>
//                     <th className="px-4 py-3 text-center">AWS</th>
//                     <th className="px-4 py-3 text-center">Total Skills</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     {
//                       name: "John Smith",
//                       skills: [5, 3, 4, 2],
//                       total: 14,
//                     },
//                     {
//                       name: "Sarah Johnson",
//                       skills: [4, 5, 3, 1],
//                       total: 13,
//                     },
//                   ].map((employee, index) => (
//                     <tr key={index} className="border-t border-gray-200">
//                       <td className="px-4 py-3 font-medium">{employee.name}</td>
//                       {employee.skills.map((rating, idx) => (
//                         <td key={idx} className="px-4 py-3 text-center">
//                           {renderCircularRating(rating)}
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 text-center font-medium">
//                         {employee.total}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* guidlines */}
//           <div className="w-64 ml-6">
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">
//                 Rating Guidelines
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   { rating: 5, label: "Expert" },
//                   { rating: 4, label: "High Competence" },
//                   { rating: 3, label: "Some Competence" },
//                   { rating: 2, label: "Low Competence" },
//                   { rating: 1, label: "No Competence" },
//                 ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                     {renderCircularRating(item.rating)}
//                     <span className="text-sm text-gray-600">{item.label}</span>
//                   </div>

//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;




// import React from "react";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CircularSkill = () => {
//   // Helper function to render circular ratings
//   const renderCircularRating = (rating) => {
//     const segments = 5; // Total number of segments in the circle
//     const filledSegments = Math.min(rating, segments); // Ensure the rating doesn't exceed max

//     return (
//       <div className="relative w-8 h-8">
//         <svg viewBox="0 0 36 36" className="w-8 h-8">
//           {[...Array(segments)].map((_, idx) => {
//             const startAngle = idx * 72 - 90; // Start angle of the segment (-90 for rotation offset)
//             const endAngle = startAngle + 72; // Each segment is 72 degrees

//             const x1 = 18 + 15 * Math.cos((Math.PI * startAngle) / 180);
//             const y1 = 18 + 15 * Math.sin((Math.PI * startAngle) / 180);
//             const x2 = 18 + 15 * Math.cos((Math.PI * endAngle) / 180);
//             const y2 = 18 + 15 * Math.sin((Math.PI * endAngle) / 180);

//             return (
//               <path
//                 key={idx}
//                 d={`M18,18 L${x1},${y1} A15,15 0 0,1 ${x2},${y2} Z`}
//                 fill={idx < filledSegments ? "##616161" : "#eee"} // Dark for filled, light for unfilled
//               />
//             );
//           })}
//         </svg>
//         {/* <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span> */}
//       </div>
//     );
//   };

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         {/* Filter Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          
//         </div>

//         <div className="flex">
//           {/* Main table section */}
//           <div className="flex-grow">
//             {/* Skills Matrix Table */}
//             <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-medium text-gray-700">
//                       Employee
//                     </th>
//                     <th className="px-4 py-3 text-center">React</th>
//                     <th className="px-4 py-3 text-center">Node.js</th>
//                     <th className="px-4 py-3 text-center">Python</th>
//                     <th className="px-4 py-3 text-center">AWS</th>
//                     <th className="px-4 py-3 text-center">Total Skills</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     {
//                       name: "John Smith",
//                       skills: [5, 3, 4, 2],
//                       total: 14,
//                     },
//                     {
//                       name: "Sarah Johnson",
//                       skills: [4, 5, 3, 1],
//                       total: 13,
//                     },
//                   ].map((employee, index) => (
//                     <tr key={index} className="border-t border-gray-200">
//                       <td className="px-4 py-3 font-medium">{employee.name}</td>
//                       {employee.skills.map((rating, idx) => (
//                         <td key={idx} className="px-4 py-3 text-center">
//                           {renderCircularRating(rating)}
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 text-center font-medium">
//                         {employee.total}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* guidlines */}
//           <div className="w-64 ml-6">
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">
//                 Rating Guidelines
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   { rating: 5, label: "Expert" },
//                   { rating: 4, label: "High Competence" },
//                   { rating: 3, label: "Some Competence" },
//                   { rating: 2, label: "Low Competence" },
//                   { rating: 1, label: "No Competence" },
//                 ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                     {renderCircularRating(item.rating)}
//                     <span className="text-sm text-gray-600">{item.label}</span>
//                   </div>

//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;


// import React, { useEffect, useState } from "react";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import axios from "axios";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const CircularSkill = () => {
//   const [assessmentData, setAssessmentData] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const authToken = useAuthToken();

//   // Fetch skills and assessment data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const organizationId = localStorage.getItem("organizationId"); // Assuming you store this

//         // Fetch skills
//         const skillsResponse = await axios.get(
//           `/api/v1/organization/${organizationId}/skills`,
//           {
//             headers: { Authorization: `Bearer ${authToken}` }
//           }
//         );
//         setSkills(skillsResponse.data.data);

//         // Fetch assessment data
//         const assessmentResponse = await axios.get(
//           `/api/v1/organization/${organizationId}/assessment/details/AllStatus`,
//           {
//             headers: { Authorization: `Bearer ${authToken}` }
//           }
//         );
//         setAssessmentData(assessmentResponse.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [authToken]);

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#616161" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//       </div>
//     );
//   };

//   const calculateTotalSkillRating = (skills) => {
//     return skills.reduce((total, skill) => total + (skill.rating || 0), 0);
//   };

//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         <div className="flex">
//           <div className="flex-grow">
//             <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-medium text-gray-700">
//                       Employee
//                     </th>
//                     {skills.map((skill) => (
//                       <th key={skill._id} className="px-4 py-3 text-center">
//                         {skill.skillName}
//                       </th>
//                     ))}
//                     <th className="px-4 py-3 text-center">Total Rating</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {assessmentData.map((assessment) => (
//                     <tr key={assessment._id} className="border-t border-gray-200">
//                       <td className="px-4 py-3 font-medium">
//                         {assessment.employeeName}
//                       </td>
//                       {assessment.selectedSkills.map((skill) => (
//                         <td key={skill.skillId} className="px-4 py-3 text-center">
//                           {renderCircularRating(skill.rating)}
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 text-center font-medium">
//                         {calculateTotalSkillRating(assessment.selectedSkills)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="w-64 ml-6">
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">
//                 Rating Guidelines
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   { rating: 5, label: "Expert" },
//                   { rating: 4, label: "High Competence" },
//                   { rating: 3, label: "Some Competence" },
//                   { rating: 2, label: "Low Competence" },
//                   { rating: 1, label: "No Competence" },
//                 ].map((item) => (
//                   <div key={item.rating} className="flex items-center space-x-3">
//                     {renderCircularRating(item.rating)}
//                     <span className="text-sm text-gray-600">{item.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;


//yup1
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken }
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
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         {/* Filter Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             {/* Main Table Section */}
//             <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-medium text-gray-700">Employee</th>
//                       {historicalData[0]?.skillHistory?.map(skill => (
//                         <th key={skill.skillName} className="px-4 py-3 text-center">
//                           {skill.skillName}
//                         </th>
//                       ))}
//                       <th className="px-4 py-3 text-center">Total Skills</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {historicalData.map((employee, index) => (
//                       <tr key={index} className="border-t border-gray-200">
//                         <td className="px-4 py-3 font-medium">{employee.employeeName}</td>
//                         {employee.skillHistory?.map((skill, idx) => (
//                           <td key={idx} className="px-4 py-3 text-center">
//                             {renderCircularRating(skill.rating)}
//                           </td>
//                         ))}
//                         <td className="px-4 py-3 text-center font-medium">
//                           {employee.skillHistory?.length || 0}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Rating Guidelines Section */}
//             <div className="w-64 ml-6">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "No Competence" }
//                   ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">{item.label}</span>
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

//yup2
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   const getAllUniqueSkills = (data) => {
//     const skillSet = new Set();
//     data.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         skillSet.add(skill.skillName);
//       });
//     });
//     return Array.from(skillSet);
//   };

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken }
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
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         {/* Filter Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             {/* Main Table Section */}
//             {/* <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
//                         Employee
//                       </th>
//                       {getAllUniqueSkills(historicalData).map(skillName => (
//                         <th key={skillName} className="px-4 py-3 text-center whitespace-nowrap min-w-[120px]">
//                           {skillName}
//                         </th>
//                       ))}
//                       <th className="px-4 py-3 text-center sticky right-0 bg-gray-50 z-10">
//                         Total Skills
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {historicalData.map((employee, index) => {
//                       const skillMap = new Map(
//                         employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//                       );
                      
//                       return (
//                         <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
//                           <td className="px-4 py-3 font-medium sticky left-0 bg-white z-10">
//                             {employee.employeeName}
//                           </td>
//                           {getAllUniqueSkills(historicalData).map(skillName => (
//                             <td key={skillName} className="px-4 py-3 text-center">
//                               {skillMap.has(skillName) ? (
//                                 renderCircularRating(skillMap.get(skillName))
//                               ) : (
//                                 <span className="text-gray-400 font-medium">N/A</span>
//                               )}
//                             </td>
//                           ))}
//                           <td className="px-4 py-3 text-center font-medium sticky right-0 bg-white z-10">
//                             {employee.skillHistory?.length || 0}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div> */}

// {/* // Replace the table section with: */}
// <div className="flex-grow">
//   <div className="bg-white rounded-lg shadow overflow-x-auto">
//     <table className="w-full text-sm border-collapse">
//       <thead>
//         <tr className="bg-gray-50">
//           <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-b">
//             Employee
//           </th>
//           {getAllUniqueSkills(historicalData).map(skillName => (
//             <th key={skillName} className="px-3 py-2 text-center border-b">
//               {skillName}
//             </th>
//           ))}
//           <th className="px-3 py-2 text-center sticky right-0 bg-gray-50 z-10 border-b">
//             Total
//           </th>
//         </tr>
//       </thead>
//       <tbody>
//         {historicalData.map((employee, index) => {
//           const skillMap = new Map(
//             employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//           );
          
//           return (
//             <tr key={index} className="border-b hover:bg-gray-50">
//               <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
//                 {employee.employeeName}
//               </td>
//               {getAllUniqueSkills(historicalData).map(skillName => (
//                 <td key={skillName} className="px-3 py-2 text-center">
//                   {renderCircularRating(skillMap.get(skillName) || 0)}
//                 </td>
//               ))}
//               <td className="px-3 py-2 text-center font-medium sticky right-0 bg-white z-10">
//                 {employee.skillHistory?.length || 0}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// </div>


//             {/* Rating Guidelines Section */}
//             <div className="w-64 ml-6">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "No Competence" }
//                   ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">{item.label}</span>
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
// // CircularSkill.jsx CircularSkill.jsx:798 AEGIS-frontend <span className="text-gray-400 font-medium">N/A</span> ..INSTEAD OF THESE SHOW RELATED TO CIRCLE ..AND MAKE SURE TABLE HAVE PROPER STRUCTURE ,ALSO MAKE SURE IF EMPLOYEE HAVE INCRESE MORE SKILLS IN FUTURE THE TABLE WILL HANDLE ,REMOVE UNNECESSARY SPACING 

//yup 3 best
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
    
//     data.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });

//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
//   };

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken }
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
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-b">
//                         Employee
//                       </th>
//                       {getSortedSkills(historicalData).map(skillName => (
//                         <th key={skillName} className="px-3 py-2 text-center border-b">
//                           {skillName}
//                         </th>
//                       ))}
//                       <th className="px-3 py-2 text-center sticky right-0 bg-gray-50 z-10 border-b">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {historicalData.map((employee, index) => {
//                       const skillMap = new Map(
//                         employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//                       );
                      
//                       return (
//                         <tr key={index} className="border-b hover:bg-gray-50">
//                           <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
//                             {employee.employeeName}
//                           </td>
//                           {getSortedSkills(historicalData).map(skillName => (
//                             <td key={skillName} className="px-3 py-2 text-center">
//                               {renderCircularRating(skillMap.get(skillName) || 0)}
//                             </td>
//                           ))}
//                           <td className="px-3 py-2 text-center font-medium sticky right-0 bg-white z-10">
//                             {employee.skillHistory?.length || 0}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="w-64 ml-6">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "No Competence" }
//                   ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">{item.label}</span>
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


//yup 4 improve search functionality 
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
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   const calculateTeamAverage = () => {
//     if (!historicalData.length) return 0;
    
//     const totalRatings = historicalData.reduce((acc, employee) => {
//       const employeeTotal = employee.skillHistory?.reduce((sum, skill) => sum + skill.rating, 0) || 0;
//       return acc + employeeTotal;
//     }, 0);

//     const totalSkills = historicalData.reduce((acc, employee) => 
//       acc + (employee.skillHistory?.length || 0), 0);

//     return totalSkills ? (totalRatings / totalSkills).toFixed(1) : 0;
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
//       Git: "Version control system"
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
    
//     data.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });

//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
//   };

//   const filterSkills = (data) => {
//     if (skillFilter === "all") return data;
    
//     return data.filter(employee => {
//       return employee.skillHistory?.some(skill => {
//         switch(skillFilter) {
//           case "high": return skill.rating >= 4;
//           case "medium": return skill.rating >= 2 && skill.rating <= 3;
//           case "low": return skill.rating <= 1;
//           default: return true;
//         }
//       });
//     });
//   };

//   const filteredData = filterSkills(historicalData).filter(employee => {
//     const matchEmployee = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchSkills = employee.skillHistory?.some(skill => 
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
//             headers: { Authorization: authToken }
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
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         <div className="bg-white p-4 rounded-lg mb-4">
//           <div className="grid grid-cols-4 gap-4">
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <h4 className="text-gray-600 mb-1">Total Skills</h4>
//               <span className="text-2xl font-bold text-blue-900">
//                 {getSortedSkills(historicalData).length}
//               </span>
//             </div>
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <h4 className="text-gray-600 mb-1">Team Average</h4>
//               <span className="text-2xl font-bold text-blue-900">
//                 {calculateTeamAverage()}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-wrap gap-4 mb-4">
//             <input 
//               type="search"
//               placeholder="Search skills or employees..."
//               className="border rounded px-3 py-2 flex-grow min-w-[200px]"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select 
//               className="border rounded px-3 py-2 min-w-[150px]"
//               value={skillFilter}
//               onChange={(e) => setSkillFilter(e.target.value)}
//             >
//               <option value="all">All Skills</option>
//               <option value="high">High Rated (4-5)</option>
//               <option value="medium">Medium Rated (2-3)</option>
//               <option value="low">Low Rated (0-1)</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="flex">
//             <div className="flex-grow">
//               <div className="bg-white rounded-lg shadow overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-b">
//                         Employee
//                       </th>
//                       {getSortedSkills(historicalData).map(skillName => (
//                         <Tooltip 
//                           key={skillName}
//                           title={`${skillName} - ${getSkillDescription(skillName)}`}
//                           arrow
//                         >
//                           <th className="px-3 py-2 text-center border-b cursor-help">
//                             {skillName}
//                           </th>
//                         </Tooltip>
//                       ))}
//                       <th className="px-3 py-2 text-center sticky right-0 bg-gray-50 z-10 border-b">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map((employee, index) => {
//                       const skillMap = new Map(
//                         employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//                       );
                      
//                       return (
//                         <tr key={index} className="border-b hover:bg-gray-50">
//                           <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
//                             {employee.employeeName}
//                           </td>
//                           {getSortedSkills(historicalData).map(skillName => (
//                             <td key={skillName} className="px-3 py-2 text-center">
//                               {renderCircularRating(skillMap.get(skillName) || 0)}
//                             </td>
//                           ))}
//                           <td className="px-3 py-2 text-center font-medium sticky right-0 bg-white z-10">
//                             {employee.skillHistory?.length || 0}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="w-64 ml-6">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//                 <div className="space-y-4">
//                   {[
//                     { rating: 5, label: "Expert" },
//                     { rating: 4, label: "High Competence" },
//                     { rating: 3, label: "Some Competence" },
//                     { rating: 2, label: "Low Competence" },
//                     { rating: 1, label: "No Competence" }
//                   ].map((item) => (
//                     <div key={item.rating} className="flex items-center space-x-3">
//                       {renderCircularRating(item.rating)}
//                       <span className="text-sm text-gray-600">{item.label}</span>
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

//yup 5
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Tooltip from "@mui/material/Tooltip";

// // Heatmap Grid Component
// const HeatmapGrid = ({ rows, columns, values, colorScale }) => {
//   const getColor = (value) => {
//     const normalizedValue = value / 5;
//     const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
//     return colorScale[colorIndex];
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-50">
//             <th className="sticky left-0 bg-gray-50 z-10 px-4 py-2 border-b"></th>
//             {columns.map(skill => (
//               <Tooltip key={skill} title={`${skill} - Average rating across team`} arrow>
//                 <th className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
//                   <div className="transform -rotate-45 origin-center whitespace-nowrap">
//                     {skill}
//                   </div>
//                 </th>
//               </Tooltip>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(employee => (
//             <tr key={employee.id} className="hover:bg-gray-50">
//               <td className="sticky left-0 bg-white z-10 px-4 py-2 font-medium text-gray-700 border-b">
//                 {employee.employeeName}
//               </td>
//               {columns.map(skill => {
//                 const value = values.find(
//                   v => v.employeeId === employee.id && v.skill === skill
//                 )?.value || 0;
//                 return (
//                   <Tooltip
//                     key={`${employee.id}-${skill}`}
//                     title={`${employee.employeeName}'s ${skill} rating: ${value}`}
//                     arrow
//                   >
//                     <td className="relative border">
//                       <div 
//                         className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
//                         style={{ 
//                           backgroundColor: getColor(value),
//                           color: value > 2 ? 'white' : 'black'
//                         }}
//                       >
//                         <span className="font-medium">{value}</span>
//                       </div>
//                     </td>
//                   </Tooltip>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


// // Statistics Dashboard Component
// const StatisticsDashboard = ({ historicalData, getSortedSkills, calculateTeamAverage }) => {
//   const calculateTopSkills = () => {
//     const skillRatings = {};
//     historicalData.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         if (!skillRatings[skill.skillName]) {
//           skillRatings[skill.skillName] = [];
//         }
//         skillRatings[skill.skillName].push(skill.rating);
//       });
//     });

//     return Object.entries(skillRatings)
//       .map(([skill, ratings]) => ({
//         skill,
//         average: ratings.reduce((a, b) => a + b, 0) / ratings.length
//       }))
//       .sort((a, b) => b.average - a.average)
//       .slice(0, 3);
//   };

//   const topSkills = calculateTopSkills();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       <div className="bg-blue-50 rounded-lg p-4">
//         <h4 className="text-gray-600 mb-1">Total Skills</h4>
//         <span className="text-2xl font-bold text-blue-900">
//           {getSortedSkills(historicalData).length}
//         </span>
//       </div>
//       <div className="bg-blue-50 rounded-lg p-4">
//         <h4 className="text-gray-600 mb-1">Team Average</h4>
//         <span className="text-2xl font-bold text-blue-900">
//           {calculateTeamAverage()}
//         </span>
//       </div>
//       <div className="bg-blue-50 rounded-lg p-4 col-span-2">
//         <h4 className="text-gray-600 mb-1">Top Skills</h4>
//         <div className="flex gap-4">
//           {topSkills.map(({ skill, average }) => (
//             <div key={skill} className="text-blue-900">
//               <span className="font-medium">{skill}</span>
//               <span className="ml-2">({average.toFixed(1)})</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main CircularSkill Component
// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skillFilter, setSkillFilter] = useState("all");
//   const [viewMode, setViewMode] = useState("matrix");

//   // Existing renderCircularRating function
//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   // Utility functions
//   const calculateTeamAverage = () => {
//     if (!historicalData.length) return 0;
    
//     const totalRatings = historicalData.reduce((acc, employee) => {
//       const employeeTotal = employee.skillHistory?.reduce((sum, skill) => sum + skill.rating, 0) || 0;
//       return acc + employeeTotal;
//     }, 0);

//     const totalSkills = historicalData.reduce((acc, employee) => 
//       acc + (employee.skillHistory?.length || 0), 0);

//     return totalSkills ? (totalRatings / totalSkills).toFixed(1) : 0;
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
    
//     data.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });

//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
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
//       Git: "Version control system"
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const filterSkills = (data) => {
//     if (skillFilter === "all") return data;
    
//     return data.filter(employee => {
//       return employee.skillHistory?.some(skill => {
//         switch(skillFilter) {
//           case "high": return skill.rating >= 4;
//           case "medium": return skill.rating >= 2 && skill.rating <= 3;
//           case "low": return skill.rating <= 1;
//           default: return true;
//         }
//       });
//     });
//   };

//   const filteredData = filterSkills(historicalData).filter(employee => {
//     const matchEmployee = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchSkills = employee.skillHistory?.some(skill => 
//       skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     return matchEmployee || matchSkills;
//   });

//   // Data fetching
//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken }
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

//   // Render functions
//   const renderSkillMatrix = () => (
//     <div className="flex">
//       <div className="flex-grow">
//         <div className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-b">
//                   Employee
//                 </th>
//                 {getSortedSkills(historicalData).map(skillName => (
//                   <Tooltip 
//                     key={skillName}
//                     title={`${skillName} - ${getSkillDescription(skillName)}`}
//                     arrow
//                   >
//                     <th className="px-3 py-2 text-center border-b cursor-help">
//                       {skillName}
//                     </th>
//                   </Tooltip>
//                 ))}
//                 <th className="px-3 py-2 text-center sticky right-0 bg-gray-50 z-10 border-b">
//                   Total
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((employee, index) => {
//                 const skillMap = new Map(
//                   employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//                 );
                
//                 return (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
//                       {employee.employeeName}
//                     </td>
//                     {getSortedSkills(historicalData).map(skillName => (
//                       <td key={skillName} className="px-3 py-2 text-center">
//                         {renderCircularRating(skillMap.get(skillName) || 0)}
//                       </td>
//                     ))}
//                     <td className="px-3 py-2 text-center font-medium sticky right-0 bg-white z-10">
//                       {employee.skillHistory?.length || 0}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="w-64 ml-6">
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//           <div className="space-y-4">
//             {[
//               { rating: 5, label: "Expert" },
//               { rating: 4, label: "High Competence" },
//               { rating: 3, label: "Some Competence" },
//               { rating: 2, label: "Low Competence" },
//               { rating: 1, label: "No Competence" }
//             ].map((item) => (
//               <div key={item.rating} className="flex items-center space-x-3">
//                 {renderCircularRating(item.rating)}
//                 <span className="text-sm text-gray-600">{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const CompetencyHeatmap = ({ historicalData }) => {
//     const employees = historicalData.map(emp => ({
//       id: emp._id,
//       employeeName: emp.employeeName
//     }));
  
//     const skills = getSortedSkills(historicalData);
  
//     const competencyScores = historicalData.flatMap(emp =>
//       emp.skillHistory?.map(skill => ({
//         employeeId: emp._id,
//         skill: skill.skillName,
//         value: skill.rating
//       })) || []
//     );

//       // Calculate skill averages
//   const skillAverages = skills.map(skill => {
//     const ratings = competencyScores
//       .filter(score => score.skill === skill)
//       .map(score => score.value);
//     const average = ratings.length 
//       ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
//       : 0;
//     return { skill, average: average.toFixed(1) };
//   });


//     return (
//       <div className="bg-white rounded-lg p-4">
//         <h3 className="text-lg font-medium mb-4">Competency Heatmap</h3>
//         <HeatmapGrid
//           rows={employees}
//           columns={skills}
//           values={competencyScores}
//           colorScale={["#fee8c8", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"]}
//         />
//       </div>
//     );
//   };
  

//   const renderHeatmap = () => (
//     <CompetencyHeatmap 
//       historicalData={historicalData}
//       departmentId={organisationId}
//     />
//   );

//   // Main render
//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         <StatisticsDashboard 
//           historicalData={historicalData}
//           getSortedSkills={getSortedSkills}
//           calculateTeamAverage={calculateTeamAverage}
//         />

//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-wrap gap-4 mb-4">
//             <input 
//               type="search"
//               placeholder="Search skills or employees..."
//               className="border rounded px-3 py-2 flex-grow min-w-[200px]"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select 
//               className="border rounded px-3 py-2 min-w-[150px]"
//               value={skillFilter}
//               onChange={(e) => setSkillFilter(e.target.value)}
//             >
//               <option value="all">All Skills</option>
//               <option value="high">High Rated (4-5)</option>
//               <option value="medium">Medium Rated (2-3)</option>
//               <option value="low">Low Rated (0-1)</option>
//             </select>
//             <select
//               className="border rounded px-3 py-2 min-w-[150px]"
//               value={viewMode}
//               onChange={(e) => setViewMode(e.target.value)}
//             >
//               <option value="matrix">Skill Matrix</option>
//               <option value="heatmap">Competency Heatmap</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           viewMode === 'matrix' ? renderSkillMatrix() : renderHeatmap()
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;

              
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import Tooltip from "@mui/material/Tooltip";

// // HeatmapGrid Component
// const HeatmapGrid = ({ rows, columns, values, colorScale }) => {
//   const getColor = (value) => {
//     const normalizedValue = value / 5;
//     const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
//     return colorScale[colorIndex];
//   };

//   return (
//     <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-50">
//             <th className="sticky left-0 bg-gray-50 z-10 px-4 py-2 border-b"></th>
//             {columns.map(skill => (
//               <Tooltip key={skill} title={`${skill} - Average rating across team`} arrow>
//                 <th className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
//                   <div className="transform -rotate-45 origin-center whitespace-nowrap">
//                     {skill}
//                   </div>
//                 </th>
//               </Tooltip>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(employee => (
//             <tr key={employee.id} className="hover:bg-gray-50">
//               <td className="sticky left-0 bg-white z-10 px-4 py-2 font-medium text-gray-700 border-b">
//                 {employee.employeeName}
//               </td>
//               {columns.map(skill => {
//                 const value = values.find(
//                   v => v.employeeId === employee.id && v.skill === skill
//                 )?.value || 0;
//                 return (
//                   <Tooltip
//                     key={`${employee.id}-${skill}`}
//                     title={`${employee.employeeName}'s ${skill} rating: ${value}`}
//                     arrow
//                   >
//                     <td className="relative border">
//                       <div 
//                         className="w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
//                         style={{ 
//                           backgroundColor: getColor(value),
//                           color: value > 2 ? 'white' : 'black'
//                         }}
//                       >
//                         <span className="font-medium">{value}</span>
//                       </div>
//                     </td>
//                   </Tooltip>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // CompetencyHeatmap Component
// const CompetencyHeatmap = ({ historicalData }) => {
//   const employees = historicalData.map(emp => ({
//     id: emp._id,
//     employeeName: emp.employeeName
//   }));

//   const skills = historicalData.reduce((acc, emp) => {
//     emp.skillHistory?.forEach(skill => {
//       if (!acc.includes(skill.skillName)) {
//         acc.push(skill.skillName);
//       }
//     });
//     return acc;
//   }, []);

//   const competencyScores = historicalData.flatMap(emp =>
//     emp.skillHistory?.map(skill => ({
//       employeeId: emp._id,
//       skill: skill.skillName,
//       value: skill.rating
//     })) || []
//   );

//   const skillAverages = skills.map(skill => {
//     const ratings = competencyScores
//       .filter(score => score.skill === skill)
//       .map(score => score.value);
//     const average = ratings.length 
//       ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
//       : 0;
//     return { skill, average: average.toFixed(1) };
//   });

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {skillAverages.slice(0, 4).map(({ skill, average }) => (
//           <div key={skill} className="bg-white rounded-lg p-4 shadow">
//             <h4 className="text-sm text-gray-600">{skill}</h4>
//             <div className="flex items-end gap-2">
//               <span className="text-2xl font-bold text-blue-900">{average}</span>
//               <span className="text-sm text-gray-500">avg rating</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white rounded-lg p-6 shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-medium text-gray-800">Team Competency Heatmap</h3>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <span className="w-3 h-3 bg-[#fee8c8]"></span>
//               <span className="text-sm">Low</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-3 h-3 bg-[#b30000]"></span>
//               <span className="text-sm">High</span>
//             </div>
//           </div>
//         </div>
        
//         <HeatmapGrid
//           rows={employees}
//           columns={skills}
//           values={competencyScores}
//           colorScale={["#fee8c8", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"]}
//         />
//       </div>
//     </div>
//   );
// };

// // StatisticsDashboard Component
// const StatisticsDashboard = ({ historicalData, getSortedSkills, calculateTeamAverage }) => {
//   const calculateTopSkills = () => {
//     const skillRatings = {};
//     historicalData.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         if (!skillRatings[skill.skillName]) {
//           skillRatings[skill.skillName] = [];
//         }
//         skillRatings[skill.skillName].push(skill.rating);
//       });
//     });

//     return Object.entries(skillRatings)
//       .map(([skill, ratings]) => ({
//         skill,
//         average: ratings.reduce((a, b) => a + b, 0) / ratings.length
//       }))
//       .sort((a, b) => b.average - a.average)
//       .slice(0, 3);
//   };

//   const topSkills = calculateTopSkills();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       <div className="bg-blue-50 rounded-lg p-4">
//         <h4 className="text-gray-600 mb-1">Total Skills</h4>
//         <span className="text-2xl font-bold text-blue-900">
//           {getSortedSkills(historicalData).length}
//         </span>
//       </div>
//       <div className="bg-blue-50 rounded-lg p-4">
//         <h4 className="text-gray-600 mb-1">Team Average</h4>
//         <span className="text-2xl font-bold text-blue-900">
//           {calculateTeamAverage()}
//         </span>
//       </div>
//       <div className="bg-blue-50 rounded-lg p-4 col-span-2">
//         <h4 className="text-gray-600 mb-1">Top Skills</h4>
//         <div className="flex gap-4">
//           {topSkills.map(({ skill, average }) => (
//             <div key={skill} className="text-blue-900">
//               <span className="font-medium">{skill}</span>
//               <span className="ml-2">({average.toFixed(1)})</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main CircularSkill Component
// const CircularSkill = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const [historicalData, setHistoricalData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [skillFilter, setSkillFilter] = useState("all");
//   const [viewMode, setViewMode] = useState("matrix");
//   // Render circular rating function
//   const renderCircularRating = (rating) => {
//     const segments = 5;
//     const filledSegments = Math.min(rating, segments);

//     return (
//       <div className="relative w-8 h-8">
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
//                 fill={idx < filledSegments ? "#2563eb" : "#eee"}
//               />
//             );
//           })}
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
//           {rating}
//         </span>
//       </div>
//     );
//   };

//   // Utility functions
//   const calculateTeamAverage = () => {
//     if (!historicalData.length) return 0;
    
//     const totalRatings = historicalData.reduce((acc, employee) => {
//       const employeeTotal = employee.skillHistory?.reduce((sum, skill) => sum + skill.rating, 0) || 0;
//       return acc + employeeTotal;
//     }, 0);

//     const totalSkills = historicalData.reduce((acc, employee) => 
//       acc + (employee.skillHistory?.length || 0), 0);

//     return totalSkills ? (totalRatings / totalSkills).toFixed(1) : 0;
//   };

//   const getSortedSkills = (data) => {
//     const skillMap = new Map();
    
//     data.forEach(employee => {
//       employee.skillHistory?.forEach(skill => {
//         const currentMax = skillMap.get(skill.skillName) || 0;
//         skillMap.set(skill.skillName, Math.max(currentMax, skill.rating));
//       });
//     });

//     return Array.from(skillMap.entries())
//       .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
//       .map(([skillName]) => skillName);
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
//       Git: "Version control system"
//     };
//     return descriptions[skillName] || "Skill description not available";
//   };

//   const filterSkills = (data) => {
//     if (skillFilter === "all") return data;
    
//     return data.filter(employee => {
//       return employee.skillHistory?.some(skill => {
//         switch(skillFilter) {
//           case "high": return skill.rating >= 4;
//           case "medium": return skill.rating >= 2 && skill.rating <= 3;
//           case "low": return skill.rating <= 1;
//           default: return true;
//         }
//       });
//     });
//   };

//   const filteredData = filterSkills(historicalData).filter(employee => {
//     const matchEmployee = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchSkills = employee.skillHistory?.some(skill => 
//       skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     return matchEmployee || matchSkills;
//   });

//   // Data fetching
//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/getHistoricalAssessmentData`,
//           {
//             headers: { Authorization: authToken }
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

//   // Render functions
//   const renderSkillMatrix = () => (
//     <div className="flex">
//       <div className="flex-grow">
//         <div className="bg-white rounded-lg shadow overflow-x-auto">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-b">
//                   Employee
//                 </th>
//                 {getSortedSkills(historicalData).map(skillName => (
//                   <Tooltip 
//                     key={skillName}
//                     title={`${skillName} - ${getSkillDescription(skillName)}`}
//                     arrow
//                   >
//                     <th className="px-3 py-2 text-center border-b cursor-help">
//                       {skillName}
//                     </th>
//                   </Tooltip>
//                 ))}
//                 <th className="px-3 py-2 text-center sticky right-0 bg-gray-50 z-10 border-b">
//                   Total
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((employee, index) => {
//                 const skillMap = new Map(
//                   employee.skillHistory?.map(skill => [skill.skillName, skill.rating])
//                 );
                
//                 return (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="px-3 py-2 font-medium sticky left-0 bg-white z-10">
//                       {employee.employeeName}
//                     </td>
//                     {getSortedSkills(historicalData).map(skillName => (
//                       <td key={skillName} className="px-3 py-2 text-center">
//                         {renderCircularRating(skillMap.get(skillName) || 0)}
//                       </td>
//                     ))}
//                     <td className="px-3 py-2 text-center font-medium sticky right-0 bg-white z-10">
//                       {employee.skillHistory?.length || 0}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

// {/* [ */}
// <div className="w-64 ml-6">
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <h3 className="text-lg font-medium text-gray-700 mb-4">Rating Guidelines</h3>
//           <div className="space-y-4">
//             {[
//               { rating: 5, label: "Expert" },
//               { rating: 4, label: "High Competence" },
//               { rating: 3, label: "Some Competence" },
//               { rating: 2, label: "Low Competence" },
//               { rating: 1, label: "No Competence" }
//             ].map((item) => (
//               <div key={item.rating} className="flex items-center space-x-3">
//                 {renderCircularRating(item.rating)}
//                 <span className="text-sm text-gray-600">{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Main render
//   return (
//     <BoxComponent>
//       <div className="container mx-auto px-4">
//         <HeadingOneLineInfo
//           heading="Skill Matrix Report"
//           info="View and analyze skill distribution across teams"
//         />

//         <StatisticsDashboard 
//           historicalData={historicalData}
//           getSortedSkills={getSortedSkills}
//           calculateTeamAverage={calculateTeamAverage}
//         />

//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-wrap gap-4 mb-4">
//             <input 
//               type="search"
//               placeholder="Search skills or employees..."
//               className="border rounded px-3 py-2 flex-grow min-w-[200px]"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select 
//               className="border rounded px-3 py-2 min-w-[150px]"
//               value={skillFilter}
//               onChange={(e) => setSkillFilter(e.target.value)}
//             >
//               <option value="all">All Skills</option>
//               <option value="high">High Rated (4-5)</option>
//               <option value="medium">Medium Rated (2-3)</option>
//               <option value="low">Low Rated (0-1)</option>
//             </select>
//             <select
//               className="border rounded px-3 py-2 min-w-[150px]"
//               value={viewMode}
//               onChange={(e) => setViewMode(e.target.value)}
//             >
//               <option value="matrix">Skill Matrix</option>
//               <option value="heatmap">Competency Heatmap</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>Skill Matrix</option>
//                 <option>Competency Report</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Departments</option>
//                 <option>Engineering</option>
//                 <option>Development</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
//               <select className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option>All Teams</option>
//                 <option>Frontend</option>
//                 <option>Backend</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-4">
//             <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
//               Generate Report
//             </button>
//             <button className="border border-blue-900 text-blue-900 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
//               Export
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           viewMode === 'matrix' ? renderSkillMatrix() : (
//             <CompetencyHeatmap 
//               historicalData={historicalData}
//             />
//           )
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default CircularSkill;





