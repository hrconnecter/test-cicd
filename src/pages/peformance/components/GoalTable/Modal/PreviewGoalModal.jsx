import { Close } from "@mui/icons-material";
import { Avatar, Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { useQuery, useQueryClient } from "react-query";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import { TestContext } from "../../../../../State/Function/Main";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";
import PreviewSkeleton from "../Skelton/PreviewSkeleton";

const PreviewGoalModal = ({ open, handleClose, id, performance, assignee }) => {
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    maxHeight: "80vh",
    p: 4,
  };

  const GoalStatus = [
    { label: "Not Started", value: "Not Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    // { label: "Overdue", value: "Overdue" },
  ];

  // const sanitizedMeasurment = DOMPurify.sanitize(getGoal?.measurement);
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const queryClient = useQueryClient();

  let { data: getSingleGoal, isFetching: goalFetching } = useQuery({
    queryKey: ["getSingleGoal", id],
    refetchOnMount: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getSingleGoals/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
    enabled: !!id,
  });

  const sanitizedReview = DOMPurify.sanitize(getSingleGoal?.review);
  const sanitizedComments = DOMPurify.sanitize(getSingleGoal?.comments);
  const sanitizedmanagerMesurments = DOMPurify.sanitize(
    getSingleGoal?.measurments
  );
  const sanitizedDescription = DOMPurify.sanitize(getSingleGoal?.description);

  const SubmitGoal = async (goalStatus, fromButton = false) => {
    try {
      // const assignee = { label: user.name, value: user._id };

      let status = role !== "Employee" ? "Goal Approved" : "Goal Submitted";

      let requestData = { status };
      if (fromButton) {
        // requestData = { ...requestData, status };
      }
      if (goalStatus) {
        requestData = { ...requestData, goalStatus: goalStatus.value };
      }

      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${id}`,
        { data: requestData },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Goal submitted successfully");
      queryClient.invalidateQueries("getSingleGoal");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[70%] md:!w-[70%] shadow-md outline-none rounded-md"
        >
          {goalFetching ? (
            <PreviewSkeleton />
          ) : (
            <>
              <div className="flex justify-between py-4 items-center  px-4">
                <h1 id="modal-modal-title" className="text-2xl pl-2">
                  {getSingleGoal?.goal}
                </h1>
                <IconButton onClick={handleClose}>
                  <Close className="!text-[16px]" />
                </IconButton>
              </div>

              <div className="space-y-4 pb-4 px-4">
                <div className="flex justify-between">
                  <div className="flex w-full gap-2 items-center">
                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      Start Date: -{" "}
                      {getSingleGoal?.startDate &&
                        format(new Date(getSingleGoal?.startDate), "PP")}
                    </div>
                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      End Date : -{" "}
                      {getSingleGoal?.endDate &&
                        format(new Date(getSingleGoal?.endDate), "PP")}
                    </div>

                    {getSingleGoal?.empId?._id === user?._id &&
                      getSingleGoal.goalStatus !== "Pending" &&
                      getSingleGoal.goalStatus !== "Goal Rejected" && (
                        <div
                          className={` ${
                            getSingleGoal?.goalStatus === "In Progress"
                              ? "bg-blue-500 "
                              : getSingleGoal?.goalStatus === "Completed"
                              ? "bg-green-500"
                              : "bg-gray-50"
                          }  flex rounded-md px-2 border-gray-200 border-[.5px]  items-center`}
                        >
                          {/* <Icon className="text-gray-700" /> */}
                          <Select
                            aria-errormessage=""
                            placeholder={"Status"}
                            styles={{
                              singleValue: (styles) => ({
                                ...styles,
                                color:
                                  getSingleGoal?.goalStatus === "In Progress"
                                    ? "white" // Text color for "In Progress"
                                    : getSingleGoal?.goalStatus === "Completed"
                                    ? "white" // Text color for "Completed", adjust as needed
                                    : "black", // Default text color, adjust as needed
                              }),
                              control: (styles) => ({
                                ...styles,
                                borderWidth: "0px",
                                boxShadow: "none",
                                backgroundColor:
                                  getSingleGoal?.goalStatus === "In Progress"
                                    ? "#3b82f6" // Equivalent to bg-blue-500
                                    : getSingleGoal?.goalStatus === "Completed"
                                    ? "#10b981" // Equivalent to bg-green-500
                                    : "#f9fafb", // Equivalent to bg-gray-50
                              }),
                            }}
                            components={{
                              IndicatorSeparator: () => null,
                            }}
                            value={GoalStatus?.find(
                              (item) => item.label === getSingleGoal?.goalStatus
                            )}
                            className={` ${
                              getSingleGoal?.goalStatus === "In Progress"
                                ? "bg-blue-500 "
                                : getSingleGoal?.goalStatus === "Completed"
                                ? "bg-green-500"
                                : "bg-gray-50"
                            }   w-full !outline-none  px-2 !shadow-none !border-none !border-0`}
                            options={GoalStatus}
                            onChange={(value) => {
                              SubmitGoal(value);
                            }}
                          />
                        </div>
                      )}
                  </div>

                  {getSingleGoal?.creatorId === user?._id &&
                    getSingleGoal?.status === "Goal Created" && (
                      <div className="w-max">
                        <button
                          onClick={() => SubmitGoal(null, true)}
                          className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-6 py-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                        >
                          Submit Goal
                        </button>
                      </div>
                    )}
                </div>
                <div className="hover:bg-gray-100 rounded-md px-2">
                  <p className="font-semibold text-[#67748E]">Description</p>
                  <p
                    className="preview  "
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  ></p>
                </div>

                <div className="hover:bg-gray-100 rounded-md  px-2 ">
                  <p className="font-semibold text-[#67748E]">
                    Employee comments
                  </p>
                  <p
                    className="preview"
                    dangerouslySetInnerHTML={{
                      __html:
                        getSingleGoal?.isEmployeeMonitoring &&
                        sanitizedmanagerMesurments
                          ? sanitizedmanagerMesurments
                          : "No data",
                    }}
                  ></p>
                </div>
                <div className="hover:bg-gray-100 rounded-md  px-2 ">
                  <p className="font-semibold text-[#67748E]">
                    Manager Comments
                  </p>
                  <p
                    className="preview"
                    dangerouslySetInnerHTML={{
                      __html:
                        role !== "Employee" ||
                        performance?.stage ===
                          "KRA stage/Ratings Feedback/Manager review stage" ||
                        performance?.stage ===
                          "KRA stage/Ratings Feedback/Manager review stage"
                          ? sanitizedComments
                          : "No data",
                    }}
                  />
                </div>

                {getSingleGoal?.rating && (
                  <div className="hover:bg-gray-100 rounded-md px-2">
                    <p className="font-semibold text-[#67748E]">Ratings</p>
                    <p className="preview ">{getSingleGoal?.rating}</p>
                  </div>
                )}
                {getSingleGoal?.review && (
                  <div className="hover:bg-gray-100 rounded-md px-2">
                    <p className="font-semibold text-[#67748E]">Review</p>
                    <p
                      className="preview "
                      dangerouslySetInnerHTML={{
                        __html: sanitizedReview ? sanitizedReview : "No data",
                      }}
                    ></p>
                  </div>
                )}
                <div className=" rounded-md px-2">
                  <p className="font-semibold text-[#67748E]">Attachments</p>

                  {getSingleGoal?.managerAttachments &&
                    getSingleGoal.managerAttachments.length > 0 && (
                      <div className="flex items-center border  gap-2 bg-gray-50 rounded-md w-max p-2 px-4">
                        <FaFilePdf className="!text-2xl text-gray-600" />
                        <div>
                          <p className="font-semibold text-[#67748E]">
                            Manager Attachments
                          </p>
                          <div className="flex flex-col gap-2">
                            <Link
                              to={getSingleGoal.managerAttachments}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Attachment
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {role !== "Employee" && (
                  <div className="hover:bg-gray-100 rounded-md  px-2">
                    <p className="font-semibold text-[#67748E] mb-2">
                      Assigned to
                    </p>

                    <div className="flex w-max items-center gap-2">
                      <Avatar src={getSingleGoal?.empId?.user_logo_url} />
                      <p className="text-sm">
                        {getSingleGoal?.empId?.first_name}{" "}
                        {getSingleGoal?.empId?.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PreviewGoalModal;
