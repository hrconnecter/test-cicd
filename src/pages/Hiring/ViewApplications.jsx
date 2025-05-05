import React from "react";
import axios from "axios";
import { useQuery } from "react-query"; // Import useQuery from react-query
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { Link, useParams } from "react-router-dom";
import { Avatar, CircularProgress, Grid } from "@mui/material"; // For loading state
import useGetUser from "../../hooks/Token/useUser";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { useDrawer } from "../../components/app-layout/components/Drawer";
import { useMutation, useQueryClient } from "react-query";
const ViewApplications = () => {
  const { organisationId, jobId } = useParams();
  const { open } = useDrawer();
  const { authToken } = useGetUser(); // Retrieve the auth token

  const { data: applications, isLoading } = useQuery(
    ["jobApplications", organisationId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-applications/${jobId}`,
        {
          headers: {
            Authorization: authToken, // Correct header format
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: Boolean(authToken),
      onSuccess: (data) => console.log("Fetched Job Openings:", data),
      onError: (err) => console.error("Error fetching job openings:", err),
    }
  );
  // Fetch job applications using useQuery

  console.log("applications", applications);

  const queryClient = useQueryClient();

  const selectApplicantMutation = useMutation(
    async (applicationId) => {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/applications/${applicationId}/final-selection`,

        {}, // empty body
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        alert("Applicant selected successfully!");
        queryClient.invalidateQueries([
          "jobApplications",
          organisationId,
          authToken,
        ]); // refetch job applications
      },
      onError: (error) => {
        console.error("Error selecting applicant:", error);
        alert("Failed to select applicant.");
      },
    }
  );

  // Button click handler
  const handleSelectApplicant = (applicationId) => {
    selectApplicantMutation.mutate(applicationId);
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading="Job Application"
        info="Here you can see job applications"
      />

      {/* Loading state */}
      {isLoading && (
        <div
          className="h-[70vh] flex flex-col items-center justify-center"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <CircularProgress />
          <p>Loading...</p>
        </div>
      )}

      {/* Error state */}

      {/* Render the applications */}

      <Grid container spacing={2} sx={{ height: "auto" }}>
        {Array.isArray(applications) && applications.length > 0
          ? applications?.map((application) => (
              <Grid
                item
                lg={open ? 3 : 2.5}
                sm={open ? 6 : 6}
                md={open ? 6 : 4}
                key={application?._id}
                sx={{ height: "100%" }}
              >
                <div
                  className="p-2 bg-white flex flex-col justify-between"
                  style={{
                    border: "1px solid #D2D2D2",
                    borderRadius: "15px",
                    minHeight: "250px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="flex justify-center items-center flex-col"
                    style={{
                      width: "100%",
                      height: "100%",
                      textAlign: "center", // Optional for aligning text inside
                    }}
                  >
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
                      <Avatar
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <h3
                      style={{
                        marginTop: "2px",
                        fontSize: "1.25rem",
                        color: "#333",
                      }}
                    >
                      {application?.applicantId?.first_name}{" "}
                      {application?.applicantId?.last_name}
                    </h3>
                    <h3 style={{ marginTop: "2px", color: "#333" }}>
                      {application?.jobId?.jobTitle}
                    </h3>
                  </div>

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
                    <div className="flex">
                      <MdEmail className="m-1" />
                      <p>{application.email}</p>
                    </div>
                    <div className="flex ">
                      <PiPhoneCallFill className="m-1" />
                      <p> {application.phone}</p>
                    </div>
                  </div>
                  <div
                    className="flex flex-col justify-center items-center gap-2 mt-2"
                    style={{ width: "100%" }}
                  >
                    <Link
                      to={`/organisation/${organisationId}/view-job-detail-application-hiring/${application?._id}`}
                      className="font-semibold text-blue-500 hover:underline text-md"
                    >
                      View Details
                    </Link>

                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                      onClick={() => handleSelectApplicant(application?._id)}
                      disabled={selectApplicantMutation.isLoading}
                    >
                      {selectApplicantMutation.isLoading
                        ? "Selecting..."
                        : "Select"}
                    </button>
                  </div>
                </div>
              </Grid>
            ))
          : !isLoading && <p>There are no Job apllications.</p>}
      </Grid>
    </BoxComponent>
  );
};

export default ViewApplications;
