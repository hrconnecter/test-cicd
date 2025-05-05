import { CalendarDaysIcon } from "@heroicons/react/16/solid";
import { Pin, Report } from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const EmployeeTrainingNoteification = () => {
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { organisationId } = useParams("");

  const { data: notifications, isLoading } = useQuery(
    ["getTrainingNotifications", user._id],
    async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/trainings/getNotification/${user._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
    {
      enabled: !!user._id,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  const mergedNotifications = [
    ...(notifications?.trainingNotifications || []),
    ...(notifications?.reportNotifications || []),
  ];

  return (
    <>
      <h1 className="text-2xl tracking-tighter font-semibold my-4">
        Training Notification
      </h1>
      <div className="space-y-2">
        {mergedNotifications.map((item) => (
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <img
                src={item?.trainingId?.trainingLogo}
                alt={"none"}
                className="object-cover h-[70px] rounded-lg"
              />
              <div className="flex-grow min-w-0">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold truncate text-gray-800">
                    {item?.trainingId?.trainingName}
                  </h3>

                  {item?.reportReason && (
                    <div className="space-x-2 text-red-500 ">
                      <Report />
                      <span className="text-red-500">Reported</span>
                    </div>
                  )}
                </div>
                {item?.reportReason ? (
                  <div className="text-base mt-1">
                    <p
                      className={` ${
                        item?.status === "approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      Status: {item?.status}
                    </p>
                    <p>Reason: {item?.reportReason}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center text-base text-gray-600 mt-1">
                      <CalendarDaysIcon className="mr-1 h-5" />
                      <span className="truncate">
                        {format(new Date(item?.startDate), "PP")} -{" "}
                        {format(new Date(item?.endDate), "PP")}
                      </span>
                    </div>
                    <div className="flex items-center text-base text-gray-600 mt-1">
                      <Pin className="mr-1 h-5" />
                      <span className="truncate">
                        {item?.trainingId?.trainingLocation?.address}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {item?.reportReason ? null : (
                  <Link
                    to={`/organisation/${organisationId}/training/${item?.trainingId?._id}`}
                    target="_blank"
                    className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
            {item?.reportReason ? null : (
              <div className="bg-blue-50 px-4 py-2 text-sm text-blue-700">
                This training is assigned to you. Please complete it between{" "}
                {format(new Date(item?.startDate), "PP")} -{" "}
                {format(new Date(item?.endDate), "PP")}.
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeTrainingNoteification;
