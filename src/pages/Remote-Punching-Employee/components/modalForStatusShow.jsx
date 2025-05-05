import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Button } from "@mui/material";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import axios from "axios";

const ModalForStatusShow = ({ taskData }) => {
  console.log("taskData", taskData);
  const { organisationId } = useParams();
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const { data: employees } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        { headers: { Authorization: authToken } }
      );
      return response.data.employees;
    }
  );

  if (!taskData) {
    return <div>No task data available.</div>;
  }

  const handleComplete = (email, punchObjectId) => {
    console.log("punchObjectId in remote", punchObjectId);
    const employee = employees.find((emp) => emp.email === email);
    if (employee) {
      navigate(
        `/organisation/${organisationId}/remote-task/${employee._id}/${punchObjectId?._id}`
      );
    } else {
      console.error("Employee not found");
    }
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const taskWorksheet = workbook.addWorksheet("Filtered Task Data");

    // Add title and description
    taskWorksheet.mergeCells("A1:E1");
    taskWorksheet.getCell("A1").value = `Title: ${taskData.title}`;
    taskWorksheet.getCell("A1").font = { bold: true };
    taskWorksheet.mergeCells("A2:E2");
    taskWorksheet.getCell("A2").value = `Description: ${taskData.description}`;
    taskWorksheet.getCell("A2").font = { bold: true };

    taskWorksheet.addRow([]);
    const headerRow = taskWorksheet.addRow([
      "Task",
      "Email",
      "Distance",
      "Date",
      "Status",
      "Comments",
    ]);
    headerRow.font = { bold: true };

    // Track user distances uniquely per location
    const userDistanceMap = {};

    // Add filtered data
    filteredTaskData.forEach((taskItem) => {
      taskItem.filteredTo.forEach((email) => {
        const acceptedByEntry = taskItem.acceptedBy.find(
          (entry) => entry.employeeEmail === email.value
        );

        const distance = acceptedByEntry?.punchObjectId?.distance
          ? Number(acceptedByEntry.punchObjectId.distance)
          : 0;

        const locationKey = acceptedByEntry?.punchObjectId?.location || ""; // Unique identifier for location

        if (!userDistanceMap[email.label]) {
          userDistanceMap[email.label] = new Map(); // Store location-wise distances
        }

        // Add distance only if the location is not already counted
        if (distance > 0 && !userDistanceMap[email.label].has(locationKey)) {
          userDistanceMap[email.label].set(locationKey, distance);
        }

        taskWorksheet.addRow([
          taskItem.taskName,
          email.label,
          distance ? distance.toFixed(3) : "",
          acceptedByEntry?.punchObjectId?.createdAt
            ? format(new Date(acceptedByEntry.punchObjectId.createdAt), "PP")
            : "-",
          acceptedByEntry?.status || "Assigned",
          acceptedByEntry?.comments || "",
        ]);
      });
    });

    // Add summary worksheet
    const summaryWorksheet = workbook.addWorksheet("User-Wise Totals");
    summaryWorksheet.mergeCells("A1:B1");
    summaryWorksheet.getCell("A1").value = "User-Wise Total Distances";
    summaryWorksheet.getCell("A1").font = { bold: true };
    summaryWorksheet.addRow(["Email", "Total Unique Distance"]).font = {
      bold: true,
    };

    // Sum unique distances per user
    Object.entries(userDistanceMap).forEach(([email, locationDistances]) => {
      const totalDistance = Array.from(locationDistances.values()).reduce(
        (sum, d) => sum + d,
        0
      );

      summaryWorksheet.addRow([email, totalDistance.toFixed(3)]);
    });

    // Generate Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filtered_task_data.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const filteredTaskData = taskData.taskName.map((taskItem) => {
    const filteredTo = taskData.to.filter((email) => {
      const acceptedByEntry = taskItem.acceptedBy.find(
        (entry) => entry.employeeEmail === email.value
      );

      if (!acceptedByEntry?.punchObjectId?.createdAt) return false;

      const date = new Date(acceptedByEntry.punchObjectId.createdAt);

      const yearMatches = selectedYear
        ? date.getFullYear() === Number(selectedYear)
        : true;
      const monthMatches = selectedMonth
        ? date.getMonth() + 1 === Number(selectedMonth)
        : true;

      return yearMatches && monthMatches;
    });

    return { ...taskItem, filteredTo };
  });

  // If no filter is selected, return all data (default behavior)
  const allData = taskData.taskName.map((taskItem) => ({
    ...taskItem,
    filteredTo: taskData.to,
  }));

  const tasksToDisplay =
    selectedYear || selectedMonth ? filteredTaskData : allData;
  console.log("tasksToDisplay", tasksToDisplay);
  return (
    <div className="overflow-auto">
      <div>
        <h2 className="text-2xl mb-2">{taskData?.title}</h2>
        <p className="text-sm text-muted-foreground">{taskData?.description}</p>
        <br />
      </div>

      <div className="flex gap-4 mb-4">
        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">All Years</option>
          {Array.from({ length: 30 }, (_, i) => 2001 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">All Months</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-100 font-bold">
          <tr className="!font-semibold">
            <th className="py-3 text-sm px-2">Task</th>
            <th className="py-3 text-sm px-2">Email</th>
            <th className="py-3 text-sm px-2">Distance</th>
            <th className="py-3 text-sm px-2">Date</th>
            <th className="py-3 text-sm px-2">Status</th>
            <th className="py-3 text-sm px-2">Comments</th>
          </tr>
        </thead>
        <tbody>
          {tasksToDisplay.map((taskItem) =>
            taskItem.filteredTo.map((email) => {
              const acceptedByEntry = taskItem.acceptedBy.find(
                (entry) => entry.employeeEmail === email.value
              );
              return (
                <tr className="border-b" key={`${taskItem._id}-${email.value}`}>
                  <td className="py-3 px-2">{taskItem.taskName}</td>
                  <td className="py-3 px-2">{email.label}</td>
                  <td className="py-3 px-2">
                    {acceptedByEntry?.punchObjectId?.distance
                      ? Number(acceptedByEntry.punchObjectId.distance).toFixed(
                          3
                        )
                      : ""}
                  </td>
                  <td className="py-3 px-2">
                    {acceptedByEntry?.punchObjectId?.createdAt
                      ? format(
                          new Date(acceptedByEntry.punchObjectId.createdAt),
                          "PP"
                        )
                      : "-"}
                  </td>
                  <td className="py-3 px-2">
                    {acceptedByEntry ? (
                      acceptedByEntry.status ? (
                        acceptedByEntry.status === "Completed" ? (
                          <Button
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                              handleComplete(
                                email.value,
                                acceptedByEntry?.punchObjectId
                              )
                            }
                          >
                            Completed
                          </Button>
                        ) : (
                          acceptedByEntry.status
                        )
                      ) : acceptedByEntry.accepted ? (
                        "Accept"
                      ) : (
                        "Reject"
                      )
                    ) : (
                      "Assigned"
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {acceptedByEntry?.comments || ""}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <br />
      <div className="flex justify-end">
        <Button variant="contained" onClick={generateExcel}>
          Download Excel
        </Button>
      </div>
    </div>
  );
};

export default ModalForStatusShow;
