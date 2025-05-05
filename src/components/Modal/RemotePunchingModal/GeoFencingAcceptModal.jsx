import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress, Tabs, Tab } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import PunchMapModal from "./components/mapped-form";
import HeadingOneLineInfo from "../../HeadingOneLineInfo/HeadingOneLineInfo";

const GeoFencingAcceptModal = ({ filterOrgId, filterOrgData, isLoading }) => {
  console.log("GeofilterOrgId", filterOrgId);
  // Hooks
  const [employeeId, setEmployeeId] = useState();
  console.log("setEmployeeId", setEmployeeId, "employeeId", employeeId);
  const queryClient = useQueryClient();
  const { data: punchNotifications } = usePunchNotification();
  console.log("punchNotifications data", punchNotifications);

  const authToken = useAuthToken();
  const [selectedPunchId, setSelectedPunchId] = useState(null);
  console.log("selectedPunchId", selectedPunchId);

  const geoFence = "geoFence";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("geoRequest");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId, punchId }) => {
      console.log("employeeId in mutate", employeeId);

      return axios.patch(
        `${process.env.REACT_APP_API}/route/punch-notification/update-notification-count/${employeeId}`,
        { notificationCount: 0, selectedPunchId: punchId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        // Refetch the punch notifications after updating notification count
        queryClient.invalidateQueries("EmpDataPunch");
        queryClient.invalidateQueries("punch-request");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  // Get particular employee punching and miss punch data
  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunch", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch-notification/notification-user/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching employee notification data:", error);
      }
    },
    enabled: Boolean(employeeId),
  });
  console.log("EmpNotification", EmpNotification);
  // Function to handle employee click and set punchId
  const handleEmployeeClick = (employeeId) => {
    console.log("employeeId in handle click", employeeId);
    // Find the punch notification that matches the clicked employee
    const punchData = punchNotifications?.punchNotification?.find(
      (notification) => notification?.punchData[0]?.employeeId === employeeId
    );
    console.log("employeeId in handle click punchData", punchData);
    if (punchData) {
      setEmployeeId(employeeId); // Set employeeId here
      setSelectedPunchId(punchData._id);
      console.log("start geo");

      mutation.mutate({ employeeId, punchId: punchData._id });
      console.log("end geo");
    }
  };

  // Handle employee search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2  ">
            <div className="space-y-2">
              <div
                className={`
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                {" "}
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  className="border-none bg-white w-full outline-none px-2"
                  value={searchTerm}
                  onChange={handleSearch} // Search input handler
                />
              </div>
            </div>
          </div>
          {filterOrgData?.data?.geoPunches[0].arrayOfEmployee?.map(
            (employee, idx) =>
              employee !== null && (
                <Link
                  onClick={() => handleEmployeeClick(employee?.employeeId)}
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-blue-500 hover:text-white
                                    ${
                                      employee?._id === employeeId
                                        ? "bg-gray-50  text-black"
                                        : ""
                                    }`}
                  key={idx}
                >
                  <Avatar />
                  <div>
                    <h1 className="md:text-[1.2rem] text-sm">
                      {employee?.employeeName}
                    </h1>
                    <h1 className={`md:text-sm text-xs`}>
                      {employee?.employeeEmail}
                    </h1>
                  </div>
                </Link>
              )
          )}
        </article>

        {/* Show particular employee data */}
        <article className="w-[75%] min-h-[90vh] border-l-[.5px]">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Geo Fence"}
              info={"Here manager can accept geofencing request."}
            />
          </div> 

          <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
            <Tab label="Geo Request" value="geoRequest" />
            <Tab label="Archive" value="archive" />
          </Tabs>

          {empDataLoading ? (
            <div className="flex justify-center h-full">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.punchNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Geo Fencing Request Found
                </h1>
              </div>
            ) : (
              <div>
                {activeTab === "geoRequest" &&
                  EmpNotification?.punchNotification
                    ?.filter(
                      (notification) =>
                        notification.geoFencingArea === true &&
                        notification.status === "Pending"
                    )
                    ?.map((items, itemIndex) => (
                      <PunchMapModal
                        key={itemIndex}
                        items={items}
                        idx={itemIndex}
                        geoFence={geoFence}
                        tabname="geoRequest"
                      />
                    ))}

                {activeTab === "archive" &&
                  EmpNotification?.punchNotification
                    ?.filter(
                      (notification) =>
                        notification.geoFencingArea === true &&
                        notification.status !== "Pending"
                    )
                    ?.map((items, itemIndex) => (
                      <PunchMapModal
                        key={itemIndex}
                        items={items}
                        idx={itemIndex}
                        geoFence={geoFence}
                        tabname="archive"
                      />
                    ))}
              </div>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select an employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default GeoFencingAcceptModal;
