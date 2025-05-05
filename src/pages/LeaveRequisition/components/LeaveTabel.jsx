import { MoreHoriz } from "@mui/icons-material";
import { IconButton, Popover, Skeleton, Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import React, { useState } from "react";
import SummaryTable from "./summaryTable";

const LeaveTable = ({ data, isLoading, balenceLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  if (isLoading || balenceLoading) {
    return (
      <article className="w-full  px-6 h-max py-6   ">
        <div className="text-lg  font-semibold flex  text-gray-700">
          <div className="flex gap-2">
            <h1 className="text-gray-500 text-xl font-bold tracking-tight">
              Balance Leaves
            </h1>
          </div>
          <Tooltip title="Click to get Summary for current month">
            <IconButton className="">
              <MoreHoriz className="text-black" />
            </IconButton>
          </Tooltip>
        </div>
        <Divider className="mt-4 mb-6" />
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" className="w-1/4 h-6" />
              <Skeleton variant="text" className="w-2/4 h-8" />
              <Divider />
            </div>
          ))}
        </div>
      </article>
    );
  }

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <article className="w-full h-auto ">
      <aside className="bg-white border  ">
        <div className="pb-1 px-2  bg-blue-50 w-full  flex items-center gap-2 justify-between ">
          <h1 className="text-gray-500 font-semibold pt-2 text-xl  tracking-tight">
            Balance Leaves
          </h1>
        </div>

        <div className="space-y-1  px-2 bg-white ">
          {data?.leaveTypes?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between   items-center  py-2 px-0 rounded-lg  "
            >
              <div className="gap-3 flex items-center">
                {/* <span
                  style={{ backgroundColor: item.color }}
                  className="h-4 w-4 rounded-full"
                ></span> */}

                <h2 className="text-md  font-medium text-gray-800">
                  {item.leaveName}
                </h2>
              </div>
              <h2 className="text-md font-semibold text-gray-900">
                {item.count}
              </h2>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center py-2 px-2 bg-white  border-t">
          <h2 className="text-lg     text-gray-800">Total Leave Balance</h2>
          <h2 className="text-lg  font-bold   text-gray-800">
            {data.totalCoutn}
          </h2>
        </div>
      </aside>

      <div className="flex  mt-4 bg-white border  gap-4 flex-col justify-between  ">
        <div className="flex items-center  gap-2 py-1 bg-blue-50 ">
          <h1 className="text-gray-500 text-xl px-2  font-bold tracking-tight">
            Monthly Summary
          </h1>
        </div>
        <div className="flex w-ful justify-between px-2">
          <h2 className="text-md font-medium text-gray-800">
            Leaves Taken in this month
          </h2>
          <h2 className="text-md font-semibold text-gray-900">
            {data?.totalLeavesTaken}
          </h2>
        </div>
        <div className="flex w-ful justify-between mb-2 px-2">
          <h2 className="text-md font-medium text-gray-800">Available Days</h2>
          <h2 className="text-md font-semibold text-gray-900">
            {data?.presentDays}
          </h2>
        </div>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="transition-transform transform scale-95"
      >
        <SummaryTable />
      </Popover>
    </article>
  );
};

export default LeaveTable;
