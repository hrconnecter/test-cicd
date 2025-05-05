import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ToggleOn, WorkOffOutlined } from "@mui/icons-material";
import { Button, FormControl, FormLabel, Stack } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import ReusableModal from "../component";
const leaveTypeSchema = z.object({
  leaveName: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .refine(
      (doc) => {
        return doc.value?.length > 3 && doc.value?.length <= 35;
      },
      {
        message: "Leave name must be between 3 and 35 characters",
      }
    ),
  count: z
    .string()
    .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
  color: z.string(),
  isActive: z.boolean(),
});

const LeaveTypeModal = ({ handleClose, open, id, leaveType }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      leaveName: {
        label: leaveType?.leaveName,
        value: leaveType.leaveName,
      } || { label: "", value: "" },
      color: leaveType?.color || "",
      isActive: leaveType?.isActive || false,
      count: `${leaveType?.count}` || "0",
    },
    resolver: zodResolver(leaveTypeSchema),
  });

  const { handleSubmit, control, formState } = form;
  const { errors } = formState;
  const isFormClean = Object.keys(formState.dirtyFields).length === 0;
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        leaveName: data.leaveName.value,
      };
      // Make the PATCH request using axios
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/leave-types-details/${leaveType._id}`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      // Handle success
      console.log(`🚀 ~ response:`, response);
      handleAlert(true, "success", response.data.message);
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries("leaveTypes");

      // Close the modal
      handleClose();
    } catch (error) {
      // Handle error
      console.error(error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message ||
          "Failed to update leave type. Please try again."
      );
    }
  };

  return (
    <ReusableModal
      heading={"Edit Leave Type"}
      open={open}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} className="w-[-webkit-fill-available]">
          <AuthInputFiled
            name="leaveName"
            icon={WorkOffOutlined}
            control={control}
            type="autocomplete"
            optionlist={[
              { label: "Sick leave", value: "Sick leave" },
              { label: "Casual leave", value: "Casual leave" },
              { label: "Paid leave", value: "Paid leave" },
              { label: "Unpaid leave", value: "Unpaid leave" },
              { label: "Maternity leave", value: "Maternity leave" },
              { label: "Paternity leave", value: "Paternity leave" },
              { label: "Special leave", value: "Special leave" },
              { label: "Vacation leave", value: "Vacation leave" },
              { label: "Bereavement leave", value: "Bereavement leave" },
              { label: "Compensatory leave", value: "Compensatory leave" },
              { label: "Study leave", value: "Study leave" },
            ]}
            placeholder="eg. Sick leave"
            label="Leave Type Name *"
            errors={errors}
            error={errors.leaveName}
            isMulti={true}
          />
          <AuthInputFiled
            name="count"
            icon={Add}
            control={control}
            type="number"
            placeholder="eg. 4"
            label="Enter Count *"
            errors={errors}
            error={errors.count}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Color</FormLabel>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div
                  className="rounded-full overflow-hidden relative"
                  style={{
                    height: "40px",
                    width: "40px",
                  }}
                >
                  <input
                    required
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      height: "60px",
                      width: "60px",
                      padding: "0",
                      border: "none",
                    }}
                    type="color"
                    id="favcolor"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              )}
            />
          </FormControl>
          <AuthInputFiled
            name="isActive"
            icon={ToggleOn}
            control={control}
            type="checkbox"
            placeholder="eg. 4"
            label="Is Active *"
            errors={errors}
            error={errors.count}
          />
          <div className="flex gap-4 mt-4  justify-end mr-4">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button disabled={isFormClean} type="submit" variant="contained">
              Apply
            </Button>
          </div>
        </Stack>
      </form>
    </ReusableModal>
  );
};

export default LeaveTypeModal;
