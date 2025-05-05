import { Visibility } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, Stack } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";
import useGetAllTrainings from "../hooks/useGetAllTrainings";

const TrainingTable = ({ organizationId, search, page = 1, setPage }) => {
  const { data: trainingData, isFetching: trainingFetching } =
    useGetAllTrainings(organizationId, page, search);

  const navigate = useNavigate("");

  return (
    <>
      {!trainingFetching && trainingData?.data.length <= 0 ? (
        <h1>Training Not Found</h1>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full border rounded-md table-auto inline-table min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-100 font-bold">
                <tr className="!font-semibold px-2 border-r">
                  <th
                    scope="col"
                    className="!text-left px-2 w-[70px  ] py-2 border-r"
                  >
                    Sr. No
                  </th>
                  <th scope="col" className="py-2 px-2 w-[200px] border-r">
                    Training Name
                  </th>
                  <th scope="col" className="py-2 px-2 w-[150px] border-r">
                    Training Location
                  </th>
                  <th scope="col" className="py-2 px-2 w-[150px] border-r">
                    Date
                  </th>
                  <th scope="col" className="py-2 px-2 w-[150px] border-r">
                    Attendees
                  </th>
                  <th scope="col" className="py-2 px-2 w-[100px] border-r">
                    Pending
                  </th>
                  <th scope="col" className="py-2 px-2 w-[100px] border-r">
                    Over Due
                  </th>
                  {/* <th scope="col" className="py-2 px-2 w-[100px] border-r">
                    Points
                  </th> */}
                  <th
                    scope="col"
                    className="py-2 px-2 w-[150px] border-r border-l sticky right-0 bg-gray-50"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainingFetching
                  ? Array.from(new Array(10)).map((_, index) => (
                      <tr
                        key={index}
                        className="bg-white !font-sans !text-base !font-medium px-2 border-b"
                      >
                        <td className="!text-left py-3 px-2 w-[50px] border-r">
                          <Skeleton />
                        </td>
                        <td className="px-2 w-[200px] text-left border-r">
                          <Skeleton />
                        </td>
                        <td className="text-left !text-sm px-2 w-[150px] border-r">
                          <Skeleton />
                        </td>
                        <td className="px-2 text-left w-[150px] border-r">
                          <Skeleton />
                        </td>
                        <td className="px-2 text-left w-[150px] border-r">
                          <Skeleton />
                        </td>
                        <td className="px-2 text-left w-[100px] border-r">
                          <Skeleton />
                        </td>
                        <td className="px-2 text-left w-[100px] border-r">
                          <Skeleton />
                        </td>
                        {/* <td className="px-2 text-left w-[100px] border-r">
                          <Skeleton />
                        </td> */}
                        <td className="px-2 text-left w-[150px] border-r sticky right-0 bg-white">
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : trainingData?.data?.map((tre, id) => (
                      <tr
                        key={tre?._id}
                        className="bg-white !font-sans !text-base !font-medium px-2 border-b"
                      >
                        <td className="!text-left py-3 px-2 w-[50px] border-r whitespace-nowrap">
                          {page * 10 - 10 + (id + 1)}
                        </td>
                        <td className="px-2 w-[200px] text-left border-r whitespace-nowrap">
                          {tre?.trainingName}
                        </td>
                        <td className="text-left !text-sm px-2 w-[150px] border-r whitespace-nowrap">
                          <span className="flex bg-blue-100 w-max text-xs px-3 py-1 rounded-full font-semibold">
                            <span className="text-[#1414fe]">
                              {tre?.trainingLocation?.address}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 text-left w-[150px] border-r whitespace-nowrap">
                          {format(new Date(tre?.trainingStartDate), "PP")} -{" "}
                          {format(new Date(tre?.trainingEndDate), "PP")}
                        </td>
                        <td className="px-2 text-left w-[150px] border-r whitespace-nowrap">
                          {tre?.trainingAttendees}
                        </td>
                        <td className="px-2 text-left w-[100px] border-r whitespace-nowrap">
                          {tre?.pendingCount}
                        </td>
                        <td className="px-2 text-left w-[100px] border-r whitespace-nowrap">
                          {tre?.overdueCount}
                        </td>
                        {/* <td className="px-2 text-left w-[100px] border-r whitespace-nowrap">
                          {tre?.trainingPoints}
                        </td> */}
                        <td className="px-2 text-left w-[150px] border-r sticky right-0 bg-white whitespace-nowrap">
                          <IconButton
                            onClick={() => {
                              navigate(
                                `/organisation/${organizationId}/training/check-status/${tre?._id}`
                              );
                            }}
                          >
                            <Visibility className="text-blue-500" />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <Stack
            direction={"row"}
            className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
          >
            <div>
              <h1>
                {/* Showing {trainingData?.currentPage} to{" "}
                {trainingData?.totalPages} of {trainingData?.totalResults}{" "}
                entries */}
                No data found
              </h1>
            </div>
            <Pagination
              count={trainingData?.totalPages}
              page={page}
              color="primary"
              shape="rounded"
              onChange={(_, page) => {
                setPage(page);
              }}
            />
          </Stack>
        </>
      )}
    </>
  );
};

export default TrainingTable;
