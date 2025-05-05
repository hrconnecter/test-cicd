import { Tab } from "@headlessui/react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../hooks/UserData/useUser";
import CloseSurveyList from "./components/CloseSurveyList";
import OpenSurveyList from "./components/OpenSurveyList";
import SaveAsDraft from "./components/SaveAsDraft";

const EmployeeSurvey = () => {
  // Hooks
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const param = useParams();
  const organisationId = param?.organisationId;
  const employeeId = param?.employeeId;

  // User Role Check
  const isAdminOrHR =
    user?.profile.includes("Super-Admin") || user?.profile.includes("HR");

  // Create new survey navigation
  const handleCreateNewSurvey = () => {
    navigate(`/organisation/${organisationId}/create-new-survey`);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // const tabArray = [
  //   {
  //     title: "Open Surveys",
  //     component: <OpenSurveyList />,
  //     disabled: false,
  //   },
  //   {
  //     title: "Closed Surveys",
  //     component: <CloseSurveyList />,
  //     disabled: !isAdminOrHR || role === "Employee",
  //   },
  //   {
  //     title: "Draft Surveys",
  //     component: <SaveAsDraft />,
  //     disabled: !isAdminOrHR || role === "Employee",
  //   },
  // ];
  const tabArray = [
    {
      title: "Open Surveys",
      component: <OpenSurveyList />,
      disabled: false,
    },
  ];

  if (isAdminOrHR && role !== "Employee") {
    tabArray.push(
      {
        title: "Closed Surveys",
        component: <CloseSurveyList />,
        disabled: false,
      },
      {
        title: "Draft Surveys",
        component: <SaveAsDraft />,
        disabled: false,
      }
    );
  }

  return (
    <BoxComponent>
      <div className="flex items-center justify-between w-full">
        <HeadingOneLineInfo
          heading="Employee Survey"
          info={
            employeeId === undefined && isAdminOrHR && role !== "Employee"
              ? "Here you can create employee survey"
              : "Here you can fill employee survey"
          }
        />
        {employeeId === undefined && isAdminOrHR && role !== "Employee" && (
          <BasicButton
            title={"Create New Survey"}
            onClick={handleCreateNewSurvey}
          />
        )}
      </div>

      <div className="min-h-[85vh] bg-gray-50">
        <Tab.Group>
          <Tab.List className="mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
            {tabArray.map((tab, index) => (
              <Tab
                key={index}
                disabled={tab.disabled}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
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
              <Tab.Panel key={index}>{tab.component}</Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </BoxComponent>
  );
};

export default EmployeeSurvey;
