//😎
import axios from "axios";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useState } from "react";
import { useQuery } from "react-query";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
import HRgraph from "./Components/Bar/HRgraph";
import LineGraph from "./Components/Bar/LineGraph";
import { Avatar, Box, Grid, Skeleton, Typography } from "@mui/material";
import useHook from "../../hooks/UserProfile/useHook";
import EmployeeLeaveDonut from "./Components/Pie/EmployeeLeavePie";
import { format } from "date-fns";
import HiearchyCard from "./Components/HiearchyCard";
import PublicHolidayDisplayList from "./Components/List/PublicHolidayDisplayList";
import QuickTabs from "./Components/QuickTabs";
import BirthdaySection from "./BirthdayEffect";
import AnniversarySection from "./AnniversaryEffect";
// import VoiceAssistant from "./voiceassistant";

Chart.register(CategoryScale);

const Dashboard = () => {
  // const [isImageLoaded, setIsImageLoaded] = useState(false);
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  // const role = useGetCurrentRole();
  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });
  const user = getCurrentUser();
  console.log("user", user);

  const { UserInformation } = useHook();
  console.log("UserInformation", UserInformation);
  const getSalaryTemplate = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${user._id}/${user.organizationId}/${selectedyear.value}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: EmployeSalaryData } = useQuery(
    ["salary-template-employee", selectedyear],
    getSalaryTemplate
  );

  //upcoming birthdat
  const { data: employeelist, isLoading, isError, error } = useQuery(
    ["employeeList", user.organizationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/${user.organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!user.organizationId && !!authToken,

    }
  );

  console.log("employeebirth", employeelist, isLoading, isError, error)


  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Dashboard"}
          info={
            "Get insights of employee's data with interactive charts and reports"
          }
        />
        <Grid container spacing={2}>
          {/* Information Section - Left Panel */}
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <h1 className="text-[20px] font-semibold text-[#67748E] mb-4">
                Information
              </h1>
              <div className="border-[0.5px] border-[#E5E7EB] bg-white py-4 rounded-lg shadow-md">
                <div>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      padding="0px 10px"
                    >
                      <Avatar
                        sx={{
                          height: 144,
                          width: 144,
                        }}
                        src={UserInformation?.user_logo_url}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center" }}>
                      {!UserInformation ? (
                        // Show skeletons while data is not loaded
                        <>
                          <Skeleton
                            variant="text"
                            width="60%"
                            height={40}
                            sx={{ mx: "auto" }}
                          />
                          <Skeleton
                            variant="text"
                            width="50%"
                            height={30}
                            sx={{ mx: "auto" }}
                          />
                          <Skeleton
                            variant="rectangular"
                            width="80%"
                            height={20}
                            sx={{ mx: "auto", my: 1 }}
                          />
                          <Skeleton
                            variant="rectangular"
                            width="80%"
                            height={20}
                            sx={{ mx: "auto", my: 1 }}
                          />
                        </>
                      ) : (
                        <>
                          <Box className="border-b-[0.5px] border-[#E5E7EB] py-2">
                            <Typography variant="h6" sx={{ fontSize: "22px" }}>
                              {UserInformation.first_name}{" "}
                              {UserInformation.last_name}
                            </Typography>
                            <Typography
                              variant="h6"
                              color="textSecondary"
                              sx={{ fontSize: "18px" }}
                            >
                              {UserInformation?.designation?.[0]?.designationName}
                            </Typography>
                          </Box>
                          <Box className="border-b-[0.5px] border-[#E5E7EB] py-2">
                            <Typography>
                              Join:{" "}
                              {UserInformation?.joining_date ? format(
                                new Date(UserInformation?.joining_date),
                                "PP"
                              ) : "-"}
                            </Typography>
                          </Box>
                          <Box className="py-2">
                            <Typography>
                              Contact: {UserInformation.additional_phone_number}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>

          {/* Main Content Section - Right Panel */}
          <Grid
            item
            container
            xs={12}
            sm={8}
            md={9}
            lg={10}
            sx={{ overflow: "auto" }}
          >
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
              <Grid item xs={12} md={6}>
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // Transparent background
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                      borderRadius: "8px", // Optional: round the corners slightly
                    }}
                  />
                ) : (
                  <BirthdaySection birthdays={employeelist?.upcomingBirthdays} />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // Transparent background
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                      borderRadius: "8px", // Optional: round the corners slightly
                    }}
                  />
                ) : (
                  <AnniversarySection anniversaries={employeelist?.upcomingAnniversaries} />
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
              {/* y */}
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
              <Grid item xs={12} md={6}>
                <EmployeeLeaveDonut />
              </Grid>
              <Grid item xs={12} md={6}>
                <PublicHolidayDisplayList />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
              <Grid item xs={12} md={6}>
                <QuickTabs />
              </Grid>
              <Grid item xs={12} md={6}>
                <HiearchyCard />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LineGraph
                  salarydata={EmployeSalaryData?.employeeSalaryViaYear}
                  selectedyear={selectedyear}
                  setSelectedYear={setSelectedYear}
                  employee={EmployeSalaryData?.employeeInfo}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <HRgraph />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <VoiceAssistant style={{ 
          position: "fixed", 
          bottom: "20px", 
          right: "20px", 
        }} /> */}
      </BoxComponent>
    </>
  );
};

export default Dashboard;
