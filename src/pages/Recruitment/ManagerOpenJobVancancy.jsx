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
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
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
    ["JobVacancyByHR", organisationId, hrId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/hr/${hrId}/vacancies`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  const handleCreateJob = (vacancyId) => {
    console.log("vacancyId", vacancyId);
    if (vacancyId) {
      navigate(
        `/organisation/${organisationId}/create-job-position/${vacancyId}`
      );
    } else {
      navigate(`/organisation/${organisationId}/create-job-position`);
    }
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${selectedVacancy}`,
        {
          headers: {
            Authorization: authToken,
          },
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
      queryClient.invalidateQueries("JobVacancyByHR");
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
            heading="Job Vacancy List"
            info="Here you can create and edit job position."
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <BasicButton
            title="Create Job Position"
            onClick={() => handleCreateJob()}
          />
        </Grid>
      </Grid>
      <div className="overflow-auto  bg-white  mt-2">
        {isLoading && (
          <div
            className="h-[70vh] flex flex-col items-center justify-center"
            style={{ textAlign: "center", padding: "20px" }}
          >
            <CircularProgress />
            <p>Loading...</p>
          </div>
        )}
        {!isLoading && data && data.length > 0 ? (
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
                  </td>{" "}
                  <td className="pl-8 py-3">
                    <div className="flex gap-2 items-center ">
                      <Avatar
                        sx={{
                          height: 30,
                          width: 30,
                        }}
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
                        onClick={(e) => handleClick(e, vacancy, vacancy?._id)} // Pass vacancy ID to handleClick
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
    </div>
  );
};

export default ManagerOpenJobVacancy;
