import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarToday, Group, Report, Search } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { PiWarningCircleFill } from "react-icons/pi";
import { RiAlarmWarningFill } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { z } from "zod";
import BasicButton from "../../../../components/BasicButton";
import BoxComponent from "../../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import useAuthToken from "../../../../hooks/Token/useAuth";
import useGetStatus from "../hooks/useGetStatus";
import TrainingDetailCard from "./Card";
import TrainingStatusTable from "./TrainingStatusTable";

const TrainingStatus = () => {
  const { id } = useParams("");
  const [search, setSearch] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false); // Add state for report modal
  const [selectedReport, setSelectedReport] = useState(null);
  const authToken = useAuthToken();
  const { traningStatus, trainingDetails, isLoading, trainingLoading } =
    useGetStatus(id, search, page, statusFilter);

  const { data: reportData, isLoading: reportLoading } = useQuery(
    ["trainingReport", id],
    () =>
      axios
        .get(`${process.env.REACT_APP_API}/route/training/${id}/report`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => res.data),
    {
      enabled: reportModalOpen,
    }
  );

  const queryClient = useQueryClient();

  const updateReportStatus = useMutation(
    ({ reportId, status, reason }) =>
      axios.patch(
        `${process.env.REACT_APP_API}/route/training/${id}/report/${reportId}/status`,
        { status, approverReason: reason },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trainingReport", id]);
      },
    }
  );

  const schema = z.object({
    reason: z.string().min(1, "Reason is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    updateReportStatus.mutate({
      reportId: selectedReport.id,
      status: selectedReport.status,
      reason: data.reason,
    });
    setSelectedReport(null);
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <BoxComponent>
      {trainingLoading ? (
        <div className="animate-pulse">
          <div className="mt-6 flex gap-4 mb-4">
            <div className="rounded-lg h-[100px] w-[100px] bg-gray-200"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex gap-4 items-center">
                <div className="flex bg-gray-200 text-xs px-3 py-1 rounded-full font-semibold h-6 w-1/2"></div>
                <div className="flex bg-gray-200 text-xs px-3 py-1 rounded-full font-semibold h-6 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 flex gap-4 mb-4">
            <img
              src={trainingDetails?.Training?.trainingLogo}
              alt="none"
              className="rounded-lg h-[100px]"
            />
            <div>
              <HeadingOneLineInfo
                heading={trainingDetails?.Training?.trainingName}
              />
              <div className="flex gap-4 items-center">
                <span className="flex bg-blue-100 text-xs px-3 py-1 rounded-full font-semibold">
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
                  <span className="text-[#1414fe]">
                    {trainingDetails?.Training?.trainingLocation?.address}
                  </span>
                </span>
                <span className="flex bg-white text-xs px-3 py-1 rounded-full font-semibold">
                  <CalendarToday className="!h-4 !text-sm text-gray-500 mr-1" />
                  <span>
                    {traningStatus?.status?.isPermanent && "On Demanad"}
                    {trainingDetails?.Training?.trainingStartDate &&
                      format(
                        new Date(trainingDetails?.Training?.trainingStartDate),
                        "PP"
                      )}{" "}
                    {traningStatus?.status?.isPermanent && "-"}{" "}
                    {trainingDetails?.Training?.trainingStartDate &&
                      format(
                        new Date(trainingDetails?.Training?.trainingEndDate),
                        "PP"
                      )}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div>
            <aside>
              <div className="flex flex-wrap mb-4 gap-4">
                <TrainingDetailCard
                  title={"Attendees"}
                  icon={Group}
                  desc={trainingDetails?.totalResults}
                  className={"bg-blue-100 text-blue-500"}
                />
                <TrainingDetailCard
                  title={"Completed"}
                  icon={FaCheck}
                  desc={trainingDetails?.completedCount}
                  className={"bg-green-100 text-green-500"}
                />
                <TrainingDetailCard
                  title={"Pending"}
                  desc={trainingDetails?.pendingCount}
                  icon={PiWarningCircleFill}
                  className={"bg-yellow-100 text-yellow-500"}
                />
                <TrainingDetailCard
                  title={"Overdue"}
                  icon={RiAlarmWarningFill}
                  desc={trainingDetails?.overDueCount}
                  className={"bg-red-100 text-red-500"}
                />
              </div>
              <div className="w-full flex gap-4 mb-4">
                <div className="flex justify-between w-full items-center">
                  <div
                    className={`space-y-1 min-w-[300px] md:min-w-[40vw] w-max`}
                  >
                    <div
                      onFocus={() => setFocusedInput("search")}
                      onBlur={() => setFocusedInput(null)}
                      className={`${
                        focusedInput === "search"
                          ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                          : "outline-none border-gray-200 border-[.5px]"
                      } flex rounded-md items-center px-2 bg-white py-3 md:py-[6px]`}
                    >
                      <Search className="text-gray-700 md:text-lg !text-[1em]" />
                      <input
                        type={"text"}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={"Search Employees"}
                        className={`border-none bg-white w-full outline-none px-2`}
                        formNoValidate
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="min-w-[200px]">
                      <Select
                        options={statusOptions}
                        onChange={(selectedOption) =>
                          setStatusFilter(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        placeholder="Filter by Status"
                        isClearable
                      />
                    </div>
                    <BasicButton
                      onClick={async () => {
                        setReportModalOpen(true); // Open the report modal
                      }}
                      color={"danger"}
                      variant={"ghost"}
                      icon={Report}
                      title="Reported Trainings"
                      size="large"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
      <TrainingStatusTable
        traningStatus={traningStatus?.status}
        totalResults={traningStatus?.totalResults}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={traningStatus?.totalPages}
        currentPage={traningStatus?.currentPage}
      />
      <ReusableModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        heading="Reported Trainings"
      >
        {reportLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {reportData?.report?.map((report) => (
              <div
                key={report.id}
                className={`p-5 ${
                  selectedReport?.id === report._id &&
                  "bg-gray-50 border rounded-lg"
                }`}
              >
                <div className={`flex justify-between p-`}>
                  <div className="flex gap-2">
                    <Avatar src={report?.empId?.user_logo_url} />
                    <div>
                      <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-gray-600">
                          {report?.empId?.first_name} {report?.empId?.last_name}
                        </h1>
                        <p className="text-xs text-gray-500">
                          {format(new Date(), "PP")}
                        </p>
                      </div>
                      <p className="text-gray-700">{report.reportReason}</p>
                    </div>
                  </div>
                  {report?.status === "pending" ? (
                    <div className="flex items-center justify-end gap-3">
                      {selectedReport?.id !== report._id ? (
                        <>
                          <BasicButton
                            variant="ghost"
                            color="danger"
                            size={"small"}
                            onClick={() => {
                              setSelectedReport({
                                id: report._id,
                                status: "rejected",
                                empName: `${report?.empId?.first_name} ${report?.empId?.last_name}`,
                              });
                            }}
                            title={"Reject"}
                          />
                          <BasicButton
                            title={"Accept"}
                            size={"small"}
                            onClick={() => {
                              setSelectedReport({
                                id: report._id,
                                status: "approved",
                                empName: `${report?.empId?.first_name} ${report?.empId?.last_name}`,
                              });
                            }}
                          />
                        </>
                      ) : (
                        <span className="text-sm text-blue-500">
                          Add Reason
                        </span>
                      )}
                    </div>
                  ) : (
                    <h1
                      className={`capitalize font-semibold ${
                        report.status === "approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {report?.status}
                    </h1>
                  )}
                </div>
                {selectedReport?.id === report._id && (
                  <div className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <AuthInputFiled
                        label="Enter Reason *"
                        type={"textarea"}
                        name="reason"
                        control={control}
                        placeholder={"Reason"}
                        error={errors.reason}
                        errors={errors}
                      />
                      <div className="flex justify-end gap-3 mt-2">
                        <BasicButton
                          variant="ghost"
                          color="danger"
                          size={"small"}
                          onClick={() => setSelectedReport(null)}
                          title={"Cancel"}
                        />
                        <BasicButton
                          title={"Submit"}
                          size={"small"}
                          type="submit"
                        />
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ReusableModal>
    </BoxComponent>
  );
};

export default TrainingStatus;
