import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
  TextField,
} from "@mui/material";
import ReusableModal from "../../../components/Modal/component";
import RemotePunchingTaskForm from "./RemotePunchingTaskForm";
import ModalForStatusShow from "./modalForStatusShow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { format } from "date-fns";
import * as XLSX from "xlsx";

const GetAddedTask = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [taskForStatus, setTaskForStatus] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchAssign, setSearchAssign] = useState("");

  const { data, error, isLoading, refetch } = useQuery(
    ["addedTask", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );
  console.log("data in remote", data);
  const deleteTask = useMutation(
    async (taskId) => {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        refetch();
        setDeleteConfirmation(null);
      },
      onError: (err) => {
        console.error("Error deleting task:", err);
      },
    }
  );

  const handleEdit = async (taskId) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    setSelectedTask(response.data.remoteTask);
    setOpen(true);
  };

  const confirmDelete = (taskId) => {
    setDeleteConfirmation(taskId);
  };

  const handleDelete = () => {
    if (deleteConfirmation) {
      deleteTask.mutate(deleteConfirmation);
    }
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleRowClick = (task) => {
    setTaskForStatus(task);
    setSelectedTaskId(task._id);
    setShowStatus(true);
  };

  // Filtered Data based on Search Inputs
  const filteredTasks = data?.remotePunchingTasks?.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      (searchAssign
        ? task.to.some((user) =>
            user.label.toLowerCase().includes(searchAssign.toLowerCase())
          )
        : true)
    );
  });

  const handleDownloadExcel = () => {
    if (
      !filteredTasks?.length &&
      (!GetAddedTask || !Array.isArray(GetAddedTask))
    ) {
      alert("No data available to download!");
      return;
    }

    const allTasks = [
      ...filteredTasks,
      ...(Array.isArray(GetAddedTask) ? GetAddedTask : []),
    ];

    const excelData = allTasks.flatMap((task, index) => {
      return task.to.map((user) => {
        let assignedEntry = null;

        // Check if this assigned user has accepted the task in any taskName entry
        task.taskName?.forEach((taskItem) => {
          const foundEntry = taskItem.acceptedBy?.find(
            (entry) => entry.employeeEmail === user.value
          );
          if (foundEntry) assignedEntry = foundEntry;
        });

        return {
          "Sr. No.": index + 1,
          Title: task.title,
          Date: task.deadlineDate
            ? format(new Date(task.deadlineDate), "PP")
            : "N/A",
          Assign: user.label,
          Distance: assignedEntry?.punchObjectId?.distance
            ? Number(assignedEntry.punchObjectId.distance).toFixed(3)
            : "-",
          Status: assignedEntry?.status || "Pending",
          Comments: assignedEntry?.punchObjectId?.message || "No Comments",
        };
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");

    XLSX.writeFile(wb, "Task_List.xlsx");
  };

  return (
    <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
      {/* Search Fields */}
      <div className="p-4 flex space-x-4">
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <TextField
          label="Search by Assigned User"
          variant="outlined"
          size="small"
          value={searchAssign}
          onChange={(e) => setSearchAssign(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </div>

      {/* Task Table */}
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th className="!text-left pl-8 py-3">Sr. No.</th>
            <th className="!text-left pl-8 py-3">Title</th>
            <th className="!text-left pl-8 py-3">Date</th>
            <th className="!text-left pl-8 py-3">Assign</th>
            <th className="!text-left pl-8 py-3"></th>
            <th className="!text-left pl-8 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="py-6 px-2">
                Loading...
              </td>
            </tr>
          ) : error || !filteredTasks?.length ? (
            <tr>
              <td colSpan="6" className="py-6 px-2">
                No tasks found.
              </td>
            </tr>
          ) : (
            filteredTasks.map((task, index) => (
              <tr key={task._id} className="!font-medium border-b">
                <td className="!text-left pl-8 py-3">{index + 1}</td>
                <td className="py-3 pl-8">{task.title}</td>
                <td className="py-3 pl-8">
                  {task.deadlineDate
                    ? format(new Date(task.deadlineDate), "PP")
                    : "N/A"}
                </td>
                <td className="py-3 pl-8">
                  {task.to.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {task.to.map((user) => (
                        <li key={user._id} className="text-sm text-gray-800">
                          {user.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">Not Assigned</span>
                  )}
                </td>
                <td className="py-3 pl-8">
                  <Button
                    onClick={() => handleRowClick(task)}
                    variant="outlined"
                    size="small"
                  >
                    View Details
                  </Button>
                </td>
                <td className="py-3 pl-8">
                  <Tooltip title="Edit">
                    <EditIcon
                      style={{ color: "#2196f3", marginRight: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(task._id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteOutlineIcon
                      color="error"
                      style={{ marginRight: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(task._id);
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {taskForStatus && (
        <ReusableModal
          className="sm:!w-[full] lg:!w-[1000px] h-[600px]"
          open={showStatus}
          heading={"Task Status"}
          subHeading={"Here is the status of the selected task"}
          onClose={() => setShowStatus(false)}
        >
          <ModalForStatusShow
            taskId={selectedTaskId}
            taskData={taskForStatus}
          />
        </ReusableModal>
      )}

      {selectedTask && (
        <ReusableModal
          className="h-[600px]"
          open={open}
          heading={"Edit Remote Punching Task"}
          subHeading={"Here you can Edit remote punching task"}
          onClose={() => setOpen(false)}
        >
          <RemotePunchingTaskForm
            taskData={selectedTask}
            onClose={() => setOpen(false)}
          />
        </ReusableModal>
      )}

      {taskForStatus && (
        <ReusableModal
          className="sm:!w-[full] lg:!w-[1000px] h-[600px]"
          open={showStatus}
          heading={"Task Status"}
          subHeading={"Here is the status of the selected task"}
          onClose={() => setShowStatus(false)}
        >
          <ModalForStatusShow
            taskId={selectedTaskId}
            taskData={taskForStatus}
          />
        </ReusableModal>
      )}

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this task, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDelete}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GetAddedTask;
