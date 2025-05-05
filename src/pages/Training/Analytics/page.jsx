import { Search } from "@mui/icons-material";
import { Button, Tab, Tabs } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { RiAlarmWarningFill } from "react-icons/ri";
import { TbSchool } from "react-icons/tb";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../../hooks/Token/useAuth";
import TrainingDetailCard from "../SingleTraining/Components/Card";
import TrainingAnalyticsTable from "./components/TrainingAnalyticsTable";
import TrainingTable from "./components/TrainingTable";
import useGetStatusCard from "./hooks/useGetStatusCard";

const TrainingAnalytics = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTraining, setSearchTraining] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const { organizationId } = useParams("");
  const { data: trainingCard } = useGetStatusCard(organizationId);
  console.log(`🚀 ~ trainingCard:`, trainingCard);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // const { data: trainingData } = useGetAllTrainings(
  //   organizationId,
  //   page,
  //   search
  // );
  // console.log("trainingData", trainingData);
  // const { data } = useGetAllEmployeeTraining(organizationId, page, search);
  const authToken = useAuthToken();

  const getAllTrainingsForExport = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getTrainingDatawithoutPagination/${organizationId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  };

  // Function to export data as Excel
  const exportToExcel = async () => {
    try {
      const exportData = await getAllTrainingsForExport(); // Fetch all data
      if (!exportData?.data?.length) {
        alert("No data available to export.");
        return;
      }

      const formattedData = exportData.data.map((emp, index) => ({
        "Sr. No": index + 1,
        Employee: `${emp?.first_name} ${emp?.last_name}`,
        "Training Name": emp?.trainingName || "N/A",
        "Trainings Attended": emp?.totalTrainingsAttended || 0,
        Completed: emp?.completedCount || 0,
        Pending: emp?.pendingCount || 0,
        "Over Due": emp?.overDueCount || 0,
        "Total Points Earned": emp?.earnedPoints || 0,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Training Data");

      XLSX.writeFile(wb, "Training_Analytics.xlsx");
    } catch (error) {
      console.error("Error fetching training data:", error);
      alert("Failed to generate Excel file.");
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Training Analytics"}
        info={
          "This section provides an overview and detailed analysis of the training sessions."
        }
      />

      <div className="flex gap-4 flex-wrap">
        <TrainingDetailCard
          title={"Total Trainings"}
          icon={TbSchool}
          desc={trainingCard?.trainings}
          className={"bg-purple-100 text-purple-500"}
        />

        <TrainingDetailCard
          title={"Pending Trainings"}
          icon={RiAlarmWarningFill}
          desc={trainingCard?.upcomingCount}
          className={"bg-yellow-100 text-yellow-500"}
        />
        <TrainingDetailCard
          title={"Completed Training"}
          icon={TbSchool}
          desc={trainingCard?.totalCompleted}
          className={"bg-green-100 text-green-500"}
        />
        <TrainingDetailCard
          title={"Over Due's Training"}
          icon={RiAlarmWarningFill}
          desc={trainingCard?.totalOverdue}
          className={"bg-red-100 text-red-500"}
        />
      </div>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        style={{
          backgroundColor: "white",
          marginTop: "16px",
          padding: "0px 10px",
          width: "max-content",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tab label="Trainings" />
        <Tab label="Employees" />
      </Tabs>

      {tabIndex === 0 && (
        <div className="bg-white py-2 px-4 shadow-md rounded-md">
          <div className="flex justify-between w-full items-center py-4">
            <div
              className={`space-y-1 rounded-md shadow-sm min-w-[300px] md:min-w-[40vw] w-max`}
            >
              <div
                onFocus={() => setFocusedInput("trainingSearch")}
                onBlur={() => setFocusedInput(null)}
                className={`flex rounded-md items-center px-2 bg-white py-3 md:py-[6px]  ${
                  focusedInput === "trainingSearch"
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                }`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  onChange={(e) => setSearchTraining(e.target.value)}
                  placeholder={"Search Trainings"}
                  className={`border-none bg-white w-full outline-none px-2`}
                />
              </div>
            </div>
          </div>

          <TrainingTable
            organizationId={organizationId}
            search={searchTraining}
            page={page}
            setPage={setPage}
          />
        </div>
      )}

      {tabIndex === 1 && (
        <div className="bg-white py-2 px-4 shadow-md rounded-md">
          <div className="flex justify-between w-full items-center py-2">
            <div
              className={`space-y-1 rounded-md shadow-sm min-w-[300px] md:min-w-[40vw] w-max`}
            >
              <div
                onFocus={() => setFocusedInput("search")}
                onBlur={() => setFocusedInput(null)}
                className={`flex rounded-md items-center px-2 bg-white py-3 md:py-[6px]  ${
                  focusedInput === "search"
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                }`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={"Search Employees"}
                  className={`border-none bg-white w-full outline-none px-2`}
                />
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <Button
                variant="contained"
                color="success"
                onClick={exportToExcel}
              >
                Generate Excel
              </Button>
            </div>
          </div>

          <TrainingAnalyticsTable
            organizationId={organizationId}
            search={search}
            page={page}
            setPage={setPage}
          />
        </div>
      )}
    </BoxComponent>
  );
};

export default TrainingAnalytics;
