import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Grid, Link, Avatar, Button } from "@mui/material";
import axios from "axios";
import useGetUser from "../../hooks/Token/useUser";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../hooks/UserData/useUser";
import BasicButton from "../../components/BasicButton";
import { TestContext } from "../../State/Function/Main";

const ViewJobApplicationDetails = () => {
  const { organisationId, jobId, applicationId } = useParams();
  const queryClient = useQueryClient();
  const { authToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const [feedback, setFeedback] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  console.log(feedback);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const { data: application } = useQuery(
    ["jobApplicationDetails", organisationId, jobId, applicationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data;
    },
    { enabled: !!authToken }
  );
  console.log("application", application);

  // Mutation to update status via PATCH API
  const mutation = useMutation(
    async (status) => {
      console.log("status", status);
      await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicationId}/statusbyhr`,
        { statusByHR: status },
        { headers: { Authorization: authToken } }
      );
      return status; // Return status so it can be accessed in onSuccess
    },
    {
      onSuccess: (statusByHR) => {
        handleAlert(
          true,
          "success",
          statusByHR === "Rejected"
            ? "Application rejected successfully!"
            : "Application shortlisted successfully!"
        );
        navigate(
          `/organisation/${organisationId}/view-job-application/${jobId}`
        );
        setFeedback({
          open: true,
          message: "Status updated successfully",
          severity: "success",
        });

        queryClient.invalidateQueries([
          "jobApplicationDetails",
          organisationId,
          jobId,
          applicationId,
        ]);
      },
      onError: () =>
        setFeedback({
          open: true,
          message: "Failed to update status",
          severity: "error",
        }),
    }
  );

  const handleAction = (status, applicantId) => {
    console.log("status by manager", status);

    if (status === "Cancel") {
      navigate(`/organisation/${organisationId}/open-job-position`);
      return;
    }
    if (status === "ScheduledInterview") {
      navigate(
        `/organisation/${organisationId}/interview-Shedule-hiring/${jobId}/${applicantId}`
      );
      return;
    }
    mutation.mutate(status);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short", // Short month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
    });
  };

  const mutationMR = useMutation(
    async ({ status, applicationId }) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicationId}/statusbymr`,
        { statusByManager: status },
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["shortlistedApplications"]),
    }
  );

  const handleActionMR = (status, applicationId) => {
    mutationMR.mutate({ status, applicationId });
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading="Applicant Details"
        info="Here you can see job applicant details"
      />
      <Grid container spacing={2} xs={12} md={12}>
        {/* Left Section */}
        <Grid container item xs={12} md={12}>
          <Grid item xs={12} md={12} sx={{ bgcolor: "white", padding: "10px" }}>
            <div className="flex justify-between items-center">
              {/* Left Section */}
              <div className="flex items-center">
                {application?.applicantId?.user_logo_url ? (
                  <img
                    src={application?.applicantId?.user_logo_url}
                    alt="Profile"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Avatar style={{ width: "80px", height: "80px" }} />
                )}
                <div className="px-4">
                  <h3
                    style={{
                      fontWeight: "500",
                      marginTop: "2px",
                      fontSize: "30px",
                      color: "#333",
                    }}
                  >
                    {application?.applicantId?.first_name}{" "}
                    {application?.applicantId?.last_name}
                  </h3>
                  <span style={{ color: "#333" }}>
                    {application?.jobId?.jobTitle}
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>
                    {application?.applicantId?.email}
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>{application?.phone}</span>
                </div>
              </div>

              {/* Right Section */}
              {role === "HR" ? (
                <div className="flex gap-2">
                  {/* Shortlist Button */}
                  {application?.statusByManager !== "Shortlisted" && (
                    <>
                      <Button
                        sx={{
                          borderRadius: "50px",
                          textTransform: "none",
                        }}
                        variant="contained"
                        color="success"
                        onClick={() => handleAction("Shortlisted")}
                        disabled={application?.statusByHR === "Shortlisted"}
                      >
                        Shortlist
                      </Button>
                      <Button
                        sx={{
                          borderRadius: "50px",
                          textTransform: "none",
                        }}
                        variant="contained"
                        color="error"
                        onClick={() => handleAction("Rejected")}
                        disabled={application?.applicationStatus === "Rejected"}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {/* Scheduled Interview Button */}
                  {application?.statusByHR === "Shortlisted" &&
                    application?.statusByManager === "Shortlisted" && (
                      <Button
                        sx={{
                          borderRadius: "50px",
                          textTransform: "none",
                        }}
                        variant="contained"
                        onClick={() =>
                          handleAction("ScheduledInterview", application?._id)
                        }
                      >
                        Schedule Interview
                      </Button>
                    )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <BasicButton
                    title="Shortlist"
                    onClick={() =>
                      handleActionMR("Shortlisted", application?._id)
                    }
                    disabled={application?.statusByManager === "Shortlisted"}
                  />
                  <BasicButton
                    title="Reject"
                    color="danger"
                    onClick={() => handleActionMR("Rejected", application?._id)}
                    disabled={application?.statusByManager === "Rejected"}
                  />
                </div>
              )}
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{ bgcolor: "white", padding: "10px", my: "20px" }}
          >
            <h3
              className="font-bold"
              style={{
                marginTop: "2px",
                fontSize: "20px",
                color: "#333",
              }}
            >
              Candidate Details
            </h3>
            <Typography variant="body1">
              <strong>Applied Date:</strong>{" "}
              {application?.createdAt ? formatDate(application.createdAt) : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Job Title:</strong> {application?.jobId?.jobTitle}
            </Typography>
            <Typography variant="body1">
              <strong>Job Role:</strong> {application?.jobId?.jobRole}
            </Typography>
            <Typography variant="body1">
              <strong>Education:</strong> {application?.education}
            </Typography>
            <Typography variant="body1">
              <strong>Experience:</strong> {application?.experience} years
            </Typography>
            <Typography variant="body1">
              <strong>Skills:</strong>{" "}
              {application?.skills.length > 0
                ? application.skills.map((skill, index) => (
                    <span key={index}>
                      {skill.label}{" "}
                      {index < application.skills.length - 1 && ", "}
                    </span>
                  ))
                : "No skills listed"}
            </Typography>
            <Typography variant="body1">
              <strong>Cover Letter:</strong> {application?.coverLetter}
            </Typography>
            <Typography variant="body1">
              <strong>Certifications:</strong>{" "}
              {application?.certifications.length > 0
                ? application?.certifications.join(", ")
                : "None"}
            </Typography>
            <Typography variant="body1">
              <strong>Resume:</strong>{" "}
              <Link href={application?.resume} target="_blank" rel="noopener">
                View Resume
              </Link>
            </Typography>
          </Grid>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={5} sx={{}}>
          <div
            className="h-[400px]"
            style={{ backgroundColor: "white", padding: "10px" }}
          >
            <h3
              className="font-bold"
              style={{
                fontSize: "20px",
                color: "#333",
              }}
            >
              Applicant Questions Response
            </h3>
          </div>
          {/* Add additional content here */}
        </Grid>
      </Grid>
    </BoxComponent>
  );
};

export default ViewJobApplicationDetails;
