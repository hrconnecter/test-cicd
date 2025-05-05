import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { CircularProgress, Typography, Box, Grid, Avatar } from "@mui/material";
import { format } from "date-fns";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import useGetUser from "../../hooks/Token/useUser";

const ShortlistByHrList = () => {
  const { vacancyId, organisationId } = useParams();
  const { authToken } = useGetUser();
  const navigate = useNavigate();

  // Fetch shortlisted applications
  const { data, isLoading } = useQuery(
    ["shortlistedApplications", vacancyId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job/${vacancyId}/shortlisted-applications`,
        { headers: { Authorization: authToken } }
      );
      return response?.data?.data;
    },
    {
      enabled: !!authToken && !!vacancyId,
    }
  );
  console.log("data in shortlist", data);

  // Handle navigation to details page
  const handleViewDetails = (vacancy) => {
    if (vacancy?.jobId?._id && vacancy?._id) {
      navigate(
        `/organisation/${organisationId}/view-job-detail-application/${vacancy.jobId._id}/${vacancy?._id}`
      );
    } else {
      console.error("Missing jobId or applicantId for navigation.");
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      {/* Header Section */}
      <Grid
        container
        sm={12}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Grid item xs={12} sm={6}>
          <HeadingOneLineInfo
            heading="Applicant List"
            info="Here you can see applicant list."
          />
        </Grid>
      </Grid>
      <div>
        {data?.length > 0 ? (
          <div className="overflow-auto bg-white mt-2">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th className="!text-left pl-8 py-3">Sr. No</th>
                  <th className="pl-8 py-3">Applicant Name</th>
                  <th className="!text-left pl-8 py-3">Experience</th>
                  <th className="!text-left pl-8 py-3">Applied For</th>
                  <th className="!text-left pl-8 py-3">Applied On</th>
                  <th className="!text-left pl-8 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((vacancy, index) => (
                  <tr key={vacancy._id} className="border-b hover:bg-gray-100">
                    <td className="pl-8 py-3">{index + 1}</td>
                    <td className="pl-8 py-3">
                      <div className="flex gap-2 items-center">
                        <Avatar
                          sx={{ height: 30, width: 30 }}
                          src={vacancy?.applicantId?.user_logo_url}
                        />
                        {`${vacancy?.applicantId?.first_name} ${vacancy?.applicantId?.last_name}`}
                      </div>
                    </td>
                    <td className="pl-8 py-3">
                      {vacancy?.experience || "N/A"}
                    </td>
                    <td className="pl-8 py-3">
                      {vacancy?.jobId?.jobTitle || "N/A"}
                    </td>
                    <td className="pl-8 py-3">
                      {vacancy?.appliedDate
                        ? format(new Date(vacancy.appliedDate), "PP")
                        : "-"}
                    </td>
                    <td className="flex gap-2 pl-8 py-3">
                      {/* <Link href={vacancy?.resume} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                        </Link> */}
                      <BasicButton
                        title="Resume"
                        onClick={() =>
                          window.open(
                            vacancy?.resume,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      />
                      <BasicButton
                        onClick={() => handleViewDetails(vacancy)}
                        title={"View"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography variant="p">
            No shortlisted applications found.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ShortlistByHrList;
