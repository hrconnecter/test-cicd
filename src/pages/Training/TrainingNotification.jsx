import { Tab } from "@headlessui/react";
import { Info, Search } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useState } from "react";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import TrainingViewNotification from "./TrainingViewNotification";

const TrainingNotification = ({ filterOrgId, filterOrgData, isLoading }) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabArray = [
    {
      title: "Training Requests",

      isArchive: false,
      disabled: false,
    },
    {
      title: "Archived",

      isArchive: true,
      disabled: false,
    },
  ];

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Function to select employee
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Extract employees from filterOrgData
  const employees = filterOrgData?.data?.training[0]?.arrayOfEmployee || [];

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee?.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-[90vh] flex">
      <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
        <div className="p-2 my-2 !py-2">
          <div className="space-y-2">
            <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
              <Search className="text-gray-700 md:text-lg !text-[1em]" />
              <input
                type="text"
                placeholder="Search Employee"
                className="border-none bg-white w-full outline-none px-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {filteredEmployees.length > 0 ? (
          <div>
            {filteredEmployees.map((employee) => (
              <div
                className={` cursor-pointer px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
                  selectedEmployee?.employeeEmail === employee?.employeeEmail &&
                  "!bg-blue-500 !text-white hover:!bg-blue-300"
                }`}
                key={employee?.employeeId}
                onClick={() => handleEmployeeClick(employee)}
              >
                <Avatar />
                <div>
                  <h1 className="text-[1.2rem]">{employee?.employeeName}</h1>
                  <h1
                    className={`${
                      selectedEmployee?.employeeEmail ===
                        employee?.employeeEmail && "text-white"
                    } text-sm text-gray-500`}
                  >
                    {employee?.employeeEmail}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 px-4">No employees found.</p>
        )}
      </article>
      <div className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
        <div className="px-4 pt-2">
          <HeadingOneLineInfo
            heading="Employee Training  Requests"
            info="Here you would be able to approve or reject the training notifications"
          />
        </div>
        {selectedEmployee ? (
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
                      <div className="px-2">
                        <TrainingViewNotification
                          employee={selectedEmployee?.trainingDetails}
                          isArchive={tab.isArchive}
                        />
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </>
        ) : (
          <div className="flex px-4 w-full items-center my-4">
            <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
              <Info /> Select employee to see their requests
            </h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainingNotification;
