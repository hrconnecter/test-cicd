import { Avatar } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { format } from "date-fns";
import React from "react";

const TrainingStatusTable = ({
  traningStatus,
  isLoading,
  totalPages,
  currentPage = 1,
  page,
  setPage,
  totalResults,
}) => {
  console.log("traningStatus", traningStatus);
  if (isLoading) {
    return (
      <div className="overflow-auto rounded-lg">
        <table className="w-full table-auto inline-table min-w-full bg-white text-left !text-sm font-light">
          <thead className="border-b bg-gray-100 font-bold">
            <tr className="!font-semibold px-2 border-r">
              <th scope="col" className="!text-left px-2 w-max py-3 border-r">
                Sr. No
              </th>
              <th scope="col" className="py-3 px-2 border-r">
                Employee
              </th>
              <th scope="col" className="py-3 px-2 border-r">
                Rating
              </th>
              <th scope="col" className="py-3 px-2 border-r">
                Comment
              </th>
              <th scope="col" className="py-3 px-2 border-r">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className="bg-white !font-medium px-2 border-b animate-pulse"
              >
                <td className="!text-left py-3 px-2 w-[70px] border-r">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </td>
                <td className="px-2 text-left w-[30%] border-r">
                  <div className="flex h-full items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </td>
                <td className="text-left w-[200px] border-r">
                  <div className="px-2 flex gap-2 items-center h-max w-max cursor-pointer">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </td>
                <td className="px-2 text-left w-[200px] border-r">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="text-left !p-0 !w-[250px] border-r">
                  <div className="flex bg-gray-200 w-max text-xs px-3 py-1 rounded-full font-semibold h-4"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="overflow-auto ">
      <table className="w-full table-auto inline-table min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-100 font-bold">
          <tr className="!font-semibold px-2 border-r">
            <th scope="col" className="!text-left px-2 w-max py-3 border-r">
              Sr. No
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              Employee
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              Start Date
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              End Date
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              Rating
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              Comment
            </th>
            <th scope="col" className="py-3 px-2 border-r">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {traningStatus?.map((emp, id) => (
            <tr key={id} className="bg-white !font-medium px-2 border-b">
              <td className="!text-left py-3 px-2 w-[70px] border-r">
                {currentPage * 10 - 10 + (id + 1)}
              </td>
              <td className="px-2 text-left w-[30%] border-r">
                <div className="flex h-full items-center gap-2">
                  <Avatar
                    src={emp?.employeeId?.user_logo_url}
                    sx={{ height: "30px", width: "30px" }}
                  />
                  {emp?.employeeId?.first_name} {emp?.employeeId?.last_name}
                </div>
              </td>

              <td className="text-left w-[200px] border-r">
                <div className="px-2 flex gap-2 items-center h-max w-max cursor-pointer">
                  {emp?.startDate
                    ? format(new Date(emp?.startDate), "PP")
                    : "-"}
                </div>
              </td>
              <td className="text-left w-[200px] border-r">
                <div className="px-2 flex gap-2 items-center h-max w-max cursor-pointer">
                  {emp?.endDate ? format(new Date(emp?.endDate), "PP") : "-"}
                </div>
              </td>
              <td className="text-left w-[200px] border-r">
                <div className="px-2 flex gap-2 items-center h-max w-max cursor-pointer">
                  {emp?.rating ? emp?.rating : "-"}
                </div>
              </td>
              <td className="px-2 text-left w-[200px] border-r">
                {emp?.comment ? emp?.comment : "-"}
              </td>
              <td className="text-left !px-2 !w-[250px] border-r">
                <span
                  className={`flex ${
                    emp?.status === "pending" &&
                    new Date(emp?.endDate) < new Date()
                      ? "bg-red-100"
                      : "bg-blue-100"
                  } w-max text-xs px-3 py-1 rounded-full font-semibold`}
                >
                  <span
                    className={`${
                      emp?.status === "pending" &&
                      new Date(emp?.endDate) < new Date()
                        ? "text-red-500"
                        : 'text-["#1414fe"]'
                    } `}
                  >
                    {emp?.status === "pending" &&
                    new Date(emp?.endDate) < new Date()
                      ? "Overdue"
                      : emp?.status
                      ? emp?.status
                      : "Pending"}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Stack
        direction={"row"}
        className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
      >
        <div>
          <h1>
            Showing {currentPage} to {totalPages} of {totalResults} entries
          </h1>
        </div>
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          shape="rounded"
          onChange={(event, page) => {
            setPage(page);
          }}
        />
      </Stack>
    </div>
  );
};

export default TrainingStatusTable;
