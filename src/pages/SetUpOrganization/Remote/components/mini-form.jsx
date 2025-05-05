import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Money } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../../components/BasicButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const organizationSchema = z.object({
  isVisibleAttendanceCalender: z.boolean(),
  dualWorkflow: z.boolean(),
  allowance: z.boolean(),
  allowanceQuantity: z.string().refine(
    (doc) => {
      return Number(doc) >= 0 && Number(doc) < 100000;
    },
    {
      message: "The Allowance Quantity must be between 0 and 1,00,000",
    }
  ),
});

const MiniForm = ({ data, mutate }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      isVisibleAttendanceCalender:
        data?.remotePunchingObject?.isVisibleAttendanceCalender || false,
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      allowanceQuantity: Number(formData.allowanceQuantity),
    };
    mutate(payload);
  };

  const isAllowanceEnabled = watch("allowance");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
        <AuthInputFiled
          name="isVisibleAttendanceCalender"
          icon={CalendarMonthIcon}
          control={control}
          type="checkbox"
          placeholder="Visible In Attendance Calender"
          label="Visible In Attendance Calender"
          errors={errors}
          error={errors.isVisibleAttendanceCalender}
          descriptionText={
            "Enabling then allow to show Geofencing and Remote Punching in Attendance Calender."
          }
        />
        {/* <AuthInputFiled
          name="dualWorkflow"
          icon={Business}
          control={control}
          type="checkbox"
          placeholder="Dual Workflow"
          label="Dual Workflow"
          errors={errors}
          error={errors.dualWorkflow}
          descriptionText={
            "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
          }
        /> */}
        <AuthInputFiled
          name="allowance"
          icon={PriceChangeOutlinedIcon}
          control={control}
          type="checkbox"
          placeholder="Enable Extra Allowance"
          label="Enable Extra Allowance"
          errors={errors}
          error={errors.allowance}
          descriptionText={
            "Enabling allowance will allow the employee to get extra amount."
          }
        />
        {isAllowanceEnabled && (
          <AuthInputFiled
            name="allowanceQuantity"
            icon={Money}
            control={control}
            type="number"
            placeholder="Allowance"
            label="Allowance *"
            errors={errors}
            error={errors.allowanceQuantity}
          />
        )}
      </div>
      <div className="w-full flex justify-end">
        <BasicButton type="submit" title="Apply" />
      </div>
    </form>
  );
};

export default MiniForm;
