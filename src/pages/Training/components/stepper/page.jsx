import { Book, CheckCircleOutline, FitnessCenter } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReusableModal from "../../../../components/Modal/component";
import StepFormWrapper from "../../../../components/step-form/wrapper";
import useSetupTraining from "../../../../hooks/QueryHook/Setup/training";
import useMultiStepForm from "../../../../hooks/useStepForm";
import Step1 from "./components/step1/page";
import Step2 from "./components/step2/page";
import useGetDepartments from "./components/step2/step2-hook";
import Step3 from "./components/step3/page";

const Stepper = ({ setOpen, open }) => {
  const { organisationId } = useParams();
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
    setStep,
  } = useMultiStepForm(3);
  const { data } = useGetDepartments();
  const { data: trainingData } = useSetupTraining(organisationId);
  useEffect(() => {
    setStep(1);
    // eslint-disable-next-line
  }, [open]);
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 {...{ nextStep }} />;
      case 2:
        return (
          <Step2
            {...{
              nextStep,
              departments: data?.data,
              orgTrainingType: trainingData?.data?.trainingType,
            }}
          />
        );
      case 3:
        return <Step3 {...{ nextStep }} />;
      default:
        return null;
    }
  };
  const stepper = [
    {
      label: "Training Details",
      icon: Book,
    },
    {
      label: "Info",
      icon: FitnessCenter,
    },
    {
      label: "Confirmation",
      icon: CheckCircleOutline,
    },
  ];

  return (
    <ReusableModal
      open={open}
      onClose={() => setOpen(false)}
      className="md:!w-[800px] w-full "
      heading={"Add Training"}
    >
      <StepFormWrapper
        {...{
          goToStep,
          totalSteps,
          step,
          isFirstStep,
          isLastStep,
          nextStep,
          prevStep,
          stepper,
        }}
      >
        {useSwitch(step)}
      </StepFormWrapper>
    </ReusableModal>
  );
};

export default Stepper;
