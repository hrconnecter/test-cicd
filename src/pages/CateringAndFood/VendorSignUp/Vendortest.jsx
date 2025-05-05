import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
  
} from "@mui/icons-material";
import {
  Button,
  // Checkbox,
  CircularProgress,
  // FormControlLabel,
  
} from "@mui/material";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../../State/UseState/UseContext";
import StepFormWrapper from "../../../components/step-form/wrapper";
import useGetUser from "../../../hooks/Token/useUser";
import useMultiStepForm from "../../../hooks/useStepForm";

import Signupvendor from "./Signupvendor";
import Page2 from "./Page2";
import Page3 from "./Page3";

import Page3a from "./Page3a";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";

const convertExcelSerialDateToISO = (serialDate) => {
  // Excel uses a base date of December 30, 1899
  const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
  // Excel serial dates count days from this base date
  const date = new Date(
    excelBaseDate.getTime() + serialDate * 24 * 60 * 60 * 1000
  );
  // Ensure that the date is in the correct format without time component
  return date.toISOString().split("T")[0];
};

// Helper function to convert date format from mm/dd/yyyy or Excel serial date to ISO format
const convertToISOFormat = (dateStr) => {
  if (!isNaN(dateStr)) {
    return convertExcelSerialDateToISO(Number(dateStr));
  }

  const dateStrString = String(dateStr).trim();
  const match = dateStrString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, month, day, year] = match.map(Number);
    // JavaScript Date months are 0-indexed, so subtract 1 from month
    const date = new Date(Date.UTC(year, month - 1, day));
    // Format to ISO (yyyy-mm-dd) and ensure no time component is included
    return date.toISOString().split("T")[0];
  } else {
    console.error(
      "Invalid date format. Expected mm/dd/yyyy or Excel serial date. Received:",
      dateStr
    );
    return null;
  }
};

// Validation functions
const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

const Vendortest = () => {
  const { authToken } = useGetUser();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);
  // const [org, setOrg] = useState();
  // const [ setOrg] = useState();
  // const [members, setMembers] = useState();
  // const [ setMembers] = useState();
  // const [showExcelOnboarding, setShowExcelOnboarding] = useState(false);
  const [showExcelOnboarding] = useState(false);
  // const [ setShowExcelOnboarding] = useState(false);

  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const {document} = useVendorState();
  const orgId = useParams().organisationId;

  // console.log("document",document);

  // useEffect(() => {
  //   (async () => {
  //     const resp = await axios.get(
  //       `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
  //     );
  //     setOrg(resp.data.organizations);
  //   })();
  // }, [orgId]);

  // useEffect(() => {
  //   (async () => {
  //     const resp = await axios.get(
  //       `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
  //     );
  //     setMembers(resp.data.members);
  //   })();
  // }, [orgId]);

  const handleFileUpload = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only Excel files are allowed",
      });
      setIsLoading(false);
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 40 },
        { wch: 30 },
        { wch: 30 },
        { wch: 30 },
      ];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      console.log("JSON Data:", jsonData);

      const finalData = jsonData.map((data) => {
        const isoDate = convertToISOFormat(data.date_of_birth);
        console.log(
          "Original Date:",
          data.date_of_birth,
          "Converted ISO Date:",
          isoDate
        );

        return {
          empId: data.empId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          organizationId: orgId,
          date_of_birth: isoDate,
          phone_number: data.phone_number,
          address: data.address,
          gender: data.gender,
          adhar_card_number: data.adhar_card_number,
          pan_card_number: data.pan_card_number,
          bank_account_no: data.bank_account_no,
          citizenship: data.citizenship,
        };
      });

      console.log("Final Data:", finalData);

      const validEmployees = [];

      for (const employee of finalData) {
        // Validation for PAN and Aadhar card
        if (!isValidPanCard(employee.pan_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid PAN card format for employee no ${employee.empId}`,
          });
          continue;
        }

        if (!isValidAadharCard(employee.adhar_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid Aadhar card format for vendor no ${employee.empId}`,
          });
          continue;
        }

        // If validations pass, add the employee to the validEmployees array
        validEmployees.push(employee);
      }

      if (validEmployees.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/employee/add-employee-excel`, // Adjusted endpoint
            validEmployees,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          console.log(`${response.data.message}`);
          setAppAlert({
            alert: true,
            type: "success",
            msg: response.data.message,
          });
        } catch (error) {
          console.error("Error posting employees:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg:
              error.response?.data?.message ||
              "An error occurred while posting vendors.",
          });
        }
      } else {
        setAppAlert({
          alert: true,
          type: "warning",
          msg: "No valid vendor to submit.",
        });
      }

      // for (const employee of finalData) {
      //   // Validation for PAN and Aadhar card
      //   if (!isValidPanCard(employee.pan_card_number)) {
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: `Invalid PAN card format for employee no ${employee.empId}`,
      //     });
      //     continue;
      //   }

      //   if (!isValidAadharCard(employee.adhar_card_number)) {
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
      //     });
      //     continue;
      //   }

      //   try {
      //     await axios.post(
      //       `${process.env.REACT_APP_API}/route/employee/add-employee`,
      //       employee,
      //       {
      //         headers: {
      //           Authorization: authToken,
      //         },
      //       }
      //     );
      //     console.log(`Employee ${employee.empId} posted successfully`);
      //   } catch (error) {
      //     console.error(`Error posting employee ${employee.empId}:`, error);
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: error.response.data.message,
      //     });
      //   }
      // }

      // Clear file input value to allow re-uploading the same file
      fileInputRef.current.value = null;

      setIsLoading(false);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Onboarding Process Completed",
      });
      // window.location.reload();
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const csvTemplateData = [
    { empId: "", first_name: "", last_name: "", email: "", password: "" },
  ];

  const csvHeaders = [
    { label: "empId", key: "empId" },
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
    { label: "password", key: "password" },
    { label: "date_of_birth", key: "date_of_birth" },
    { label: "phone_number", key: "phone_number" },
    { label: "address", key: "address" },
    { label: "gender", key: "gender" },
    { label: "adhar_card_number", key: "adhar_card_number" },
    { label: "pan_card_number", key: "pan_card_number" },
    { label: "bank_account_no", key: "bank_account_no" },
    { label: "citizenship", key: "citizenship" },
  ];

  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  // const navigate = useNavigate();

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
        return (
          <Signupvendor {...{ nextStep, prevStep, isLastStep, isFirstStep }} />
        );
      case 2:
        return <Page2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Page3a {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Page3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      default:
        return null;
    }
  };

  return (
    <BoxComponent>
    <div className="flex flex-col  justify-between w-full md:ml-4">
    <div className="flex justify-between items-center">
    <HeadingOneLineInfo
     heading={"Vendor Onboarding"} 
     info={" Welcome your Vendors by creating their profiles here."} />
      
      {isLoading && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}
      </div>
      
       
      
      
       {showExcelOnboarding && (
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
      )} 

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-lg bg-white">
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

export default Vendortest;
