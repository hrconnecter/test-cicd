import React, { useContext, useEffect, useState } from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import BasicButton from "../../components/BasicButton";
import { formatDistanceToNow, parseISO } from "date-fns";
import JobAppliedAppoveRequestToMR from "./components/JobAppliedAppoveRequestToMR";
import { IoBagSharp } from "react-icons/io5";
import { IoLocation } from "react-icons/io5";
import DOMPurify from "dompurify";
import CreateJobRegistration from "./DashboardApply/CreateJobRegistration";
import { UseContext } from "../../State/UseState/UseContext";

const EmpViewJobDetails = () => {
  const { vacancyId, organisationId } = useParams();
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [open, setOpen] = useState();
  const [openRegistration, setOpenRegistration] = useState();

  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem("hiring_token");

    if (authToken || localToken) {
      setIsAuthenticated(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowModal(true);
      setOpenRegistration(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [authToken]);

  // Fetch specific job opening
  const { data, isLoading, isError, error } = useQuery(
    ["jobOpeninghiring", vacancyId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open-hiring/${vacancyId}`
      );
      return response.data.data;
    },
    {
      enabled: !!vacancyId, // Ensure the query only runs if vacancyId is available
    }
  );
  console.log("data for perticular job", data);

  const { data: openJob } = useQuery(
    ["openJobPositionhiring", organisationId],
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
  console.log("openJob in hiring", openJob);
  if (isLoading) {
    return (
      <div
        className="h-[90vh] flex flex-col items-center justify-center"
        style={{ textAlign: "center", padding: "20px" }}
      >
        <CircularProgress />
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <BoxComponent>
        <Typography color="error">
          Error fetching job details:{" "}
          {error?.response?.data?.message || error.message}
        </Typography>
      </BoxComponent>
    );
  }

  const jobDetails = data;
  console.log("jobDetails", jobDetails);

  const formatPostedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return `${formatDistanceToNow(parseISO(dateString))} ago`; // Example: "Posted 2 days ago"
    } catch (error) {
      console.error("Error formatting posted date:", error);
      return "Invalid Date";
    }
  };

  const handleAttachment = () => {
    window.open(data?.additionalDocument, "_blank");
  };

  const handleDetails = (vacancyId) => {
    navigate(
      `/organisation/${organisationId}/view-job-details-hiring/${vacancyId}`
    );
  };

  const handleApply = () => {
    navigate(`/organisation/${organisationId}/apply-job-hiring/${vacancyId}`);
  };

  return (
    <div className="container">
      <HeadingOneLineInfo
        heading="Job Details"
        info="Here employee view and apply for job"
      />
      <Grid container spacing={2} lg={12}>
        <Grid item lg={9}>
          <Grid
            item
            lg={12}
            className="p-2 bg-white overflow-auto h-screen"
            sx={{
              border: "1px solid #D2D2D2",
              borderRadius: "15px",
            }}
            style={{
              overflow: "auto",
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For IE and Edge
            }}
          >
            <div
              style={{
                backgroundColor: "#ECEFF4",
                padding: "20px",
                borderRadius: "15px",
                flex: "1", // Allows the container to stretch
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
              }}
            >
              <span
                style={{
                  backgroundColor: "white",
                  padding: "5px 10px",
                  borderRadius: "50px",
                  alignSelf: "start",
                }}
              >
                {formatPostedDate(jobDetails?.jobPostedDate)}
              </span>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <h4>{jobDetails?.organizationId?.orgName}</h4>
                  <span
                    style={{
                      marginTop: 0,
                      fontSize: "30px",
                      color: "#333",
                      lineHeight: "30px",
                    }}
                  >
                    {jobDetails?.jobTitle || "Position Not Specified"}
                  </span>
                </div>
                {jobDetails?.organizationId?.logo_url ? (
                  <img
                    src={jobDetails?.organizationId?.logo_url}
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

              {/* Add `marginTop: "auto"` to push this div to the bottom */}

              <div className="mt-3">
                <div className="flex">
                  <IoBagSharp className="mt-1 mr-1" />
                  {jobDetails.experienceRequired}
                </div>
                {jobDetails?.location ? (
                  <div className="flex">
                    <IoLocation className="mt-1 mr-1" />
                    {jobDetails.location?.city}, {jobDetails.location?.state},{" "}
                    {jobDetails.location?.country}
                  </div>
                ) : null}
              </div>

              <div className="flex space-x-1 justify-end ">
                <BasicButton
                  title="Apply"
                  disabled={!isAuthenticated}
                  onClick={handleApply}
                />
              </div>
            </div>
            <Box sx={{ bgcolor: "White", p: 2, mt: 3 }}>
              <Typography>
                <strong>Role:</strong> {jobDetails?.jobRole || "N/A"}
              </Typography>
              <Typography>
                <strong>Industry Type:</strong>{" "}
                {jobDetails?.organizationId?.industry_type || "N/A"}
              </Typography>
              <Typography>
                <strong>Department:</strong>{" "}
                {jobDetails?.department?.departmentName || "N/A"}
              </Typography>
              <Typography>
                <strong>Industry:</strong> {jobDetails?.JobIndustry || "N/A"}
              </Typography>
              <Typography>
                <strong>Employment Type:</strong> {jobDetails?.jobType || "N/A"}
              </Typography>
              <Typography>
                <strong>Mode of Working:</strong>{" "}
                {jobDetails?.modeOfWorking || "N/A"}
              </Typography>
              <Typography>
                <strong>Job Type:</strong> {jobDetails?.jobType || "N/A"}
              </Typography>
              <Typography>
                <strong>Working Shift:</strong>{" "}
                {jobDetails?.workingShift || "N/A"}
              </Typography>
              <Typography>
                <strong>Education:</strong> {jobDetails?.education || "N/A"}
              </Typography>
              <Typography>
                <strong>Key Skills:</strong>{" "}
                {jobDetails?.requiredSkill
                  ?.map((skill) => skill.label)
                  .join(", ") || "N/A"}
              </Typography>
              <Typography>
                <strong>Document:</strong>{" "}
                <Link
                  onClick={handleAttachment}
                  className="font-semibold text-blue-500 hover:underline text-md"
                >
                  View Document
                </Link>
                {/* <BasicButton variant='outlined' title={"View Attachment"} onClick={handleAttachment} /> */}
              </Typography>
              <br />
              <Typography>
                <strong>Description:</strong>{" "}
                {jobDetails?.jobDescription || "N/A"}
              </Typography>
              <br />
              <div>
                <strong>Terms And Condition:</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      jobDetails?.termsAndCondition ||
                        "No terms and conditions available."
                    ),
                  }}
                ></div>
              </div>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          lg={3}
          className="overflow-auto h-screen"
          style={{
            overflow: "auto",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE and Edge
          }}
        >
          <Grid
            style={{
              overflow: "auto",
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For IE and Edge
            }}
            sx={{ width: "100%", height: "auto" }}
          >
            {Array.isArray(openJob) && openJob.length > 0
              ? openJob.map((vacancy) => (
                  <Grid item key={vacancy._id}>
                    <div
                      className="p-2 bg-white flex flex-col justify-between"
                      style={{
                        border: "1px solid #D2D2D2",
                        borderRadius: "15px",
                        minHeight: "300px",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#ECEFF4",
                          padding: "10px 10px ",
                          borderRadius: "15px",
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
                              {vacancy.location?.city},{" "}
                              {vacancy.location?.state},{" "}
                              {vacancy.location?.country}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className={` my-2 px-3 flex  justify-end mt-3`}>
                        <Button
                          className=" font-bold rounded-md "
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
                  <div
                    className="h-[70vh] flex flex-col items-center justify-center"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <CircularProgress />
                    <p>Loading...</p>
                  </div>
                )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} className="p-0">
        <JobAppliedAppoveRequestToMR
          jobId={vacancyId}
          organisationId={organisationId}
        />
      </Dialog>
      {showModal && (
        <Dialog
          open={openRegistration}
          onClose={() => setOpenRegistration(false)}
        >
          <CreateJobRegistration
            setShowModal={setShowModal}
            setIsAuthenticated={setIsAuthenticated}
          />
        </Dialog>
      )}
    </div>
  );
};

export default EmpViewJobDetails;
