/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useHook from "../../../hooks/UserProfile/useHook";
import { Bar } from "react-chartjs-2";
import { Avatar, Box, Grid, Skeleton, Typography } from "@mui/material";
import useDashboardFilter from "../../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../../hooks/Dashboard/useEmployee";
import FourMatrix from "./FourMatrix";
import CircularSkill from "./CircularSkill"
import { useQuery } from "react-query";
import axios from "axios";

import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
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

const OrganizationalInsights = () => {
  const { organisationId, employeeId } = useParams();
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { UserInformation } = useHook();
  const [skillsData, setSkillsData] = useState([]);
  const [lowRatedSkills, setLowRatedSkills] = useState([]);
  const [selfAssessmentStatus, setSelfAssessmentStatus] = useState("");
  const [managerAssessmentStatus, setManagerAssessmentStatus] = useState("");

  //count employees
  const { employee } = useEmployee(organisationId, 1, "");
  const [selfAssessmentsCompleted, setSelfAssessmentsCompleted] = useState(0);
  const [supervisorAssessmentsCompleted, setSupervisorAssessmentsCompleted] =
    useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [averageSkillLevel, setAverageSkillLevel] = useState(0);

  // Fetch Organization Stats Query
  const { data: organizationStatsData } = useQuery(
    ["organizationStats", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/stats`,
        {
          headers: { Authorization: authToken },
        }
      );
      console.log("Frontend Request Details:", {
        url: `${process.env.REACT_APP_API}/route/organization/${organisationId}/stats`,
        organisationId: organisationId,
      });
      console.log("Apresponse.data", response.data);
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        setSelfAssessmentsCompleted(data.selfAssessmentCompleted || 0);
        setSupervisorAssessmentsCompleted(data.managerAssessmentCompleted || 0);
        setTotalSkills(data.totalSkills || 0);
        setAverageSkillLevel(parseFloat(data.averageSkillLevel) || 0);
      },
      onError: (error) => {
        console.error("Error fetching organization stats:", error);
      },
    }
  );

  const {
    Managers,
    // managerLoading,
    // location: loc,
    oraganizationLoading,
    absentEmployee,
    locationOptions,
    managerOptions,
    Departmentoptions,
    // customStyles,
    data,
    locations,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,
    salaryData,
  } = useDashboardFilter(organisationId);
  console.log("employee", employee);

  const mostSkilled = [
    { rank: 1, score: 3.92, name: "Prachi Bhagat" },
    { rank: 2, score: 3.85, name: "Aadesh Rathod" },
    { rank: 3, score: 3.77, name: "Aniket Potbhare" },
    { rank: 4, score: 3.58, name: "Naresh Bhosale" },
    { rank: 5, score: 3.58, name: "Employee User" },
    { rank: 6, score: 3.38, name: "User Employee" },
  ];
  const mostInterested = [
    { rank: 1, score: 3.31, name: "Prachi Bhagat" },
    { rank: 2, score: 3.31, name: "Aadesh Rathod" },
    { rank: 3, score: 2.92, name: "Aniket Potbhare" },
    { rank: 4, score: 2.85, name: "Naresh Bhosale" },
    { rank: 5, score: 2.85, name: "Employee User" },
    { rank: 6, score: 2.85, name: "User Employee" },
  ];

  const topSkills = [
    { rank: 1, score: 4.12, name: "ReactJs" },
    { rank: 2, score: 3.83, name: "Javascript" },
    { rank: 3, score: 3.62, name: "ExpressJs" },
    { rank: 4, score: 3.54, name: "Java" },
    { rank: 5, score: 3.42, name: "Implement a firewall" },
    { rank: 6, score: 3.42, name: "PHP" },
  ];

  return (
    <div className="container mx-auto px-6 py-4">
      <BoxComponent>
        <HeadingOneLineInfo
          heading="Organizational Insights"
          info="Gain a comprehensive overview of team performance and skill metrics"
        />

        {/* 1 */}
        <div className="flex space-x-4  rounded-lg  ">
          <div className="w-1/3 bg-white rounded-lg  p-4">
            <h3 className="text-lg font-bold mb-2"> A Quick Glimpse</h3>
            <div className="flex space-x-4 my-3 py-2">
              <div className="w-1/2">
                <div className="h-24 bg-gradient-to-r from-blue-50 to-blue-200 rounded-lg mb-2"></div>
                <p className="text-center text-lg font-bold"> {averageSkillLevel.toFixed(2)}</p>
                <p className="text-center text-gray-600 text-sm">Skill level</p>
              </div>
              <div className="w-1/2">
                <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg mb-2"></div>
                <p className="text-center text-lg font-bold">{totalSkills}</p>
                <p className="text-center text-gray-600 text-sm">
                Assessable skills
                </p>
              </div>
            </div>
          </div>

          {/* ✅   */}

          <div className="w-1/3 bg-white rounded-lg  p-4">
            {/* <p className="text-gray-600 text-sm font-medium mb-2">Statistics</p> */}
            <h3 className="text-lg font-bold mb-2">Statistics</h3>
            <div className="space-y-2 my-3 py-2">
              <div className="flex justify-between">
                <p className="text-gray-700">People in this Organizastion:</p>

                <p className="text-gray-900 font-bold">
                  {employee?.totalEmployees}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Self-assessments completed:</p>
                <p className="text-gray-900 font-bold">  
                   {selfAssessmentsCompleted} / {employee?.totalEmployees || 0}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">
                  Supervisor assessments completed:
                  
                </p>
                <p className="text-gray-900 font-bold">{supervisorAssessmentsCompleted} / {employee?.totalEmployees || 0}</p>
              </div>
              {/* <div className="flex justify-between">
                <p className="text-gray-700">Assessable skills:</p>
                <p className="text-gray-900 font-bold"> </p>{" "}
              </div> */}
            </div>
          </div>
          <div className="w-1/3 bg-white rounded-lg  p-4">
           
            <h3 className="text-lg font-bold mb-2">
              Roles in the Organization
            </h3>
            <div className="flex items-center space-x-2 my-3 py-2">
              <p className="text-gray-900 font-bold"></p>{" "}
              <img
                src="https://placehold.co/50x50"
                alt="Hazel Raynor"
                className="rounded-full h-8 w-8"
              />
              <p className="text-gray-900 font-medium">
                People's Manager: {Managers?.length}
              </p>
            </div>
          </div>
        </div>
        <br />

        {/* <div>
          <div className="flex justify-between">
            <p className="text-gray-700">Self-assessments completed:</p>
            <p className="text-gray-900 font-bold">
              {selfAssessmentsCompleted} / {employee?.totalEmployees || 0}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Supervisor assessments completed:</p>
            <p className="text-gray-900 font-bold">
              {supervisorAssessmentsCompleted} / {employee?.totalEmployees || 0}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Assessable skills:</p>
            <p className="text-gray-900 font-bold">{totalSkills}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Skill Level</p>
            <p className="text-gray-900 font-bold">
              {averageSkillLevel.toFixed(2)}
            </p>
          </div>
        </div> */}

        {/* Section 2.0 */}
        <div className="w-full bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
          
          </h3>
          <FourMatrix />
        </div>

        <div className="w-full bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
           
          </h3>
          <CircularSkill/>
        </div>




        {/* Section 2.1 */}
        {/* <div className="w-full bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Top Rated Categories
          </h3>
          <SkillGraph skillsData={topSkills} />
        </div> */}

        {/* Section 3 */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Most Skilled
            </h2>
            <ul>
              {mostSkilled.map((item) => (
                <li key={item.name} className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.score}
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Most Interested
            </h2>
            <ul>
              {mostInterested.map((item) => (
                <li key={item.name} className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.score}
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800">Top Skills</h2>
            <ul>
              {topSkills.map((item) => (
                <li key={item.name} className="flex items-center gap-4 mb-4">
                  <span className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.score}
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </BoxComponent>
    </div>
  );
};

export default OrganizationalInsights;

