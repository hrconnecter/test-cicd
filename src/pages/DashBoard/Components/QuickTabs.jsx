import { ListAlt, Room } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import UserProfile from "../../../hooks/UserData/useUser";
import useOrgGeo from "../../Geo-Fence/useOrgGeo";
// import { BsQrCodeScan } from "react-icons/bs";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

const QuickTabs = () => {
  const { id } = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const { data } = useSubscriptionGet({
    organisationId: id,
  });

  const empId = user?._id;
  const { data: geofencingData } = useOrgGeo(id);
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(empId)
  );

  return (
    <>
      <h1 className="font-semibold text-[#67748E] mb-4 text-[20px]">
        Quick Tabs
      </h1>
      <div className="flex items-center border justify-around  bg-white p-2 rounded-sm  space-x-4 overflow-x-auto   ">
        <Link
          to={`/organisation/${id}/leave`}
          className="flex flex-col items-center justify-center  p-4 rounded-sm min-w-[120px]"
        >
          <Avatar sx={{ bgcolor: "tomato" }}>
            <FaCalendarAlt color="white" />
          </Avatar>
          <h1 className="text-[#67748E] text-center tracking-tighter font-bold">
            Attendance Calendar
          </h1>
        </Link>

        <Link
          to={`/organisation/${id}/view-payslip`}
          className="flex flex-col items-center justify-center  p-4 rounded-sm min-w-[120px]"
        >
          <Avatar className="!bg-lime-500">
            <ListAlt color="white" />
          </Avatar>
          <h1 className="text-[#67748E] text-center text-lg tracking-tighter font-bold">
            Payslip
          </h1>
        </Link>

        {/* {data?.organisation?.packageInfo === "Enterprise Plan" &&
          data?.organisation?.packages?.includes("QR Code Attendance") && (
            <Link
              to={`/organisation/${id}/mark-attendence-qr`}
              className="flex flex-col items-center justify-center  p-4 rounded-sm min-w-[120px]"
            >
              <Avatar className="!bg-red-500">
                <BsQrCodeScan color="white" />
              </Avatar>
              <h1 className="text-[#67748E] text-center text-lg tracking-tighter font-bold">
                Scan QR
              </h1>
            </Link>
          )} */}

        {(data?.organisation?.packageInfo === "Intermediate Plan" ||
          data?.organisation?.packageInfo === "Enterprise Plan") && (
          <Link
            to={
              isUserMatchInEmployeeList
                ? `/organisation/${id}/geo-fencing`
                : `/organisation/${id}/employee-remote-punching`
            }
            className="flex flex-col items-center justify-center  p-4 rounded-sm min-w-[120px]"
          >
            <Avatar className="!bg-violet-500">
              <Room color="white" />
            </Avatar>
            <h1 className="text-[#67748E] text-center tracking-tighter font-bold">
              {isUserMatchInEmployeeList ? "Geo Fencing" : "Remote Punching"}
            </h1>
          </Link>
        )}
      </div>
    </>
  );
};

export default QuickTabs;
