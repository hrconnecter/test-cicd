import React from 'react'
import {
    AddCircle,
    Business,
    CheckCircle,
    Person,
  } from "@mui/icons-material";
  



import BoxComponent from '../../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import StepFormWrapper from '../../../components/step-form/wrapper';
import useMultiStepForm from '../../../hooks/useStepForm';
  
const VendorEditList = () => {
    const {
        step,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
        totalSteps,
        goToStep,
      } = useMultiStepForm(4);
    
      // to define the steppar
      const stepper = [
        {
          label: "Personal Details",
          icon: Person,
        },
        {
          label: "Company Info",
          icon: Business,
        },
        {
          label: "Additional Fields",
          icon: AddCircle,
        },
        {
          label: "Confirm",
          icon: CheckCircle,
        },
      ];
    
      // swtiching the component based on Next and Prev button
      const useSwitch = (step) => {
        switch (step) {
          case 1:
            return <Page1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
          case 2:
            return <Page2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
          case 3:
            return <Page3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
          case 4:
            return <Page4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
    
          default:
            return null;
        }
      };
    
      return (
        <BoxComponent>
          <div className="flex flex-col  justify-between w-full md:ml-4">
            <div className="flex justify-between items-center">
              <HeadingOneLineInfo
                heading={"Edit Employee"}
                info={"Welcome your employees by editing their profiles here."}
              />
            </div>
            <section className="flex space-x-2 ">
              <article className="w-full rounded-lg">
                <div className="w-full md:px-5 px-1">
                  <StepFormWrapper
                    {...{
                      goToStep,
                      totalSteps,
                      step,
                      isFirstStep,
                      nextStep,
                      prevStep,
                      isLastStep,
                      stepper,
                    }}
                  >
                    {useSwitch(step)}
                  </StepFormWrapper>
                </div>
              </article>
            </section>
          </div>
        </BoxComponent>
      );
    };
    

export default VendorEditList