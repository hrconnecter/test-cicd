import { Search } from "@mui/icons-material";
import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BasicButton from "../../../components/BasicButton";
import useSetupTraining from "../../../hooks/QueryHook/Setup/training";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import UserProfile from "../../../hooks/UserData/useUser";
import useTrainingStore from "../components/stepper/components/zustand-store";
import Stepper from "../components/stepper/page";
import useSearchTrainingZustandStore from "../components/zustand-store";
import TableRow from "./components/TableRow";

const TrainingTable = () => {
  const { open, setOpen, reset } = useTrainingStore();
  const { organisationId } = useParams();
  const { data, isLoading } = useTrainingHook();
  const { setTrainingName } = useSearchTrainingZustandStore();
  const [focusedInput, setFocusedInput] = useState(null);
  const role = UserProfile().useGetCurrentRole();
  const { data: TrainingSetup } = useSetupTraining(organisationId);
  console.log(`🚀 ~ TrainingSetup:`, TrainingSetup);

  const checkPermission =
    role === "Manager"
      ? TrainingSetup?.data?.canManagerAssign
      : role === "HR"
      ? TrainingSetup?.data?.canHRAssign
      : role === "Department-Head"
      ? TrainingSetup?.data?.canDeptHeadAssign
      : true;

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <div
            onFocus={() => {
              setFocusedInput("search");
            }}
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
              onChange={(e) => setTrainingName(e.target.value)}
              placeholder={"Search trainings"}
              className={`border-none bg-white w-full outline-none px-2`}
              formNoValidate
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          {checkPermission && (
            <Box display="flex" gap={2} justifyContent="flex-end" width="100%">
              <BasicButton
                onClick={async () => {
                  await reset();
                }}
                title="Add New Training"
                size="large"
              />
            </Box>
          )}
          <Stepper open={open} setOpen={setOpen} />
        </Grid>
      </Grid>

      {isLoading ? (
        <div className="flex justify-center">
          <CircularProgress size={26} />
        </div>
      ) : (
        (data?.data?.length <= 0 || data?.data === undefined) && (
          <div style={{ backgroundColor: "white", padding: "10px 5px" }}>
            <h1 style={{ fontWeight: "400" }}>Training Not Found</h1>
          </div>
        )
      )}
      <div className="flex items-center gap-2 flex-wrap flex-grow">
        {data?.data?.map((doc) => (
          <TableRow
            key={doc.id}
            logo={doc?.trainingLogo}
            name={doc?.trainingName}
            duration={doc?.trainingDuration}
            doc={doc}
          />
        ))}
      </div>
    </>
  );
};

export default TrainingTable;
