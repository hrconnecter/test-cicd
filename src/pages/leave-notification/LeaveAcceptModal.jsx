import { Tab } from "@headlessui/react";
import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import useGetUser from "../../hooks/Token/useUser";

const LeaveAcceptModal = ({ filterOrgId, filterOrgData, isLoading }) => {
  //hooks
  const { authToken } = useGetUser();
  const queryClient = useQueryClient();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  //states
  const [employeeId, setEmployeeId] = useState(null);
  const [searchEmp, setSearchEmp] = useState("");
  const [prevFilterOrgId, setPrevFilterOrgId] = useState(null);

  useEffect(() => {
    if (prevFilterOrgId !== filterOrgId) {
      setEmployeeId(null);
      setPrevFilterOrgId(filterOrgId);
    }
  }, [filterOrgId, prevFilterOrgId]);

  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId }) => {
      return axios.put(
        `${process.env.REACT_APP_API}/route/leave/update/notificationCount/${employeeId}`,
        { notificationCount: 0 },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getFilterOrgData");
        queryClient.invalidateQueries("employee-leave");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  const handleEmployeeClick = (employeeId) => {
    setEmployeeId(employeeId);
    mutation.mutate({ employeeId }); // Update notification count
  };

  const tabArray = [
    {
      title: "Leave Requests",

      isArchive: false,
      disabled: false,
    },
    {
      title: "Archived",

      isArchive: true,
      disabled: false,
    },
  ];

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          {/* Search Employee */}
          <div className="p-2 my-2 !py-2  ">
            <div className="space-y-2">
              <div
                className={`flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2`}
                />
              </div>
            </div>
          </div>

          {/* Employee List */}
          {isLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress size={20} />
            </div>
          ) : (
            filterOrgData?.data?.leaves[0].arrayOfEmployee
              ?.filter((item) =>
                searchEmp
                  ? item?.employeeName
                      ?.toLowerCase()
                      .includes(searchEmp.toLowerCase())
                  : true
              )
              ?.map(
                (employee, idx) =>
                  employee !== null && (
                    <Link
                      onClick={() => handleEmployeeClick(employee?.employeeId)}
                      className={` my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-blue-500 hover:text-white
              ${
                employee?.employeeId === employeeId
                  ? "!bg-blue-500  !text-white"
                  : ""
              }`}
                      key={idx}
                    >
                      <div></div>
                      <Avatar />
                      <div>
                        <h1 className="md:text-[1.2rem] text-sm">
                          {employee?.employeeName}
                        </h1>
                        <h1
                          className={`md:text-sm text-xs  ${
                            employee?._id === employeeId && "text-gray-500"
                          }`}
                        >
                          {employee?.employeeEmail}
                        </h1>
                      </div>
                    </Link>
                  )
              )
          )}
        </article>

        <article className="w-[75%] min-h-[90vh] border-l-[.5px]">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Attendance & Leave Requests"}
              info={
                "Here you will be able to approve or reject the attendance & leave notifications"
              }
            />
          </div>
          {employeeId ? (
            <>
              <div className="min-h-[85vh] px-4 bg-gray-50">
                <Tab.Group>
                  <Tab.List className="mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
                    {tabArray.map((tab, index) => (
                      <Tab
                        key={index}
                        disabled={tab.disabled}
                        className={({ selected }) =>
                          classNames(
                            "w-full rounded-lg py-2 px-6 text-sm font-medium leading-5 whitespace-nowrap",
                            selected
                              ? "bg-white text-blue-700 shadow"
                              : "text-black hover:bg-gray-200 ",
                            tab.disabled &&
                              "cursor-not-allowed text-gray-400 hover:bg-gray-100"
                          )
                        }
                      >
                        {tab?.title}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels>
                    {tabArray.map((tab, index) => (
                      <Tab.Panel key={index}>
                        <LeaveRejectmodal
                          employeeId={employeeId}
                          isLoading={isLoading}
                          isArchive={tab.isArchive}
                        />
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </>
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="md:text-lg text-sm w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
export default LeaveAcceptModal;
