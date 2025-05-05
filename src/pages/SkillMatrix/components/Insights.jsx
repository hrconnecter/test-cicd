/* eslint-disable no-unused-vars */
// // Insights.jsx
// import React from 'react';

// const Insights = ({ userRole }) => {
//   return (
//     <div>
//       <h2>My Insights</h2>
//       <p>Summary of logged-in user's insights here.</p>

//       {userRole === 'HR' || userRole === 'Manager' ? (
//         <div>
//           <h2>My Team's Insights</h2>
//           <p>Team insights visible for authorized users.</p>
//         </div>
//       ) : null}

//       {userRole === 'Super Admin' || userRole === 'HR' ? (
//         <div>
//           <h2>Organization Insights</h2>
//           <p>Full organization insights visible for Super Admin/HR only.</p>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Insights;
// ____________________________________________________________________________________________
//one
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import React, { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import UserProfile from "../../../hooks/UserData/useUser";
// import axios from "axios";
// import useHook from "../../../hooks/UserProfile/useHook";
// import { Avatar, Box, Grid, Skeleton, Typography } from "@mui/material";
// import { Bar } from "react-chartjs-2";
// import {
//   BarChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
// } from "recharts";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useNavigate } from 'react-router-dom';
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );
// const SkillGraph = ({ skillsData }) => {
//   const chartData = {
//     labels: skillsData.map((skill) => skill.name),
//     datasets: [
//       {
//         label: "Skill Rating (0-5)",
//         data: skillsData.map((skill) => skill.rating),
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       y: {
//         min: 0,
//         max: 5,
//         ticks: {
//           stepSize: 1, // Y-axis will have values from 0 to 5 with steps of 1
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// const Insights = () => {
//   const { organisationId, employeeId } = useParams();
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const { UserInformation } = useHook();
//   console.log("UserInformation", UserInformation);
//   const [skillsData, setSkillsData] = useState([]);
//   const [lowRatedSkills, setLowRatedSkills] = useState([]);
//   const [selfAssessmentStatus, setSelfAssessmentStatus] = useState("");
//   const [managerAssessmentStatus, setManagerAssessmentStatus] = useState("");
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchSkillsData = async () => {
//       if (!employeeId) {
//         console.error("Employee ID is missing.");
//         alert("Employee ID is missing");
//         return;
//       }
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/assessment/completed`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         console.log(" ashu API Response: ", response.data);
//         if (response.data.success) {
//           setSkillsData(response.data.data);

//           setSelfAssessmentStatus(response.data.selfAssessmentStatus);
//           setManagerAssessmentStatus(response.data.managerAssessmentStatus);

//           // Filter low-rated skills (rating < 3)
//           const lowSkills = response.data.data.filter(
//             (skill) => skill.rating < 3
//           );
//           setLowRatedSkills(lowSkills);
//         } else {
//           console.error("Error fetching skills data:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching skills data:", error);
//       }
//     };

//     fetchSkillsData();
//   }, [authToken, organisationId, employeeId]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "green"; // Green for completed
//       case "in-progress":
//         return "yellow"; // Yellow for in-progress
//       case "Not Started":
//         return "red"; // Red for not started
//       default:
//         return "gray"; // Default gray color
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 ">
//       <BoxComponent>
//         <HeadingOneLineInfo
//           heading={"My Summary"}
//           info={
//             "Track your performance and growth with detailed reports and interactive charts"
//           }
//         />
//         <div>
//           <div className="flex justify-between items-center mb-2"></div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white shadow-md rounded p-3">
//               <h3 className="text-lg font-bold mb-2">Information</h3>

//               <div className="flex items-center mb-4  px-4 gap-2 my-3 py-2">
//                 <div className="bg-blue-500 rounded-full p-1 m-1">
//                   <Avatar
//                     sx={{
//                       height: 144,
//                       width: 144,
//                     }}
//                     src={UserInformation?.user_logo_url}
//                   />
//                 </div>
//                 <div className=" h-36 border-[0.5px] border-[#E5E7EB] bg-white py-4 rounded-lg shadow-md"></div>

//                 <div className="py-4 ">
//                   <h2 className="text-xl font-bold">
//                     {UserInformation.first_name} {UserInformation.last_name}
//                   </h2>
//                   <p className="text-gray-600">
//                     {UserInformation?.designation?.[0]?.designationName}{" "}
//                     Developer
//                   </p>
//                   {/* <p className="text-gray-600">5 active skills</p>
//                   <p className="text-red-500">2 not completed</p> */}
//                   <p className="text-green-600">
//                     {skillsData.length} active skills
//                   </p>
//                   {/* list of completed assessment */}
//                   {/* <p className="text-red-500">
//                     {skillsData.filter((skill) => skill.rating < 1).length} not
//                     completed
//                   </p> */}

//                   {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
//                     Start your Self-assessment
//                   </button> */}
//                 </div>
//               </div>
//               {/* <div className="h-48 text-center">
//                 <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
//                   Start your Self-assessment
//                 </button>
//               </div> */}
//               <div className="h-48 text-center">
//                 {selfAssessmentStatus !== "completed" ? (
//                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
//                   onClick={() => navigate(`/organization/${organisationId}/employee/${employeeId}/assessment`)}
//                   >
//                     Start your Self-assessment
//                   </button>
//                 ) : managerAssessmentStatus !== "completed" ? (
//                   <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
//                   onClick={() => navigate(`/organization/${organisationId}/employee/${employeeId}/receive-assessment`)}
//                   >
//                     Start your Manager-assessment
//                   </button>
//                 ) : (
//                   <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
//                     Up-to-date Assessment
//                   </button>
//                 )}
//               </div>

//               <div className="h-48">
//                 <div className="flex items-center justify-center h-full">
//                   {/* <p>People with similar skills</p> */}
//                 </div>
//               </div>
//             </div>

//             {/* 2nd */}
//             <div className="bg-white shadow-md rounded p-4">
//               <h3 className="text-lg font-bold mb-2 ">Top Rated Skills</h3>

//               <div className="my-6 py-2">
//                 <SkillGraph skillsData={skillsData} />
//               </div>
//               <br />

//               {/* <div className="h-48">
//                 <h3 className="text-lg font-bold mb-4 mt-10">
//                   Keep to Improve
//                 </h3>
//                 <div className="">
//                   <div className="mt-2 px-3">
//                     <ul className="list-disc pl-6">
//                       {lowRatedSkills.length > 0 ? (
//                         lowRatedSkills.map((skill, index) => (
//                           <li key={index} className="text-red-500">
//                             {skill.name} (Rating: {skill.rating})
//                           </li>
//                         ))
//                       ) : (
//                         <p className="text-gray-600 space-x-2 mx-2 mt-2">
//                           No low-rated skills found
//                         </p>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//               </div> */}
//               {/* <div className="h-48">
//   <h3 className="text-lg font-bold mb-4 mt-10">Keep to Improve</h3>
//   <div className="relative">
//     {lowRatedSkills.length > 0 ? (
//       <div className="space-y-4">
//         {lowRatedSkills.map((skill, index) => (
//           <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
//             <div className="w-1/2">
//               <p className="font-medium text-gray-700">{skill.name}</p>
//             </div>
//             <div className="w-1/2 flex items-center gap-2">
//               <div className="flex-1 bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-red-500 h-2 rounded-full"
//                   style={{ width: `${(skill.rating / 5) * 100}%` }}
//                 />
//               </div>
//               <span className="text-sm text-red-500 font-medium min-w-[45px]">
//                 {skill.rating}/5
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//         <div className="text-center">
//           <span className="material-icons text-gray-400 text-3xl mb-2">
//             ✨
//           </span>
//           <p className="text-gray-500">All skills are well rated! No low-rated skills found</p>
//         </div>
//       </div>
//     )}
//   </div>
// </div> */}
// <div className="h-48">
//   <h3 className="text-lg font-bold mb-4 mt-10 flex items-center gap-2">
//     Keep to Improve
//   </h3>

//   {lowRatedSkills.length > 0 ? (
//     <div className="grid gap-4">
//       {lowRatedSkills.map((skill, index) => (
//         <div key={index}>
//           <div className="flex items-center p-3 rounded-md bg-gray-50 text-gray-800">
//             <div className="w-1/3">
//               <span className="ml-2 font-bold">{skill.name}</span>
//             </div>

//             <div className="w-2/3 flex items-center gap-3">
//               <div className="flex-1">
//                 {[...Array(5)].map((_, i) => (
//                   <span
//                     key={i}
//                     className={`text-xl ${i < Math.floor(skill.rating) ? 'text-yellow-400' : 'text-gray-800'}`}
//                   >
//                     {i < Math.floor(skill.rating) ? '★' : '☆'}
//                   </span>
//                 ))}
//               </div>
//               <div className="text-lg font-bold bg-white text-blue-800 px-3 py-1 rounded-full">
//                 {skill.rating}/5
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl text-dark text-center">
//       <div className="text-4xl mb-2">🌟</div>
//       <p className="text-gray-500">All skills are well rated! No low-rated skills found</p>
//     </div>
//   )}
// </div>

//             </div>

//             {/* 3rd */}
//             <div className="bg-white shadow-md rounded p-4">
//               <h3 className="text-lg font-bold mb-2">Assessment</h3>

//               <div className="grid grid-cols-2 gap-4 my-3 py-2">
//                 <div className="bg-gray-200 rounded p-4">
//                   <p className="text-center text-sm font-bold">
//                     Self Assessment
//                   </p>
//                   {/* <p className="text-center text-sm">Status</p> */}
//                   <p
//                     className="text-center text-sm"
//                     style={{ color: getStatusColor(selfAssessmentStatus) }}
//                   >
//                     {selfAssessmentStatus === "Not Started"
//                       ? "Not Started"
//                       : selfAssessmentStatus === "completed"
//                       ? "Completed"
//                       : selfAssessmentStatus === "in-progress"
//                       ? "In Progress"
//                       : "Pending"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-200 rounded p-4">
//                   <p className="text-center text-sm font-bold">
//                     Manager Assessment
//                   </p>
//                   {/* <p className="text-center text-sm">Status</p> */}
//                   <p
//                     className="text-center text-sm"
//                     style={{ color: getStatusColor(managerAssessmentStatus) }}
//                   >
//                     {managerAssessmentStatus === "Not Started"
//                       ? "Not Started"
//                       : managerAssessmentStatus === "completed"
//                       ? "Completed"
//                       : managerAssessmentStatus === "in-progress"
//                       ? "In Progress"
//                       : "Pending"}
//                   </p>
//                 </div>

//               </div>
//             </div>

//           </div>
//         </div>
//       </BoxComponent>
//     </div>
//   );
// };
// export default Insights;
//  ________________________________________________________________________________________________

//two

// _________________________________________________________________________________

//three
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import axios from "axios";
import useHook from "../../../hooks/UserProfile/useHook";
import {
  Avatar,
  Box,
  Grid,
  Skeleton,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  LinearProgress,
} from "@mui/material";
import { Bar, Radar, Line, Doughnut } from "react-chartjs-2";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Legend,
  Tooltip as RechartsTooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);
// Export utilities at top level
export const useSkillAnalytics = (skillsData) => {
  const calculateGrowthRate = () => {
    // Calculate growth rate based on historical data
    const growthRates = skillsData.map((skill) => ({
      skillName: skill.name,
      growthRate:
        ((skill.rating - skill.initialRating) / skill.initialRating) * 100,
    }));
    return growthRates;
  };

  const predictFutureProgress = () => {
    // Predict future skill levels based on current growth rate
    const predictions = skillsData.map((skill) => ({
      skillName: skill.name,
      predictedRating: Math.min(5, skill.rating * 1.2),
    }));
    return predictions;
  };

  const getSkillGaps = () => {
    // Identify gaps between current and target skill levels
    const gaps = skillsData.map((skill) => ({
      skillName: skill.name,
      gap: 5 - skill.rating,
    }));
    return gaps;
  };

  return {
    calculateGrowthRate,
    predictFutureProgress,
    getSkillGaps,
  };
};

export const skillsAnalytics = {
  calculateSkillScore: (ratings) => {
    return ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
  },

  getSkillLevel: (score) => {
    if (score >= 4.5) return "Expert";
    if (score >= 3.5) return "Advanced";
    if (score >= 2.5) return "Intermediate";
    return "Beginner";
  },

  generateSkillReport: (skillsData) => {
    const averageScore = skillsAnalytics.calculateSkillScore(
      skillsData.map((skill) => skill.rating)
    );
    const level = skillsAnalytics.getSkillLevel(averageScore);
    return {
      averageScore,
      level,
      totalSkills: skillsData.length,
      needsImprovement: skillsData.filter((skill) => skill.rating < 3).length,
    };
  },
};
// Helper Components
const SkillGraph = ({ skillsData }) => {
  const chartData = {
    labels: skillsData.map((skill) => skill.name),
    datasets: [
      {
        label: "Current Rating",
        data: skillsData.map((skill) => skill.rating),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Target Rating",
        data: skillsData.map(() => 5),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        type: "line",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Skill Progress Overview",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const SkillRadar = ({ skillsData }) => {
  const data = {
    labels: skillsData.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Levels",
        data: skillsData.map((skill) => skill.rating),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  };

  return <Radar data={data} options={options} />;
};

const ProgressTimeline = ({ historyData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={historyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line type="monotone" dataKey="rating" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

//remove
const SkillComparison = ({ userData, teamData }) => {
  const data = {
    labels: ["Technical", "Leadership", "Communication", "Problem Solving"],
    datasets: [
      {
        label: "Your Skills",
        data: userData,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Team Average",
        data: teamData,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
  return <Radar data={data} />;
};

const GrowthTrajectory = ({ skillHistory }) => {
  const data = skillHistory.map((entry) => ({
    name: entry.date,
    actual: entry.rating,
    projected: entry.rating * 1.2,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RechartsTooltip />
        <Area
          type="monotone"
          dataKey="actual"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="projected"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const SkillDevelopmentPlan = ({ recommendations }) => {
  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-lg">{rec.skillName}</h4>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span>Current Level: {rec.currentRating}/5</span>
              <span>Target Level: 5/5</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={(rec.currentRating / 5) * 100}
              sx={{ height: 8, borderRadius: 4, mt: 1 }}
            />
          </div>
          <div className="mt-4">
            <h5 className="font-medium">Action Items:</h5>
            <ul className="list-disc list-inside mt-2">
              {rec.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-gray-600">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
const Insights = () => {
  const { organisationId, employeeId } = useParams();
  const authToken = useAuthToken();
  const navigate = useNavigate();
  const { getCurrentUser } = UserProfile();
  const { UserInformation } = useHook();

  // Enhanced State Management
  const [skillsData, setSkillsData] = useState([]);
  const [lowRatedSkills, setLowRatedSkills] = useState([]);
  const [skillHistory, setSkillHistory] = useState([]);
  const [selfAssessmentStatus, setSelfAssessmentStatus] = useState("");
  const [managerAssessmentStatus, setManagerAssessmentStatus] = useState("");
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [comparisonData, setComparisonData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [selfAssessments, setSelfAssessments] = useState([]);
  const [latestDate, setLatestDate] = useState(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      if (!employeeId) {
        console.error("Employee ID is missing.");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/assessment/completed`,
          {
            headers: { Authorization: authToken },
          }
        );

        if (response.data.success) {
          setSkillsData(response.data.data);
          setSelfAssessmentStatus(response.data.selfAssessmentStatus);
          setManagerAssessmentStatus(response.data.managerAssessmentStatus);

          // Handle self assessment date
          if (response.data.selfAssessmentStatus === "completed") {
            setSelfAssessments([{ completedDate: new Date() }]);
            setLatestDate(new Date());
          }

          const lowSkills = response.data.data.filter(
            (skill) => skill.rating < 3
          );
          setLowRatedSkills(lowSkills);

          const categories = [
            ...new Set(response.data.data.map((skill) => skill.category)),
          ];
          setSkillCategories(categories);

          generateSkillHistory(response.data.data);
          generateRecommendations(response.data.data);
          calculateAchievements(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      }
    };

    fetchSkillsData();
  }, [authToken, organisationId, employeeId]);

  const generateSkillHistory = (skills) => {
    const mockHistory = skills.map((skill) => ({
      skillId: skill.id,
      name: skill.name,
      history: Array.from({ length: 6 }, (_, i) => ({
        date: new Date(
          Date.now() - i * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        rating: Math.max(1, Math.min(5, skill.rating - Math.random())),
      })),
    }));
    setSkillHistory(mockHistory);
  };
  const checkSixMonthsPassed = (date) => {
    if (!date) return false;
    const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
    return new Date() - new Date(date) >= sixMonthsInMs;
  };

  const generateRecommendations = (skills) => {
    const recs = skills
      .filter((skill) => skill.rating < 4)
      .map((skill) => ({
        skillName: skill.name,
        currentRating: skill.rating,
        suggestions: [
          `Take online courses in ${skill.name}`,
          `Practice ${skill.name} through projects`,
          // `Find a mentor for ${skill.name}`
        ],
      }));
    setRecommendations(recs);
  };

  const calculateAchievements = (skills) => {
    const achievementsList = [
      {
        title: "Skill Master",
        description: "Achieved 5/5 in any skill",
        earned: skills.some((skill) => skill.rating === 5),
      },
      {
        title: "Well Rounded",
        description: "All skills rated 3 or higher",
        earned: skills.every((skill) => skill.rating >= 3),
      },
      // {
      //   title: "Quick Learner",
      //   description: "Improved any skill by 2 points",
      //   earned: true,
      // },
    ];
    setAchievements(achievementsList);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "in-progress":
        return "yellow";
      case "Not Started":
        return "red";
      default:
        return "gray";
    }
  };

  const filteredSkills =
    selectedCategory === "all"
      ? skillsData
      : skillsData.filter((skill) => skill.category === selectedCategory);

  // const isSixMonthsAgo = latestDate && (new Date() - latestDate) >= 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
  return (
    <div className="container mx-auto px-4">
      <BoxComponent>
        <HeadingOneLineInfo
          heading="Skills Dashboard"
          info="Comprehensive overview of your skill development journey"
        />

        {/*✅  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1 */}
          {/* Profile and Quick Actions Card */}

          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h3 className="text-xl font-bold pb-2">Information</h3>
            <div className="flex items-center space-x-4">
              <Avatar
                sx={{ width: 90, height: 90, border: "3px solid #4F46E5" }}
                src={UserInformation?.user_logo_url}
              />
              <div className=" h-20 border-[0.5px] border-[#E5E7EB] bg-white py-4 rounded-lg shadow-md"></div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {UserInformation.first_name} {UserInformation.last_name}
                </h2>
                <p className="text-gray-600">
                  {UserInformation?.designation?.[0]?.designationName} Developer
                </p>

                <p className="text-green-600">
                  {skillsData.length} active skills
                </p>
              </div>
            </div>

            <div className="mx-3">
              {/* <LinearProgress
                variant="determinate"
                value={
                  (skillsData.filter((s) => s.rating >= 4).length /
                    skillsData.length) *
                  100
                }
                sx={{ height: 8, borderRadius: 4 }}
              /> */}
            </div>

            {/* Assessment Actions */}
            <div className=" flex justify-between items-center">
              {selfAssessmentStatus !== "completed" ? (
                <button
                  onClick={() =>
                    // http://localhost:3000/organisation/66e016b5ee260b656b953178/skills/SelfAssessmentbyEmp
                    navigate(
                      // `/organization/${organisationId}/employee/${employeeId}/assessment`
                      `/organisation/${organisationId}/skills/SelfAssessmentbyEmp`
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Start Self-Assessment
                </button>
              ) : managerAssessmentStatus !== "completed" ? (
                <button
                  onClick={() =>
                    // http://localhost:3000/organisation/66e016b5ee260b656b953178/skillMatrix/directory/assessment/employee/67384a11c6b3e4ab60473dd1
                    navigate(
                      // `/organization/${organisationId}/employee/${employeeId}/receive-assessment`
                      `/organisation/${organisationId}/skillMatrix/directory/assessment/employee/${employeeId}`
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Start Manager Assessment
                </button>
              ) : (
                <div className="bg-green-100 text-green-800 text-center font-bold py-2 px-4 rounded mt-2">
                  All Assessments Up-to-date ✓
                </div>
              )}
              <div className="px=1 mx-1">
                {selfAssessments.length > 0 && latestDate ? (
                  <div className="bg-green-100 text-green-800 text-center font-bold py-2 px-4 rounded mt-2">
                     Self-Assessment:{" "}
                    {latestDate.toLocaleDateString()} 
                  </div>
                ) : (
                  // <div className="bg-yellow-100 text-yellow-800 text-center font-bold py-2 px-4 rounded mt-2">
                  //   {isSixMonthsAgo
                  //     ? "You updated the last self-assessment 6 months ago, please update."
                  //     : "No assessments completed yet."

                  //     }
                  // </div>
                  <div className="bg-yellow-100 text-yellow-800 text-center font-bold py-2 px-4 rounded mt-2">
                    {checkSixMonthsPassed(latestDate)
                      ? "You updated the last self-assessment 6 months ago, please update."
                      : "No assessments completed yet."}
                  </div>
                )}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-lg ${
                      achievement.earned ? "bg-yellow-50" : "bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl mr-2">
                      {achievement.earned ? "🏆" : "🔒"}
                    </span>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="space-y-2">
                
                <p className="font-medium">Track your Performace</p>
                <p className="text-sm text-gray-600">
                 Upcoming! Performance Managment
                </p>
              </div> */}


<div className="border-t pt-4">
  <h3 className="text-lg font-semibold mb-3">Upcoming Features</h3>
  <div className="space-y-2">
    <div className="flex items-center p-2 rounded-lg bg-blue-50 animate-pulse">
      <span className="text-2xl mr-2">🚀</span>
      <div>
        <p className="font-medium">Performance Management</p>
        <p className="text-sm text-gray-600">
        Coming soon! Set goals and monitor progress
        </p>
      </div>
    </div>
  </div>
</div>




          
            </div>
          </div>

          

          {/* <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
              
              </div> */}

          {/* Skill Analytics Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <div>
              {/* Assessment Status Card */}
              <div className="mb-6">
                <h3 className="text-xl font-bold pb-2">Assessment Status </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`rounded-lg p-6 ${
                      selfAssessmentStatus === "completed"
                        ? "bg-green-50"
                        : selfAssessmentStatus === "in-progress"
                        ? "bg-yellow-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-center mt-2">
                      <h4 className="font-semibold mb-2">Self Assessment</h4>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selfAssessmentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : selfAssessmentStatus === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {selfAssessmentStatus === "Not Started"
                          ? "Not Started"
                          : selfAssessmentStatus === "completed"
                          ? "Completed"
                          : selfAssessmentStatus === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg p-6 ${
                      managerAssessmentStatus === "completed"
                        ? "bg-green-50"
                        : managerAssessmentStatus === "in-progress"
                        ? "bg-yellow-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Manager Assessment</h4>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          managerAssessmentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : managerAssessmentStatus === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {managerAssessmentStatus === "Not Started"
                          ? "Not Started"
                          : managerAssessmentStatus === "completed"
                          ? "Completed"
                          : managerAssessmentStatus === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <br />

            <div className="flex justify-between items-center mb-6 ">
              <h3 className="text-xl font-bold">Skill Analytics</h3>
              <div className="flex space-x-2">
                {skillCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Skill Chart */}
            <div className="h-[300px] mb-6">
              <SkillGraph skillsData={filteredSkills} />
            </div>

            {/* Skill Distribution */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="h-[200px]">
                <SkillRadar skillsData={filteredSkills} />
              </div>
              <div className="h-[200px]">
                <ProgressTimeline historyData={skillHistory} />
              </div>
            </div> */}
          </div>
        </div>

        {/* Recommendations and Progress Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills to Improve */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Skills to Improve</h3>
            {lowRatedSkills.length > 0 ? (
              <div className="space-y-4">
                {lowRatedSkills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < Math.floor(skill.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <LinearProgress
                        variant="determinate"
                        value={(skill.rating / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(209, 213, 219, 0.5)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#4F46E5",
                          },
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <span className="material-icons text-gray-400 text-3xl mb-2">
                    ✨
                  </span>
                  <p className="text-gray-500">
                    All skills are well rated! No low-rated skills found
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              Personalized Recommendations
            </h3>
            <SkillDevelopmentPlan recommendations={recommendations} />
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Insights;
