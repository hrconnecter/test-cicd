import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import BasicButton from "../../../../components/BasicButton";
import UserProfile from "../../../../hooks/UserData/useUser";
import useTrainingStore from "../../components/stepper/components/zustand-store";
import AssignTraining from "./assign-training";
import useTrainingDetailsMutation from "./mutation";

const TableRow = ({
  logo,
  name,
  duration,
  doc,
  isLoading,
  status = null,
  empStartDate = null,
  empEndDate = null,
}) => {
  const [newOpen, setNewOpen] = React.useState(false);
  const state = useTrainingStore();
  const { setOpen, setTrainingData } = state;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const role = UserProfile().useGetCurrentRole();

  console.log("doc?.trainingAttendees", doc);

  const { mutate, isLoading: mutationLoading } = useTrainingDetailsMutation();
  const [assignTrainingOpen, setAssignTrainingOpen] = React.useState(false);
  if (isLoading || mutationLoading) {
    return (
      <div className="w-[300px] max-w-xs bg-white rounded-lg shadow-md border overflow-hidden">
        <Skeleton variant="rectangular" width="100%" height={128} />
        <div className="p-4">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[300px]  max-w-xs h-max bg-white rounded-lg shadow-md border overflow-hidden">
      {/* <div className="flex items-center gap-2 p-2">
        <Avatar
          variant="circular"
          src={doc?.trainingCreator?.user_logo_url}
          alt="none"
          sx={{ width: 40, height: 40 }}
        />
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {doc?.trainingCreator?.first_name} {doc?.trainingCreator?.last_name}
          </h2>
          <p className="text-sm text-gray-700">{doc?.trainingCreator?.email}</p>
        </div>
      </div> */}
      <div className="relative p-2">
        <img
          src={logo?.length > 0 ? logo : "https://via.placeholder.com/150"}
          alt="Course cover"
          className="object-cover h-32 w-full"
        />
        <div
          className={`absolute bottom-4 left-4 px-2 py-1 rounded-full text-xs font-bold bg-gray-600 text-white`}
        >
          {`${doc?.trainingPoints} pts`}
        </div>
      </div>
      <div className="px-6 py-3 border-t">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            {status ? (
              <span
                className={`flex text-xs px-3 py-1 rounded-full font-semibold ${
                  status === "pending" && new Date(empEndDate) <= new Date()
                    ? "bg-red-200 text-red-600"
                    : status && status === "completed"
                    ? "bg-green-200 text-green-600"
                    : status === "pending"
                    ? "bg-yellow-200 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {status
                  ? status === "pending" && new Date(empEndDate) <= new Date()
                    ? "Over due"
                    : status
                  : `${doc?.trainingPoints} pts`}
              </span>
            ) : (
              <span
                className={`flex text-white text-xs px-3 py-1 rounded-full font-semibold bg-blue-600`}
              >
                {doc?.trainingType[0]?.value}
              </span>
            )}
            {role !== "Employee" && (
              <div>
                <IconButton
                  onClick={(e) => {
                    setNewOpen(true);
                    setAnchorEl(e?.currentTarget);
                  }}
                  className="bg-white !border !border-gray-900"
                  aria-label="edit"
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  open={newOpen}
                  anchorEl={anchorEl}
                  onClose={() => setNewOpen(false)}
                  onClick={() => setNewOpen(false)}
                >
                  <MenuItem
                    onClick={() => {
                      setNewOpen(false);
                      setOpen(true);
                      setTrainingData(doc);
                    }}
                  >
                    Update
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      mutate(doc._id);
                      setNewOpen(false);
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAssignTrainingOpen(true);
                    }}
                  >
                    Assign Training
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>

          <h2
            className="line-clamp-1 text-xl font-bold text-gray-900"
            // style={{ minHeight: "3em" }}
          >
            {doc?.trainingName}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-1 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span> {doc?.trainingLocation?.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <span>
              {doc?.isPermanent
                ? "On-demand"
                : `   ${format(
                    new Date(
                      empStartDate ? empStartDate : doc?.trainingStartDate
                    ),
                    "PP"
                  )}
              -
              ${format(
                new Date(empEndDate ? empEndDate : doc?.trainingEndDate),
                "PP"
              )}`}
            </span>
          </div>
        </div>
      </div>
      {assignTrainingOpen && (
        <AssignTraining
          open={assignTrainingOpen}
          setOpen={setAssignTrainingOpen}
          doc={doc}
        />
      )}
      <div className="bg-gray-100  p-4 flex items-center justify-between">
        {role === "Employee" && (
          <span className="text-lg tracking-tighter font-bold">
            {doc?.trainingPoints} Points
          </span>
        )}
        {role !== "Employee" && (
          <Link
            to={`/organisation/${doc?.trainingOrganizationId}/training/check-status/${doc._id}`}
          >
            <BasicButton
              className={
                "!bg-white hover:!bg-gray-700 hover:!text-white  !border !text-gray-900 "
              }
              title={"Check Status"}
            />
          </Link>
        )}
        <Link
          to={`/organisation/${doc?.trainingOrganizationId}/training/${doc._id}`}
        >
          <BasicButton
            className={"!bg-gray-700 hover:!bg-gray-600 "}
            title={"View Training"}
          />
        </Link>
      </div>
    </div>
  );
};

export default TableRow;
