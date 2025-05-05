import React from "react";
import { Link } from "react-router-dom";
import BasicButton from "../../../../components/BasicButton";

const UpcomingTrainingCard = () => {
  return (
    <>
      <header>
        <h1 className="text-xl font-bold mb-4 text-gray-700 !font-sans">
          Upcoming Trainings
        </h1>
      </header>
      <div className="grid grid-cols-4">
        <div className="relative flex w-max bg-white rounded-lg shadow-md border overflow-hidden group">
          <div className="relative">
            <img
              src={
                "https://cdn.dribbble.com/userupload/16994646/file/original-6b40b7984eff89d7f12d50ef3af5a272.png?crop=33x13-4011x2996&format=webp&resize=320x240&vertical=center"
              }
              alt="Course cover"
              className="object-cover w-[300px] "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50  flex flex-col items-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-14">
              <div className="container mx-auto p-4">
                <div className="space-y-3">
                  <h2 className="line-clamp-2 text-white !font-sans text-lg font-bold ">
                    The test training api
                  </h2>

                  <div className="flex items-center text-sm text-gray-100">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>24 june,2021 - 24 june,2021</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex bg-blue-100  text-xs px-3 py-1 rounded-full font-semibold">
                      <svg
                        className="w-4 h-4 mr-1 text-[#1414fe]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[#1414fe]">Location</span>
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between">
                    <Link
                    // to={`/organisation/${doc?.trainingOrganizationId}/training/check-status/${doc._id}`}
                    >
                      <BasicButton
                        className={
                          "!bg-white hover:!bg-gray-700 hover:!text-white  !border !text-gray-900 "
                        }
                        title={"Check Status"}
                      />
                    </Link>

                    <Link
                    // to={`/organisation/${doc?.trainingOrganizationId}/training/${doc._id}`}
                    >
                      <BasicButton
                        className={"!bg-gray-700 hover:!bg-gray-600 "}
                        title={"View Training"}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="px-6 py-3 border-t w-max min-w-[50%]">
            <div className="space-y-3">
              <h2 className="line-clamp-2 !font-sans text-lg font-bold text-gray-700">
                The test training api
              </h2>

              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>24 june,2021 - 24 june,2021</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex bg-blue-100  text-xs px-3 py-1 rounded-full font-semibold">
                  <svg
                    className="w-4 h-4 mr-1 text-[#1414fe]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-[#1414fe]">Location</span>
                </span>
              </div>

              <div className="w-full flex items-center justify-between">
                <Link
                // to={`/organisation/${doc?.trainingOrganizationId}/training/check-status/${doc._id}`}
                >
                  <BasicButton
                    className={
                      "!bg-white hover:!bg-gray-700 hover:!text-white  !border !text-gray-900 "
                    }
                    title={"Check Status"}
                  />
                </Link>

                <Link
                // to={`/organisation/${doc?.trainingOrganizationId}/training/${doc._id}`}
                >
                  <BasicButton
                    className={"!bg-gray-700 hover:!bg-gray-600 "}
                    title={"View Training"}
                  />
                </Link>
              </div>
            </div>
          </div> */}
        </div>

        <div className="relative flex w-max bg-white rounded-lg shadow-md border overflow-hidden group">
          <div className="relative">
            <img
              src={
                "https://cdn.dribbble.com/userupload/16994646/file/original-6b40b7984eff89d7f12d50ef3af5a272.png?crop=33x13-4011x2996&format=webp&resize=320x240&vertical=center"
              }
              alt="Course cover"
              className="object-cover w-[300px] "
            />
            <div className="absolute inset-0 bg-black bg-opacity-50  flex flex-col items-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-14">
              <div className="container mx-auto p-4">
                <div className="space-y-3">
                  <h2 className="line-clamp-2 text-white !font-sans text-lg font-bold ">
                    The test training api
                  </h2>

                  <div className="flex items-center text-sm text-gray-100">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>24 june,2021 - 24 june,2021</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex bg-blue-100  text-xs px-3 py-1 rounded-full font-semibold">
                      <svg
                        className="w-4 h-4 mr-1 text-[#1414fe]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[#1414fe]">Location</span>
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between">
                    <Link
                    // to={`/organisation/${doc?.trainingOrganizationId}/training/check-status/${doc._id}`}
                    >
                      <BasicButton
                        className={
                          "!bg-white hover:!bg-gray-700 hover:!text-white  !border !text-gray-900 "
                        }
                        title={"Check Status"}
                      />
                    </Link>

                    <Link
                    // to={`/organisation/${doc?.trainingOrganizationId}/training/${doc._id}`}
                    >
                      <BasicButton
                        className={"!bg-gray-700 hover:!bg-gray-600 "}
                        title={"View Training"}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white border shadow-lg rounded-lg"></div> */}
    </>
  );
};

export default UpcomingTrainingCard;
