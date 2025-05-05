import { Tab } from "@headlessui/react";
import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ShiftRejectModel from "../../components/Modal/ShiftRequestModal/ShiftRejectModel";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const ShiftNotification = ({ filterOrgId, filterOrgData, isLoading }) => {
  //hooks
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { getCurrentUser } = UserProfile();
  const queryClient = useQueryClient();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabArray = [
    {
      title: "Shift Requests",

      isArchive: false,
      disabled: false,
    },
    {
      title: "Archived",

      isArchive: true,
      disabled: false,
    },
  ];

  //state
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeId] = useState();
  const [prevFilterOrgId, setPrevFilterOrgId] = useState(null);

  let isAcc = false;
  let isSuper = false;

  const user = getCurrentUser();
  const profileArr = user.profile;
  profileArr.forEach((element) => {
    if (element === "Accountant") {
      isAcc = true;
    }
    if (element === "Super-Admin") {
      isSuper = true;
    }
  });

  useEffect(() => {
    if (prevFilterOrgId !== filterOrgId) {
      setEmployeeId(null);
      setPrevFilterOrgId(filterOrgId);
    }
  }, [filterOrgId, prevFilterOrgId]);

  const { data: data2 } = useQuery("shift-emp", async () => {
    let url;
    if (isAcc && isSuper) {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      console.log("finalData for manager", response.data);
      return response.data;
    } else if (isAcc) {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForAccountant/${organisationId}`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      console.log("finalData for account", response.data);
      return response.data;
    } else {
      url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      console.log("finalData for manager", response.data);
      return response.data;
    }
  });

  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["ShiftData", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/shiftApply/getForEmp/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("this is emp1", res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });
  console.log("EmpNotification", EmpNotification);

  const { data: EmpNotification2 } = useQuery({
    queryKey: ["ShiftData2", employeeId],
    queryFn: async () => {
      try {
        console.log("employeeIdsdsd", organisationId);
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/shiftApply/getForEmp2/${employeeId}/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("this is emp2", res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
    onSuccess: () => {
      queryClient.invalidateQueries("shift-request");
    },
  });

  console.log("EmpNotification2", EmpNotification2);

  const filteredEmployees = data2?.arrayOfEmployee?.filter((employee) =>
    `${employee?.first_name} ${employee?.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  console.log("filteredEmployees", filteredEmployees);

  // Mutation to update notification count
  const mutation = useMutation(
    ({ employeeId }) => {
      return axios.put(
        `${process.env.REACT_APP_API}/route/shift/update/notificationCount/${employeeId}`,
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
        // Refetch the punch notifications after updating notification count
        queryClient.invalidateQueries("shift-request");
      },
      onError: (error) => {
        console.error("Error updating notification count:", error);
      },
    }
  );

  const handleEmployeeClick = (employeeId) => {
    // Call the mutation to update the notification count
    setEmployeeId(employeeId);
    mutation.mutate({ employeeId });
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
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"test"}
                  placeholder={"Search Employee"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border-none bg-white w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress size={20} />
            </div>
          ) : (
            filterOrgData?.data?.shifts[0]?.arrayOfEmployee?.map(
              (employee, idx) =>
                employee !== null && (
                  <Link
                    onClick={() => handleEmployeeClick(employee?.employeeId)}
                    //to={`/organisation/${organisationId}/shift-notification/${employee?._id}`}
                    className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-blue-500 hover:text-white ${
                      employee?.employeeId === employeeId
                        ? "bg-blue-500  text-white"
                        : ""
                    }`}
                    key={idx}
                  >
                    <Avatar />
                    <div>
                      <h1 className="md:text-[1.2rem] text-sm">
                        {employee?.employeeName}
                      </h1>
                      <h1
                        className={`md:text-sm text-xs  ${
                          employee?._id === employeeId
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

        <article className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Shift Requests"}
              info={"Here manager can manage the shift requests"}
            />
          </div>
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress size={20} />
            </div>
          ) : employeeId ? (
            EmpNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Shift Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className=" px-4 mt-4 flex flex-col gap-8">
                  {!EmpNotification && !EmpNotification2 && (
                    <div className="flex px-4 w-full items-center my-4">
                      <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                        No Shift Request Found
                      </h1>
                    </div>
                  )}

                  {/* test */}

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
                            <div className="space-y-2">
                              {EmpNotification &&
                                EmpNotification?.requests
                                  ?.filter((item) =>
                                    tab.isArchive
                                      ? item?.status !== "Pending"
                                      : item?.status === "Pending"
                                  )
                                  ?.map((item, idx) => (
                                    <ShiftRejectModel
                                      items={item}
                                      isArchive={tab.isArchive}
                                    />
                                  ))}
                            </div>
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                  {/* test */}
                  {/* {EmpNotification &&
                    EmpNotification?.requests?.map((item, idx) => (
                      <div>
                        <ShiftRejectModel items={item} />
                      </div>
                    ))} */}
                  {isAcc &&
                    EmpNotification2?.newReq?.map((item, idx) => (
                      <div className="px-2">
                        <ShiftRejectModel key={idx} items={item} />
                      </div>
                    ))}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="md:text-lg text-sm w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
export default ShiftNotification;
