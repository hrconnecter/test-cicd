import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarMonthOutlined,
  CalendarTodayOutlined,
  CalendarViewDayOutlined,
  CategoryOutlined,
  LocationOnOutlined,
  MeetingRoomOutlined,
  PowerInputOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../../components/InputFileds/AuthInputFiled";
import useTrainingStore from "../zustand-store";

let center = {
  lat: 0,
  lng: 0,
};

const Step2 = ({ nextStep, departments, orgTrainingType }) => {
  const departmentOptions = departments?.map((department) => ({
    label: department.departmentName,
    value: department._id,
  }));
  const {
    trainingType,
    trainingStartDate,
    trainingLocation,
    trainingLink,
    trainingEndDate,
    trainingPoints,
    trainingDuration,
    trainingDownCasted,
    setStep2,
    isDepartmentalTraining,
    trainingDepartment,
    proofSubmissionRequired,
    isPermanent,
    trainingDurationTime,
  } = useTrainingStore();
  console.log("trainingDurationTime", trainingDurationTime);
  const trainingDetailSchema = z.object({
    isPermanent: z.boolean(),
    trainingStartDate: z.string().optional(),
    trainingDurationTime: z.object({
      label: z.string(),
      value: z.string(),
    }),
    trainingEndDate: z.string().optional(),
    // trainingLocation: z.object({
    //   address: z.string().optional(),
    //   position: z.object({
    //     lat: z.number().optional(),
    //     lng: z.number().optional(),
    //   }),
    // }),
    trainingLocation: z.object({
      address: z.string().min(1, "Location is required"), // Ensure address is required
      position: z.object({
        lat: z.number().min(-90).max(90, "Invalid latitude"),
        lng: z.number().min(-180).max(180, "Invalid longitude"),
      }),
    }),
    trainingLink: z.string().url(),
    trainingDownCasted: z.boolean(),
    trainingPoints: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (Number(data) < 0) {
            return false;
          }
          return true;
        },
        { message: "Training must be greater than 0" }
      ),
    trainingType: z.object({
      label: z.string(),
      value: z.string(),
    }),
    trainingDuration: z.string(),
    isDepartmentalTraining: z.boolean(),
    trainingDepartment: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    proofSubmissionRequired: z.boolean(),
  });
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      isPermanent: isPermanent,
      trainingType: trainingType && {
        label: trainingType[0]?.label,
        value: trainingType[0]?.value,
      },
      trainingStartDate: trainingStartDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingLocation,
      trainingLink,
      trainingEndDate: trainingEndDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingPoints,
      trainingDownCasted,
      trainingDuration,
      isDepartmentalTraining,
      trainingDepartment,
      proofSubmissionRequired,
      trainingDurationTime: trainingDurationTime
        ? {
            label: trainingDurationTime,
            value: trainingDurationTime,
          }
        : undefined,
    },
    resolver: zodResolver(trainingDetailSchema),
  });
  const { errors } = formState;
  console.log(`🚀 ~ errors from training:`, errors);
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    console.log("trainingDurationTime:", data.trainingDurationTime); // Debugging line

    setStep2({
      ...data,
      trainingDurationTime: data.trainingDurationTime?.value,
    });
    nextStep();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center w-full"
      >
        <AuthInputFiled
          className={"w-full flex items-start justify-center flex-col"}
          name={"isPermanent"}
          control={control}
          type="switch"
          descriptionText={"No time limit for this training."}
          placeholder="No time limit"
          label="Set No Time Limit"
          errors={errors}
          error={errors.isPermanent}
        />

        <div className="w-full grid grid-cols-2 gap-4">
          {!watch("isPermanent") && (
            <>
              <AuthInputFiled
                name="trainingStartDate"
                icon={CalendarTodayOutlined}
                label={"Training Start Date"}
                type="date"
                placeholder="Training Start Date"
                className="items-center"
                control={control}
                error={errors.trainingStartDate}
                errors={errors}
                // min={new Date().toISOString().split("T")[0]}
              />
              <AuthInputFiled
                name="trainingEndDate"
                icon={CalendarMonthOutlined}
                label={"Training End Date"}
                type="date"
                placeholder="Training End Date"
                className="items-center"
                control={control}
                error={errors.trainingEndDate}
                errors={errors}
                min={
                  new Date(watch("trainingStartDate"))
                    .toISOString()
                    .split("T")[0]
                }
              />
            </>
          )}

          <div className="grid gap-2  items-end justify-end grid-cols-2">
            <AuthInputFiled
              name="trainingDuration"
              icon={CalendarViewDayOutlined}
              label={"Training Duration *"}
              type="text"
              placeholder="Training Duration"
              className="items-center"
              control={control}
              error={errors.trainingDuration}
              errors={errors}
            />
            <AuthInputFiled
              name="trainingDurationTime"
              // icon={CalendarViewDayOutlined}
              label={""}
              type="select"
              placeholder="ex hours"
              className="items-end justify-end"
              control={control}
              options={[
                { label: "Minutes", value: "min" },
                { label: "Hours", value: "hours" },
                { label: "Days", value: "days" },
                { label: "Weeks", value: "weeks" },
                { label: "Months", value: "months" },
              ]}
              error={errors.trainingDurationTime}
              errors={errors}
              isMulti={false}
            />
          </div>

          <AuthInputFiled
            name="trainingPoints"
            icon={PowerInputOutlined}
            label={"Training Points"}
            type="number"
            placeholder="Training Points"
            className="items-center"
            control={control}
            error={errors.trainingPoints}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingLink"
            icon={MeetingRoomOutlined}
            label={"Training Link *"}
            type="text"
            placeholder="eg. https://zoom.com/1234"
            className="items-center"
            control={control}
            error={errors.trainingLink}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingType"
            icon={CategoryOutlined}
            control={control}
            type="select"
            placeholder="Training Type"
            label="Training Type *"
            readOnly={false}
            maxLimit={15}
            errors={errors}
            options={orgTrainingType}
            error={errors.trainingType}
            // isMulti={false}
          />
          {/* <AuthInputFiled
            className="w-full"
            name="trainingLocation"
            icon={LocationOnOutlined}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.trainingLocation}
            center={center}
            value={watch("trainingLocation")}
          /> */}
          <AuthInputFiled
            className="w-full"
            name="trainingLocation"
            icon={LocationOnOutlined}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.trainingLocation?.address} // Show error message
            center={center}
            value={watch("trainingLocation")}
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"trainingDownCasted"}
            control={control}
            type="switch"
            placeholder="Downcasted"
            label="Down Cast"
            errors={errors}
            error={errors.trainingDownCasted}
            descriptionText={
              "Down-Casted Training will be automatically assigned to organization employees."
            }
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"proofSubmissionRequired"}
            control={control}
            type="switch"
            placeholder="Proof Submission Required"
            label="Proof Submission Required"
            errors={errors}
            error={errors.proofSubmissionRequired}
            descriptionText={
              "Proof of submission required will be automatically assigned to organization employees."
            }
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"isDepartmentalTraining"}
            control={control}
            type="switch"
            placeholder="Departmental Training"
            label="Departmental Training"
            errors={errors}
            error={errors.isDepartmentalTraining}
            descriptionText={
              "Departmental Training will be automatically assigned to department employees."
            }
          />
          {watch("isDepartmentalTraining") && (
            <AuthInputFiled
              name="trainingDepartment"
              icon={CategoryOutlined}
              control={control}
              type="autocomplete"
              placeholder="Department"
              label="Department *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              optionlist={departmentOptions}
              error={errors.trainingDepartment}
              isMulti={true}
            />
          )}
        </div>
        <Button
          type="submit"
          size="large"
          className="!h-[40px] !w-[40px]"
          variant="contained"
        >
          Next
        </Button>
      </form>
    </>
  );
};

export default Step2;
