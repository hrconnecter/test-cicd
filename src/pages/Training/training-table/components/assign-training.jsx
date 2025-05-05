import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarMonth, CalendarToday, Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import useTrainingDetailsMutation from "./mutation";
import useAssignTraining from "./useAssignTraining";

const trainingAssign = z.object({
  employeeId: z.array(z.object({ label: z.string(), value: z.string() })),
  startDate: z.string(),
  endDate: z.string(),
});

const AssignTraining = ({ open, setOpen, doc }) => {
  const { employees, employeeFetching } = useAssignTraining();

  console.log("document", new Date()?.toISOString()?.split("T")[0], doc);

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      employeeId: [],
    },
    resolver: zodResolver(trainingAssign),
  });
  const { errors } = formState;
  console.log(`🚀 ~ errors:`, errors);
  const { assignEmployee } = useTrainingDetailsMutation();
  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      employeeId: data?.employeeId.map((ele) => ele.value),
    };
    assignEmployee({
      data: updatedData,
      trainingId: doc?._id,
      close: () => setOpen(false),
    });
  };
  return (
    <ReusableModal
      heading={"Assign Training To Employees"}
      open={open}
      onClose={() => setOpen(false)}
      className="!h-[50vh] !w-[60vw]"
    >
      {/* <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white"> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-end"
      >
        <AuthInputFiled
          className={""}
          name={"employeeId"}
          icon={Person}
          control={control}
          type="multiselect"
          isMulti={true}
          placeholder={"e.g. Select Employee *"}
          label={` Select Employees *`}
          errors={errors}
          error={errors?.employeeId}
          options={
            employeeFetching
              ? []
              : employees?.map((ele) => ({
                  label: `${ele?.first_name} ${ele?.last_name}`,
                  value: ele._id,
                }))
          }
        />
        <div className="grid grid-cols-2 w-full gap-2 mb-4">
          <AuthInputFiled
            className={""}
            name={"startDate"}
            icon={CalendarToday}
            control={control}
            type="date"
            placeholder={"e.g. Start Date *"}
            label={` Start Date *`}
            errors={errors}
            error={errors?.startDate}
            min={doc?.trainingStartDate?.split("T")[0]}
            // max={doc?.trainingEndDate?.split("T")[0]}
          />
          <AuthInputFiled
            className={""}
            name={"endDate"}
            icon={CalendarMonth}
            control={control}
            type="date"
            placeholder={"e.g. End Date *"}
            label={` End Date *`}
            errors={errors}
            error={errors?.endDate}
            min={doc?.trainingStartDate?.split("T")[0]}
            //  max={doc?.trainingEndDate?.split("T")[0]}
          />
        </div>
        <Button variant={"contained"} className="!w-fit" type="submit">
          Assign
        </Button>
      </form>
      {/* </Box> */}
    </ReusableModal>
  );
};

export default AssignTraining;
