import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Settings } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import CreteLeaveTypeModal from "../../../components/Modal/LeaveTypeModal/create-leve-type-modal";
import ReusableModal from "../../../components/Modal/component";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import Setup from "../Setup";
import LeaveTypeEditBox from "./components/leave-type-layoutbox";
import SkeletonForLeaveTypes from "./components/skeleton-for-leavetype";
import useCreateLeaveSetting from "./hook/useCreateLeaveSetting";
import useGetLeaveSetting from "./hook/useGetLeaveSetting";
import { ErrorMessage } from "@hookform/error-message";

const LeaveTypes = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const { organisationId } = useParams();
  const { data: subscription } = useSubscriptionGet({
    organisationId: organisationId,
  });

  const { leaveSetting, isFetching } = useGetLeaveSetting(openSettingsModal);

  const { data, isLoading } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        { organisationId: params.organisationId },
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );

  const SettingsSchema = z.object({
    isCompOff: z.boolean(),
    isBiometric: z.boolean(),
    isHalfDay: z.boolean(),
    isQRGenerate: z.boolean().optional(),
    isEncashment: z.boolean(),
    isHRJustify: z.boolean(),
    isPublicHoliday: z.boolean(),
    isForward: z.boolean(),
    biometricMachine: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional(),
    ...data?.reduce((acc, ele) => {
      acc[ele.leaveName] = z
        .string()
        .refine(
          (val) =>
            watch("isEncashment") ||
            (val !== "" &&
              !isNaN(val) &&
              Number(val) >= 0 &&
              Number(val) <= ele.count),
          {
            message: `Count must be a number between 0 and ${ele.count}`,
          }
        )
        .optional();
      return acc;
    }, {}),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isLoading: loading },
  } = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      isCompOff: false,
      isBiometric: false,
      isHalfDay: false,
      isPublicHoliday: false,
      isHRJustify: false,
      isEncashment: false,
      isForward: false,
      biometricMachine: {},
    },
  });

  useEffect(() => {
    if (leaveSetting) {
      setValue("isCompOff", leaveSetting?.data?.isCompOff ?? false);
      setValue("isBiometric", leaveSetting?.data?.isBiometric ?? false);
      setValue("isHalfDay", leaveSetting?.data?.isHalfDay ?? false);
      setValue("isPublicHoliday", leaveSetting?.data?.isPublicHoliday ?? false);
      setValue("isHRJustify", leaveSetting?.data?.isHRJustify ?? false);
      setValue("isEncashment", leaveSetting?.data?.isEncashment ?? false);
      setValue("isForward", leaveSetting?.data?.isForward ?? false);
      setValue("isQRGenerate", leaveSetting?.data?.isQRGenerate);
      setValue(
        "biometricMachine",
        {
          label: leaveSetting?.data?.biometricMachine,
          value: leaveSetting?.data?.biometricMachine,
        } ?? {}
      );
      leaveSetting?.data?.MaxCount.forEach((ele) => {
        setValue(ele.leaveName, ele?.count?.toString());
      });
    } else if (data) {
      data.forEach((ele) => {
        setValue(ele.leaveName, ele?.count?.toString());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettingsModal, isFetching, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watch("isEncashment") === true) {
        setValue("isForward", false);
      }
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("isEncashment")]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (watch("isForward") === true) {
        setValue("isEncashment", false);
      }
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("isForward")]);


  const handleCreateLeave = () => {
    setConfirmOpen(true);
  };

  const { handleCompOff } = useCreateLeaveSetting(setOpenSettingsModal);

  const onSubmit = async (data) => {
    const encashmentData = Object.keys(data)
      .filter(
        (key) =>
          ![
            "isHalfDay",
            "isForward",
            "isBiometric",
            "isEncashment",
            "isCompOff",
            "isPublicHoliday",
            "biometricMachine",
            "isQRGenerate",
            "isHRJustify",
          ].includes(key) &&
          data[key] !== undefined &&
          !isNaN(data[key])
      )
      .map((key) => ({ leaveName: key, count: Number(data[key]) }));

    const updatedData = {
      isHalfDay: data.isHalfDay,
      isForward: data.isForward,
      isBiometric: data.isBiometric,
      biometricMachine: data?.biometricMachine?.value,
      isEncashment: data.isEncashment,
      isCompOff: data.isCompOff,
      isPublicHoliday: data.isPublicHoliday,
      isHRJustify: data.isHRJustify,
      isQRGenerate: data.isQRGenerate,
      MaxCount: encashmentData,
    };

    await handleCompOff(updatedData);
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Leaves"
              info="Create multiple types of leaves which will applicable to all
              employees."
            />
            <div className="flex gap-4">
              <button
                className="text-[#1414fe] hover:underline-[#1414fe] bg-transparent border-none outline-none "
                onClick={() => setOpenSettingsModal(true)}
              >
                <Settings /> Settings
              </button>
              <BasicButton title="Add Leave" onClick={handleCreateLeave} />
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className=" xs:mt-3 sm:mt-3 md:mt-0">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold">
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Sr. No
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Leave Name
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Color
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Count
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap !text-left pl-8 py-3"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonForLeaveTypes />
                  ) : (
                    <>
                      {
                        data?.map((leaveType, index) => (
                          <LeaveTypeEditBox
                            key={leaveType._id}
                            leaveType={leaveType}
                            index={index}
                          />
                        ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Add Leave </h1>
              </article>
              <p>No leave found. Please add types of leave</p>
            </section>
          )}
        </div>
      </Setup>
      <CreteLeaveTypeModal
        open={confirmOpen}
        handleClose={() => {
          setConfirmOpen(false);
        }}
      />
      <ReusableModal
        heading="Settings"
        open={openSettingsModal}
        onClose={() => setOpenSettingsModal(false)}
      >
        {isFetching ? (
            <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <AuthInputFiled
              name="isCompOff"
              descriptionText={
                "This option helps to manage comp off leave which can use to compensate the leaves taken by the employees."
              }
              control={control}
              type="switch"
              label="Comp Off"
              errors={errors}
            />

            {subscription?.organisation?.packageInfo !== "Essential Plan" && (
              <AuthInputFiled
                name="isBiometric"
                control={control}
                descriptionText={"Enable biometric machine for attendance."}
                type="switch"
                label="Biometric Machine"
                errors={errors}
              />
            )}
            {(watch("isBiometric") && subscription?.organisation?.packageInfo !== "Essential Plan") && (
              <>
                <AuthInputFiled
                  name="isHRJustify"
                  control={control}
                  descriptionText={
                    "Allow HR to add justification for the employees in attendance."
                  }
                  type="switch"
                  label="HR Justification"
                  errors={errors}
                />
                <div className="my-2 px-1">
                  <AuthInputFiled
                    name="biometricMachine"
                    control={control}
                    descriptionText={"Select the type of biometric machine."}
                    type="select"
                    label="Select Biometric Machine"
                    options={[
                      { label: "ESSL", value: "ESSL" },
                      { label: "Zktecho", value: "Zktecho" },
                    ]}
                    errors={errors}
                  />
                </div>
              </>
            )}
            <AuthInputFiled
              name="isPublicHoliday"
              control={control}
              descriptionText={
                "User need to apply public holiday to get public holiday benefits."
              }
              type="switch"
              label="Public Holiday"
              errors={errors}
            />
            <AuthInputFiled
              name="isHalfDay"
              control={control}
              type="switch"
              descriptionText={
                "An option for half-day leave will be included in the attendance."
              }
              label="Half Day Leaves"
              errors={errors}
            />
            {subscription?.organisation?.packageInfo === "Enterprise Plan" &&
            subscription?.organisation?.packages?.includes(
              "QR Code Attendance"
            ) ? (
              <AuthInputFiled
                name="isQRGenerate"
                control={control}
                type="switch"
                descriptionText={"An option for generate QR"}
                label="QR Generate"
                errors={errors}
              />
            ) : null}
            <AuthInputFiled
              name="isEncashment"
              control={control}
              type="switch"
              label="Leave Encashment"
              descriptionText={
                "Add remaining leaves to the salary in employee account."
              }
              errors={errors}
            />

            {watch("isEncashment") && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Leave Encashment Settings
                </h3>
                <table className="min-w-full bg-white text-left !text-sm font-light border border-gray-300">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-2 border-r border-gray-300"
                      >
                        Leave Name
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-2"
                      >
                        Max Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((leaveType, index) => (
                      <tr
                        key={index}
                        className="border-b dark:border-neutral-500"
                      >
                        <td className="whitespace-nowrap pl-8 py-2 border-r border-gray-300">
                          {leaveType.leaveName}
                        </td>
                        <td className="whitespace-nowrap pl-8 bg-gray-50 py-2">
                          <Controller
                            control={control}
                            name={leaveType.leaveName}
                            render={({ field }) => (
                              <input
                                type="number"
                                placeholder="Enter max count"
                                className="outline-none border p-1 rounded-lg"
                                {...field}
                              />
                            )}
                          />
                          <ErrorMessage
                            errors={errors}
                            name={leaveType.leaveName}
                            render={({ message }) => (
                              <p className="text-sm w-max text-red-500">
                                {message}
                              </p>
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <AuthInputFiled
              name="isForward"
              control={control}
              type="switch"
              label="Carry Forward"
              descriptionText={
                "The remaining leave balance of the current year will be added to the leave balance for the next year."
              }
              errors={errors}
            />
            <div className="flex justify-end my-2 gap-2">
              <BasicButton
                title="Cancel"
                color="error"
                variant="outlined"
                onClick={() => setOpenSettingsModal(false)}
                type="button"
              />
              <BasicButton title="Save" disabled={loading} type="submit" />
            </div>
          </form>
        )}
      </ReusableModal>
      {/* <ReusableModal
        heading={`${
          !org?.organisation?.isCompOff ? "Enable " : "Disable "
        } comp off leave`}
        open={openModal}
        onClose={onClose}
      ></ReusableModal>
        <div className="flex justify-end w-full gap-4">
          <BasicButton
            title="Cancel"
            onClick={onClose}
            variant="outlined"
            color={"danger"}
          />
          <BasicButton title="Submit" onClick={handleCompOff} />
        </div>
      </ReusableModal> */}
    </BoxComponent>
  );
};

export default LeaveTypes;
