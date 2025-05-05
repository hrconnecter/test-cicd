import { AddCircle, Business, CheckCircle, Person } from "@mui/icons-material";
import {
 Tooltip ,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import SelfOnboardingFromModal from "../Self-Onboarding/SelfOnboardingFromModal";
import Test1 from "./EmployeeCom/Test1 ";
import Test2 from "./EmployeeCom/Test2";
import Test3 from "./EmployeeCom/Test3";
import Test4 from "./EmployeeCom/Test4";

const EmployeeTest = () => {
  const [org, setOrg] = useState();
  const [members, setMembers] = useState();
  console.log(org, members);

  //selfOnboarding Employee Modal
  const [openModal, setOpenModal] = useState(false);
  const handleSelfOnboardingClick = () => {
    setOpenModal(true);
  };

  const orgId = useParams().organisationId;

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      setOrg(resp.data.organizations);
    })();
  }, [orgId]);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
      );
      setMembers(resp.data.members);
    })();
  }, [orgId]);

  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);

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

  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 2:
        return <Test2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Test3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Test4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      default:
        return null;
    }
  };

  return (
    <BoxComponent>
      <div className="flex flex-col  justify-between w-full md:ml-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo
            heading={"Employee Onboarding"}
            info={"Welcome your employees by creating their profiles here."}
          />
          <div>
            <div className="w-full md:w-auto">
              <Tooltip
                      title={
                        <div>
                          <p>Bulk Add: Add up to 100 employees at once.</p>
                          <p>Auto Emails: Onboarding emails are sent automatically upon submission.</p>
                        </div>
                      }
                      placement="bottom-start"
                      arrow
                    >
              <button
                className="text-base text-blue-500 text-pretty font-bold"
                onClick={handleSelfOnboardingClick}
              >
                Employee Self Onboarding
              </button>
              </Tooltip>
            </div>

            <SelfOnboardingFromModal
              open={openModal}
              handleClose={() => setOpenModal(false)}
            />
          </div>
        </div>

        {/* {isLoading && (
          <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
            <CircularProgress />
          </div>
        )} */}
        {/* {showExcelOnboarding && (
        <div className="w-full flex justify-center items-center mt-6">
          <div className="flex flex-col gap-4 py-4 bg-white shadow-md">
            <h1 className="text-xl text-center">Excel Onboarding</h1>
            <div className="w-full flex flex-col"></div>
            <h1 className="text-xs text-gray-600 w-[80%] m-auto text-center">
              You can onboard employees efficiently by downloading the template,
              filling in the employee data, and uploading the completed Excel
              sheet below.
            </h1>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              style={{ display: "none" }}
            />
            {uploadedFileName && (
              <div className="text-center text-sm text-gray-600">
                Uploaded File: {uploadedFileName}
              </div>
            )}
            <div className="flex gap-5 w-full justify-center">
              <Button size="small" variant="contained" color="warning">
                <CSVLink
                  data={csvTemplateData}
                  headers={csvHeaders}
                  filename="employee_onboard_template.csv"
                  className="btn btn-secondary text-white"
                  target="_blank"
                >
                  Download EXCEL Template
                </CSVLink>
              </Button>
              <Button
                size="large"
                onClick={handleButtonClick}
                variant="contained"
              >
                Upload Excel File
              </Button>
            </div>
          </div>
        </div>
      )} */}

        <section className=" flex space-x-2 ">
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

export default EmployeeTest;
