import { zodResolver } from "@hookform/resolvers/zod";
import {
  AttachFile,
  Close,
  DateRange,
  Paid,
  PersonOutline,
  TrendingUp,
} from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../../State/Function/Main";
import BasicButton from "../../../../components/BasicButton";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const GoalsModel = ({
  handleClose,
  open,
  options,
  id,
  performance,
  assignee,
}) => {
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const { data: goalData } = useQuery({
    queryKey: "getSingleGoal",
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getSingleGoals/${id._id}`,
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

  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();

  const authToken = useAuthToken();
  const zodSchema = z.object({
    goal: z.string(),
    description: z.string(),
    measurments: z.string().optional(),
    downcasted: z.boolean().optional(),
    comments: z.string().optional(),
    assignee: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    startDate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    endDate: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    goalType: z.object({ value: z.string(), label: z.string() }),
    attachment: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  console.log("errors", errors);

  useEffect(() => {
    setValue("goal", goalData?.goal);
    setValue("description", goalData?.description);
    // setValue("measurement", goalData?.measurement);
    setValue("comments", goalData?.comments);
    setValue(
      "assignee",
      goalData?.assignee?.map((item) => ({
        value: item._id,
        label: `${item.first_name} ${item.last_name}`,
      }))
    );
    setValue("startDate", {
      startDate: new Date(goalData?.startDate),
      endDate: new Date(goalData?.endDate),
    });
    setValue("endDate", {
      startDate: goalData?.startDate,
      endDate: goalData?.endDate,
    });
    //eslint-disable-next-line
  }, [goalData]);

  useEffect(() => {
    if (!open) {
      console.log(`🚀 ~ id:`, id?._id);
      reset({
        goal: undefined,
        description: undefined,
        downcasted: undefined,
        comments: undefined,
        assignee: undefined,
      });
    }
    //eslint-disable-next-line
  }, [open]);

  const queryClient = useQueryClient();
  const addMutation = useMutation(
    async (data) => {
      let currentData = { ...data, creatorRole: role };
      console.log(`🚀 ~ data:`, data);
      if (role === "Employee") {
        currentData.assignee = [user._id];
      } else {
        currentData.assignee = data?.assignee?.map((emp) => emp) ?? [];
        console.log(data?.assignee?.map((emp) => emp));
      }
      await axios.post(
        `${process.env.REACT_APP_API}/route/performance/createGoal`,
        { goals: currentData },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Goal created successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

  const updateMutation = useMutation(
    async (data) => {
      const goals = {
        ...data,
        assignee: { label: id?.empId._id, value: id?.empId._id },
      };
      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${id._id}`,
        {
          data: goals,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

  const onSubmit = async (data, status) => {
    console.log(`🚀 ~ status:`, status);
    const goals = {
      goal: data.goal,
      description: data.description,
      measurments: data.measurments,
      downcasted: data.downcasted,
      // measurement: data.measurement,
      assignee: data?.assignee?.map((emp) => emp.value) ?? [],
      startDate: data.startDate.startDate,
      endDate: data.endDate.startDate,
      goalType: data?.goalType?.value,
      attachment: data.attachment,
      status: status,
    };

    if (!id) {
      addMutation.mutate(goals);
    } else {
      updateMutation.mutate(goals);
    }
  };

  const { data: employeeData } = useQuery("employee", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager/${role}/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  const goalTypeOption = performance?.goals?.map((goal) => goal);

  console.log(goalTypeOption);

  const empoptions = Array.isArray(employeeData)
    ? employeeData?.map((emp) => ({
        value: emp._id,
        label: `${emp.first_name} ${emp.last_name}`,
        image: emp.user_logo_url,
      }))
    : [];

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
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2">
              {!id ? "Create goal" : "Update goal"}
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form
            onSubmit={handleSubmit((data) => onSubmit(data, "Goal Submitted"))}
            className="px-6 max-h-[80vh] overflow-auto "
          >
            <AuthInputFiled
              name="goal"
              icon={TrendingUp}
              control={control}
              type="text"
              placeholder="goal"
              label="Enter Goal Name *"
              errors={errors}
              error={errors.goal}
            />

            <AuthInputFiled
              name="description"
              // readOnly={performance?.stages !== "Goal setting"}
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter Description *"
              errors={errors}
              error={errors.description}
            />

            <AuthInputFiled
              name="measurments"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter Measurements Name"
              errors={errors}
              error={errors.measurments}
            />

            <AuthInputFiled
              name="goalType"
              icon={Paid}
              control={control}
              type="select"
              options={goalTypeOption}
              placeholder="Goal Type"
              isMulti={false}
              label="Enter Goal Type *"
              errors={errors}
              error={errors.goalType}
            />

            {/* {performance?.stages ===
              "Monitoring stage/Feedback collection stage" &&
              role !== "Employee" && (
                <AuthInputFiled
                  name="comments"
                  icon={Paid}
                  control={control}
                  type="texteditor"
                  placeholder="100"
                  label="Comments box"
                  errors={errors}
                  error={errors.comments}
                />
              )} */}

            {role !== "Employee" && !(role === "Manager") && (
              <AuthInputFiled
                name="downcasted"
                // icon={ToggleOn}
                control={control}
                type="checkbox"
                placeholder="eg. 4"
                label="Downcast Goal"
                errors={errors}
                error={errors.downcasted}
              />
            )}

            {role === "Manager" && (
              <AuthInputFiled
                name="assignee"
                icon={PersonOutline}
                isMulti={true}
                control={control}
                type="empselect"
                options={empoptions}
                placeholder="Assignee name"
                label="Select Assignee Name "
                errors={errors}
                error={errors.assignee}
              />
            )}
            {role !== "Employee" && !watch("downcasted") && !id && (
              <AuthInputFiled
                name="assignee"
                icon={PersonOutline}
                isMulti={true}
                control={control}
                type="empselect"
                options={empoptions}
                placeholder="Assignee name"
                label="Select Assignee Name "
                errors={errors}
                error={errors.assignee}
              />
            )}
            {id && (
              <AuthInputFiled
                name="attachment"
                icon={AttachFile}
                control={control}
                type="file"
                placeholder="100"
                label="Add Attachments"
                errors={errors}
                error={errors.attachment}
              />
            )}

            <div className="grid grid-cols-2 gap-2">
              <AuthInputFiled
                name="startDate"
                icon={DateRange}
                popoverDirection={"up"}
                control={control}
                type="calender"
                placeholder="Assignee name"
                label="Enter Start Date *"
                errors={errors}
                error={errors.startDate}
              />
              <AuthInputFiled
                name="endDate"
                icon={DateRange}
                popoverDirection={"up"}
                control={control}
                type="calender"
                placeholder="100"
                label="Enter End Date *"
                errors={errors}
                error={errors.endDate}
              />
            </div>

            {/* <AuthInputFiled
              name="goaltype"
              icon={PersonOutline}
              control={control}
              type="select"
              options={options}
              placeholder="goal type"
              label="Select goal type"
              errors={errors}
              error={errors.goaltype}
            /> */}

            <div className="flex gap-4  mt-4 mr-4 justify-end">
              {/* <Button
                type="button"
                onClick={handleClose}
                color="error"
                variant="outlined"
              >
                Cancel
              </Button> */}
              {/* <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit((data) => onSubmit(data, "Goal Created"))}
              >
                {addMutation.isLoading || updateMutation.isLoading ? (
                  <CircularProgress size={20} color="primary" />
                ) : (
                  "Save Goal"
                )}
              </Button> */}

              <BasicButton
                title={"Cancel"}
                disabled={addMutation.isLoading || updateMutation.isLoading}
                type="button"
                variant="outlined"
              />
              {!id && (
                <BasicButton
                  title={"Save Goal"}
                  variant="outlined"
                  disabled={addMutation.isLoading || updateMutation.isLoading}
                  type="submit"
                  onClick={handleSubmit((data) =>
                    onSubmit(data, "Goal Created")
                  )}
                />
              )}
              <BasicButton
                title={id ? "Update Goal" : "Create Goal"}
                disabled={addMutation.isLoading || updateMutation.isLoading}
                type="submit"
              />
              {/* <Button type="submit" variant="contained" color="primary">
                {addMutation.isLoading || updateMutation.isLoading ? (
                  <CircularProgress size={20} color="primary" />
                ) : id ? (
                  "Update Goal"
                ) : (
                  "Create Goal"
                )}
              </Button> */}
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default GoalsModel;
