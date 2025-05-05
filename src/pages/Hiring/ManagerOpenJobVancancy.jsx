import {
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import Card from "../peformance/components/Card";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import BasicButton from "../../components/BasicButton";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../hooks/UserData/useUser";
import { UseContext } from "../../State/UseState/UseContext";
import {
  EditOutlined as EditOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { MoreVert } from "@mui/icons-material";
import { format } from "date-fns";
import { TestContext } from "../../State/Function/Main";

const ManagerOpenJobVacancy = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const navigate = useNavigate();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const hrId = user?._id;
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [vacancyData, setVacancyData] = useState();
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  // Fetch job vacancies for a specific HR assigned to a manager and also all data show to SA and DSA
  const { data, isLoading } = useQuery(
    ["JobVacancyByHRHiring", organisationId, hrId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/hr/${hrId}/vacancies/hiring`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("data in hiring", data);
  const handleCreateJob = (vacancyId) => {
    if (vacancyId) {
      navigate(
        `/organisation/${organisationId}/create-job-position/hiring/${vacancyId}`
      );
    } else {
      navigate(`/organisation/${organisationId}/create-job-position/hiring`);
    }
  };

  const handleCreateDashboard = () => {
    navigate(`/organisation/${organisationId}/create-job-dashboard/hiring`);
  };

  const confirmDeleteVacancy = (vacancyId) => {
    setSelectedVacancy(vacancyId);
    setOpenDelete(true);
  };

  const handleClick = (event, vacancyData, vacancyId) => {
    setOpen(vacancyId);
    setVacancyData(vacancyData);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(null);
  };

  const [openlinkModal, setOpenLinkModal] = useState(false);

  const handleViewLink = () => {
    setOpenLinkModal(true);
  };

  const { data: dataDashboard } = useQuery(["differentdata"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-dashboard/hiring`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data?.data;
  });
  console.log("dataDashboard", dataDashboard);

  // const handleDelete = async () => {
  //   try {
  //     await axios.delete(
  //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${selectedVacancy}/hiring`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );

  //     setOpenDelete(false);
  //     setSelectedVacancy(null);

  //     handleAlert(
  //       true,
  //       "success",
  //       vacancyData?.createdBy?._id === hrId ||
  //         vacancyData?.updatedBy?._id === hrId
  //         ? "Job position deleted successfully."
  //         : "Job vacancy deleted successfully."
  //     );
  //     queryClient.invalidateQueries("JobVacancyByHRHiring");
  //   } catch (err) {
  //     handleAlert(
  //       true,
  //       "error",
  //       vacancyData?.createdBy?._id === hrId ||
  //         vacancyData?.updatedBy?._id === hrId
  //         ? "Failed to delete job position."
  //         : "Failed to delete job vacancy."
  //     );
  //   }
  // };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${selectedVacancy}/hiring`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Immediately update cache
      queryClient.setQueryData(
        ["JobVacancyByHRHiring", organisationId, hrId],
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter((vacancy) => vacancy._id !== selectedVacancy);
        }
      );

      setOpenDelete(false);
      setSelectedVacancy(null);

      handleAlert(
        true,
        "success",
        vacancyData?.createdBy?._id === hrId ||
          vacancyData?.updatedBy?._id === hrId
          ? "Job position deleted successfully."
          : "Job vacancy deleted successfully."
      );
    } catch (err) {
      handleAlert(
        true,
        "error",
        vacancyData?.createdBy?._id === hrId ||
          vacancyData?.updatedBy?._id === hrId
          ? "Failed to delete job position."
          : "Failed to delete job vacancy."
      );
    }
  };

  const handleOpenLink = () => {
    if (dataDashboard?.dashboardLink) {
      navigate(`/organisation/${organisationId}/profile`);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/organisation/${organisationId}/profile`;
    navigator.clipboard.writeText(link);
    handleAlert(true, "success", "Link copied to clipboard!");
  };

  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [org, setOrg] = useState();
  const orgId = useParams().organisationId;

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      setOrg(resp.data.organizations);
    })();
  }, [orgId]);

  const remainingPositions = org?.hiringPosition || 0;
  const canCreateJob = remainingPositions > 0;
  const TotalPrice = org?.hiringPosition + org?.usedHiringPosition;
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
            heading="Job Position List"
            info="Here you can create and edit job position."
          />
          {role === "Manager" ||
          role === "Super-Admin" ||
          role === "Delegate-Super-Admin" ||
          role === "HR" ? (
            <div className="flex gap-8">
              <Card
                title={"Remainig Job Position"}
                data={org?.hiringPosition}
              />
              <Card
                title={"Created Job Position"}
                data={org?.usedHiringPosition}
              />
              <Card title={"Total Job Position"} data={TotalPrice || 0} />
            </div>
          ) : null}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}
        >
          {dataDashboard?.dashboardLink ? (
            <BasicButton title="View Link" onClick={() => handleViewLink()} />
          ) : null}
          <BasicButton
            title="Create Dashboard"
            onClick={() => handleCreateDashboard()}
          />
          <Tooltip
            title={
              !canCreateJob
                ? "No remaining job positions. Please add job position first."
                : ""
            }
          >
            <span>
              <BasicButton
                title="Create Job Position"
                onClick={() => handleCreateJob()}
                disabled={!canCreateJob}
              />
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      <div className="overflow-auto  bg-white  mt-2">
        {isLoading ? (
          <div
            className="h-[70vh] flex flex-col items-center justify-center"
            style={{ textAlign: "center", padding: "20px" }}
          >
            <CircularProgress />
            <p>Loading...</p>
          </div>
        ) : data && data.length > 0 ? (
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-semibold">
                <th scope="col" className="!text-left pl-8 py-3">
                  Sr. No
                </th>
                <th className="pl-8 py-3">Job Title</th>
                <th className="pl-8 py-3">Job Role</th>
                <th
                  scope="col"
                  className="whitespace-nowrap !text-left pl-8 py-3"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap !text-left pl-8 py-3"
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap !text-left pl-8 py-3"
                >
                  Posted On
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap !text-left pl-8 py-3"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((vacancy, index) => (
                <tr key={vacancy._id} className="border-b hover:bg-gray-100">
                  <td className="pl-8 py-3">{index + 1}</td>
                  <td className="pl-8 py-3">{vacancy?.jobTitle}</td>
                  <td className="pl-8 py-3">{vacancy?.jobRole}</td>
                  <td className="pl-8 py-3">
                    {vacancy.department?.departmentName || "N/A"}
                  </td>
                  <td className="pl-8 py-3">
                    <div className="flex gap-2 items-center ">
                      <Avatar
                        sx={{ height: 30, width: 30 }}
                        src={vacancy?.createdBy?.user_logo_url}
                      />
                      {vacancy.createdBy?.first_name || ""}{" "}
                      {vacancy.createdBy?.last_name || ""}
                    </div>
                  </td>
                  <td className="pl-8 py-3">
                    {vacancy?.jobPostedDate
                      ? format(new Date(vacancy?.jobPostedDate), "PP")
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap pl-8">
                    <div className="flex col-span-2 p-2">
                      <MoreVert
                        onClick={(e) => handleClick(e, vacancy, vacancy?._id)}
                        className="mt-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    handleCreateJob(vacancyData?._id);
                    handleClose();
                  }}
                >
                  {vacancyData?.createdBy?._id === hrId ||
                  vacancyData?.updatedBy?._id === hrId ? (
                    <>
                      <EditOutlinedIcon
                        color="primary"
                        aria-label="edit"
                        style={{ marginRight: "8px" }}
                      />
                      Edit Job Position
                    </>
                  ) : (
                    <>
                      <AddCircleOutlineIcon
                        color="primary"
                        aria-label="create"
                        style={{ marginRight: "8px" }}
                      />
                      Create Job Position
                    </>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    confirmDeleteVacancy(vacancyData?._id);
                    handleClose();
                  }}
                >
                  <DeleteOutlineIcon
                    color="error"
                    aria-label="delete"
                    style={{ marginRight: "8px" }}
                  />
                  {vacancyData?.createdBy?._id === hrId ||
                  vacancyData?.updatedBy?._id === hrId
                    ? "Delete Job Position"
                    : "Delete Job Vacancy"}
                </MenuItem>
              </Menu>
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "20px" }}>Job position not found.</div>
        )}
      </div>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job
          {vacancyData?.createdBy?._id === hrId ||
          vacancyData?.updatedBy?._id === hrId
            ? " position?"
            : " vacancy?"}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openlinkModal} onClose={() => setOpenLinkModal(false)}>
        <DialogTitle>Link</DialogTitle>
        <DialogContent>
          <p>{dataDashboard?.dashboardLink}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleOpenLink}
            variant="contained"
            size="small"
            color="primary"
          >
            Open Link
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            size="small"
            color="secondary"
          >
            Copy Link
          </Button>
          <Button
            onClick={() => setOpenLinkModal(false)}
            variant="outlined"
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManagerOpenJobVacancy;
