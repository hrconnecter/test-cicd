import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccessTimeFilled,
  CalendarToday,
  CancelRounded,
  CheckCircleOutline,
  ErrorOutline,
  LocationOn,
} from "@mui/icons-material";
import { Avatar, Chip, CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import AuthInputField from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import { TestContext } from "../../../State/Function/Main";
import useCardQuery from "../../My-Training/components/card-training/useQuery";
import MiniForm from "../../My-Training/components/mini-form";
import CompleteTrainingMiniForm from "../Employee/CompleteTrainingForm";
import Comment from "./Components/Comment";
import useGetTraining from "./hooks/useGetTraining";

const AdminTrainingView = () => {
  const { id, organisationId } = useParams("");
  const { data, isLoading } = useGetTraining(id);
  console.log("data in admintraining", data);
  const [open, setOpen] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const queryClient = useQueryClient();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const { mutate } = useCardQuery({
    trainingId: id,
    setOpenForAssign: setOpen,
  });

  const user = UserProfile();
  const empId = user.getCurrentUser();
  const getReport = data?.data?.TrainingReport?.find(
    (report) => report?.empId === empId?._id
  );

  const trainingStartDate = new Date(data?.data.trainingStartDate);

  const reportSchema = z.object({
    reportReason: z.string().min(1, "Reason is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportReason: "",
    },
  });

  const reportMutation = useMutation(
    async (data) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/training/${id}/report`,
        data,
        { headers: { Authorization: authToken } }
      );
      return response;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Report submitted successfully");
        setReportOpen(false);
        reset();
      },
      onError: (error) => {
        handleAlert(true, "error", error.message || "Failed to submit report");
      },
    }
  );

  const onSubmitReport = (data) => {
    reportMutation.mutate({ reportReason: data.reportReason });
  };

  const startTrainingMutation = useMutation(
    async () => {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/training/start-training/${id}/${empId?._id}`,
        {},
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Training started successfully!");
        setOpenStart(false);
        queryClient.invalidateQueries("getTrainingDetails");
      },
      onError: (error) => {
        handleAlert(true, "error", error.message || "Failed to start training");
      },
    }
  );

  const handleStartTraining = () => {
    startTrainingMutation.mutate();
  };

  if (isLoading) {
    return (
      <BoxComponent>
        <CircularProgress />
      </BoxComponent>
    );
  }

  return (
    <BoxComponent>
      <div className="flex md:items-start items-center py-4 gap-4 justify-between">
        <article className="md:w-[70%]  w-full ">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {data?.data?.trainingName}
          </h1>

          <div className="flex flex-wrap md:w-full container items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex flex-wrap items-center text-sm text-gray-500 ">
              <span className="flex items-center mr-4">
                <CalendarToday className="w-3 h-3 text-gray-500 mr-1" />
                {data?.data?.isPermanent
                  ? "On-demand"
                  : `   ${moment(data?.data?.trainingStartDate).format("LL")}
                              -
                              ${moment(data?.data?.trainingEndDate).format(
                                "LL"
                              )}`}
              </span>
              <div className="flex items-center gap-2 mr-2">
                <h1>Duration :</h1>
                <p>
                  {data?.data?.trainingDuration}{" "}
                  {data?.data?.trainingDurationTime}
                </p>
              </div>
              <span className="flex items-center mr-4">
                <LocationOn className="w-3 h-3 text-gray-500 mr-1" />
                {data?.data?.trainingLocation?.address}
              </span>
              <Chip label={`Points ${data?.data.trainingPoints}`} />
            </div>

            <div className="flex items-center gap-4">
              {getReport?.status === "pending" ? (
                <p className="text-blue-500 space-x-2 font-bold">
                  <ErrorOutline />
                  Report sent
                </p>
              ) : getReport?.status === "approved" ? (
                <p className="text-green-500 space-x-2 font-bold">
                  <CheckCircleOutline />
                  Report request Approved
                </p>
              ) : getReport?.status === "rejected" ? (
                <p className="text-red-500 space-x-2 font-bold">
                  <CancelRounded />
                  Report request rejected
                </p>
              ) : (
                <BasicButton
                  title={"Report Training"}
                  color={"danger"}
                  onClick={() => setReportOpen(true)}
                />
              )}

              {data?.employeeTraining?.status === "started" ||
              data?.employeeTraining?.status === "pending" ? (
                <>
                  {data?.employeeTraining === null && (
                    <BasicButton
                      title={"Enroll Now"}
                      onClick={() => setOpen(true)}
                    />
                  )}
                  {data?.employeeTraining?.status === "pending" && (
                    <BasicButton
                      title={"Start Training"}
                      onClick={() => setOpenStart(true)}
                    />
                  )}
                  {data?.employeeTraining?.status === "started" && (
                    <CompleteTrainingMiniForm
                      doc={data?.data}
                      status={data?.employeeTraining?.status}
                    />
                  )}
                </>
              ) : (
                <>
                  {!data?.data?.isPermanent &&
                  moment().isBefore(trainingStartDate) ? (
                    <></>
                  ) : data?.employeeTraining?.status === "rejected" ||
                    data?.employeeTraining?.status === "pending" ||
                    data?.employeeTraining?.status === "started" ? (
                    <CompleteTrainingMiniForm
                      doc={data?.data}
                      status={data?.employeeTraining?.status}
                    />
                  ) : data?.employeeTraining?.status === "ratingPending" ? (
                    <p className="text-yellow-500  space-x-2 font-semibold">
                      <AccessTimeFilled />
                      Approval Pending
                    </p>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>

          <div className="py-2">
            {data?.employeeTraining?.status === "pending" &&
              (moment().isAfter(trainingStartDate) ||
                data?.data?.isPermanent) && (
                <BasicButton
                  component="link"
                  to={data?.data?.trainingLink}
                  // onClick={() => {
                  //   window.location.href = data?.data?.trainingLink;
                  // }}
                  title={"Join Room Meeting"}
                />
              )}
          </div>

          <div className="bg-white my-3 ">
            <img
              src={data?.data?.trainingLogo}
              alt="none"
              className="border p-4 rounded-lg w-full  h-[300px] object-cover "
            />
          </div>

          <div className=" md:hidden flex items-center space-x-4 mb-4">
            <Avatar src={data?.data?.trainingCreator?.user_logo_url} />
            <div>
              <p className=" leading-tight font-semibold text-gray-900 text-lg">
                {data?.data.trainingCreator.first_name}{" "}
                {data?.data.trainingCreator.last_name}
              </p>
              <p className=" text-gray-500">
                {data?.data.trainingCreator.email}
              </p>
            </div>
          </div>

          <div
            className="preview"
            dangerouslySetInnerHTML={{
              __html: data?.data?.trainingDescription,
            }}
          />

          <div className="my-4 space-y-4">
            <Divider />
            <h1 className="text-gray-700 tracking-tighter text-2xl font-bold">
              Comments{" "}
            </h1>

            {data?.comments?.length <= 0 ? (
              <p className="text-gray-500">No comments yet</p>
            ) : (
              data?.comments?.map((comment) => <Comment comment={comment} />)
            )}
          </div>
        </article>

        <article className="w-[30%] h-max space-y-4 hidden md:block ">
          <div className="bg-white p-4  rounded-lg shadow-sm ">
            <h1 className="!font-sans mb-4 font-semibold text-gray-700 text-xl">
              Created By
            </h1>
            <div className="flex gap-4 ">
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={data?.data?.trainingCreator?.user_logo_url}
              />
              <div>
                <h1 className="!font-sans font-semibold text-gray-700 text-lg">
                  {data?.data.trainingCreator.first_name}{" "}
                  {data?.data.trainingCreator.last_name}
                </h1>
                <p className=" text-gray-500">
                  {data?.data.trainingCreator.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4  rounded-lg shadow-sm mb-4">
            <h1 className="!font-sans font-semibold mb-8 text-gray-700 text-xl">
              More Trainings By {data?.data.trainingCreator.first_name}
            </h1>

            <div className="space-y-4">
              {data?.moreTrainings.length === 0 ? (
                <p className="text-gray-500">No trainings</p>
              ) : (
                data?.moreTrainings.map((training) => (
                  <Link
                    to={`/organisation/${organisationId}/training/${training?._id}`}
                    className="flex items-center gap-4  hover:bg-white  rounded-lg transition-all"
                  >
                    <Avatar
                      src={training?.trainingLogo}
                      alt=""
                      variant="rounded"
                      sx={{ height: 60, width: 60 }}
                    />
                    <div>
                      <h1 className="text-lg !font-sans font-semibold line-clamp-1">
                        {training?.trainingName}
                      </h1>
                      <p className="font-sans text-sm text-gray-500">
                        {moment(training?.trainingStartDate).format("LL")} -{" "}
                        {moment(training?.trainingEndDate).format("LL")}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </article>
      </div>

      <ReusableModal
        heading={"Report Training"}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmitReport)} className="space-y-4">
          <AuthInputField
            name="reportReason"
            control={control}
            label="Reason"
            type="textarea"
            placeholder="Enter reason..."
            rows={4}
            error={errors.reportReason}
            errors={errors}
          />
          <div className="flex justify-end space-x-2">
            <BasicButton
              title={"Cancel"}
              type="button"
              color={"danger"}
              variant="outlined"
              onClick={() => setReportOpen(false)}
            />

            <BasicButton title={"Submit"} type="submit" />
            {/* Submit
            </button> */}
          </div>
        </form>
      </ReusableModal>

      <ReusableModal
        heading={"Schedule Training"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <MiniForm {...{ mutate }} />
      </ReusableModal>
      <ReusableModal
        heading={"Start Training"}
        open={openStart}
        onClose={() => setOpenStart(false)}
      >
        <p>Are you sure you want to start the training?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={() => setOpenStart(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleStartTraining}
          >
            Start
          </button>
        </div>
      </ReusableModal>
    </BoxComponent>
  );
};

export default AdminTrainingView;
