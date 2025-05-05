/* eslint-disable no-unused-vars */

import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Modal } from "@mui/material";

import { useParams } from "react-router-dom";
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
  Tabs,
  Tab,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Button } from '@mui/material';
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SkillLookupTable from "./SkillLookupTable";
import OlddSkillsLookup from "./OlddSkillsLookup";
import FetchEvaluateAssSkills from "./FetchEvaluateAssSkills";
import HistoricalAssessment from "./HistoricalAssessment";
import SendAssessment from "./SendAssessment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillGraph = ({ skillsData }) => {
  const chartData = {
    labels: skillsData.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Rating (0-5)",
        data: skillsData.map((skill) => skill.rating),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const MyteamInsights = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { UserInformation } = useHook();
  const [skillsData, setSkillsData] = useState([]);
  const [lowRatedSkills, setLowRatedSkills] = useState([]);
  const [selfAssessmentStatus, setSelfAssessmentStatus] = useState("");
  const [managerAssessmentStatus, setManagerAssessmentStatus] = useState("");
  const [stats, setStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Add state for modal
  const [openSendAssessment, setOpenSendAssessment] = useState(false);

  // Add handlers
  const handleOpenSendAssessment = () => setOpenSendAssessment(true);
  const handleCloseSendAssessment = () => setOpenSendAssessment(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!organisationId) {
        console.error("organisationId ID is missing.");
        alert("organisationId ID is missing");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/OrgStats`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log(" ashu API Response: ", response.data);
        if (response.data.success) {
          setStats(response.data.data);
          console.log("Set stats data:", response.data.data);
        } else {
          console.error("Failed to fetch organization statistics");
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      }
    };

    fetchStats();
  }, [authToken, organisationId]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <OlddSkillsLookup />;
      // case 1:
      //   return <FetchEvaluateAssSkills />;
      case 1:
        return <HistoricalAssessment />;
      default:
        return <OlddSkillsLookup />;
    }
  };

  return (
    <div className=" container mx-auto px-4">
      <BoxComponent>
        <div className="flex justify-between">
          <HeadingOneLineInfo
            heading={"My Team's Insights"}
            info={"Analyze team performance with real-time data and reports"}
          />

          <div className="flex">
            <button
             variant="contained"
              onClick={handleOpenSendAssessment}
              // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              className=" text-blue-500 hover:text-blue-700 cursor-pointer  font-bold py-2 px-4"
            >
              Send Assessment
            </button>
            


            {/* Add Modal */}
            <Modal
              open={openSendAssessment}
              onClose={handleCloseSendAssessment}
              aria-labelledby="send-assessment-modal"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  maxWidth: 800,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
              >
                <SendAssessment
                  handleClose={handleCloseSendAssessment}
                  mutate={() => {
                    handleCloseSendAssessment();
                    // Add any additional refresh logic here if needed
                  }}
                />
              </Box>
            </Modal>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="skill assessment tabs"
          >
            <Tab label="Skills Evaluation" />
            {/* <Tab label="Employee Performance" /> */}
            <Tab label=" Skill Analysis" />
            {/* <Tab label="Historical Skill Analysis" /> */}
          </Tabs>
        </Box>

        {renderTabContent()}
      </BoxComponent>
    </div>
  );
};
export default MyteamInsights;

// ____________________
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
// import SkillLookupTable from "./SkillLookupTable";
// import OlddSkillsLookup from "./OlddSkillsLookup";

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
// const MyteamInsights = () => {
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const { UserInformation } = useHook();
//   console.log("UserInformation", UserInformation);
//   const [skillsData, setSkillsData] = useState([]);
//   const [lowRatedSkills, setLowRatedSkills] = useState([]);
//   const [selfAssessmentStatus, setSelfAssessmentStatus] = useState("");
//   const [managerAssessmentStatus, setManagerAssessmentStatus] = useState("");

//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!organisationId) {
//         console.error("organisationId ID is missing.");
//         alert("organisationId ID is missing");
//         return;
//       }
//       try {
//         const response = await axios.get(
//           // `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee/${employeeId}/assessment/completed`,
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/OrgStats`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         console.log(" ashu API Response: ", response.data);
//         if (response.data.success) {
//           setStats(response.data.data);
//           console.log("Set stats data:", response.data.data);
//         } else {
//           console.error("Failed to fetch organization statistics");
//         }
//       } catch (error) {
//         console.error("Error fetching skills data:", error);
//       }
//     };

//     fetchStats();
//   }, [authToken, organisationId]);
//   console.log("Stats data to be rendered:", stats);
//   return (
//     <div className="container mx-auto px-4 ">
//       <BoxComponent>

//         <HeadingOneLineInfo
//           heading={"My Team's Insights"}
//           info={"Analyze team performance with real-time data and reports"}
//         />

//         {/* <div className="flex space-x-4  rounded-lg ">
//           <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">

//             <h3 className="text-lg font-bold mb-2"> A quick glimpse</h3>
//             <div className="flex space-x-4 my-3 py-2">
//               <div className="w-1/2">
//                 <div className="h-24 bg-[#b4c9dd] rounded-lg mb-2"></div>
//                 <p className="text-center text-lg font-bold">3.40</p>
//                 <p className="text-center text-gray-600 text-sm">Skill level</p>
//               </div>
//               <div className="w-1/2">
//                 <div className="h-24 bg-[#b4c9dd] rounded-lg mb-2"></div>
//                 <p className="text-center text-lg font-bold">2.72</p>
//                 <p className="text-center text-gray-600 text-sm">
//                   Interest level
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">

//             <h3 className="text-lg font-bold mb-2">Statistics</h3>
//             <div className="space-y-2 my-3 py-2">
//               <div className="flex justify-between">
//                 <p className="text-gray-700">People in this team:</p>
//                 <p className="text-gray-900 font-bold">5</p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-gray-700">Self-assessments completed:</p>
//                 <p className="text-gray-900 font-bold">1 / 5 </p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-gray-700">
//                   Supervisor assessments completed:
//                 </p>
//                 <p className="text-gray-900 font-bold">0 / 5 </p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-gray-700">Assessable skills:</p>
//                 <p className="text-gray-900 font-bold">13</p>
//               </div>
//             </div>
//           </div>
//           <div className="w-1/3 bg-white rounded-lg shadow-inner p-4">

//             <h3 className="text-lg font-bold mb-2">Manager</h3>
//             <div className="flex items-center space-x-2 my-3 py-2">
//               <p className="text-gray-900 font-bold">1</p>
//               <img
//                 src="https://placehold.co/50x50"
//                 alt="Hazel Raynor"
//                 className="rounded-full h-8 w-8"
//               />
//               <p className="text-gray-900 font-medium">Manager User</p>
//             </div>
//           </div>
//         </div> */}
//         <br />
//         {/* <Box> */}
//           {/* SkillLookuptable including overallrating  nd Insights btn*/}
//           {/* <SkillLookupTable /> */}
//           {/* ALL old skillLookup table  render ethe*/}
//          <OlddSkillsLookup/>
//         {/* </Box> */}
//       </BoxComponent>
//     </div>
//   );
// };
// export default MyteamInsights;

//In this component i wanna integrate three  tab functionallity default =first for    <OlddSkillsLookup/> , second tab for  <FetchEvaluateAssSkills /> and third tab for <HistoricalAssessment/>
