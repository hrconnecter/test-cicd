import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import { Avatar, Button, CircularProgress, Grid } from "@mui/material";
import { IoBagSharp } from "react-icons/io5";
import { IoLocation } from "react-icons/io5";

const OpenJobPosition = ({ external }) => {
  console.log("external", external);
  // const { open } = useDrawer();
  const { organisationId } = useParams();
  const navigate = useNavigate();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  const { data: openJob, isLoading } = useQuery(
    ["openJobPositionHiring", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open-hiring`
      );
      return response?.data?.data;
    },
    {
      onSuccess: (data) => console.log("Fetched Job Openings:", data),
      onError: (err) => console.error("Error fetching job openings:", err),
    }
  );
  console.log("openJob", openJob);

  const handleDetails = (vacancyId) => {
    navigate(
      `/organisation/${organisationId}/view-job-details-hiring/${vacancyId}`
    );
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return `${formatDistanceToNow(parseISO(dateString))} ago`;
    } catch (error) {
      console.error("Error formatting posted date:", error);
      return "Invalid Date";
    }
  };

  return (
    <BoxComponent sx={{ p: 2 }}>
      {external ? null : (
        <HeadingOneLineInfo
          heading="Open Job Positions"
          info="Explore the list of open job positions below"
        />
      )}

      {isLoading && (
        <div
          className="h-[70vh] flex flex-col items-center justify-center"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <CircularProgress />
          <p>Loading...</p>
        </div>
      )}

      <Grid container spacing={2} sx={{ height: "auto" }}>
        {Array.isArray(openJob) && openJob.length > 0
          ? openJob.map((vacancy) => (
              <Grid
                item
                // lg={open ? 3 : 2.4}
                // sm={open ? 6 : 6}
                // md={open ? 6 : 4}
                lg={2.4}
                key={vacancy._id}
                sx={{ height: "100%" }}
              >
                <div
                  className="p-2 bg-white flex flex-col justify-between"
                  style={{
                    border: "1px solid #D2D2D2",
                    borderRadius: "15px",
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#ECEFF4",
                      padding: "10px 10px ",
                      borderRadius: "7px",
                      flex: "1",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "white",
                        padding: "5px",
                        borderRadius: "50px",
                        alignSelf: "start",
                      }}
                    >
                      {formatPostedDate(vacancy?.jobPostedDate)}
                    </span>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <h4>{vacancy?.organizationId?.orgName}</h4>
                        <span
                          style={{
                            marginTop: 0,
                            fontSize: "24px",
                            color: "#333",
                            lineHeight: "30px",
                          }}
                        >
                          {vacancy.jobTitle || "Position Not Specified"}
                        </span>
                      </div>
                      {vacancy?.organizationId?.logo_url ? (
                        <img
                          src={vacancy?.organizationId?.logo_url}
                          alt="Logo"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Avatar />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex">
                        <IoBagSharp className="mt-1 mr-1" />
                        {vacancy.experienceRequired}
                      </div>
                      {vacancy?.location ? (
                        <div className="flex">
                          <IoLocation className="mt-1 mr-1" />
                          {vacancy.location?.city}, {vacancy.location?.state},{" "}
                          {vacancy.location?.country}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={`mt-1 px-3 flex ${
                      external
                        ? "justify-end"
                        : role === "HR" ||
                          role === "Super-Admin" ||
                          role === "Delegate-Super-Admin"
                        ? "justify-between"
                        : "justify-end"
                    }`}
                  >
                    {external
                      ? null
                      : (role === "HR" ||
                          role === "Super-Admin" ||
                          role === "Delegate-Super-Admin") && (
                          <Link
                            to={`/organisation/${organisationId}/view-job-application-hiring/${vacancy._id}`}
                            className="font-semibold text-blue-500 hover:underline text-md"
                          >
                            View Applications
                          </Link>
                        )}
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                        borderRadius: "50px",
                        bgcolor: "#1414FE",
                        p: "2px",
                      }}
                      onClick={() => handleDetails(vacancy._id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Grid>
            ))
          : !isLoading && (
              <div style={{ padding: "20px" }}>Job position not found.</div>
            )}
      </Grid>
    </BoxComponent>
  );
};

export default OpenJobPosition;
