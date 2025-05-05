import { Avatar, Pagination, Skeleton, Stack } from "@mui/material";
import React from "react";
import useGetAllEmployeeTraining from "../hooks/useGetAllEmployeeTraining";

const TrainingAnalyticsTable = ({ page, setPage, search, organizationId }) => {
  const { data, isFetching } = useGetAllEmployeeTraining(
    organizationId,
    page,
    search
  );

  return (
    <>
      <div className="overflow-auto ">
        {isFetching ? (
          <table className="w-full border rounded-md table-auto inline-table min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold px-2 border-r">
                <th scope="col" className="!text-left px-2 w-max py-2 border-r">
                  Sr. No
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Employee
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Trainings Attended
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Completed
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Pending
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Over Due
                </th>
                {/* <th scope="col" className="py-2 px-2 border-r">
                  Total Points Earn
                </th> */}
              </tr>
            </thead>
            <tbody>
              {Array.from(new Array(10)).map((_, index) => (
                <tr key={index} className="bg-white !font-medium px-2 border-b">
                  <td className="!text-left py-3 px-2 w-[70px] border-r">
                    <Skeleton width="100%" />
                  </td>
                  <td className="px-2 text-left w-[30%] border-r">
                    <div className="flex h-full items-center gap-2">
                      <Skeleton variant="circular" width={30} height={30} />
                      <Skeleton width="60%" />
                    </div>
                  </td>
                  <td className="text-left w-[200px] border-r">
                    <Skeleton width="100%" />
                  </td>
                  <td className="px-2 text-left w-[200px] border-r">
                    <Skeleton width="100%" />
                  </td>
                  <td className="px-2 text-left w-[200px] border-r">
                    <Skeleton width="100%" />
                  </td>
                  {/* <td className="px-2 text-left w-[200px] border-r">
                    <Skeleton width="100%" />
                  </td> */}
                  <td className="px-2 text-left w-[200px] border-r">
                    <Skeleton width="100%" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full border rounded-md table-auto inline-table min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold px-2 border-r">
                <th scope="col" className="!text-left px-2 w-max py-2 border-r">
                  Sr. No
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Employee
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Trainings Attended
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Completed
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Pending
                </th>
                <th scope="col" className="py-2 px-2 border-r">
                  Over Due
                </th>
                {/* <th scope="col" className="py-2 px-2 border-r">
                  Total Points Earn
                </th> */}
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((emp, id) => (
                <tr key={id} className="bg-white !font-medium px-2 border-b">
                  <td className="!text-left py-3 px-2 w-[70px] border-r">
                    {page * 10 - 10 + (id + 1)}
                  </td>
                  <td className="px-2 text-left w-[30%] border-r">
                    <div className="flex h-full items-center gap-2">
                      <Avatar
                        src={emp?.user_logo_url}
                        sx={{ height: "30px", width: "30px" }}
                      />
                      {emp?.first_name} {emp?.last_name}
                    </div>
                  </td>
                  <td className="text-left w-[200px] border-r">
                    <div className="px-2 flex gap-2 items-center h-max w-max cursor-pointer">
                      {emp?.totalTrainingsAttended
                        ? emp?.totalTrainingsAttended
                        : 0}
                    </div>
                  </td>
                  <td className="px-2 text-left w-[200px] border-r">
                    {emp?.completedCount ? emp?.completedCount : 0}
                  </td>
                  <td className="px-2 text-left w-[200px] border-r">
                    {emp?.pendingCount ? emp?.pendingCount : 0}
                  </td>
                  <td className="px-2 text-left w-[200px] border-r">
                    {emp?.overDueCount ? emp?.overDueCount : 0}
                  </td>
                  {/* <td className="px-2 text-left w-[200px] border-r">
                    {emp?.earnedPoints ? emp?.earnedPoints : 0}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Stack
          direction={"row"}
          className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
        >
          <div>
            <h1>
              {/* Showing {data?.currentPage} to {data?.totalPages} of{" "}
              {data?.totalEmployees} entries */}
              No data found
            </h1>
          </div>
          <Pagination
            count={data?.totalPages}
            page={page}
            color="primary"
            shape="rounded"
            onChange={(_, page) => {
              setPage(page);
            }}
          />
        </Stack>
      </div>
    </>
  );
};

export default TrainingAnalyticsTable;
